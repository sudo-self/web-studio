import { NextRequest, NextResponse } from "next/server";

const GITHUB_API_BASE = "https://api.github.com";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // --- Step 1: OAuth token exchange ---
    if (body.code) {
      const clientId = process.env.GITHUB_CLIENT_ID;
      const clientSecret = process.env.GITHUB_CLIENT_SECRET;

      if (!clientId || !clientSecret) {
        return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
      }

      const params = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code: body.code,
      });

      const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: params.toString(),
      });

      const tokenData = await tokenRes.json();

      if (!tokenData.access_token) {
        return NextResponse.json({ error: "Failed to get GitHub token" }, { status: 400 });
      }

      return NextResponse.json({ token: tokenData.access_token });
    }

    // --- Step 2: Create repo ---
    if (body.files && body.name) {
      const token = req.headers.get("authorization")?.replace("Bearer ", "");

      if (!token) return NextResponse.json({ error: "Missing token" }, { status: 401 });

      const { name, description, isPublic = true, deployPages = true, files } = body;

      // Create repository
      const repoRes = await fetch(`${GITHUB_API_BASE}/user/repos`, {
        method: "POST",
        headers: {
          Authorization: `token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          private: !isPublic,
        }),
      });

      const repoData = await repoRes.json();

      if (!repoData || !repoData.full_name) {
        return NextResponse.json({ error: repoData.message || "Failed to create repo" }, { status: 400 });
      }

      const owner = repoData.owner.login;
      const repo = repoData.name;

      // Upload files via GitHub API
      for (const file of files) {
        await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${file.path}`, {
          method: "PUT",
          headers: {
            Authorization: `token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: `Add ${file.path}`,
            content: Buffer.from(file.content).toString("base64"),
          }),
        });
      }

      // Optional: GitHub Pages URL
      let pages_url: string | null = null;
      if (deployPages) {
        pages_url = `https://${owner}.github.io/${repo}`;
      }

      return NextResponse.json({ success: true, html_url: repoData.html_url, pages_url });
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
