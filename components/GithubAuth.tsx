// components/GithubAuth.tsx
import { Github } from 'lucide-react';

const GithubAuth = ({ onAuthSuccess }: { onAuthSuccess: (token: string) => void }) => {
  const startOAuth = () => {
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/github/callback`;
    const scope = 'repo,workflow';
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
};
