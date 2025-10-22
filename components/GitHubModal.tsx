"use client";

import { Github, X, FileText } from 'lucide-react';
import { GithubAuth } from './GithubAuth';


interface GithubUser {
  login: string;
  avatar_url: string;
  // Add other properties you use from GitHub API
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
  handleCreateRepo: () => void;
  fetchUserInfo: (token: string) => void;
}


interface GitHubAuthSectionProps {
  onAuthSuccess: (token: string) => void;
}

interface GitHubConnectedSectionProps {
  githubUser: GithubUser | null;
  githubForm: GithubForm;
  setGithubForm: (form: GithubForm | ((prev: GithubForm) => GithubForm)) => void;
  isCreatingRepo: boolean;
  onDisconnect: () => void;
  onCreateRepo: () => void;
  onCancel: () => void;
}

interface UserInfoCardProps {
  githubUser: GithubUser | null;
  onDisconnect: () => void;
  isCreatingRepo: boolean;
}

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled: boolean;
  required?: boolean;
}

interface CheckboxOptionProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled: boolean;
}

interface FilesPreviewProps {
  githubForm: GithubForm;
  githubUser: GithubUser | null;
}

interface ActionButtonsProps {
  isCreatingRepo: boolean;
  isValid: boolean;
  onCreateRepo: () => void;
  onCancel: () => void;
}

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
  // ... rest of your component remains the same
  
  return (
    showGithubModal && (
      <div className="modal-overlay" onClick={() => !isCreatingRepo && setShowGithubModal(false)}>
        <div
          className="modal-content"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-labelledby="github-modal-title"
          aria-modal="true"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent-color bg-opacity-10 rounded-lg" aria-hidden="true">
                <Github size={20} className="text-accent-color" />
              </div>
              <div>
                <h3 id="github-modal-title" className="text-lg font-semibold text-text-primary">
                  Create a GitHub Repository
                </h3>
                <p className="text-xs text-text-muted mt-1">
                  Deploy your Website with GitHub Pages
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowGithubModal(false)}
              className="btn btn-primary btn-sm btn-icon hover:bg-component-hover transition-colors"
              disabled={isCreatingRepo}
              aria-label="Close modal"
            >
              <X size={16} />
            </button>
          </div>

          {!githubToken ? (
            <GitHubAuthSection
              onAuthSuccess={(token) => {
                setGithubToken(token);
                localStorage.setItem('github_access_token', token);
                fetchUserInfo(token);
              }}
            />
          ) : (
            <GitHubConnectedSection
              githubUser={githubUser}
              githubForm={githubForm}
              setGithubForm={setGithubForm}
              isCreatingRepo={isCreatingRepo}
              onDisconnect={() => {
                localStorage.removeItem('github_access_token');
                setGithubToken(null);
                setGithubUser(null);
              }}
              onCreateRepo={handleCreateRepo}
              onCancel={() => setShowGithubModal(false)}
            />
          )}
        </div>
      </div>
    )
  );
};

// GitHub Auth Section Component
const GitHubAuthSection = ({ onAuthSuccess }: GitHubAuthSectionProps) => (
  <div className="text-center py-6">
    <div className="p-4 bg-component-bg rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
      <Github size={24} className="text-text-muted" />
    </div>
    <div className="mb-4">
      <h4 className="text-text-primary font-medium mb-2">Connect to GitHub</h4>
      <p className="text-sm text-text-muted">
        Connect your GitHub account to create repositories and deploy with GitHub Pages
      </p>
    </div>
    <GithubAuth onAuthSuccess={onAuthSuccess} />
  </div>
);

// GitHub Connected Section Component
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
    <UserInfoCard
      githubUser={githubUser}
      onDisconnect={onDisconnect}
      isCreatingRepo={isCreatingRepo}
    />
    
    <div className="space-y-4">
      <FormField
        label="Repo Name"
        value={githubForm.name}
        onChange={(value) => setGithubForm(prev => ({...prev, name: value}))}
        placeholder="my-awesome-project"
        disabled={isCreatingRepo}
        required
      />
      
      <FormField
        label="Description"
        value={githubForm.description}
        onChange={(value) => setGithubForm(prev => ({...prev, description: value}))}
        placeholder="Project created with AI Web Studio"
        disabled={isCreatingRepo}
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CheckboxOption
          id="deploy-pages"
          label="Deploy to Pages"
          description="Auto-deploy with GitHub Pages"
          checked={githubForm.deployPages}
          onChange={(checked) => setGithubForm(prev => ({...prev, deployPages: checked}))}
          disabled={isCreatingRepo}
        />
        
        <CheckboxOption
          id="is-public"
          label="Public Repo"
          description="Visible to everyone"
          checked={githubForm.isPublic}
          onChange={(checked) => setGithubForm(prev => ({...prev, isPublic: checked}))}
          disabled={isCreatingRepo}
        />
      </div>

      <FilesPreview
        githubForm={githubForm}
        githubUser={githubUser}
      />
    </div>
    
    <ActionButtons
      isCreatingRepo={isCreatingRepo}
      isValid={githubForm.name.trim().length > 0}
      onCreateRepo={onCreateRepo}
      onCancel={onCancel}
    />
  </div>
);

