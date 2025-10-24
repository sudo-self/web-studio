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
  <div style={{ textAlign: 'center', padding: '32px 0' }}>
    <div style={{
      padding: '16px',
      backgroundColor: 'var(--surface-primary)',
      borderRadius: 'var(--radius-xl)',
      width: '80px',
      height: '80px',
      margin: '0 auto 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid var(--border-primary)'
    }}>
      <Github size={32} style={{ color: 'var(--text-muted)' }} />
    </div>
    <div style={{ marginBottom: '24px' }}>
      <h4 style={{ 
        fontSize: '18px', 
        fontWeight: 600, 
        color: 'var(--text-primary)',
        marginBottom: '12px'
      }}>
        Connect to GitHub
      </h4>
      <p style={{ 
        fontSize: '14px', 
        color: 'var(--text-muted)', 
        lineHeight: '1.5'
      }}>
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
  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
    <UserInfoCard githubUser={githubUser} onDisconnect={onDisconnect} isCreatingRepo={isCreatingRepo} />

    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <FormField 
        label="Repository Name" 
        value={githubForm.name} 
        onChange={(v) => setGithubForm(prev => ({ ...prev, name: v }))} 
        placeholder="my-awesome-project" 
        disabled={isCreatingRepo} 
        required 
      />
      <FormField 
        label="Description" 
        value={githubForm.description} 
        onChange={(v) => setGithubForm(prev => ({ ...prev, description: v }))} 
        placeholder="Project created with AI Web Studio" 
        disabled={isCreatingRepo} 
      />
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '16px' 
      }}>
        <CheckboxOption 
          id="deploy-pages" 
          label="Deploy to Pages" 
          description="Auto-deploy with GitHub Pages" 
          checked={githubForm.deployPages} 
          onChange={(c) => setGithubForm(prev => ({ ...prev, deployPages: c }))} 
          disabled={isCreatingRepo} 
        />
        <CheckboxOption 
          id="is-public" 
          label="Public Repository" 
          description="Visible to everyone" 
          checked={githubForm.isPublic} 
          onChange={(c) => setGithubForm(prev => ({ ...prev, isPublic: c }))} 
          disabled={isCreatingRepo} 
        />
      </div>

      <FilesPreview githubForm={githubForm} githubUser={githubUser} />
    </div>

    <ActionButtons 
      isCreatingRepo={isCreatingRepo} 
      isValid={githubForm.name.trim().length > 0} 
      onCreateRepo={onCreateRepo} 
      onCancel={onCancel} 
    />
  </div>
);


