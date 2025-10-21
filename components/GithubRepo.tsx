import React, { useState } from 'react';

// If you're using Lucide React icons, make sure they're imported
// If not, you can use simple text or other icons
const Github = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const X = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59 7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12 5.7 16.89a.996.996 0 1 0 1.41 1.41L12 13.41l4.89 4.89a.996.996 0 1 0 1.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"/>
  </svg>
);

const ExternalLink = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6m4-3h6v6m-11 5L21 3"/>
  </svg>
);

interface GithubRepoProps {
  onRepoCreated?: (repoUrl: string) => void;
}

const GithubRepo: React.FC<GithubRepoProps> = ({ onRepoCreated }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: 'web-studio-project',
    description: 'Project created with AI Web Studio',
    isPublic: true,
    deployPages: true
  });

  const handleCreateRepo = async () => {
    setIsLoading(true);
    try {
      // Get current project data
      const projectData = getCurrentProjectData();
      
      // Create the file structure
      const files = createProjectFiles(projectData, formData.deployPages);
      
      // Create repository
      const result = await createGitHubRepo({
        ...formData,
        files: files
      });

      if (result.success) {
        onRepoCreated?.(result.html_url);
        setIsModalOpen(false);
        showNotification('Repository created successfully!', 'success');
        
        // Show pages URL if deployed
        if (formData.deployPages && result.pages_url) {
          showNotification(`GitHub Pages will be available at: ${result.pages_url}`, 'success');
        }
        
        // Open new repo in tab
        if (result.html_url) {
          window.open(result.html_url, '_blank');
        }
      } else {
        throw new Error(result.error || 'Failed to create repository');
      }
    } catch (error) {
      console.error('GitHub repo creation failed:', error);
      showNotification(`Failed to create repository: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const createProjectFiles = (projectData: any, deployPages: boolean) => {
    const badge = '<img src="https://img.shields.io/badge/made%20with-studio.jessejesse.com-orange?style=plastic" alt="made with - studio.jessejesse.com" />';
    
    const files = [
      {
        path: 'index.html',
        content: projectData.html || '<!DOCTYPE html>\n<html>\n<head>\n    <title>Web Studio Project</title>\n</head>\n<body>\n    <h1>Hello World!</h1>\n</body>\n</html>'
      },
      {
        path: 'README.md',
        content: `# ${formData.name}\n\n${formData.description}\n\n${badge}\n\n## About\n\nThis project was created with [studio.jessejesse.com](https://studio.jessejesse.com) - an AI-powered web development studio.\n\n## Getting Started\n\nOpen \`index.html\` in your browser to view the project.\n\n---\n*Created with ❤️ using AI Web Studio*`
      }
    ];

    if (deployPages) {
      files.push({
        path: '.github/workflows/static.yml',
        content: `# GitHub Pages
name: Deploy static content to Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Pages
        uses: actions/configure-pages@v5
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4`
      });
    }

    return files;
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <>
      {/* Create Repo Button */}
      <button
        className="btn btn-outline btn-sm flex items-center gap-2"
        onClick={() => setIsModalOpen(true)}
      >
        <Github size={14} />
        Create Repo
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                <Github size={20} />
                Create GitHub Repository
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="btn btn-ghost btn-sm btn-icon"
                disabled={isLoading}
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Repository Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full p-2 border border-panel-border rounded bg-component-bg text-text-primary text-sm"
                  placeholder="my-awesome-project"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full p-2 border border-panel-border rounded bg-component-bg text-text-primary text-sm"
                  placeholder="Project created with AI Web Studio"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="deploy-pages"
                  checked={formData.deployPages}
                  onChange={(e) => handleInputChange('deployPages', e.target.checked)}
                  className="rounded border-panel-border bg-component-bg"
                />
                <label htmlFor="deploy-pages" className="text-sm text-text-primary">
                  Deploy to GitHub Pages
                </label>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is-public"
                  checked={formData.isPublic}
                  onChange={(e) => handleInputChange('isPublic', e.target.checked)}
                  className="rounded border-panel-border bg-component-bg"
                />
                <label htmlFor="is-public" className="text-sm text-text-primary">
                  Public repository
                </label>
              </div>

              {/* Files Preview */}
              <div className="text-xs text-text-muted bg-component-bg p-3 rounded border border-panel-border">
                <p className="font-medium text-text-primary mb-2">Files that will be created:</p>
                <ul className="space-y-1">
                  <li>• <code>index.html</code> - Your project</li>
                  <li>• <code>README.md</code> - With project info and badge</li>
                  {formData.deployPages && (
                    <li>• <code>.github/workflows/static.yml</code> - GitHub Pages deployment</li>
                  )}
                </ul>
                {formData.deployPages && (
                  <p className="mt-2 text-text-primary">
                    Your site will be available at: <code>username.github.io/{formData.name}</code>
                  </p>
                )}
              </div>
              
              <div className="flex gap-2 pt-2">
                <button
                  className="btn btn-ghost flex-1"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary flex-1 flex items-center justify-center gap-2"
                  onClick={handleCreateRepo}
                  disabled={isLoading || !formData.name.trim()}
                >
                  {isLoading ? (
                    <>
                      <div className="loading-spinner"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Github size={16} />
                      Create Repository
                    </>
                  )}
                </button>
              </div>

              {/* Info section */}
              <div className="text-xs text-text-muted bg-component-bg p-3 rounded border border-panel-border">
                <p className="flex items-center gap-1 mb-1">
                  <ExternalLink size={12} />
                  <strong>Note:</strong>
                </p>
                <p>You'll be redirected to GitHub to authorize this application.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Helper functions (these would be implemented elsewhere)
async function createGitHubRepo(options: any) {
  // Implementation needed - this would call your backend API
  return await fetch('/api/github/create-repo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(options)
  }).then(res => res.json());
}

function getCurrentProjectData() {
  // Implementation needed - get current project state from your app
  // This should return the current HTML, CSS, JS content
  return {
    html: '<!-- Your project HTML content here -->',
    css: '/* Your project CSS here */',
    js: '// Your project JavaScript here'
  };
}

function showNotification(message: string, type: 'success' | 'error' | 'info' = 'info') {
  // Implementation needed - use your app's notification system
  console.log(`${type}: ${message}`);
}

export default GithubRepo;
