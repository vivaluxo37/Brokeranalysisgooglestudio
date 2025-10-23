import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient, getSupabaseClientWithAuth } from '../lib/supabase.js';
import { ReviewSchema, type Review } from '../lib/validation.js';
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
    const brokerId = searchParams.get('brokerId');
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const verified = searchParams.get('verified') === 'true';

    const supabase = await getSupabaseClient();
    let queryBuilder = supabase
      .from('reviews')
      .select(`
        *,
        user:users(
          id,
          name,
          trading_level
        )
      `, { count: 'exact' });

    if (brokerId) {
      queryBuilder = queryBuilder.eq('broker_id', brokerId);
    }

    if (userId) {
      queryBuilder = queryBuilder.eq('user_id', userId);
    }

    if (verified) {
      queryBuilder = queryBuilder.eq('verified', true);
    }

    const { data, error, count } = await queryBuilder
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch reviews' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      reviews: data,
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
    const rateLimitResult = await checkRateLimit(request, 'general');
    if (!rateLimitResult.success) {
      return createRateLimitResponse(rateLimitResult.remainingPoints, rateLimitResult.msBeforeNext);
    }

    // Require authentication
    const user = await requireAuth(request);

    // Parse and validate request body
    const body = await request.json();
    const reviewData = {
      ...body,
      userId: user.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const validatedReview = ReviewSchema.parse(reviewData);

    // Insert review into database
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('reviews')
      .insert(validatedReview)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to create review' },
        { status: 500 }
      );
    }

    // Update broker average rating (you might want to use a database trigger for this)
    const { data: reviews } = await supabase
      .from('reviews')
      .select('rating')
      .eq('broker_id', validatedReview.brokerId)
      .eq('verified', true);

    const averageRating = reviews && reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

    await supabase
      .from('brokers')
      .update({ average_rating: averageRating })
      .eq('id', validatedReview.brokerId);

    return NextResponse.json({
      success: true,
      review: data,
      message: 'Review created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Review creation error:', error);

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