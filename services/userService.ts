import { User } from '../types';

// Base API URL - adjust according to your deployment
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-api-domain.vercel.app' 
  : 'http://localhost:3000';

export interface UserPreferences {
  tradingLevel?: 'beginner' | 'intermediate' | 'advanced';
  tradingExperience?: string;
  preferredInstruments?: string[];
  riskTolerance?: 'low' | 'medium' | 'high';
  baseCurrency?: string;
}

export interface CreateUserRequest {
  id: string;
  email: string;
  name: string;
  preferences?: UserPreferences;
}

export interface UpdateUserRequest {
  name?: string;
  preferences?: UserPreferences;
}

class UserService {
  private getAuthHeaders(): { Authorization: string } | {} {
    // Get the token from Clerk - this will be called from components
    // that have access to useAuth hook
    if (typeof window !== 'undefined' && window.Clerk) {
      const session = window.Clerk.session;
      if (session) {
        return {
          Authorization: `Bearer ${session.getToken()}`
        };
      }
    }
    return {};
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create user');
    }

    const data = await response.json();
    return data.user;
  }

  async getUser(userId: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/api/users?id=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch user');
    }

    const data = await response.json();
    return data.user;
  }

  async updateUser(userId: string, updates: UpdateUserRequest): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/api/users`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update user');
    }

    const data = await response.json();
    return data.user;
  }

  async deleteUser(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/users`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete user');
    }
  }

  // Synchronize Clerk user with database on first login
  async syncUserWithDatabase(clerkUser: any): Promise<User> {
    const userData: CreateUserRequest = {
      id: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress || '',
      name: clerkUser.fullName || clerkUser.firstName || clerkUser.username || 'User',
    };

    try {
      // Try to get existing user first
      return await this.getUser(userData.id);
    } catch (error) {
      // If user doesn't exist, create them
      return await this.createUser(userData);
    }
  }

  // Helper method to get token for API calls from components
  async getTokenForApiCall(): Promise<string | null> {
    if (typeof window !== 'undefined' && window.Clerk) {
      const session = window.Clerk.session;
      if (session) {
        try {
          return await session.getToken();
        } catch (error) {
          console.error('Failed to get token:', error);
          return null;
        }
      }
    }
    return null;
  }
}

export const userService = new UserService();
export default userService;