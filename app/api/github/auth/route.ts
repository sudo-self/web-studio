import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();
    
    console.log('Exchanging GitHub code for token');
    
    if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
      console.error('Missing GitHub OAuth configuration');
      return NextResponse.json(
        { error: 'GitHub OAuth not configured' },
        { status: 500 }
      );
    }

    const response = await fetch('https://github.com/login/oauth/access_token', {
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

    const data = await response.json();
    console.log('GitHub token response:', data);
    
    if (data.error) {
      console.error('GitHub OAuth error:', data);
      return NextResponse.json({ error: data.error_description || data.error }, { status: 400 });
    }

    return NextResponse.json({ access_token: data.access_token });
    
  } catch (error) {
    console.error('GitHub auth error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
