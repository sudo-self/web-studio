"use client";

import React, { useState } from 'react';
import { Download, Globe, Package, CheckCircle, AlertCircle, Upload, Key, Loader, Zap, FileJson, Building } from 'lucide-react';

interface TWAManifestBuilderProps {
  onInsert?: (code: string) => void;
}

interface BuildResult {
  downloadUrl: string;
  keystoreGenerated?: boolean;
  keystorePassword?: string;
  manifest?: any;
}

export default function TWAManifestBuilder({ onInsert }: TWAManifestBuilderProps) {
  const [url, setUrl] = useState('');
  const [keystoreFile, setKeystoreFile] = useState<File | null>(null);
  const [keystorePassword, setKeystorePassword] = useState('');
  const [keystoreAlias, setKeystoreAlias] = useState('android');
  const [useCustomKeystore, setUseCustomKeystore] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, building, success, error
  const [errorMsg, setErrorMsg] = useState('');
  const [buildResult, setBuildResult] = useState<BuildResult | null>(null);
  const [progress, setProgress] = useState('');
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Change this to your Cloud Run URL after deployment
  const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:8080' 
    : '';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('Keystore file must be less than 5MB');
        return;
      }
      setKeystoreFile(file);
    }
  };

  const handleBuild = async () => {
    if (!url.trim()) {
      setErrorMsg('Please enter a URL');
      setStatus('error');
      return;
    }

    if (useCustomKeystore && (!keystoreFile || !keystorePassword || !keystoreAlias)) {
      setErrorMsg('Please provide keystore file, password, and alias');
      setStatus('error');
      return;
    }

    setStatus('building');
    setErrorMsg('');
    setBuildResult(null);
    setProgress('Preparing build...');

    try {
      const formData = new FormData();
      formData.append('url', url);
      
      if (useCustomKeystore && keystoreFile) {
        formData.append('keystore', keystoreFile);
        formData.append('keystorePassword', keystorePassword);
        formData.append('keystoreAlias', keystoreAlias);
      }

      setProgress('Building APK... This may take 2-3 minutes');

      const response = await fetch(`${API_URL}/api/build`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Build failed');
      }

      setProgress('Build complete!');
      setBuildResult(data);
      setStatus('success');

    } catch (error) {
      setErrorMsg(error.message || 'Build failed');
      setStatus('error');
      setProgress('');
    }
  };

  const downloadAPK = () => {
    if (buildResult?.downloadUrl) {
      window.location.href = `${API_URL}${buildResult.downloadUrl}`;
    }
  };

  const copyToClipboard = async (content: string, itemName: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedItem(itemName);
      setTimeout(() => setCopiedItem(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const insertManifest = async () => {
    if (!onInsert || !buildResult?.manifest) return;
    
    setIsLoading(true);
    try {
      const manifestString = JSON.stringify(buildResult.manifest, null, 2);
      onInsert(manifestString);
      
      await new Promise(resolve => setTimeout(resolve, 500));
    } finally {
      setIsLoading(false);
    }
  };

  const copyKeystorePassword = () => {
    if (buildResult?.keystorePassword) {
      copyToClipboard(buildResult.keystorePassword, 'keystore-password');
    }
  };

  return (
    <div style={{
      backgroundColor: 'var(--surface-card)',
      borderRadius: 'var(--radius-xl)',
      border: '1px solid var(--border-primary)',
      padding: '24px',
      fontFamily: 'var(--font-sans)'
    }}>
      {/* Header - Matches your component layout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <div style={{
          padding: '12px',
          backgroundColor: 'var(--interactive-accent)',
          borderRadius: 'var(--radius-xl)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Building style={{ width: '24px', height: '24px', color: 'var(--text-inverse)' }} />
        </div>
        <h2 style={{ 
          fontSize: '20px', 
          fontWeight: 600, 
          color: 'var(--text-primary)',
          margin: 0
        }}>
          TWA APK Builder
        </h2>
        <span style={{
          fontSize: '12px',
          color: 'var(--text-muted)',
          backgroundColor: 'var(--surface-tertiary)',
          padding: '4px 8px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-primary)'
        }}>
          Android
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* URL Input Section */}
        <div style={{
          padding: '20px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-primary)',
          backgroundColor: 'var(--surface-secondary)'
        }}>
          <label style={{
            display: 'block',
            marginBottom: '12px',
            fontWeight: 600,
            fontSize: '14px',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-sans)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Globe style={{ width: '16px', height: '16px' }} />
            Website URL
          </label>
          
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://your-website.com"
            disabled={status === 'building'}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1.5px solid var(--border-primary)',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--surface-primary)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-sans)',
              fontSize: '14px',
              transition: 'all var(--transition-normal)',
              outline: 'none',
              marginBottom: '16px',
              opacity: status === 'building' ? 0.6 : 1
            }}
          />

          {/* Custom Keystore Toggle */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500
            }}>
              <input
                type="checkbox"
                checked={useCustomKeystore}
                onChange={(e) => setUseCustomKeystore(e.target.checked)}
                disabled={status === 'building'}
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '4px',
                  opacity: status === 'building' ? 0.6 : 1
                }}
              />
              <Key style={{ width: '16px', height: '16px' }} />
              Use custom keystore (optional)
            </label>
            <p style={{
              color: 'var(--text-muted)',
              fontSize: '12px',
              marginTop: '4px',
              marginLeft: '24px'
            }}>
              Leave unchecked to auto-generate a keystore
            </p>
          </div>

          {/* Custom Keystore Fields */}
          {useCustomKeystore && (
            <div style={{
              padding: '16px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-primary)',
              backgroundColor: 'var(--surface-primary)',
              marginBottom: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: 600,
                  fontSize: '14px',
                  color: 'var(--text-primary)'
                }}>
                  Keystore File (.keystore, .jks)
                </label>
                <input
                  type="file"
                  accept=".keystore,.jks"
                  onChange={handleFileChange}
                  disabled={status === 'building'}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1.5px solid var(--border-primary)',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: 'var(--surface-secondary)',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '14px',
                    opacity: status === 'building' ? 0.6 : 1
                  }}
                />
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: 600,
                  fontSize: '14px',
                  color: 'var(--text-primary)'
                }}>
                  Keystore Password
                </label>
                <input
                  type="password"
                  value={keystorePassword}
                  onChange={(e) => setKeystorePassword(e.target.value)}
                  placeholder="Enter keystore password"
                  disabled={status === 'building'}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1.5px solid var(--border-primary)',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: 'var(--surface-primary)',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '14px',
                    opacity: status === 'building' ? 0.6 : 1
                  }}
                />
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: 600,
                  fontSize: '14px',
                  color: 'var(--text-primary)'
                }}>
                  Key Alias
                </label>
                <input
                  type="text"
                  value={keystoreAlias}
                  onChange={(e) => setKeystoreAlias(e.target.value)}
                  placeholder="android"
                  disabled={status === 'building'}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1.5px solid var(--border-primary)',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: 'var(--surface-primary)',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '14px',
                    opacity: status === 'building' ? 0.6 : 1
                  }}
                />
              </div>
            </div>
          )}

          {/* Build Button */}
          <button
            onClick={handleBuild}
            disabled={status === 'building'}
            style={{
              width: '100%',
              padding: '14px 20px',
              background: 'linear-gradient(135deg, var(--interactive-accent), var(--interactive-accent-hover))',
              color: 'var(--text-inverse)',
              border: 'none',
              borderRadius: 'var(--radius-lg)',
              fontWeight: 600,
              fontSize: '15px',
              cursor: status === 'building' ? 'not-allowed' : 'pointer',
              opacity: status === 'building' ? 0.7 : 1,
              transition: 'all var(--transition-normal)',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {status === 'building' ? (
              <>
                <Loader style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }} />
                Building...
              </>
            ) : (
              <>
                <Package style={{ width: '18px', height: '18px' }} />
                Build APK
              </>
            )}
          </button>

          {/* Progress Indicator */}
          {progress && status === 'building' && (
            <div style={{
              marginTop: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--interactive-info)',
              backgroundColor: 'var(--surface-info)',
              padding: '12px 16px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-info)'
            }}>
              <Loader style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
              <span style={{ fontSize: '14px' }}>{progress}</span>
            </div>
          )}

          {/* Error State */}
          {status === 'error' && (
            <div style={{
              marginTop: '16px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              color: 'var(--interactive-error)',
              backgroundColor: 'var(--surface-error)',
              padding: '12px 16px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-error)'
            }}>
              <AlertCircle style={{ width: '16px', height: '16px', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>Build Failed</div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{errorMsg}</div>
              </div>
            </div>
          )}

          {/* Success State */}
          {status === 'success' && buildResult && (
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--interactive-success)',
                backgroundColor: 'var(--surface-success)',
                padding: '12px 16px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-success)'
              }}>
                <CheckCircle style={{ width: '16px', height: '16px' }} />
                <span style={{ fontSize: '14px', fontWeight: 600 }}>APK built successfully!</span>
              </div>

              {/* Download Button */}
              <button
                onClick={downloadAPK}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  background: 'linear-gradient(135deg, var(--interactive-success), var(--interactive-success-hover))',
                  color: 'var(--text-inverse)',
                  border: 'none',
                  borderRadius: 'var(--radius-lg)',
                  fontWeight: 600,
                  fontSize: '15px',
                  cursor: 'pointer',
                  transition: 'all var(--transition-normal)',
                  fontFamily: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Download style={{ width: '18px', height: '18px' }} />
                Download APK
              </button>

              {/* Auto-generated Keystore Info */}
              {buildResult.keystoreGenerated && (
                <div style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-warning)',
                  backgroundColor: 'var(--surface-warning)'
                }}>
                  <h4 style={{ 
                    fontSize: '14px', 
                    fontWeight: 600, 
                    color: 'var(--text-primary)',
                    margin: '0 0 8px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <Key style={{ width: '14px', height: '14px' }} />
                    Auto-Generated Keystore
                  </h4>
                  <p style={{ 
                    color: 'var(--text-secondary)',
                    fontSize: '13px',
                    lineHeight: '1.5',
                    margin: '0 0 12px 0'
                  }}>
                    A keystore was automatically generated. Save this password for future updates:
                  </p>
                  <div style={{
                    backgroundColor: 'var(--surface-primary)',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    fontFamily: 'monospace',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    wordBreak: 'break-all',
                    marginBottom: '8px',
                    border: '1px solid var(--border-primary)'
                  }}>
                    {buildResult.keystorePassword}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={copyKeystorePassword}
                      style={{
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-md)',
                        fontWeight: 600,
                        fontSize: '12px',
                        border: '1px solid var(--border-primary)',
                        backgroundColor: 'transparent',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        transition: 'all var(--transition-normal)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <FileJson style={{ width: '12px', height: '12px' }} />
                      Copy Password
                    </button>
                  </div>
                  <p style={{ 
                    color: 'var(--text-secondary)',
                    fontSize: '11px',
                    margin: '8px 0 0 0',
                    fontStyle: 'italic'
                  }}>
                    ⚠️ You'll need this password to update your app in the future!
                  </p>
                </div>
              )}

              {/* Insert Manifest Option */}
              {onInsert && buildResult.manifest && (
                <button
                  onClick={insertManifest}
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'linear-gradient(135deg, var(--interactive-info), var(--interactive-info-hover))',
                    color: 'var(--text-inverse)',
                    border: 'none',
                    borderRadius: 'var(--radius-lg)',
                    fontWeight: 600,
                    fontSize: '14px',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: isLoading ? 0.7 : 1,
                    transition: 'all var(--transition-normal)',
                    fontFamily: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <FileJson style={{ width: '16px', height: '16px' }} />
                  {isLoading ? 'Inserting...' : 'Insert Manifest to Editor'}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Requirements Section */}
        <div style={{
          padding: '20px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-primary)',
          backgroundColor: 'var(--surface-secondary)'
        }}>
          <h3 style={{ 
            fontSize: '16px', 
            fontWeight: 600, 
            color: 'var(--text-primary)',
            margin: '0 0 12px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Package style={{ width: '16px', height: '16px' }} />
            Requirements
          </h3>
          <ul style={{ 
            color: 'var(--text-secondary)',
            fontSize: '13px',
            lineHeight: '1.6',
            margin: 0,
            paddingLeft: '20px'
          }}>
            <li>Your website must have a valid <code style={{ background: 'var(--surface-tertiary)', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>/manifest.json</code></li>
            <li>Icon file must exist at <code style={{ background: 'var(--surface-tertiary)', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>/icon512.png</code> (512x512px)</li>
            <li>Website must be accessible over HTTPS</li>
            <li>Build takes 2-3 minutes on first run</li>
          </ul>
        </div>
      </div>

      {/* Toast Notification */}
      {copiedItem && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'var(--interactive-success)',
          color: 'var(--text-inverse)',
          padding: '12px 20px',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-xl)',
          animation: 'fadeIn 0.4s ease-out',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 50,
          fontSize: '14px',
          fontWeight: 600
        }}>
          <CheckCircle style={{ width: '16px', height: '16px' }} />
          {copiedItem === 'keystore-password' 
            ? 'Keystore password copied!' 
            : 'Copied to clipboard!'}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          0% { 
            opacity: 0; 
            transform: translate(-50%, 20px) scale(0.9);
          }
          100% { 
            opacity: 1; 
            transform: translate(-50%, 0) scale(1);
          }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
