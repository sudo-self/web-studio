//components/GitHubModal.tsx 

"use client";

import { useState } from "react";
import { Github, X, FileText } from 'lucide-react';
import { GithubAuth } from './GithubAuth';

interface GithubUser {
  login: string;
  avatar_url: string;
}

interface GithubForm {
  name: string;
  description: string;
  deployPages: boolean;
  isPublic: boolean;
}

interface GitHubModalProps {
  showGithubModal: boolean;
  setShowGithubModal: (show: boolean) => void;
  githubToken: string | null;
  setGithubToken: (token: string | null) => void;
  githubUser: GithubUser | null;
  setGithubUser: (user: GithubUser | null) => void;
  githubForm: GithubForm;
  setGithubForm: (form: GithubForm | ((prev: GithubForm) => GithubForm)) => void;
  isCreatingRepo: boolean;
  handleCreateRepo: () => Promise<void>;
  fetchUserInfo: (token: string) => void;
}

// Supporting component types
interface GitHubAuthSectionProps { onAuthSuccess: (token: string) => void; }
interface GitHubConnectedSectionProps {
  githubUser: GithubUser | null;
  githubForm: GithubForm;
  setGithubForm: (form: GithubForm | ((prev: GithubForm) => GithubForm)) => void;
  isCreatingRepo: boolean;
  onDisconnect: () => void;
  onCreateRepo: () => void;
  onCancel: () => void;
}
interface UserInfoCardProps { githubUser: GithubUser | null; onDisconnect: () => void; isCreatingRepo: boolean; }
interface FormFieldProps { label: string; value: string; onChange: (value: string) => void; placeholder: string; disabled: boolean; required?: boolean; }
interface CheckboxOptionProps { id: string; label: string; description: string; checked: boolean; onChange: (checked: boolean) => void; disabled: boolean; }
interface FilesPreviewProps { githubForm: GithubForm; githubUser: GithubUser | null; }
interface ActionButtonsProps { isCreatingRepo: boolean; isValid: boolean; onCreateRepo: () => void; onCancel: () => void; }


const GitHubAuthSection = ({ onAuthSuccess }: GitHubAuthSectionProps) => (
  <div className="text-center py-8">
    <div className="p-4 bg-component-bg rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center border border-panel-border">
      <Github size={32} className="text-text-muted" />
    </div>
    <div className="mb-6">
      <h4 className="text-lg font-semibold text-text-primary mb-3">Connect to GitHub</h4>
      <p className="text-sm text-text-muted leading-relaxed">
        Connect your GitHub account to create repositories<br />and deploy with GitHub Pages
      </p>
    </div>
    <GithubAuth onAuthSuccess={onAuthSuccess} />
  </div>
);


const GitHubConnectedSection = ({
  githubUser,
  githubForm,
  setGithubForm,
  isCreatingRepo,
  onDisconnect,
  onCreateRepo,
  onCancel
}: GitHubConnectedSectionProps) => (
  <div className="space-y-6">
    <UserInfoCard githubUser={githubUser} onDisconnect={onDisconnect} isCreatingRepo={isCreatingRepo} />

    <div className="space-y-5">
      <FormField label="Repository Name" value={githubForm.name} onChange={(v) => setGithubForm(prev => ({ ...prev, name: v }))} placeholder="my-awesome-project" disabled={isCreatingRepo} required />
      <FormField label="Description" value={githubForm.description} onChange={(v) => setGithubForm(prev => ({ ...prev, description: v }))} placeholder="Project created with AI Web Studio" disabled={isCreatingRepo} />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CheckboxOption id="deploy-pages" label="Deploy to Pages" description="Auto-deploy with GitHub Pages" checked={githubForm.deployPages} onChange={(c) => setGithubForm(prev => ({ ...prev, deployPages: c }))} disabled={isCreatingRepo} />
        <CheckboxOption id="is-public" label="Public Repository" description="Visible to everyone" checked={githubForm.isPublic} onChange={(c) => setGithubForm(prev => ({ ...prev, isPublic: c }))} disabled={isCreatingRepo} />
      </div>

      <FilesPreview githubForm={githubForm} githubUser={githubUser} />
    </div>

    <ActionButtons isCreatingRepo={isCreatingRepo} isValid={githubForm.name.trim().length > 0} onCreateRepo={onCreateRepo} onCancel={onCancel} />
  </div>
);


