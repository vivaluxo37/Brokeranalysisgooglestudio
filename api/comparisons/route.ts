import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient, getSupabaseClientWithAuth } from '@/lib/supabase';
import { ComparisonSchema, type Comparison } from '@/lib/validation';
import { cors, handleOptions } from '@/middleware/cors';
import { checkRateLimit, createRateLimitResponse } from '@/middleware/rateLimit';
import { requireAuth, createUnauthorizedResponse } from '@/middleware/auth';

export async function GET(request: NextRequest) {
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

    // Rate limiting
    const rateLimitResult = await checkRateLimit(request, 'general');
    if (!rateLimitResult.success) {
      return createRateLimitResponse(rateLimitResult.remainingPoints, rateLimitResult.msBeforeNext);
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    const supabase = await getSupabaseClient();
    let queryBuilder = supabase
      .from('comparisons')
      .select(`
        *,
        user:users(
          id,
          name
        ),
        brokers:broker_comparisons(
          broker:brokers(
            id,
            name,
            logo,
            average_rating,
            min_deposit_amount
          )
        )
      `, { count: 'exact' });

    if (userId) {
      queryBuilder = queryBuilder.eq('user_id', userId);
    }

    const { data, error, count } = await queryBuilder
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch comparisons' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      comparisons: data,
      pagination: {
        total: count || 0,
        limit,
        offset,
        hasMore: (offset + limit) < (count || 0)
      }
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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

    // Rate limiting
    const rateLimitResult = await checkRateLimit(request, 'auth');
    if (!rateLimitResult.success) {
      return createRateLimitResponse(rateLimitResult.remainingPoints, rateLimitResult.msBeforeNext);
    }

    // Require authentication
    const user = await requireAuth(request);

    // Parse and validate request body
    const body = await request.json();
    const comparisonData = {
      ...body,
      userId: user.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const validatedComparison = ComparisonSchema.parse(comparisonData);

    const supabase = await getSupabaseClientWithAuth();

    // Insert comparison
    const { data: comparison, error } = await supabase
      .from('comparisons')
      .insert({
        user_id: validatedComparison.userId,
        name: validatedComparison.name,
        description: validatedComparison.description,
        created_at: validatedComparison.createdAt,
        updated_at: validatedComparison.updatedAt
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to create comparison' },
        { status: 500 }
      );
    }

    // Insert broker associations
    if (validatedComparison.brokerIds && validatedComparison.brokerIds.length > 0) {
      const brokerComparisons = validatedComparison.brokerIds.map((brokerId, index) => ({
        comparison_id: comparison.id,
        broker_id: brokerId,
        order_index: index
      }));

      const { error: brokerError } = await supabase
        .from('broker_comparisons')
        .insert(brokerComparisons);

      if (brokerError) {
        console.error('Broker association error:', brokerError);
        // Clean up the comparison if broker association fails
        await supabase.from('comparisons').delete().eq('id', comparison.id);
        return NextResponse.json(
          { error: 'Failed to associate brokers with comparison' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      comparison: {
        ...comparison,
        brokerIds: validatedComparison.brokerIds
      },
      message: 'Comparison created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Comparison creation error:', error);

    if (error instanceof Error && error.message === 'Unauthorized') {
      return createUnauthorizedResponse();
    }

    if (error instanceof Error && error.message.includes('Invalid')) {
      return NextResponse.json({
        error: 'Invalid request',
        message: error.message
      }, { status: 400 });
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}