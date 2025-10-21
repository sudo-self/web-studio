"use client";

import React, { useState } from 'react';

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

const ExternalLink = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 13v6a2 2 0 0 1-2 2H5 ..."/>
  </svg>
);

interface GithubRepoProps {
  onRepoCreated?: (repoUrl: string) => void;
}

interface FormData {
  name: string;
  description: string;
  isPublic: boolean;
  deployPages: boolean;
}

const GithubRepo: React.FC<GithubRepoProps> = ({ onRepoCreated }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: 'web-studio-project',
    description: 'Project created with AI Web Studio',
    isPublic: true,
    deployPages: true
  });

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateRepo = async () => {
    if (!formData.name.trim()) return;

    setIsLoading(true);

    try {
      const projectData = getCurrentProjectData();
      const files = createProjectFiles(projectData, formData.deployPages);

      const result = await createGitHubRepo({ ...formData, files });

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
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      showNotification(`Failed to create repository: ${errorMessage}`, 'error');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const createProjectFiles = (projectData: any, deployPages: boolean) => {
    const badge = '<img src="https://img.shields.io/badge/made%20with-studio.jessejesse.com-orange?style=plastic" alt="made with - studio.jessejesse.com" />';
    const readmeContent = [
      `# ${formData.name}`,
      '',
      formData.description,
      '',
      badge,
      '',
      '## About',
      '',
      'This project was created with [studio.jessejesse.com](https://studio.jessejesse.com) - AI-powered web studio.',
      '',
      '## Getting Started',
      '',
      'Open index.html in your browser to view the project.',
      '',
      '---',
      '*Created with AI Web Studio*'
    ].join('\n');

    const files = [
      { path: 'index.html', content: projectData.html || '<!DOCTYPE html><html><head><title>Project</title></head><body><h1>Hello World!</h1></body></html>' },
      { path: 'README.md', content: readmeContent }
    ];

    if (deployPages) {
      files.push({
        path: '.github/workflows/static.yml',
        content: `# GitHub Pages deployment workflow
name: Deploy static content to Pages
on:
  push:
    branches: ["main"]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
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

  return (
    <>
      <button className="btn btn-outline btn-sm flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
        <Github size={14} />
        Create Repo
      </button>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Github size={20} />
                Create GitHub Repository
              </h3>
              <button onClick={() => setIsModalOpen(false)} disabled={isLoading} className="btn btn-ghost btn-sm btn-icon">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Repo Name */}
              <div>
                <label className="block text-sm font-medium mb-1">Repository Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full p-2 border rounded text-sm"
                  placeholder="my-awesome-project"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full p-2 border rounded text-sm"
                  placeholder="Project created with AI Web Studio"
                />
              </div>

              {/* Checkboxes */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="deploy-pages"
                  checked={formData.deployPages}
                  onChange={(e) => handleInputChange('deployPages', e.target.checked)}
                  className="rounded border"
                />
                <label htmlFor="deploy-pages" className="text-sm">Deploy to GitHub Pages</label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is-public"
                  checked={formData.isPublic}
                  onChange={(e) => handleInputChange('isPublic', e.target.checked)}
                  className="rounded border"
                />
                <label htmlFor="is-public" className="text-sm">Public repository</label>
              </div>

              {/* Files Preview */}
              <div className="text-xs p-3 rounded border">
                <p className="font-medium mb-2">Files that will be created:</p>
                <ul className="space-y-1">
                  <li>• <code>index.html</code></li>
                  <li>• <code>README.md</code></li>
                  {formData.deployPages && <li>• <code>.github/workflows/static.yml</code></li>}
                </ul>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-2">
                <button className="btn btn-ghost flex-1" onClick={() => setIsModalOpen(false)} disabled={isLoading}>Cancel</button>
                <button className="btn btn-primary flex-1 flex items-center justify-center gap-2" onClick={handleCreateRepo} disabled={isLoading || !formData.name.trim()}>
                  {isLoading ? 'Creating...' : <><Github size={16} /> Create Repository</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Helper stubs
async function createGitHubRepo(options: any) {
  return fetch('/api/github/create-repo', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(options) })
    .then(res => res.json());
}

function getCurrentProjectData() {
  return { html: '<!DOCTYPE html><html><body><h1>Hello World</h1></body></html>' };
}

function showNotification(message: string, type: 'success' | 'error' | 'info' = 'info') {
  console.log(`${type}: ${message}`);
}

export default GithubRepo;

