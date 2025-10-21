// app/api/github/callback/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  // Verify state
  const storedState = req.cookies.get("github_oauth_state")?.value;
  if (!code || state !== storedState) {
    return NextResponse.json({ error: "Invalid state or missing code" }, { status: 400 });
  }

  const client_id = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
  const client_secret = process.env.GITHUB_CLIENT_SECRET;

  try {
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ client_id, client_secret, code }),
    });

    const tokenData = await tokenRes.json();
    if (tokenData.error) {
      return NextResponse.json({ error: tokenData.error }, { status: 400 });
    }

    // Optionally, store in cookie
    const res = NextResponse.redirect(new URL("/", req.url)); // redirect to home
    res.cookies.set("github_access_token", tokenData.access_token, { httpOnly: true });
    return res;

  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch access token" }, { status: 500 });
  }
}



