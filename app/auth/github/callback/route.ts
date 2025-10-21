// app/auth/github/callback/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  console.log('GitHub callback received:', { code: !!code, state, error });

  // Handle errors from GitHub
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
    // CRITICAL: Include redirect_uri in token exchange
    const redirectUri = `${request.nextUrl.origin}/auth/github/callback`;
    
    console.log('Exchanging code for token with:', {
      clientId: process.env.GITHUB_CLIENT_ID ? 'present' : 'missing',
      clientSecret: process.env.GITHUB_CLIENT_SECRET ? 'present' : 'missing',
      redirectUri
    });

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
        redirect_uri: redirectUri, // THIS IS REQUIRED
      }),
    });

    const data = await tokenResponse.json();
    console.log('GitHub token exchange response:', { 
      success: !!data.access_token,
      error: data.error,
      error_description: data.error_description 
    });

    if (data.error) {
      console.error('GitHub token error:', data);
      throw new Error(data.error_description || data.error);
    }

    if (!data.access_token) {
      throw new Error('No access token received');
    }

    // Redirect back to app with token in URL params (temporary)
    const redirectUrl = new URL('/', request.url);
    redirectUrl.searchParams.set('github_token', data.access_token);
    
    const response = NextResponse.redirect(redirectUrl);
    
    // Also set secure cookie as backup
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
    const errorMessage = error instanceof Error ? error.message : 'unknown';
    const redirectUrl = new URL('/', request.url);
    redirectUrl.searchParams.set('github_error', 'auth_failed');
    redirectUrl.searchParams.set('error_detail', errorMessage);
    return NextResponse.redirect(redirectUrl);
  }
}
