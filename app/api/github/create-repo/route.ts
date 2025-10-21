import { NextRequest, NextResponse } from "next/server";

interface File {
  path: string;
  content: string;
}

interface RepoRequestBody {
  name: string;
  description: string;
  isPublic: boolean;
  deployPages: boolean;
  files: File[];
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Missing GitHub token" }, { status: 401 });

    const body: RepoRequestBody = await req.json();

    // Step 1: Create the repository
    const repoRes = await fetch("https://api.github.com/user/repos", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Accept": "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: body.name,
        description: body.description,
        private: !body.isPublic,
      }),
    });

    const repoData = await repoRes.json();
    if (!repoRes.ok) throw new Error(repoData.message || "Failed to create repository");

    const owner = repoData.owner.login;
    const repo = repoData.name;

    // Step 2: Create each file via GitHub API
    for (const file of body.files) {
      const fileRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${file.path}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept": "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Add ${file.path}`,
          content: Buffer.from(file.content).toString("base64"),
        }),
      });

      const fileData = await fileRes.json();
      if (!fileRes.ok) throw new Error(fileData.message || `Failed to create file ${file.path}`);
    }

    // Step 3: Return success and repo URL
    return NextResponse.json({ success: true, html_url: repoData.html_url });

  } catch (err) {
    console.error("GitHub repo creation error:", err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}


