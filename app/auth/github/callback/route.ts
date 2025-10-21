// app/auth/github/callback/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  
  // Get state from localStorage via cookie (we'll set this differently)
  const savedState = req.cookies.get("github_oauth_state")?.value;

  console.log("GitHub Callback:", { code, state, savedState });

  if (!code || !state || state !== savedState) {
    console.error("GitHub OAuth failed: Invalid state or missing code", {
      code: !!code,
      state: !!state,
      savedState: !!savedState,
      stateMatch: state === savedState
    });
    
    const redirectUrl = new URL("/", req.url);
    redirectUrl.searchParams.set("github_error", "auth_failed");
    redirectUrl.searchParams.set("error_detail", "Invalid state or missing code");
    return NextResponse.redirect(redirectUrl);
  }

  try {
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: `${req.nextUrl.origin}/auth/github/callback`,
      }),
    });

    const data = await tokenRes.json();
    console.log("GitHub Token Response:", data);

    if (!data.access_token) {
      throw new Error(data.error_description || "No access token received");
    }

    // ✅ Redirect to site with token
    const redirectUrl = new URL("/", req.url);
    redirectUrl.searchParams.set("github_token", data.access_token);

    // Clear the state cookie
    const response = NextResponse.redirect(redirectUrl);
    response.cookies.delete("github_oauth_state");
    
    return response;
  } catch (err) {
    console.error("GitHub OAuth error:", err);
    const redirectUrl = new URL("/", req.url);
    redirectUrl.searchParams.set("github_error", "auth_failed");
    redirectUrl.searchParams.set(
      "error_detail",
      err instanceof Error ? err.message : "unknown"
    );
    return NextResponse.redirect(redirectUrl);
  }
}





