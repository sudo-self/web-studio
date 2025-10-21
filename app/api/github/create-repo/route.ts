import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { name, description, isPublic, files } = await req.json();
  const token = req.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) return NextResponse.json({ success: false, error: 'Missing token' });

  try {
    // 1️⃣ Create repo
    const repoRes = await fetch('https://api.github.com/user/repos', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
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
    if (!repoData.html_url) throw new Error(repoData.message || 'Failed to create repo');

    // 2️⃣ Push files
    for (const file of files) {
      await fetch(`https://api.github.com/repos/${repoData.full_name}/contents/${file.path}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
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
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Unknown error' });
  }
}



