"use client";

import { Github } from 'lucide-react';

interface GithubAuthProps {
  onAuthSuccess: (token: string) => void;
}

export default function GithubAuth({ onAuthSuccess }: GithubAuthProps) {
  const startOAuth = () => {

    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    
    if (!clientId) {
      alert('GitHub OAuth is not configured. Please add NEXT_PUBLIC_GITHUB_CLIENT_ID to your environment variables.');
      return;
    }

    const redirectUri = `${window.location.origin}/auth/github/callback`;
    const scope = 'repo,workflow,user';
    const state = Math.random().toString(36).substring(2);
    
    localStorage.setItem('github_oauth_state', state);
    
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${state}`;
    window.location.href = authUrl;
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
