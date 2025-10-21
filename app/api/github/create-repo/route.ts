// app/api/github/create-repo/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { name, description, isPublic, deployPages, files, accessToken } = await request.json();

    // 1. Create repository
    const repoResponse = await fetch('https://api.github.com/user/repos', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        description,
        private: !isPublic,
        auto_init: false
      })
    });

    if (!repoResponse.ok) {
      throw new Error(`GitHub API error: ${repoResponse.status}`);
    }

    const repo = await repoResponse.json();

    // 2. Create files in repository
    for (const file of files) {
      await fetch(`https://api.github.com/repos/${repo.full_name}/contents/${file.path}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Add ${file.path}`,
          content: btoa(unescape(encodeURIComponent(file.content)))
        })
      });
    }

    // 3. Enable GitHub Pages if requested
    if (deployPages) {
      await fetch(`https://api.github.com/repos/${repo.full_name}/pages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source: {
            branch: 'main',
            path: '/'
          }
        })
      });
    }

    return NextResponse.json({
      success: true,
      html_url: repo.html_url,
      pages_url: `https://${repo.owner.login}.github.io/${repo.name}`
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
