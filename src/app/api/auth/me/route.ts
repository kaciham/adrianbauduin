import { NextRequest, NextResponse } from 'next/server';
import { AuthMiddleware } from '../../../../utils/authMiddleware';

export async function GET(request: NextRequest) {
  try {
    const authResult = await AuthMiddleware.verifyAuth(request);
    
    if (!authResult) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: authResult.user
    });

  } catch (error) {
    console.error('Me endpoint error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}