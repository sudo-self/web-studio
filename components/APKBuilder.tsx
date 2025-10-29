"use client";

import React, { useState, useRef } from 'react';
import { Download, Globe, Package, CheckCircle, AlertCircle, Upload, Key, Loader, Zap, FileJson, Building, Palette, Image, Copy } from 'lucide-react';

interface MakeManifestProps {
  onInsert?: (code: string) => void;
}

interface IconOption {
  src: string;
  name: string;
}

interface ManifestData {
  background_color: string;
  dir: string;
  display: string;
  name: string;
  orientation: string;
  scope: string;
  short_name: string;
  start_url: string;
  theme_color: string;
  icons: Array<{
    src: string;
    type: string;
    sizes: string;
    isSquare: boolean;
    isPng: boolean;
    isWebp: boolean;
    isJpg: boolean;
    width: number;
    is512x512: boolean;
    is256x256: boolean;
    is192x192: boolean;
  }>;
}

export default function MakeManifest({ onInsert }: MakeManifestProps) {
  // Use absolute paths for icons that will work in both local and production
  const baseUrl = typeof window !== 'undefined'
    ? window.location.origin
    : 'https://studio.jessejesse.com';

  const defaultIcons: IconOption[] = [
    { src: `${baseUrl}/android_512.png`, name: 'Android' },
    { src: `${baseUrl}/bunny_512.png`, name: 'Bunny' },
    { src: `${baseUrl}/castle_512.png`, name: 'Castle' },
    { src: `${baseUrl}/cloud_512.png`, name: 'Cloud' },
    { src: `${baseUrl}/phone_512.png`, name: 'Phone' }
  ];

  const fallbackIcon = 'https://bimi-svg.netlify.app/icon-192.png';

  const [formData, setFormData] = useState({
    name: '',
    short_name: '',
    start_url: '/',
    background_color: '#090202',
    theme_color: '#08ea82',
    selectedIcon: defaultIcons[0].src,
    customIcon: null as File | null
  });

  const [manifestUrl, setManifestUrl] = useState('');
  const [manifestContent, setManifestContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'building' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleIconSelect = (iconSrc: string) => {
    setFormData(prev => ({
      ...prev,
      selectedIcon: iconSrc,
      customIcon: null
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Basic file validation
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrorMsg('File size too large. Please choose a file smaller than 5MB.');
        setStatus('error');
        return;
      }
      
      const validTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];
      if (!validTypes.includes(file.type)) {
        setErrorMsg('Please upload a valid image file (PNG, JPEG, WebP, or SVG).');
        setStatus('error');
        return;
      }

      setFormData(prev => ({
        ...prev,
        customIcon: file,
        selectedIcon: ''
      }));
      setErrorMsg('');
      setStatus('idle');
    }
  };

  const getIconSrc = (): string => {
    if (formData.customIcon) {
      return URL.createObjectURL(formData.customIcon);
    }
    return formData.selectedIcon || fallbackIcon;
  };

  const generateManifest = (): ManifestData => {
    const iconSrc = getIconSrc();
    
    return {
      background_color: formData.background_color,
      dir: 'ltr',
      display: 'standalone',
      name: formData.name || 'manifest.json',
      orientation: 'any',
      scope: '/',
      short_name: formData.short_name || 'JSON',
      start_url: formData.start_url,
      theme_color: formData.theme_color,
      icons: [
        {
          src: iconSrc,
          type: 'image/x-icon',
          sizes: '32x32',
          isSquare: true,
          isPng: iconSrc.toLowerCase().includes('.png'),
          isWebp: iconSrc.toLowerCase().includes('.webp'),
          isJpg: iconSrc.toLowerCase().includes('.jpg') || iconSrc.toLowerCase().includes('.jpeg'),
          width: 32,
          is512x512: false,
          is256x256: false,
          is192x192: false
        },
        // Add larger icon sizes for PWA compatibility
        {
          src: iconSrc,
          type: 'image/png',
          sizes: '192x192',
          isSquare: true,
          isPng: true,
          isWebp: false,
          isJpg: false,
          width: 192,
          is512x512: false,
          is256x256: false,
          is192x192: true
        },
        {
          src: iconSrc,
          type: 'image/png',
          sizes: '512x512',
          isSquare: true,
          isPng: true,
          isWebp: false,
          isJpg: false,
          width: 512,
          is512x512: true,
          is256x256: false,
          is192x192: false
        }
      ]
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim()) {
      setErrorMsg('Please enter an app name');
      setStatus('error');
      return;
    }
    
    if (!formData.short_name.trim()) {
      setErrorMsg('Please enter a short name');
      setStatus('error');
      return;
    }

    setIsLoading(true);
    setStatus('building');
    setErrorMsg('');

    try {
      const manifestData = generateManifest();
      const manifestString = JSON.stringify(manifestData, null, 2);
      setManifestContent(manifestString);
      
      // Create and download manifest file
      const blob = new Blob([manifestString], { type: 'application/json' });
      const urlBlob = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = urlBlob;
      a.download = 'manifest.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(urlBlob);
      
      // For Bubblewrap, we need to provide a way to access the manifest content directly
      // Since we can't host it dynamically, we'll provide the content for local file usage
      setStatus('success');
      
    } catch (error) {
      console.error('Error generating manifest:', error);
      setErrorMsg('Error generating manifest. Please try again.');
      setStatus('error');
    } finally {
      setIsLoading(false);
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
    if (!onInsert) return;
    
    setIsLoading(true);
    try {
      const manifestData = generateManifest();
      const manifestString = JSON.stringify(manifestData, null, 2);
      onInsert(manifestString);
      
      await new Promise(resolve => setTimeout(resolve, 500));
    } finally {
      setIsLoading(false);
    }
  };

  const downloadManifestFile = () => {
    const blob = new Blob([manifestContent], { type: 'application/json' });
    const urlBlob = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = urlBlob;
    a.download = 'manifest.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(urlBlob);
  };

  return (
    <div style={{
      backgroundColor: 'var(--surface-card)',
      borderRadius: 'var(--radius-xl)',
      border: '1px solid var(--border-primary)',
      padding: '24px',
      fontFamily: 'var(--font-sans)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <div style={{
          padding: '12px',
          backgroundColor: 'var(--interactive-accent)',
          borderRadius: 'var(--radius-xl)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <FileJson style={{ width: '24px', height: '24px', color: 'var(--text-inverse)' }} />
        </div>
        <h2 style={{
          fontSize: '20px',
          fontWeight: 600,
          color: 'var(--text-primary)',
          margin: 0
        }}>
          Manifest Generator
        </h2>
        <span style={{
          fontSize: '12px',
          color: 'var(--text-muted)',
          backgroundColor: 'var(--surface-tertiary)',
          padding: '4px 8px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-primary)'
        }}>
          PWA
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Form Section */}
        <div style={{
          padding: '20px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-primary)',
          backgroundColor: 'var(--surface-secondary)'
        }}>
          <form onSubmit={handleSubmit}>
            {/* Name Input */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'flex',
                marginBottom: '8px',
                fontWeight: 600,
                fontSize: '14px',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-sans)',
                alignItems: 'center',
                gap: '8px'
              }}>
                <FileJson style={{ width: '16px', height: '16px' }} />
                App Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter app name"
                disabled={isLoading}
                required
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
                  opacity: isLoading ? 0.6 : 1
                }}
              />
            </div>

            {/* Short Name Input */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'flex',
                marginBottom: '8px',
                fontWeight: 600,
                fontSize: '14px',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-sans)',
                alignItems: 'center',
                gap: '8px'
              }}>
                <FileJson style={{ width: '16px', height: '16px' }} />
                Short Name (displayed on homescreen) *
              </label>
              <input
                type="text"
                name="short_name"
                value={formData.short_name}
                onChange={handleInputChange}
                placeholder="Enter short name"
                disabled={isLoading}
                required
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
                  opacity: isLoading ? 0.6 : 1
                }}
              />
            </div>

            {/* Start URL Input */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'flex',
                marginBottom: '8px',
                fontWeight: 600,
                fontSize: '14px',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-sans)',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Globe style={{ width: '16px', height: '16px' }} />
                Start URL (optional)
              </label>
              <input
                type="text"
                name="start_url"
                value={formData.start_url}
                onChange={handleInputChange}
                placeholder="/"
                disabled={isLoading}
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
                  opacity: isLoading ? 0.6 : 1
                }}
              />
            </div>

            {/* Color Pickers */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{
                  display: 'flex',
                  marginBottom: '8px',
                  fontWeight: 600,
                  fontSize: '14px',
                  color: 'var(--text-primary)',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Palette style={{ width: '16px', height: '16px' }} />
                  Background Color
                </label>
                <input
                  type="color"
                  name="background_color"
                  value={formData.background_color}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    height: '44px',
                    border: '1.5px solid var(--border-primary)',
                    borderRadius: 'var(--radius-lg)',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: isLoading ? 0.6 : 1
                  }}
                />
              </div>
              <div>
                <label style={{
                  display: 'flex',
                  marginBottom: '8px',
                  fontWeight: 600,
                  fontSize: '14px',
                  color: 'var(--text-primary)',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Palette style={{ width: '16px', height: '16px' }} />
                  Theme Color
                </label>
                <input
                  type="color"
                  name="theme_color"
                  value={formData.theme_color}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    height: '44px',
                    border: '1.5px solid var(--border-primary)',
                    borderRadius: 'var(--radius-lg)',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: isLoading ? 0.6 : 1
                  }}
                />
              </div>
            </div>

            {/* Icon Selection */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'flex',
                marginBottom: '12px',
                fontWeight: 600,
                fontSize: '14px',
                color: 'var(--text-primary)',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Image style={{ width: '16px', height: '16px' }} />
                Select Icon
              </label>
              
              {/* Default Icons - Now with actual images */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
                {defaultIcons.map((icon) => (
                  <div
                    key={icon.src}
                    onClick={() => !isLoading && handleIconSelect(icon.src)}
                    style={{
                      padding: '12px',
                      border: formData.selectedIcon === icon.src && !formData.customIcon ? '2px solid var(--interactive-accent)' : '1px solid var(--border-primary)',
                      borderRadius: 'var(--radius-lg)',
                      backgroundColor: formData.selectedIcon === icon.src && !formData.customIcon ? 'var(--surface-accent)' : 'var(--surface-primary)',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      textAlign: 'center',
                      transition: 'all var(--transition-normal)',
                      opacity: isLoading ? 0.6 : 1
                    }}
                  >
                    <img
                      src={icon.src}
                      alt={icon.name}
                      style={{
                        width: '48px',
                        height: '48px',
                        objectFit: 'contain',
                        marginBottom: '6px',
                        borderRadius: '8px'
                      }}
                      onError={(e) => {
                        // Fallback if icon fails to load
                        (e.target as HTMLImageElement).src = fallbackIcon;
                      }}
                    />
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{icon.name}</div>
                  </div>
                ))}
              </div>

              {/* Custom Icon Upload */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: 600,
                  fontSize: '14px',
                  color: 'var(--text-primary)'
                }}>
                  Or Upload Custom Icon:
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/png, image/jpeg, image/webp, image/svg+xml"
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1.5px solid var(--border-primary)',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: 'var(--surface-primary)',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '14px',
                    opacity: isLoading ? 0.6 : 1
                  }}
                />
                {formData.customIcon && (
                  <div style={{ marginTop: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>
                    Selected: {formData.customIcon.name}
                  </div>
                )}
              </div>
            </div>

            {/* Generate Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '14px 20px',
                background: 'linear-gradient(135deg, var(--interactive-accent), var(--interactive-accent-hover))',
                color: 'var(--text-inverse)',
                border: 'none',
                borderRadius: 'var(--radius-lg)',
                fontWeight: 600,
                fontSize: '15px',
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
              {isLoading ? (
                <>
                  <Loader style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }} />
                  Generating...
                </>
              ) : (
                <>
                  <Download style={{ width: '18px', height: '18px' }} />
                  Generate & Download Manifest
                </>
              )}
            </button>
          </form>

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
                <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>Generation Failed</div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{errorMsg}</div>
              </div>
            </div>
          )}

          {/* Success State */}
          {status === 'success' && manifestContent && (
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
                <span style={{ fontSize: '14px', fontWeight: '600' }}>Manifest generated successfully!</span>
              </div>

              {/* Bubblewrap Instructions */}
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
                  <Package style={{ width: '14px', height: '14px' }} />
                  For Bubblewrap Usage
                </h4>
                <p style={{
                  color: 'var(--text-secondary)',
                  fontSize: '13px',
                  lineHeight: '1.5',
                  margin: '0 0 12px 0'
                }}>
                  Save the downloaded <code style={{ background: 'var(--surface-tertiary)', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>manifest.json</code> file and use it locally:
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
                  bubblewrap init --manifest ./manifest.json
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    onClick={downloadManifestFile}
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
                    <Download style={{ width: '12px', height: '12px' }} />
                    Download Again
                  </button>
                  <button
                    onClick={() => copyToClipboard(manifestContent, 'manifest-content')}
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
                    <Copy style={{ width: '12px', height: '12px' }} />
                    Copy Manifest JSON
                  </button>
                </div>
              </div>

              {/* Insert Manifest Option */}
              {onInsert && (
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

        {/* Features Section */}
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
            <FileJson style={{ width: '16px', height: '16px' }} />
            Command Line
          </h3>
          <ul style={{
            color: 'var(--text-secondary)',
            fontSize: '13px',
            lineHeight: '1.6',
            margin: 0,
            paddingLeft: '20px'
          }}>
            <li>npm i @bubblewrap/core</li>
            <li>bubblewrap init --manifest ./manifest.json</li>
            <li>bubblewrap build</li>
            <li>SHA-256</li>
            <li>keytool -list -v -keystore android.keystore</li>
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
          {copiedItem === 'manifest-content'
            ? 'Manifest JSON copied!'
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
