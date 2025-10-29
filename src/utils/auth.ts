import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export class AuthUtils {
  /**
   * Hash a password
   * @param password string
   * @returns Promise<string>
   */
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  /**
   * Compare password with hash
   * @param password string
   * @param hash string
   * @returns Promise<boolean>
   */
  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  /**
   * Generate JWT token
   * @param payload TokenPayload
   * @returns string
   */
  static generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: '7d', // Token expires in 7 days
    });
  }

  /**
   * Verify JWT token
   * @param token string
   * @returns TokenPayload | null
   */
  static verifyToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch (error) {
      return null;
    }
  }

  /**
   * Extract token from request headers
   * @param request NextRequest
   * @returns string | null
   */
  static extractTokenFromRequest(request: NextRequest): string | null {
    const authHeader = request.headers.get('authorization');
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    // Also check for token in cookies
    const cookieToken = request.cookies.get('auth-token');
    if (cookieToken) {
      return cookieToken.value;
    }

    return null;
  }

  /**
   * Validate email format
   * @param email string
   * @returns boolean
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate password strength
   * @param password string
   * @returns {isValid: boolean, message: string}
   */
  static validatePassword(password: string): {isValid: boolean, message: string} {
    if (password.length < 6) {
      return {
        isValid: false,
        message: 'Password must be at least 6 characters long'
      };
    }

    if (password.length > 128) {
      return {
        isValid: false,
        message: 'Password cannot exceed 128 characters'
      };
    }

    // Check for at least one letter and one number (optional, but recommended)
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);

    if (!hasLetter || !hasNumber) {
      return {
        isValid: false,
        message: 'Password should contain at least one letter and one number'
      };
    }

    return {
      isValid: true,
      message: 'Password is valid'
    };
  }

  /**
   * Generate a secure random string for tokens
   * @param length number
   * @returns string
   */
  static generateSecureToken(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
  }
}