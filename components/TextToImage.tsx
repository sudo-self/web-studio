// components/TextToImage.tsx

import { useState, useEffect } from 'react';

type Props = {
  /** Prompt that will be sent to the worker */
  prompt?: string;
  /** Optional placeholder image shown while loading */
  placeholder?: string;
  /** Worker endpoint (defaults to the Cloudflare route you posted) */
  workerUrl?: string;
};

export default function TextToImage({
  prompt = 'The Matrix',
  placeholder,
  workerUrl = '/api/text-to-image', // <-- change if your route is different
}: Props) {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<string | null>(null);

  // generate image when component mounts or prompt changes
  useEffect(() => {
    let cancelled = false;

    async function fetchImage() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(workerUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt }),
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Worker returned ${res.status}: ${text}`);
        }

        const blob = await res.blob();          // PNG Blob
        const url  = URL.createObjectURL(blob); // local object URL

        if (!cancelled) {
          setImgSrc(url);
        }
      } catch (e: any) {
        if (!cancelled) setError(e.message || 'Unknown error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchImage();

    // cleanup on unmount
    return () => {
      cancelled = true;
      if (imgSrc) URL.revokeObjectURL(imgSrc);
    };
  }, [prompt, workerUrl]);

  return (
    <div style={{ textAlign: 'center' }}>
      {loading && <p>Generating image…</p>}
      {error && (
        <div style={{ color: 'red' }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      {!loading && !error && (
        <img
          src={imgSrc ?? placeholder}
          alt={`Image for "${prompt}"`}
          style={{ maxWidth: '100%', borderRadius: 8 }}
        />
      )}
    </div>
  );
}








