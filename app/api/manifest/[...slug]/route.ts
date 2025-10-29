// app/api/manifests/[...slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  try {
    const { slug } = await params;
    const filename = slug.join('/');

    if (!filename) {
      return NextResponse.json(
        { error: 'Filename is required' },
        { status: 400 }
      );
    }

    // Fetch from Turso database
    const tursoResponse = await fetch('https://apk-icons-sudo-self.aws-us-east-1.turso.io', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjE2Mzg1MDEsImlkIjoiYmU2NTMzZTktZmNmYS00ODczLWIyN2ItN2I4YzczMmJkZjMyIiwicmlkIjoiNDRhNTYwMzYtYjc3ZC00Yzc2LTkwYTAtY2MyNjI0OWQxNzZhIn0.tF0t5GvKhLEzAW32PJ263dr00LrCVBge2Rz6T69JdsCvJ2He_SzMJQ3AMpfAWpsFoJ7aqLpMRXgifl0XKzylAw`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        operation: 'query',
        query: 'SELECT * FROM manifests WHERE filename = ?',
        params: [filename]
      })
    });

    if (!tursoResponse.ok) {
      throw new Error('Failed to fetch from Turso');
    }

    const data = await tursoResponse.json();
    const manifest = data[0]?.manifest_data;

    if (!manifest) {
      return NextResponse.json(
        { error: 'Manifest not found' },
        { status: 404 }
      );
    }

    // Set CORS headers
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return new NextResponse(JSON.stringify(manifest), {
      status: 200,
      headers
    });
  } catch (error) {
    console.error('Error fetching manifest:', error);
    return NextResponse.json(
      { error: 'Manifest not found' },
      { status: 404 }
    );
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type');
  
  return new NextResponse(null, {
    status: 200,
    headers
  });
}
