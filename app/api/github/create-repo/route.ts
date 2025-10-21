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
        auto_init: false, // Make sure this is false
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

    // Wait a moment for the repo to be fully initialized
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create files in the repository with error handling
    const fileCreationResults = [];
    
    for (const file of files) {
      try {
        // Check if file already exists
        const checkRes = await fetch(
          `https://api.github.com/repos/${repoData.full_name}/contents/${file.path}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Accept": "application/vnd.github.v3+json",
            },
          }
        );

        let sha = undefined;
        if (checkRes.status === 200) {
          const existingFile = await checkRes.json();
          sha = existingFile.sha; // Get the SHA of the existing file to update it
        }

        // Create or update the file
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
              content: Buffer.from(file.content).toString('base64'),
              ...(sha && { sha }) // Include SHA if updating existing file
            }),
          }
        );

        if (!fileRes.ok) {
          const errorData = await fileRes.json();
          console.error(`Failed to create file ${file.path}:`, errorData);
          fileCreationResults.push({
            file: file.path,
            success: false,
            error: errorData.message
          });
        } else {
          fileCreationResults.push({
            file: file.path,
            success: true
          });
        }
      } catch (fileError) {
        console.error(`Error creating file ${file.path}:`, fileError);
        fileCreationResults.push({
          file: file.path,
          success: false,
          error: fileError instanceof Error ? fileError.message : 'Unknown error'
        });
      }
    }

    // Check if any file creations failed
    const failedFiles = fileCreationResults.filter(result => !result.success);
    if (failedFiles.length > 0) {
      console.warn("Some files failed to create:", failedFiles);
      // We still return success since the repo was created, but with warnings
    }

    const pagesUrl = `https://${repoData.owner.login}.github.io/${name}`;

    return NextResponse.json({
      success: true,
      html_url: repoData.html_url,
      pages_url: repoData.private ? null : pagesUrl,
      full_name: repoData.full_name,
      file_results: fileCreationResults,
      warnings: failedFiles.length > 0 ? 
        `Some files may not have been created properly: ${failedFiles.map(f => f.file).join(', ')}` 
        : null
    });

  } catch (err: any) {
    console.error("Repository creation error:", err);
    return NextResponse.json({ 
      success: false, 
      error: err.message || "Unknown error occurred" 
    }, { status: 500 });
  }
}




