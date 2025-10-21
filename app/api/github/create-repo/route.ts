// app/api/github/create-repo/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface FileData {
  path: string;
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, name, description, isPublic, files }: { token: string; name: string; description: string; isPublic: boolean; files: FileData[] } = body;

    if (!token || !name) {
      return NextResponse.json({ error: 'Missing token or repository name' }, { status: 400 });
    }

    // Step 1: Create GitHub repository
    const repoRes = await fetch('https://api.github.com/user/repos', {
      method: 'POST',
      headers: {
        Authorization: `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        description,
        private: !isPublic,
        auto_init: false,
      }),
    });

    const repoData = await repoRes.json();

    if (repoData.message) {
      return NextResponse.json({ error: repoData.message }, { status: 400 });
    }

    // Step 2: Add files to repository
    for (const file of files) {
      await fetch(`https://api.github.com/repos/${repoData.owner.login}/${name}/contents/${file.path}`, {
        method: 'PUT',
        headers: {
          Authorization: `token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Add ${file.path}`,
          content: Buffer.from(file.content).toString('base64'),
        }),
      });
    }

    return NextResponse.json({
      success: true,
      html_url: repoData.html_url,
      pages_url: `https://${repoData.owner.login}.github.io/${name}`,
    });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 });
  }
}

