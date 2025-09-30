import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_SERVICE_KEY! // Use service key for admin operations
);

export default async function handler(req: Request): Promise<Response> {
  try {
    const { method } = req;
    
    // Parse authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.slice(7);

    // Verify the user token and check admin status
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if user is admin
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('role')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    if (!adminUser && !user.app_metadata?.role?.includes('admin')) {
      return new Response(JSON.stringify({ error: 'Insufficient permissions' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    switch (method) {
      case 'GET':
        // Get all ranking weights
        const { data: weights, error: getError } = await supabase
          .from('ranking_weights')
          .select('*')
          .order('factor');

        if (getError) {
          throw new Error(getError.message);
        }

        return new Response(JSON.stringify({ weights }), {
          headers: { 'Content-Type': 'application/json' }
        });

      case 'PUT':
        // Update ranking weights
        const body = await req.json();
        const { weights: newWeights } = body;

        if (!newWeights || typeof newWeights !== 'object') {
          return new Response(JSON.stringify({ error: 'Invalid weights data' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        // Validate total weight doesn't exceed 1.0
        const totalWeight = Object.values(newWeights).reduce((sum: number, w: any) => sum + (parseFloat(w) || 0), 0);
        if (totalWeight > 1.01) {
          return new Response(JSON.stringify({ error: 'Total weights cannot exceed 1.0' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        // Update each weight
        const updatePromises = Object.entries(newWeights).map(async ([factor, weight]) => {
          const { error } = await supabase
            .from('ranking_weights')
            .update({
              weight: parseFloat(weight as string),
              updated_at: new Date().toISOString(),
              updated_by: user.email || 'admin'
            })
            .eq('factor', factor);

          if (error) {
            throw error;
          }

          // Log the change
          return supabase.from('verification_logs').insert({
            action: 'ranking_weight_changed',
            entity_type: 'ranking_weights',
            entity_id: factor,
            details: {
              factor,
              new_weight: weight,
              changed_by: user.email
            },
            user_id: user.id,
            created_at: new Date().toISOString()
          });
        });

        await Promise.all(updatePromises);

        return new Response(JSON.stringify({ success: true }), {
          headers: { 'Content-Type': 'application/json' }
        });

      case 'POST':
        // Reset weights to defaults
        const defaultWeights = [
          { factor: 'regulation', weight: 0.25 },
          { factor: 'execution', weight: 0.20 },
          { factor: 'costs', weight: 0.20 },
          { factor: 'platform', weight: 0.15 },
          { factor: 'country_availability', weight: 0.10 },
          { factor: 'user_reviews', weight: 0.10 }
        ];

        const resetPromises = defaultWeights.map(async ({ factor, weight }) => {
          const { error } = await supabase
            .from('ranking_weights')
            .update({
              weight,
              updated_at: new Date().toISOString(),
              updated_by: user.email || 'admin'
            })
            .eq('factor', factor);

          if (error) {
            throw error;
          }
        });

        await Promise.all(resetPromises);

        // Log the reset action
        await supabase.from('verification_logs').insert({
          action: 'ranking_weights_reset',
          entity_type: 'ranking_weights',
          entity_id: 'all',
          details: {
            reset_by: user.email,
            default_weights: defaultWeights
          },
          user_id: user.id,
          created_at: new Date().toISOString()
        });

        return new Response(JSON.stringify({ success: true }), {
          headers: { 'Content-Type': 'application/json' }
        });

      default:
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { 'Content-Type': 'application/json' }
        });
    }
  } catch (error) {
    console.error('Admin rankings API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}