const UserInfoCard = ({ githubUser, onDisconnect, isCreatingRepo }: UserInfoCardProps) => (
  <div className="bg-component-bg rounded-xl border border-panel-border p-5">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <img src={githubUser?.avatar_url} alt={`${githubUser?.login}'s GitHub avatar`} className="w-12 h-12 rounded-full border-2 border-panel-border" />
        <div>
          <div className="text-base font-semibold text-text-primary">{githubUser?.login}</div>
          <div className="text-sm text-text-muted flex items-center gap-2 mt-1">
            <div className="w-2 h-2 bg-green-500 rounded-full" aria-hidden="true"></div>
            Connected to GitHub
          </div>
        </div>
      </div>
      <button 
        onClick={onDisconnect} 
        className="text-sm text-text-muted hover:text-accent-color transition-colors px-4 py-2 rounded-lg hover:bg-component-hover disabled:opacity-50 border border-panel-border hover:border-accent-color/30" 
        disabled={isCreatingRepo}
      >
        Disconnect
      </button>
    </div>
  </div>
);

const FormField = ({ label, value, onChange, placeholder, disabled, required }: FormFieldProps) => (
  <div>
    <label className="block text-sm font-medium text-text-primary mb-3">
      {label}{required && <span className="text-red-400 ml-1">*</span>}
    </label>
    <input 
      type="text" 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      placeholder={placeholder} 
      disabled={disabled} 
      required={required}
      className="w-full p-4 border border-panel-border rounded-xl bg-component-bg text-text-primary text-base focus:outline-none focus:ring-2 focus:ring-accent-color focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed placeholder-text-muted" 
    />
  </div>
);

const CheckboxOption = ({ id, label, description, checked, onChange, disabled }: CheckboxOptionProps) => (
  <label className="flex items-start gap-4 p-4 bg-component-bg rounded-xl border border-panel-border hover:border-accent-color transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 group">
    <input 
      type="checkbox" 
      id={id} 
      checked={checked} 
      onChange={(e) => onChange(e.target.checked)} 
      disabled={disabled}
      className="mt-1 rounded border-panel-border bg-component-bg text-accent-color focus:ring-accent-color focus:ring-2 focus:ring-offset-2 focus:ring-offset-component-bg transform scale-110" 
    />
    <div className="flex-1">
      <div className="text-base font-medium text-text-primary group-hover:text-accent-color transition-colors">{label}</div>
      <div className="text-sm text-text-muted mt-1">{description}</div>
    </div>
  </label>
);

const FilesPreview = ({ githubForm, githubUser }: FilesPreviewProps) => (
  <div className="bg-component-bg rounded-xl border border-panel-border overflow-hidden">
    <div className="p-4 border-b border-panel-border bg-component-bg">
      <p className="font-semibold text-text-primary flex items-center gap-3 text-base">
        <FileText size={18} />
        Files to be created
      </p>
    </div>
    <div className="p-4">
      <ul className="space-y-3">
        <li className="flex items-center gap-4 p-3 rounded-lg hover:bg-component-hover transition-colors group">
          <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0" aria-hidden="true"></div>
          <code className="text-sm text-text-primary font-medium flex-1">index.html</code>
          <span className="text-xs text-text-muted bg-component-bg px-2 py-1 rounded">Your website</span>
        </li>
        <li className="flex items-center gap-4 p-3 rounded-lg hover:bg-component-hover transition-colors group">
          <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0" aria-hidden="true"></div>
          <code className="text-sm text-text-primary font-medium flex-1">README.md</code>
          <span className="text-xs text-text-muted bg-component-bg px-2 py-1 rounded">Project documentation</span>
        </li>
        {githubForm.deployPages && (
          <li className="flex items-center gap-4 p-3 rounded-lg hover:bg-component-hover transition-colors group">
            <div className="w-3 h-3 bg-purple-500 rounded-full flex-shrink-0" aria-hidden="true"></div>
            <code className="text-sm text-text-primary font-medium flex-1">.github/workflows/deploy.yml</code>
            <span className="text-xs text-text-muted bg-component-bg px-2 py-1 rounded">Deployment workflow</span>
          </li>
        )}
      </ul>
      {githubForm.deployPages && githubForm.name && (
        <div className="mt-5 p-4 bg-accent-color bg-opacity-5 rounded-lg border border-accent-color border-opacity-20">
          <p className="text-sm text-text-primary font-medium mb-2">Your website will be available at:</p>
          <code className="text-sm text-accent-color break-all bg-black bg-opacity-10 px-3 py-2 rounded border border-accent-color border-opacity-20">
            https://{githubUser?.login}.github.io/{githubForm.name}/
          </code>
        </div>
      )}
    </div>
  </div>
);

