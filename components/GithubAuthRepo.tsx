'use client';
import React, { useEffect, useState } from 'react';

const Github = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 ..."/>
  </svg>
);
const X = ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M18.3 5.71a.996.996 0 0 0-1.41 0 ..."/></svg>;

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
    deployPages: true,
  });

  // Step 1: OAuth login
  const startOAuth = () => {
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    if (!clientId) return alert('GitHub OAuth not configured');

    const redirectUri = `${window.location.origin}/auth/github/callback`;
    const state = Math.random().toString(36).substring(2);
    document.cookie = `github_oauth_state=${state}; path=/`;

    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=repo,workflow,user&state=${state}`;

    window.location.href = authUrl;
  };

  // Step 2: Read token from cookie
  useEffect(() => {
    const match = document.cookie.match(/github_token=([^;]+)/);
    if (match) setToken(match[1]);
  }, []);

  // Step 3: Repo creation
  const handleCreateRepo = async () => {
    if (!token || !formData.name.trim()) return;
    setIsLoading(true);

    try {
      const projectData = getCurrentProjectData();
      const files = createProjectFiles(projectData, formData.deployPages);

      const res = await fetch('/api/github/create-repo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...formData, files }),
      });

      const result = await res.json();

      if (result.success && result.html_url) {
        onRepoCreated?.(result.html_url);
        window.open(result.html_url, '_blank');
        setIsModalOpen(false);
      } else throw new Error(result.error || 'Failed to create repository');
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  const createProjectFiles = (projectData: any, deployPages: boolean) => {
    const files = [
      { path: 'index.html', content: projectData.html },
      { path: 'README.md', content: `# ${formData.name}\n\n${formData.description}` },
    ];
    if (deployPages)
      files.push({
        path: '.github/workflows/static.yml',
        content: `name: Deploy\non: [push]\njobs:\n  deploy:\n    runs-on: ubuntu-latest`,
      });
    return files;
  };

  if (!token)
    return (
      <button className="btn btn-primary" onClick={startOAuth}>
        <Github size={16} /> Sign in with GitHub
      </button>
    );

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
              <button onClick={() => setIsModalOpen(false)} disabled={isLoading}>
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                value={formData.name}
                onChange={e => handleInputChange('name', e.target.value)}
                placeholder="Repository Name"
              />
              <input
                type="text"
                value={formData.description}
                onChange={e => handleInputChange('description', e.target.value)}
                placeholder="Description"
              />
              <label>
                <input type="checkbox" checked={formData.deployPages} onChange={e => handleInputChange('deployPages', e.target.checked)} /> Deploy Pages
              </label>
              <label>
                <input type="checkbox" checked={formData.isPublic} onChange={e => handleInputChange('isPublic', e.target.checked)} /> Public
              </label>

              <div className="flex gap-2 pt-2">
                <button onClick={() => setIsModalOpen(false)} disabled={isLoading}>
                  Cancel
                </button>
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

function getCurrentProjectData() {
  return { html: '<!DOCTYPE html><html><body><h1>Hello World</h1></body></html>' };
}

export default GithubAuthRepo;



