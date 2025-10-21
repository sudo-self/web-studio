// app/auth/github/callback/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  console.log('GitHub callback received:', { code: !!code, state, error });

  // Handle errors
  if (error) {
    console.error('GitHub OAuth error:', error);
    const redirectUrl = new URL('/', request.url);
    redirectUrl.searchParams.set('github_error', error);
    return NextResponse.redirect(redirectUrl);
  }

  if (!code) {
    console.error('No code received from GitHub');
    const redirectUrl = new URL('/', request.url);
    redirectUrl.searchParams.set('github_error', 'no_code');
    return NextResponse.redirect(redirectUrl);
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const data = await tokenResponse.json();
    console.log('GitHub token exchange response:', { success: !!data.access_token });

    if (data.error) {
      console.error('GitHub token error:', data);
      throw new Error(data.error_description || data.error);
    }

    if (!data.access_token) {
      throw new Error('No access token received');
    }

    // Redirect back to app with token
    const redirectUrl = new URL('/', request.url);
    redirectUrl.searchParams.set('github_token', data.access_token);
    
    const response = NextResponse.redirect(redirectUrl);
    
    // Set secure cookie
    response.cookies.set('github_token', data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('GitHub OAuth callback error:', error);
    const redirectUrl = new URL('/', request.url);
    redirectUrl.searchParams.set('github_error', 'auth_failed');
    return NextResponse.redirect(redirectUrl);
  }
}
