// app/api/save-manifest/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { id, filename, manifest_data } = await request.json();

    if (!id || !filename || !manifest_data) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Save to Turso database
    const tursoResponse = await fetch('https://apk-icons-sudo-self.aws-us-east-1.turso.io', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjE2Mzg1MDEsImlkIjoiYmU2NTMzZTktZmNmYS00ODczLWIyN2ItN2I4YzczMmJkZjMyIiwicmlkIjoiNDRhNTYwMzYtYjc3ZC00Yzc2LTkwYTAtY2MyNjI0OWQxNzZhIn0.tF0t5GvKhLEzAW32PJ263dr00LrCVBge2Rz6T69JdsCvJ2He_SzMJQ3AMpfAWpsFoJ7aqLpMRXgifl0XKzylAw`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        operation: 'upsert',
        table: 'manifests',
        record: {
          id,
          filename,
          manifest_data,
          created_at: new Date().toISOString()
        }
      })
    });

    if (!tursoResponse.ok) {
      const errorText = await tursoResponse.text();
      console.error('Turso error:', errorText);
      throw new Error(`Turso error: ${tursoResponse.statusText}`);
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://studio.jessejesse.com';
    const url = `${baseUrl}/api/manifests/${filename}`;
    
    return NextResponse.json({ url });
  } catch (error) {
    console.error('Error saving manifest:', error);
    return NextResponse.json(
      { error: 'Failed to save manifest' },
      { status: 500 }
    );
  }
}
