import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';
import { BrokerQuerySchema, type BrokerQuery } from '@/lib/validation';
import { cors, handleOptions } from '@/middleware/cors';
import { checkRateLimit, createRateLimitResponse } from '@/middleware/rateLimit';

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

    // Parse query parameters
    const { searchParams } = new URL(request.url);

    const query: BrokerQuery = {
      search: searchParams.get('search') || undefined,
      regulation: searchParams.get('regulation') || undefined,
      minDeposit: searchParams.get('minDeposit') || undefined,
      platform: searchParams.get('platform') || undefined,
      leverage: searchParams.get('leverage') || undefined,
      limit: parseInt(searchParams.get('limit') || '10'),
      offset: parseInt(searchParams.get('offset') || '0')
    };

    // Validate query parameters
    const validatedQuery = BrokerQuerySchema.parse(query);

    const supabase = getSupabaseClient();
    let queryBuilder = supabase
      .from('brokers')
      .select(`
        *,
        regulation:broker_regulations(
          authority,
          license_number,
          status
        ),
        platforms:broker_platforms(
          name,
          type
        ),
        fees:broker_fees(
          type,
          amount,
          description
        )
      `);

    // Apply filters
    if (validatedQuery.search) {
      queryBuilder = queryBuilder.ilike('name', `%${validatedQuery.search}%`);
    }

    if (validatedQuery.regulation) {
      queryBuilder = queryBuilder.filter('broker_regulations.authority', 'ilike', `%${validatedQuery.regulation}%`);
    }

    if (validatedQuery.minDeposit) {
      queryBuilder = queryBuilder.lte('min_deposit_amount', parseFloat(validatedQuery.minDeposit.replace(/[^0-9.]/g, '')));
    }

    if (validatedQuery.platform) {
      queryBuilder = queryBuilder.filter('broker_platforms.name', 'ilike', `%${validatedQuery.platform}%`);
    }

    // Apply pagination
    queryBuilder = queryBuilder
      .range(validatedQuery.offset, validatedQuery.offset + validatedQuery.limit - 1)
      .order('created_at', { ascending: false });

    const { data, error, count } = await queryBuilder;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch brokers' },
        { status: 500 }
      );
    }

    // Get total count for pagination
    const { count: totalCount } = await supabase
      .from('brokers')
      .select('*', { count: 'exact', head: true });

    return NextResponse.json({
      brokers: data,
      pagination: {
        total: totalCount || 0,
        limit: validatedQuery.limit,
        offset: validatedQuery.offset,
        hasMore: (validatedQuery.offset + validatedQuery.limit) < (totalCount || 0)
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