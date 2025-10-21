// --- app/api/github/create-repo/route.ts ---
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, description, isPublic, files, accessToken } = await req.json();

    if (!accessToken) {
      return NextResponse.json({ 
        success: false, 
        error: "Missing GitHub access token" 
      }, { status: 401 });
    }

    // Create repository
    const repoRes = await fetch("https://api.github.com/user/repos", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "Accept": "application/vnd.github.v3+json",
      },
      body: JSON.stringify({
        name,
        description: description || "Project created with AI Web Studio",
        private: !isPublic,
        auto_init: false,
      }),
    });

    const repoData = await repoRes.json();
    
    if (!repoRes.ok) {
      console.error("GitHub repo creation failed:", repoData);
      return NextResponse.json({ 
        success: false, 
        error: repoData.message || "Failed to create repository" 
      }, { status: repoRes.status });
    }

    // Create files in the repository
    const fileCreationPromises = files.map(async (file: any) => {
      const fileRes = await fetch(
        `https://api.github.com/repos/${repoData.full_name}/contents/${file.path}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            "Accept": "application/vnd.github.v3+json",
          },
          body: JSON.stringify({
            message: `Add ${file.path}`,
            content: btoa(unescape(encodeURIComponent(file.content))),
          }),
        }
      );

      if (!fileRes.ok) {
        const errorData = await fileRes.json();
        console.error(`Failed to create file ${file.path}:`, errorData);
        throw new Error(`Failed to create ${file.path}: ${errorData.message}`);
      }

      return fileRes.json();
    });

    await Promise.all(fileCreationPromises);

    const pagesUrl = `https://${repoData.owner.login}.github.io/${name}`;

    return NextResponse.json({
      success: true,
      html_url: repoData.html_url,
      pages_url: repoData.private ? null : pagesUrl,
      full_name: repoData.full_name,
    });

  } catch (err: any) {
    console.error("Repository creation error:", err);
    return NextResponse.json({ 
      success: false, 
      error: err.message || "Unknown error occurred" 
    }, { status: 500 });
  }
}




