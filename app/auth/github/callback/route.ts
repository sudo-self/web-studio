// app/auth/github/callback/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  if (!code) return NextResponse.redirect(new URL('/?github_error=no_code', req.url));

  // Exchange code for token on server
  const tokenRes = await fetch('/api/github/oauth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });
  const data = await tokenRes.json();

  if (!data.token) return NextResponse.redirect(new URL('/?github_error=auth_failed', req.url));

  return NextResponse.redirect(new URL(`/?github_token=${data.token}`, req.url));
}

