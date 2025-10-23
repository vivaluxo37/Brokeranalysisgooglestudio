import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient, getSupabaseClientWithAuth } from '../lib/supabase.js';
import { UserSchema, type User } from '../lib/validation.js';
import { cors, handleOptions } from '../middleware/cors.js';
import { checkRateLimit, createRateLimitResponse } from '../middleware/rateLimit.js';
import { requireAuth, createUnauthorizedResponse } from '../middleware/auth.js';

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
    const userId = searchParams.get('id');

    const supabase = await getSupabaseClient();

    if (userId) {
      // Get specific user
      const { data: user, error } = await supabase
        .from('users')
        .select(`
          id,
          name,
          email,
          trading_level,
          trading_experience,
          preferred_instruments,
          risk_tolerance,
          created_at,
          avatar_url
        `)
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return NextResponse.json(
            { error: 'User not found' },
            { status: 404 }
          );
        }
        console.error('Database error:', error);
        return NextResponse.json(
          { error: 'Failed to fetch user' },
          { status: 500 }
        );
      }

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ user });
    } else {
      // Get all users (admin only)
      return NextResponse.json(
        { error: 'Authentication required for user list' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
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
    const updateData = {
      ...body,
      updatedAt: new Date()
    };

    const validatedData = UserSchema.partial().parse(updateData);

    // Update user profile
    const supabase = await getSupabaseClientWithAuth();
    const { data: updatedUser, error } = await supabase
      .from('users')
      .update(validatedData)
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to update user profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('User update error:', error);

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