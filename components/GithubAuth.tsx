"use client";

import { Github } from 'lucide-react'; 

export const GithubAuth = ({ onAuthSuccess }: { onAuthSuccess: (token: string) => void }) => {
  const startOAuth = () => {
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    if (!clientId) {
      console.error('GitHub Client ID not found');
      return;
    }

    const redirectUri = `${window.location.origin}/auth/github/callback`;
    const scope = 'repo public_repo workflow';
    const state = Math.random().toString(36).substring(2);
    
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${state}`;
    
    window.location.href = authUrl;
  };

  return (
    <button
      onClick={startOAuth}
      className="btn btn-primary flex items-center justify-center gap-2"
    >
      <Github size={16} />
      Connect GitHub Account
    </button>
  );
};