// Supporting Components with types
const UserInfoCard = ({ githubUser, onDisconnect, isCreatingRepo }: UserInfoCardProps) => (
  <div className="bg-component-bg rounded-xl border border-panel-border p-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img
          src={githubUser?.avatar_url}
          alt={`${githubUser?.login}'s GitHub avatar`}
          className="w-10 h-10 rounded-full border-2 border-panel-border"
        />
        <div>
          <div className="text-sm font-semibold text-text-primary">{githubUser?.login}</div>
          <div className="text-xs text-text-muted flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full" aria-hidden="true"></div>
            Connected to GitHub
          </div>
        </div>
      </div>
      <button
        onClick={onDisconnect}
        className="text-xs text-text-muted hover:text-accent-color transition-colors px-3 py-1 rounded-lg hover:bg-component-hover disabled:opacity-50"
        disabled={isCreatingRepo}
      >
        Disconnect
      </button>
    </div>
  </div>
);

const FormField = ({ label, value, onChange, placeholder, disabled, required }: FormFieldProps) => (
  <div>
    <label className="block text-sm font-medium text-text-primary mb-2">
      {label}
      {required && <span className="text-red-400 ml-1">*</span>}
    </label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-3 border border-panel-border rounded-lg bg-component-bg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-color focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      placeholder={placeholder}
      disabled={disabled}
      required={required}
    />
  </div>
);

const CheckboxOption = ({ id, label, description, checked, onChange, disabled }: CheckboxOptionProps) => (
  <label className="flex items-center gap-3 p-3 bg-component-bg rounded-lg border border-panel-border hover:border-accent-color transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50">
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="rounded border-panel-border bg-component-bg text-accent-color focus:ring-accent-color focus:ring-2 focus:ring-offset-2 focus:ring-offset-component-bg"
      disabled={disabled}
    />
    <div className="flex-1">
      <div className="text-sm font-medium text-text-primary">{label}</div>
      <div className="text-xs text-text-muted">{description}</div>
    </div>
  </label>
);

const FilesPreview = ({ githubForm, githubUser }: FilesPreviewProps) => (
  <div className="bg-component-bg rounded-xl border border-panel-border overflow-hidden">
    <div className="p-4 border-b border-panel-border">
      <p className="font-semibold text-text-primary flex items-center gap-2">
        <FileText size={16} />
        Files to be created
      </p>
    </div>
    <div className="p-4">
      <ul className="space-y-3">
        <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-component-hover transition-colors">
          <div className="w-2 h-2 bg-blue-500 rounded-full" aria-hidden="true"></div>
          <code className="text-sm text-text-primary font-medium">index.html</code>
          <span className="text-xs text-text-muted ml-auto">Your website</span>
        </li>
        <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-component-hover transition-colors">
          <div className="w-2 h-2 bg-green-500 rounded-full" aria-hidden="true"></div>
          <code className="text-sm text-text-primary font-medium">README.md</code>
          <span className="text-xs text-text-muted ml-auto">Project documentation</span>
        </li>
        {githubForm.deployPages && (
          <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-component-hover transition-colors">
            <div className="w-2 h-2 bg-purple-500 rounded-full" aria-hidden="true"></div>
            <code className="text-sm text-text-primary font-medium">.github/workflows/deploy.yml</code>
            <span className="text-xs text-text-muted ml-auto">Deployment workflow</span>
          </li>
        )}
      </ul>
      {githubForm.deployPages && githubForm.name && (
        <div className="mt-4 p-3 bg-accent-color bg-opacity-5 rounded-lg border border-accent-color border-opacity-20">
          <p className="text-sm text-text-primary font-medium mb-1">
            Your website will be available at:
          </p>
          <code className="text-xs text-accent-color break-all bg-black bg-opacity-20 px-2 py-1 rounded">
            https://{githubUser?.login}.github.io/{githubForm.name}/
          </code>
        </div>
      )}
    </div>
  </div>
);

const ActionButtons = ({ isCreatingRepo, isValid, onCreateRepo, onCancel }: ActionButtonsProps) => (
  <div className="flex gap-3 pt-2">
    <button
      className="btn btn-outline flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={onCancel}
      disabled={isCreatingRepo}
    >
      Cancel
    </button>
    <button
      className="btn btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={onCreateRepo}
      disabled={isCreatingRepo || !isValid}
    >
      {isCreatingRepo ? (
        <>
          <div className="loading-spinner w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
);
