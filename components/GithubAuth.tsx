"use client";

import React, { useEffect } from "react";

interface Props {
  onAuthSuccess: (token: string) => void;
}

const GithubAuth: React.FC<Props> = ({ onAuthSuccess }) => {

  const startOAuth = () => {
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    if (!clientId) {
      alert("GitHub OAuth client ID not configured");
      return;
    }

    const redirectUri = `${window.location.origin}/auth/github/callback`;
    const state = Math.random().toString(36).substring(2);
    localStorage.setItem("github_oauth_state", state);

    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=repo,workflow,user&state=${state}`;

    window.location.href = authUrl;
  };

  // Handle OAuth callback automatically if user lands here
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");
    const savedState = localStorage.getItem("github_oauth_state");

    if (code && state && state === savedState) {
      localStorage.removeItem("github_oauth_state");

      // Exchange code for token on server
      fetch("/api/github/oauth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.token) onAuthSuccess(data.token);
          else alert("Failed to get GitHub token");
        })
        .catch(console.error);
    }
  }, [onAuthSuccess]);

  return (
    <button
      className="btn btn-primary w-full flex items-center justify-center gap-2"
      onClick={startOAuth}
    >
      <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 ..."/>
      </svg>
      Sign in with GitHub
    </button>
  );
};

export default GithubAuth;


