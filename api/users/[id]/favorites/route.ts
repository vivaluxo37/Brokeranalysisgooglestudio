import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient, getSupabaseClientWithAuth } from '@/lib/supabase';
import { cors, handleOptions } from '@/middleware/cors';
import { checkRateLimit, createRateLimitResponse } from '@/middleware/rateLimit';
import { requireAuth, createUnauthorizedResponse } from '@/middleware/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id: userId } = params;
    const supabase = await getSupabaseClient();

    const { data: favorites, error } = await supabase
      .from('user_favorites')
      .select(`
        id,
        broker_id,
        created_at,
        broker:brokers(
          id,
          name,
          logo,
          average_rating,
          min_deposit_amount,
          regulation:broker_regulations(
            authority,
            status
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch favorites' },
        { status: 500 }
      );
    }

    return NextResponse.json({ favorites });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const { id: userId } = params;

    // Users can only manage their own favorites
    if (user.id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized to manage other user favorites' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { brokerId } = body;

    if (!brokerId) {
      return NextResponse.json(
        { error: 'Broker ID is required' },
        { status: 400 }
      );
    }

    const supabase = await getSupabaseClientWithAuth();

    // Check if already favorited
    const { data: existing } = await supabase
      .from('user_favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('broker_id', brokerId)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Broker already in favorites' },
        { status: 409 }
      );
    }

    // Add to favorites
    const { data: favorite, error } = await supabase
      .from('user_favorites')
      .insert({
        user_id: userId,
        broker_id: brokerId,
        created_at: new Date()
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to add favorite' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      favorite,
      message: 'Added to favorites'
    }, { status: 201 });

  } catch (error) {
    console.error('Favorite creation error:', error);

    if (error instanceof Error && error.message === 'Unauthorized') {
      return createUnauthorizedResponse();
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const { id: userId } = params;

    // Users can only manage their own favorites
    if (user.id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized to manage other user favorites' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const brokerId = searchParams.get('brokerId');

    if (!brokerId) {
      return NextResponse.json(
        { error: 'Broker ID is required' },
        { status: 400 }
      );
    }

    const supabase = await getSupabaseClientWithAuth();

    // Remove from favorites
    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', userId)
      .eq('broker_id', brokerId);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to remove favorite' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Removed from favorites'
    });

  } catch (error) {
    console.error('Favorite deletion error:', error);

    if (error instanceof Error && error.message === 'Unauthorized') {
      return createUnauthorizedResponse();
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}