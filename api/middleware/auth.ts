import { createClerkClient } from '@clerk/backend';
import type { User } from '@clerk/backend';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  username?: string;
  imageUrl?: string;
}

export async function authenticateUser(request: Request): Promise<AuthUser | null> {
  try {
    const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! });

    // Get the Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);

    // Verify the token with Clerk
    try {
      const { userId } = await clerkClient.verifyToken(token);

      if (!userId) {
        return null;
      }

      const user = await clerkClient.users.getUser(userId);

      return {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress || '',
        name: `${user.firstName} ${user.lastName}`.trim() || '',
        username: user.username,
        imageUrl: user.imageUrl
      };
    } catch (tokenError) {
      console.error('Token verification error:', tokenError);
      return null;
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

export async function requireAuth(request: Request): Promise<AuthUser> {
  const user = await authenticateUser(request);

  if (!user) {
    throw new Error('Unauthorized');
  }

  return user;
}

export function createUnauthorizedResponse() {
  return new Response(JSON.stringify({
    error: 'Unauthorized',
    message: 'Authentication required'
  }), {
    status: 401,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}