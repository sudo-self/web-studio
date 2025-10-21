import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    if (!clientId || !clientSecret)
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });

    const params = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
    });

    const res = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: params.toString(),
    });

    const data = await res.json();

    if (!data.access_token)
      return NextResponse.json({ error: data.error_description || "Token exchange failed" }, { status: 400 });

    return NextResponse.json({ token: data.access_token });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