const UserInfoCard = ({ githubUser, onDisconnect, isCreatingRepo }: UserInfoCardProps) => (
  <div style={{
    backgroundColor: 'var(--surface-primary)',
    borderRadius: 'var(--radius-xl)',
    border: '1px solid var(--border-primary)',
    padding: '20px'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <img 
          src={githubUser?.avatar_url} 
          alt={`${githubUser?.login}'s GitHub avatar`} 
          style={{ 
            width: '48px', 
            height: '48px', 
            borderRadius: '50%', 
            border: '2px solid var(--border-primary)' 
          }} 
        />
        <div>
          <div style={{ 
            fontSize: '16px', 
            fontWeight: 600, 
            color: 'var(--text-primary)' 
          }}>
            {githubUser?.login}
          </div>
          <div style={{ 
            fontSize: '14px', 
            color: 'var(--text-muted)', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            marginTop: '4px'
          }}>
            <div style={{ 
              width: '8px', 
              height: '8px', 
              backgroundColor: 'var(--interactive-success)', 
              borderRadius: '50%' 
            }} aria-hidden="true"></div>
            Connected to GitHub
          </div>
        </div>
      </div>
      <button 
        onClick={onDisconnect} 
        style={{
          fontSize: '14px',
          color: 'var(--text-muted)',
          padding: '8px 16px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-primary)',
          backgroundColor: 'transparent',
          cursor: isCreatingRepo ? 'not-allowed' : 'pointer',
          opacity: isCreatingRepo ? 0.5 : 1,
          transition: 'all var(--transition-normal)',
          fontFamily: 'inherit'
        }}
        onMouseOver={(e) => {
          if (!isCreatingRepo) {
            e.currentTarget.style.color = 'var(--interactive-accent)';
            e.currentTarget.style.borderColor = 'var(--interactive-accent)';
          }
        }}
        onMouseOut={(e) => {
          if (!isCreatingRepo) {
            e.currentTarget.style.color = 'var(--text-muted)';
            e.currentTarget.style.borderColor = 'var(--border-primary)';
          }
        }}
        disabled={isCreatingRepo}
      >
        Disconnect
      </button>
    </div>
  </div>
);

const FormField = ({ label, value, onChange, placeholder, disabled, required }: FormFieldProps) => (
  <div>
    <label style={{
      display: 'block',
      fontSize: '14px',
      fontWeight: 600,
      color: 'var(--text-primary)',
      marginBottom: '12px'
    }}>
      {label}{required && <span style={{ color: 'var(--interactive-danger)', marginLeft: '4px' }}>*</span>}
    </label>
    <input 
      type="text" 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      placeholder={placeholder} 
      disabled={disabled} 
      required={required}
      style={{
        width: '100%',
        padding: '16px',
        border: '1.5px solid var(--border-primary)',
        borderRadius: 'var(--radius-lg)',
        backgroundColor: 'var(--surface-primary)',
        color: 'var(--text-primary)',
        fontSize: '16px',
        transition: 'all var(--transition-normal)',
        outline: 'none',
        fontFamily: 'inherit'
      }}
      onFocus={(e) => {
        e.target.style.borderColor = 'var(--interactive-accent)';
        e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
      }}
      onBlur={(e) => {
        e.target.style.borderColor = 'var(--border-primary)';
        e.target.style.boxShadow = 'none';
      }}
    />
  </div>
);

const CheckboxOption = ({ id, label, description, checked, onChange, disabled }: CheckboxOptionProps) => (
  <label style={{
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
    padding: '16px',
    backgroundColor: 'var(--surface-primary)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-primary)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all var(--transition-normal)'
  }}>
    <input 
      type="checkbox" 
      id={id} 
      checked={checked} 
      onChange={(e) => onChange(e.target.checked)} 
      disabled={disabled}
      style={{
        marginTop: '2px',
        width: '18px',
        height: '18px',
        borderRadius: 'var(--radius-sm)',
        border: '1.5px solid var(--border-primary)',
        backgroundColor: checked ? 'var(--interactive-accent)' : 'var(--surface-primary)',
        cursor: 'pointer',
        transition: 'all var(--transition-normal)'
      }}
    />
    <div style={{ flex: 1 }}>
      <div style={{ 
        fontSize: '16px', 
        fontWeight: 600, 
        color: 'var(--text-primary)',
        transition: 'color var(--transition-normal)'
      }}>
        {label}
      </div>
      <div style={{ 
        fontSize: '14px', 
        color: 'var(--text-muted)', 
        marginTop: '4px' 
      }}>
        {description}
      </div>
    </div>
  </label>
);

const FilesPreview = ({ githubForm, githubUser }: FilesPreviewProps) => (
  <div style={{
    backgroundColor: 'var(--surface-primary)',
    borderRadius: 'var(--radius-xl)',
    border: '1px solid var(--border-primary)',
    overflow: 'hidden'
  }}>
    <div style={{ 
      padding: '16px', 
      borderBottom: '1px solid var(--border-primary)',
      backgroundColor: 'var(--surface-primary)'
    }}>
      <p style={{ 
        fontWeight: 600, 
        color: 'var(--text-primary)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '16px',
        margin: 0
      }}>
        <FileText size={18} />
        Files to be created
      </p>
    </div>
    <div style={{ padding: '16px' }}>
      <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', margin: 0, padding: 0 }}>
        <li style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '16px', 
          padding: '12px',
          borderRadius: 'var(--radius-lg)',
          transition: 'background-color var(--transition-normal)'
        }}>
          <div style={{ 
            width: '12px', 
            height: '12px', 
            backgroundColor: 'var(--interactive-primary)', 
            borderRadius: '50%',
            flexShrink: 0
          }} aria-hidden="true"></div>
          <code style={{ 
            fontSize: '14px', 
            color: 'var(--text-primary)', 
            fontWeight: 600, 
            flex: 1,
            fontFamily: 'var(--font-mono)'
          }}>
            index.html
          </code>
          <span style={{ 
            fontSize: '12px', 
            color: 'var(--text-muted)', 
            backgroundColor: 'var(--surface-secondary)',
            padding: '4px 8px',
            borderRadius: 'var(--radius-md)'
          }}>
            Your website
          </span>
        </li>
        <li style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '16px', 
          padding: '12px',
          borderRadius: 'var(--radius-lg)',
          transition: 'background-color var(--transition-normal)'
        }}>
          <div style={{ 
            width: '12px', 
            height: '12px', 
            backgroundColor: 'var(--interactive-success)', 
            borderRadius: '50%',
            flexShrink: 0
          }} aria-hidden="true"></div>
          <code style={{ 
            fontSize: '14px', 
            color: 'var(--text-primary)', 
            fontWeight: 600, 
            flex: 1,
            fontFamily: 'var(--font-mono)'
          }}>
            README.md
          </code>
          <span style={{ 
            fontSize: '12px', 
            color: 'var(--text-muted)', 
            backgroundColor: 'var(--surface-secondary)',
            padding: '4px 8px',
            borderRadius: 'var(--radius-md)'
          }}>
            Project documentation
          </span>
        </li>
        {githubForm.deployPages && (
          <li style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px', 
            padding: '12px',
            borderRadius: 'var(--radius-lg)',
            transition: 'background-color var(--transition-normal)'
          }}>
            <div style={{ 
              width: '12px', 
              height: '12px', 
              backgroundColor: 'var(--interactive-accent)', 
              borderRadius: '50%',
              flexShrink: 0
            }} aria-hidden="true"></div>
            <code style={{ 
              fontSize: '14px', 
              color: 'var(--text-primary)', 
              fontWeight: 600, 
              flex: 1,
              fontFamily: 'var(--font-mono)'
            }}>
              .github/workflows/deploy.yml
            </code>
            <span style={{ 
              fontSize: '12px', 
              color: 'var(--text-muted)', 
              backgroundColor: 'var(--surface-secondary)',
              padding: '4px 8px',
              borderRadius: 'var(--radius-md)'
            }}>
              Deployment workflow
            </span>
          </li>
        )}
      </ul>
      {githubForm.deployPages && githubForm.name && (
        <div style={{ 
          marginTop: '20px', 
          padding: '16px', 
          backgroundColor: 'rgba(139, 92, 246, 0.05)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid rgba(139, 92, 246, 0.2)'
        }}>
          <p style={{ 
            fontSize: '14px', 
            color: 'var(--text-primary)', 
            fontWeight: 600, 
            marginBottom: '8px' 
          }}>
            Your website will be available at:
          </p>
          <code style={{ 
            fontSize: '14px', 
            color: 'var(--interactive-accent)', 
            wordBreak: 'break-all',
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            padding: '8px 12px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            display: 'block',
            fontFamily: 'var(--font-mono)'
          }}>
            https://{githubUser?.login}.github.io/{githubForm.name}/
          </code>
        </div>
      )}
    </div>
  </div>
);

