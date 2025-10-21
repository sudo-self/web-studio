"use client";

import React, { useState, useEffect } from 'react';

const Github = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 ..."/>
  </svg>
);

const X = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.3 5.71a.996.996 0 0 0-1.41 0 ..."/>
  </svg>
);

interface FormData {
  name: string;
  description: string;
  isPublic: boolean;
  deployPages: boolean;
}

interface Props {
  onRepoCreated?: (repoUrl: string) => void;
}

const GithubAuthRepo: React.FC<Props> = ({ onRepoCreated }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: 'web-studio-project',
    description: 'Project created with AI Web Studio',
    isPublic: true,
    deployPages: true
  });

  /** ------------------------------
   *  Step 1: OAuth login
   *------------------------------- */
  const startOAuth = () => {
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    if (!clientId) {
      alert('GitHub OAuth not configured');
      return;
    }

    const redirectUri = `${window.location.origin}/auth/github/callback`;
    const state = Math.random().toString(36).substring(2);
    localStorage.setItem('github_oauth_state', state);

    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=repo,workflow,user&state=${encodeURIComponent(state)}`;

    window.location.href = authUrl;
  };

  /** ------------------------------
   *  Step 2: Handle OAuth callback
   *------------------------------- */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    const savedState = localStorage.getItem('github_oauth_state');

    if (code && state && state === savedState) {
      localStorage.removeItem('github_oauth_state');

      // Exchange code for token
      fetch('/api/github/exchange', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      })
        .then(res => res.json())
        .then(data => {
          if (data.token) {
            setToken(data.token);
            setIsModalOpen(true);
          } else {
            alert('Failed to get GitHub token');
          }
        })
        .catch(err => console.error(err));
    }
  }, []);

  /** ------------------------------
   *  Step 3: Repo creation
   *------------------------------- */
  const handleCreateRepo = async () => {
    if (!token || !formData.name.trim()) return;
    setIsLoading(true);

    try {
      const projectData = getCurrentProjectData();
      const files = createProjectFiles(projectData, formData.deployPages);

      const response = await fetch('/api/github/create-repo', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ...formData, files })
      });

      const result = await response.json();

      if (result.success && result.html_url) {
        onRepoCreated?.(result.html_url);
        showNotification('Repository created successfully!', 'success');
        if (formData.deployPages && result.pages_url) {
          showNotification(`GitHub Pages URL: ${result.pages_url}`, 'success');
        }
        window.open(result.html_url, '_blank');
        setIsModalOpen(false);
      } else {
        throw new Error(result.error || 'Failed to create repository');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      showNotification(`Failed to create repo: ${errorMessage}`, 'error');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const createProjectFiles = (projectData: any, deployPages: boolean) => {
    const badge = '<img src="https://img.shields.io/badge/made%20with-studio.jessejesse.com-orange?style=plastic" />';
    const readmeContent = [
      `# ${formData.name}`,
      '',
      formData.description,
      '',
      badge,
      '',
      '## About',
      '',
      'Created with [studio.jessejesse.com](https://studio.jessejesse.com)',
      '',
      '## Getting Started',
      '',
      'Open index.html to view the project.'
    ].join('\n');

    const files = [
      { path: 'index.html', content: projectData.html || '<!DOCTYPE html><html><body><h1>Hello World</h1></body></html>' },
      { path: 'README.md', content: readmeContent }
    ];

    if (deployPages) {
      files.push({
        path: '.github/workflows/static.yml',
        content: `# GitHub Pages deployment workflow
name: Deploy
on: [push]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: '.'
      - uses: actions/deploy-pages@v4
        id: deployment`
      });
    }

    return files;
  };

  /** ------------------------------
   *  Render
   *------------------------------- */
  if (!token) {
    return (
      <button className="btn btn-primary" onClick={startOAuth}>
        <Github size={16} /> Sign in with GitHub
      </button>
    );
  }

  return (
    <>
      <button className="btn btn-outline btn-sm flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
        <Github size={14} /> Create Repo
      </button>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Github size={20} /> Create GitHub Repository
              </h3>
              <button onClick={() => setIsModalOpen(false)} disabled={isLoading}><X size={16} /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label>Repository Name</label>
                <input type="text" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} />
              </div>

              <div>
                <label>Description</label>
                <input type="text" value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} />
              </div>

              <div>
                <label><input type="checkbox" checked={formData.deployPages} onChange={(e) => handleInputChange('deployPages', e.target.checked)} /> Deploy Pages</label>
                <label><input type="checkbox" checked={formData.isPublic} onChange={(e) => handleInputChange('isPublic', e.target.checked)} /> Public</label>
              </div>

              <div className="flex gap-2 pt-2">
                <button onClick={() => setIsModalOpen(false)} disabled={isLoading}>Cancel</button>
                <button onClick={handleCreateRepo} disabled={isLoading || !formData.name.trim()}>
                  {isLoading ? 'Creating...' : 'Create Repository'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/** ------------------------------
 *  Helpers
 *------------------------------- */
function getCurrentProjectData() {
  return { html: '<!DOCTYPE html><html><body><h1>Hello World</h1></body></html>' };
}

function showNotification(message: string, type: 'success' | 'error' | 'info' = 'info') {
  console.log(`${type}: ${message}`);
}

export default GithubAuthRepo;


