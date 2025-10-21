import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { name, description, isPublic, deployPages, files, accessToken } = await request.json();

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: 'No access token provided' },
        { status: 401 }
      );
    }

    // 1. Create repository
    const repoResponse = await fetch('https://api.github.com/user/repos', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({
        name,
        description: description || 'Project created with AI Web Studio',
        private: !isPublic,
        auto_init: false
      })
    });

    if (!repoResponse.ok) {
      const errorData = await repoResponse.text();
      console.error('GitHub repo creation failed:', errorData);
      throw new Error(`GitHub API error: ${repoResponse.status} - ${repoResponse.statusText}`);
    }

    const repo = await repoResponse.json();

    // 2. Create files in repository
    for (const file of files) {
      const fileResponse = await fetch(`https://api.github.com/repos/${repo.full_name}/contents/${file.path}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3+json',
        },
        body: JSON.stringify({
          message: `Add ${file.path}`,
          content: Buffer.from(file.content).toString('base64')
        })
      });

      if (!fileResponse.ok) {
        const errorData = await fileResponse.text();
        console.error(`Failed to create file ${file.path}:`, errorData);
        throw new Error(`Failed to create file ${file.path}`);
      }
    }

    // 3. Enable GitHub Pages if requested
    if (deployPages) {
      // Wait a bit for the files to be processed
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const pagesResponse = await fetch(`https://api.github.com/repos/${repo.full_name}/pages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3+json',
        },
        body: JSON.stringify({
          source: {
            branch: 'main',
            path: '/'
          }
        })
      });

      if (!pagesResponse.ok && pagesResponse.status !== 409) { // 409 means pages already exists
        console.warn('GitHub Pages setup failed, but continuing...');
      }
    }

    return NextResponse.json({
      success: true,
      html_url: repo.html_url,
      pages_url: `https://${repo.owner.login}.github.io/${repo.name}`,
      repo_name: repo.full_name
    });

  } catch (error: any) {
    console.error('Repository creation error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create repository' },
      { status: 500 }
    );
  }
}