const ActionButtons = ({ isCreatingRepo, isValid, onCreateRepo, onCancel }: ActionButtonsProps) => (
  <div className="flex gap-4 pt-4">
    <button 
      className="btn btn-outline flex-1 disabled:opacity-50 disabled:cursor-not-allowed py-3 text-base" 
      onClick={onCancel} 
      disabled={isCreatingRepo}
    >
      Cancel
    </button>
    <button 
      className="btn btn-primary flex-1 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed py-3 text-base" 
      onClick={onCreateRepo} 
      disabled={isCreatingRepo || !isValid}
    >
      {isCreatingRepo ? (
        <>
          <div className="loading-spinner w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Creating Repository...
        </>
      ) : (
        <>
          <Github size={18} />
          Create Repository
        </>
      )}
    </button>
  </div>
);


export const GitHubModal = ({
  showGithubModal,
  setShowGithubModal,
  githubToken,
  setGithubToken,
  githubUser,
  setGithubUser,
  githubForm,
  setGithubForm,
  isCreatingRepo,
  handleCreateRepo,
  fetchUserInfo
}: GitHubModalProps) => {
  const [successData, setSuccessData] = useState<{ html_url: string; pages_url?: string } | null>(null);

  const handleCreateRepoWithSuccess = async () => {
    if (!githubToken) return;
    try {
      await handleCreateRepo(); 
      setSuccessData({
        html_url: `https://github.com/${githubUser?.login}/${githubForm.name}`,
        pages_url: githubForm.deployPages ? `https://${githubUser?.login}.github.io/${githubForm.name}/` : undefined
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    showGithubModal && (
      <div className="modal-overlay" onClick={() => !isCreatingRepo && setShowGithubModal(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()} role="dialog" aria-labelledby="github-modal-title" aria-modal="true">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent-color bg-opacity-10 rounded-xl" aria-hidden="true">
                <Github size={24} className="text-accent-color" />
              </div>
              <div>
                <h3 id="github-modal-title" className="text-xl font-semibold text-text-primary">Create GitHub Repository</h3>
                <p className="text-sm text-text-muted mt-2">Deploy your website with GitHub Pages</p>
              </div>
            </div>
            <button
              onClick={() => setShowGithubModal(false)}
              className="btn btn-outline btn-sm btn-icon hover:bg-component-hover transition-colors"
              disabled={isCreatingRepo}
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>

          {!githubToken ? (
            <GitHubAuthSection
              onAuthSuccess={(token) => { setGithubToken(token); localStorage.setItem('github_access_token', token); fetchUserInfo(token); }}
            />
          ) : (
            <>
              <GitHubConnectedSection
                githubUser={githubUser}
                githubForm={githubForm}
                setGithubForm={setGithubForm}
                isCreatingRepo={isCreatingRepo}
                onDisconnect={() => { localStorage.removeItem('github_access_token'); setGithubToken(null); setGithubUser(null); }}
                onCreateRepo={handleCreateRepoWithSuccess}
                onCancel={() => setShowGithubModal(false)}
              />

              {/* Success Message */}
              {successData && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl text-sm space-y-2">
                  <p className="text-green-800 font-medium">
                    Repository created successfully!
                  </p>
                  <p>
                    <strong>URL:</strong>{" "}
                    <a
                      href={successData.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent-color underline hover:opacity-80"
                    >
                      {successData.html_url}
                    </a>
                  </p>
                  {successData.pages_url && (
                    <p>
                      <strong>Pages:</strong>{" "}
                      <a
                        href={successData.pages_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent-color underline hover:opacity-80"
                      >
                        {successData.pages_url}
                      </a>
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    )
  );
};




