"use client";

import { Github } from 'lucide-react';

interface GithubAuthProps {
  onAuthSuccess: (token: string) => void;
}

export default function GithubAuth({ onAuthSuccess }: GithubAuthProps) {
  const startOAuth = async () => {
    try {
      const response = await fetch('/api/github/auth/init');
      const data = await response.json();
      
      if (data.authUrl) {
        window.location.href = data.authUrl;
      } else {
        throw new Error('Failed to get auth URL');
      }
    } catch (error) {
      console.error('Failed to start OAuth:', error);
      alert('Failed to connect to GitHub. Please try again.');
    }
  };

  return (
    <button
      className="btn btn-primary w-full flex items-center justify-center gap-2"
      onClick={startOAuth}
    >
      <Github size={16} />
      Sign in with GitHub
    </button>
  );
}
