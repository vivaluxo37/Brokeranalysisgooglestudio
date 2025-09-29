import { NextRequest } from 'next/server';
import { getChatbotResponseStream, getAiTutorResponseStream } from '../lib/gemini.js';
import { ChatRequestSchema, type ChatRequest } from '../lib/validation.js';
import { cors, handleOptions } from '../middleware/cors.js';
import { checkRateLimit, createRateLimitResponse } from '../middleware/rateLimit.js';
import { authenticateUser } from '../middleware/auth.js';

export async function POST(request: NextRequest) {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return handleOptions();
  }

  try {
    // Apply CORS headers
    const corsResponse = cors(request);
    if (!corsResponse.ok) {
      return corsResponse;
    }

    // Rate limiting - stricter for chat
    const rateLimitResult = await checkRateLimit(request, 'chat');
    if (!rateLimitResult.success) {
      return createRateLimitResponse(rateLimitResult.remainingPoints, rateLimitResult.msBeforeNext);
    }

    // Optional authentication (anonymous users allowed)
    const user = await authenticateUser(request);

    // Parse and validate request body
    const body = await request.json();
    const validatedBody = ChatRequestSchema.parse(body);

    // Create readable stream for response
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        try {
          // Choose the appropriate AI function based on context
          const responseGenerator = validatedBody.context === 'tutor'
            ? getAiTutorResponseStream(validatedBody.message, validatedBody.history)
            : getChatbotResponseStream(validatedBody.message, validatedBody.history);

          // Send initial metadata
          const metadata = {
            user: user ? { id: user.id, name: user.name } : null,
            context: validatedBody.context,
            timestamp: new Date().toISOString()
          };

          controller.enqueue(encoder.encode(`data: ${JSON.stringify(metadata)}\n\n`));

          // Stream AI responses
          for await (const chunk of responseGenerator) {
            if (chunk.text) {
              const data = {
                type: 'chunk',
                content: chunk.text,
                done: chunk.done
              };
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
            }
          }

          // Send completion signal
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`));
          controller.close();

        } catch (error) {
          console.error('Stream error:', error);
          const errorData = {
            type: 'error',
            error: 'Failed to generate response',
            message: error instanceof Error ? error.message : 'Unknown error'
          };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(errorData)}\n\n`));
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
        'Access-Control-Allow-Credentials': 'true'
      }
    });

  } catch (error) {
    console.error('Chat API error:', error);

    if (error instanceof Error && error.message.includes('Invalid request')) {
      return new Response(JSON.stringify({
        error: 'Invalid request',
        message: error.message
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: 'Failed to process request'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}