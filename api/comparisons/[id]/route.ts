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

    const { id } = params;
    const supabase = await getSupabaseClient();

    const { data: comparison, error } = await supabase
      .from('comparisons')
      .select(`
        *,
        user:users(
          id,
          name
        ),
        brokers:broker_comparisons(
          broker:brokers(
            *,
            regulation:broker_regulations(
              authority,
              license_number,
              status
            ),
            platforms:broker_platforms(
              name,
              type,
              features
            ),
            fees:broker_fees(
              type,
              amount,
              description
            ),
            trading_instruments:broker_trading_instruments(
              instrument_type,
              available,
              spreads,
              commission
            )
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Comparison not found' },
          { status: 404 }
        );
      }
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch comparison' },
        { status: 500 }
      );
    }

    if (!comparison) {
      return NextResponse.json(
        { error: 'Comparison not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ comparison });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
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
    const { id } = params;

    const body = await request.json();
    const { name, description, brokerIds } = body;

    const supabase = await getSupabaseClientWithAuth();

    // Check if user owns the comparison
    const { data: existingComparison } = await supabase
      .from('comparisons')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!existingComparison || existingComparison.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to update this comparison' },
        { status: 403 }
      );
    }

    // Update comparison
    const { data: comparison, error } = await supabase
      .from('comparisons')
      .update({
        name,
        description,
        updated_at: new Date()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to update comparison' },
        { status: 500 }
      );
    }

    // Update broker associations if provided
    if (brokerIds) {
      // Remove existing associations
      await supabase
        .from('broker_comparisons')
        .delete()
        .eq('comparison_id', id);

      // Add new associations
      if (brokerIds.length > 0) {
        const brokerComparisons = brokerIds.map((brokerId: string, index: number) => ({
          comparison_id: id,
          broker_id: brokerId,
          order_index: index
        }));

        const { error: brokerError } = await supabase
          .from('broker_comparisons')
          .insert(brokerComparisons);

        if (brokerError) {
          console.error('Broker association error:', brokerError);
          return NextResponse.json(
            { error: 'Failed to update broker associations' },
            { status: 500 }
          );
        }
      }
    }

    return NextResponse.json({
      success: true,
      comparison: {
        ...comparison,
        brokerIds
      },
      message: 'Comparison updated successfully'
    });

  } catch (error) {
    console.error('Comparison update error:', error);

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
    const { id } = params;

    const supabase = await getSupabaseClientWithAuth();

    // Check if user owns the comparison
    const { data: existingComparison } = await supabase
      .from('comparisons')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!existingComparison || existingComparison.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this comparison' },
        { status: 403 }
      );
    }

    // Delete broker associations first
    await supabase
      .from('broker_comparisons')
      .delete()
      .eq('comparison_id', id);

    // Delete comparison
    const { error } = await supabase
      .from('comparisons')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to delete comparison' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Comparison deleted successfully'
    });

  } catch (error) {
    console.error('Comparison deletion error:', error);

    if (error instanceof Error && error.message === 'Unauthorized') {
      return createUnauthorizedResponse();
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}