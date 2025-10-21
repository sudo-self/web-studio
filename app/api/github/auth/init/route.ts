import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = `${process.env.NEXTAUTH_URL || request.nextUrl.origin}/auth/github/callback`;
  const scope = 'repo,workflow,user';
  const state = Math.random().toString(36).substring(2);
  
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${state}`;
  
  return NextResponse.json({ authUrl });
}
