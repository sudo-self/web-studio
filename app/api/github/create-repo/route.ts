// --- app/api/github/create-repo/route.ts ---
import { NextRequest, NextResponse } from "next/server";

interface GitHubFile {
  path: string;
  content: string;
}

interface CreateRepoRequest {
  name: string;
  description: string;
  isPublic: boolean;
  files: GitHubFile[];
  accessToken: string;
}

export async function POST(req: NextRequest) {
  try {
    const { name, description, isPublic, files, accessToken }: CreateRepoRequest = await req.json();

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: "Missing GitHub access token" },
        { status: 401 }
      );
    }

    // --- STEP 0: Get the current user's GitHub username ---
    const userRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!userRes.ok) {
      return NextResponse.json(
        { success: false, error: "Failed to fetch GitHub user info" },
        { status: userRes.status }
      );
    }

    const userData = await userRes.json();
    const username = userData.login;
    const repoFullName = `${username}/${name}`;

    // --- STEP 1: check if repo already exists ---
    const existingRepoRes = await fetch(
      `https://api.github.com/repos/${repoFullName}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    let repoData;
    if (existingRepoRes.status === 200) {
      // ✅ Repo exists — reuse it
      repoData = await existingRepoRes.json();
      console.log(`Repo '${repoFullName}' already exists, reusing it.`);
    } else {
      // --- STEP 2: create repository if not found ---
      const repoRes = await fetch("https://api.github.com/user/repos", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Accept: "application/vnd.github.v3+json",
        },
        body: JSON.stringify({
          name,
          description: description || "Project created with AI Web Studio",
          private: !isPublic,
          auto_init: false,
        }),
      });

      repoData = await repoRes.json();

      if (!repoRes.ok) {
        console.error("GitHub repo creation failed:", repoData);
        return NextResponse.json(
          {
            success: false,
            error: repoData.message || "Failed to create repository",
          },
          { status: repoRes.status }
        );
      }

      // short wait for repo propagation
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    // --- STEP 3: create/update files in the repo ---
    const fileCreationResults = [];

    for (const file of files) {
      try {
        // check if file already exists
        const checkRes = await fetch(
          `https://api.github.com/repos/${repoData.full_name}/contents/${file.path}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: "application/vnd.github.v3+json",
            },
          }
        );

        let sha;
        if (checkRes.status === 200) {
          const existingFile = await checkRes.json();
          sha = existingFile.sha;
        }

        // create or update file
        const fileRes = await fetch(
          `https://api.github.com/repos/${repoData.full_name}/contents/${file.path}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
              Accept: "application/vnd.github.v3+json",
            },
            body: JSON.stringify({
              message: `Add ${file.path} via AI Web Studio`,
              content: Buffer.from(file.content).toString("base64"),
              ...(sha && { sha }),
            }),
          }
        );

        if (!fileRes.ok) {
          const errorData = await fileRes.json();
          console.error(`Failed to create file ${file.path}:`, errorData);
          fileCreationResults.push({
            file: file.path,
            success: false,
            error: errorData.message,
          });
        } else {
          fileCreationResults.push({ file: file.path, success: true });
        }
      } catch (fileError) {
        console.error(`Error creating file ${file.path}:`, fileError);
        fileCreationResults.push({
          file: file.path,
          success: false,
          error: fileError instanceof Error ? fileError.message : "Unknown error",
        });
      }
    }

    // --- STEP 4: Enable GitHub Pages (if deploying) ---
    let pagesEnabled = false;
    const hasPagesWorkflow = files.some((f: GitHubFile) => f.path === '.github/workflows/deploy.yml');
    
    if (hasPagesWorkflow && !repoData.private) {
      try {
        // Enable GitHub Pages
        const pagesRes = await fetch(
          `https://api.github.com/repos/${repoData.full_name}/pages`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
              Accept: "application/vnd.github.v3+json",
            },
            body: JSON.stringify({
              source: {
                branch: "main",
                path: "/"
              }
            }),
          }
        );

        if (pagesRes.ok) {
          pagesEnabled = true;
          console.log("GitHub Pages enabled successfully");
        } else if (pagesRes.status === 409) {
          // Pages might already be enabled
          pagesEnabled = true;
          console.log("GitHub Pages already enabled");
        } else {
          const pagesError = await pagesRes.json();
          console.warn("Failed to enable GitHub Pages via API:", pagesError);
        }
      } catch (pagesError) {
        console.warn("Error enabling GitHub Pages:", pagesError);
      }
    }

    // --- STEP 5: respond ---
    const failedFiles = fileCreationResults.filter((r) => !r.success);
    const pagesUrl = `https://${username}.github.io/${name}`;

    return NextResponse.json({
      success: true,
      html_url: repoData.html_url,
      pages_url: repoData.private ? null : pagesUrl,
      full_name: repoData.full_name,
      pages_enabled: pagesEnabled,
      file_results: fileCreationResults,
      warnings:
        failedFiles.length > 0
          ? `Some files may not have been created properly: ${failedFiles
              .map((f) => f.file)
              .join(", ")}`
          : null,
    });
  } catch (err: any) {
    console.error("Repository creation error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Unknown error occurred" },
      { status: 500 }
    );
  }
}





