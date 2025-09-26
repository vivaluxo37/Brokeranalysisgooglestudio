import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';
import { cors, handleOptions } from '@/middleware/cors';
import { checkRateLimit, createRateLimitResponse } from '@/middleware/rateLimit';

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
    const supabase = getSupabaseClient();

    const { data: broker, error } = await supabase
      .from('brokers')
      .select(`
        *,
        regulation:broker_regulations(
          authority,
          license_number,
          status,
          year_obtained
        ),
        platforms:broker_platforms(
          name,
          type,
          features
        ),
        fees:broker_fees(
          type,
          amount,
          description,
          conditions
        ),
        trading_instruments:broker_trading_instruments(
          instrument_type,
          available,
          spreads,
          commission
        ),
        customer_support:broker_customer_support(
          language,
          availability,
          methods
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Broker not found' },
          { status: 404 }
        );
      }
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch broker' },
        { status: 500 }
      );
    }

    if (!broker) {
      return NextResponse.json(
        { error: 'Broker not found' },
        { status: 404 }
      );
    }

    // Get average rating
    const { data: reviews } = await supabase
      .from('reviews')
      .select('rating')
      .eq('broker_id', id)
      .eq('verified', true);

    const averageRating = reviews && reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

    const reviewCount = reviews?.length || 0;

    return NextResponse.json({
      ...broker,
      averageRating: Math.round(averageRating * 100) / 100,
      reviewCount
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}