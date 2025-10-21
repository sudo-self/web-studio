// app/auth/github/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const savedState = req.cookies.get('github_oauth_state')?.value;

  if (!code || !state || state !== savedState) {
    const redirectUrl = new URL('/', req.url);
    redirectUrl.searchParams.set('github_error', 'auth_failed');
    redirectUrl.searchParams.set('error_detail', 'Invalid state or missing code');
    return NextResponse.redirect(redirectUrl);
  }

  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: `${req.nextUrl.origin}/auth/github/callback`,
      }),
    });

    const data = await tokenRes.json();

    if (!data.access_token) {
      throw new Error(data.error_description || 'No access token received');
    }

    // Redirect back to app with token in cookie
    const redirectUrl = new URL('/', req.url);
    const response = NextResponse.redirect(redirectUrl);

    response.cookies.set('github_token', data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    return response;
  } catch (err) {
    const redirectUrl = new URL('/', req.url);
    redirectUrl.searchParams.set('github_error', 'auth_failed');
    redirectUrl.searchParams.set('error_detail', err instanceof Error ? err.message : 'unknown');
    return NextResponse.redirect(redirectUrl);
  }
}