const ActionButtons = ({ isCreatingRepo, isValid, onCreateRepo, onCancel }: ActionButtonsProps) => (
  <div style={{ display: 'flex', gap: '16px', paddingTop: '16px' }}>
    <button 
      style={{
        flex: 1,
        padding: '12px 20px',
        backgroundColor: 'transparent',
        color: 'var(--text-primary)',
        border: '1.5px solid var(--border-primary)',
        borderRadius: 'var(--radius-lg)',
        fontWeight: 600,
        fontSize: '16px',
        cursor: isCreatingRepo ? 'not-allowed' : 'pointer',
        opacity: isCreatingRepo ? 0.5 : 1,
        transition: 'all var(--transition-normal)',
        fontFamily: 'inherit'
      }}
      onClick={onCancel} 
      disabled={isCreatingRepo}
      onMouseOver={(e) => {
        if (!isCreatingRepo) {
          e.currentTarget.style.borderColor = 'var(--interactive-accent)';
          e.currentTarget.style.color = 'var(--interactive-accent)';
        }
      }}
      onMouseOut={(e) => {
        if (!isCreatingRepo) {
          e.currentTarget.style.borderColor = 'var(--border-primary)';
          e.currentTarget.style.color = 'var(--text-primary)';
        }
      }}
    >
      Cancel
    </button>
    <button 
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        padding: '12px 20px',
        background: 'linear-gradient(135deg, var(--interactive-primary), var(--interactive-primary-hover))',
        color: 'var(--text-inverse)',
        border: 'none',
        borderRadius: 'var(--radius-lg)',
        fontWeight: 600,
        fontSize: '16px',
        cursor: (isCreatingRepo || !isValid) ? 'not-allowed' : 'pointer',
        opacity: (isCreatingRepo || !isValid) ? 0.5 : 1,
        transition: 'all var(--transition-normal)',
        fontFamily: 'inherit'
      }}
      onClick={onCreateRepo} 
      disabled={isCreatingRepo || !isValid}
      onMouseOver={(e) => {
        if (!isCreatingRepo && isValid) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 8px 16px rgba(59, 130, 246, 0.3)';
        }
      }}
      onMouseOut={(e) => {
        if (!isCreatingRepo && isValid) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
    >
      {isCreatingRepo ? (
        <>
          <div style={{
            width: '20px',
            height: '20px',
            border: '2px solid var(--text-inverse)',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
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

  if (!showGithubModal) return null;

  return (
    <div 
      className="modal-overlay" 
      onClick={() => !isCreatingRepo && setShowGithubModal(false)}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        zIndex: 1000,
        backdropFilter: 'blur(8px)'
      }}
    >
      <div 
        className="modal-content github-modal-content"
        onClick={(e) => e.stopPropagation()} 
        role="dialog" 
        aria-labelledby="github-modal-title" 
        aria-modal="true"
        style={{
          backgroundColor: 'var(--surface-primary)',
          border: '1px solid var(--border-primary)',
          borderRadius: 'var(--radius-2xl)',
          padding: '32px',
          maxWidth: '500px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: 'var(--shadow-xl)',
          position: 'relative'
        }}
      >

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              padding: '12px',
              backgroundColor: 'rgba(139, 92, 246, 0.1)',
              borderRadius: 'var(--radius-xl)'
            }} aria-hidden="true">
              <Github size={24} style={{ color: 'var(--interactive-accent)' }} />
            </div>
            <div>
              <h3 id="github-modal-title" style={{ 
                fontSize: '20px', 
                fontWeight: 600, 
                color: 'var(--text-primary)',
                margin: 0
              }}>
                Create GitHub Repository
              </h3>
              <p style={{ 
                fontSize: '14px', 
                color: 'var(--text-muted)', 
                marginTop: '8px',
                margin: 0
              }}>
                Deploy your website with GitHub Pages
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowGithubModal(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              border: 'none',
              backgroundColor: 'var(--surface-tertiary)',
              color: 'var(--text-secondary)',
              borderRadius: 'var(--radius-lg)',
              cursor: isCreatingRepo ? 'not-allowed' : 'pointer',
              opacity: isCreatingRepo ? 0.5 : 1,
              transition: 'all var(--transition-normal)',
              fontFamily: 'inherit'
            }}
            disabled={isCreatingRepo}
            aria-label="Close modal"
            onMouseOver={(e) => {
              if (!isCreatingRepo) {
                e.currentTarget.style.backgroundColor = 'var(--interactive-danger)';
                e.currentTarget.style.color = 'var(--text-inverse)';
              }
            }}
            onMouseOut={(e) => {
              if (!isCreatingRepo) {
                e.currentTarget.style.backgroundColor = 'var(--surface-tertiary)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }
            }}
          >
            <X size={18} />
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
          <>
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
              onCreateRepo={handleCreateRepoWithSuccess}
              onCancel={() => setShowGithubModal(false)}
            />

            {/* Success Message */}
            {successData && (
              <div style={{ 
                marginTop: '24px', 
                padding: '16px', 
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: 'var(--radius-lg)',
                fontSize: '14px'
              }}>
                <p style={{ 
                  color: 'var(--interactive-success)', 
                  fontWeight: 600,
                  marginBottom: '8px'
                }}>
                  Repository created successfully!
                </p>
                <p style={{ margin: '4px 0' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>URL:</strong>{" "}
                  <a
                    href={successData.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: 'var(--interactive-accent)',
                      textDecoration: 'underline',
                      transition: 'opacity var(--transition-normal)'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
                    onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                  >
                    {successData.html_url}
                  </a>
                </p>
                {successData.pages_url && (
                  <p style={{ margin: '4px 0' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>Pages:</strong>{" "}
                    <a
                      href={successData.pages_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: 'var(--interactive-accent)',
                        textDecoration: 'underline',
                        transition: 'opacity var(--transition-normal)'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
                      onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
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

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
