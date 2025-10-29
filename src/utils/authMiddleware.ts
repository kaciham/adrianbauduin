import { NextRequest, NextResponse } from 'next/server';
import { AuthUtils, TokenPayload } from './auth';
import connectToDatabase from '../lib/mongodb';
import { User } from '../models/User';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export class AuthMiddleware {
  /**
   * Verify authentication and attach user to request
   * @param request NextRequest
   * @returns Promise<{user: any} | null>
   */
  static async verifyAuth(request: NextRequest): Promise<{user: any} | null> {
    try {
      const token = AuthUtils.extractTokenFromRequest(request);
      
      if (!token) {
        return null;
      }

      const payload = AuthUtils.verifyToken(token);
      if (!payload) {
        return null;
      }

      // Connect to database and fetch user
      await connectToDatabase();
      const user = await User.findById(payload.userId).select('-password');
      
      if (!user) {
        return null;
      }

      return {
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role
        }
      };
    } catch (error) {
      console.error('Auth verification error:', error);
      return null;
    }
  }

  /**
   * Require authentication - returns error response if not authenticated
   * @param request NextRequest
   * @returns Promise<{user: any} | NextResponse>
   */
  static async requireAuth(request: NextRequest): Promise<{user: any} | NextResponse> {
    const authResult = await this.verifyAuth(request);
    
    if (!authResult) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    return authResult;
  }

  /**
   * Require admin role - returns error response if not admin
   * @param request NextRequest
   * @returns Promise<{user: any} | NextResponse>
   */
  static async requireAdmin(request: NextRequest): Promise<{user: any} | NextResponse> {
    const authResult = await this.requireAuth(request);
    
    if (authResult instanceof NextResponse) {
      return authResult; // Return the auth error
    }

    if (authResult.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    return authResult;
  }

  /**
   * Optional authentication - attaches user if authenticated, continues if not
   * @param request NextRequest
   * @returns Promise<{user: any} | null>
   */
  static async optionalAuth(request: NextRequest): Promise<{user: any} | null> {
    return await this.verifyAuth(request);
  }
}

/**
 * Create authentication response with token
 * @param user any
 * @param message string
 * @returns NextResponse
 */
export function createAuthResponse(user: any, message: string = 'Authentication successful'): NextResponse {
  const token = AuthUtils.generateToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role
  });

  const response = NextResponse.json({
    success: true,
    message,
    user: {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role
    }
  });

  // Set token in HTTP-only cookie for security
  response.cookies.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 // 7 days
  });

  return response;
}