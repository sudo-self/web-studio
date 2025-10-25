"use client";

import React, { useState, useEffect } from 'react';

interface BadgeConfig {
  label: string;
  message: string;
  color: string;
  style: string;
  logo: string;
  logoColor: string;
  labelColor: string;
  isError: boolean;
}

interface BadgeBuilderProps {
  onInsert: (code: string) => void;
}

export default function BadgeBuilder({ onInsert }: BadgeBuilderProps) {
  const [badgeConfig, setBadgeConfig] = useState<BadgeConfig>({
    label: 'studio_jesse',
    message: 'badge_builder',
    color: 'pink',
    style: 'flat',
    logo: '',
    logoColor: 'white',
    labelColor: '',
    isError: false,
  });

  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [previewMode, setPreviewMode] = useState<'light' | 'dark'>('light');
  const [isLoading, setIsLoading] = useState(false);

  const colorOptions = [
    { name: 'Bright Green', value: 'brightgreen' },
    { name: 'Green', value: 'green' },
    { name: 'Yellow', value: 'yellow' },
    { name: 'Yellow Green', value: 'yellowgreen' },
    { name: 'Orange', value: 'orange' },
    { name: 'Red', value: 'red' },
    { name: 'Blue', value: 'blue' },
    { name: 'Light Grey', value: 'lightgrey' },
    { name: 'Pink', value: 'pink' },
    { name: 'Purple', value: 'purple' },
    { name: 'Success', value: 'success' },
    { name: 'Important', value: 'important' },
    { name: 'Critical', value: 'critical' },
    { name: 'Informational', value: 'informational' },
    { name: 'Inactive', value: 'inactive' },
  ];

  const logoOptions = [
    { name: 'None', value: '' },
    { name: 'GitHub', value: 'github' },
    { name: 'Twitter', value: 'twitter' },
    { name: 'Discord', value: 'discord' },
    { name: 'npm', value: 'npm' },
    { name: 'Docker', value: 'docker' },
    { name: 'React', value: 'react' },
    { name: 'Vue.js', value: 'vue.js' },
    { name: 'Python', value: 'python' },
    { name: 'JavaScript', value: 'javascript' },
    { name: 'TypeScript', value: 'typescript' },
    { name: 'HTML5', value: 'html5' },
    { name: 'CSS3', value: 'css3' },
    { name: 'Markdown', value: 'markdown' },
    { name: 'Git', value: 'git' },
  ];

  const styleOptions = [
    { name: 'Flat', value: 'flat' },
    { name: 'Plastic', value: 'plastic' },
    { name: 'Flat Square', value: 'flat-square' },
    { name: 'For the Badge', value: 'for-the-badge' },
    { name: 'Social', value: 'social' },
  ];

  const updateBadgeConfig = (key: keyof BadgeConfig, value: string | boolean) => {
    setBadgeConfig(prev => ({ ...prev, [key]: value }));
  };

  const generateBadgeUrl = () => {
    const { label, message, color, style, logo, logoColor, labelColor, isError } = badgeConfig;
    const finalColor = isError ? 'red' : color;
    
    const params = new URLSearchParams();
    if (style && style !== 'flat') params.append('style', style);
    if (logo) params.append('logo', logo);
    if (logoColor && logoColor !== 'white') params.append('logoColor', logoColor);
    if (labelColor) params.append('labelColor', labelColor);
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return `https://img.shields.io/badge/${encodeURIComponent(label)}-${encodeURIComponent(message)}-${finalColor}${queryString}`;
  };

  const copyToClipboard = async () => {
    try {
      const badgeUrl = generateBadgeUrl();
      const htmlSnippet = `<img src="${badgeUrl}" alt="${badgeConfig.label} - ${badgeConfig.message}" />`;
      
      await navigator.clipboard.writeText(htmlSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const insertBadge = async () => {
    setIsLoading(true);
    try {
      const badgeUrl = generateBadgeUrl();
      const htmlSnippet = `<img src="${badgeUrl}" alt="${badgeConfig.label} - ${badgeConfig.message}" />`;
      onInsert(htmlSnippet);
      
      await new Promise(resolve => setTimeout(resolve, 500));
    } finally {
      setIsLoading(false);
    }
  };

  const downloadBadge = () => {
    const link = document.createElement('a');
    link.href = generateBadgeUrl();
    link.download = `${badgeConfig.label}-${badgeConfig.message}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetToDefaults = () => {
    setBadgeConfig({
      label: 'studio_jesse',
      message: 'badge_builder',
      color: 'pink',
      style: 'flat',
      logo: '',
      logoColor: 'white',
      labelColor: '',
      isError: false,
    });
  };

  // Style objects
  const getInputStyle = () => ({
    width: '100%',
    padding: '12px 16px',
    border: '1.5px solid var(--border-primary)',
    borderRadius: 'var(--radius-lg)',
    backgroundColor: 'var(--surface-primary)',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-sans)',
    fontSize: '14px',
    transition: 'all var(--transition-normal)',
    outline: 'none'
  } as const);

  const getSelectStyle = () => ({
    width: '100%',
    padding: '12px 16px',
    border: '1.5px solid var(--border-primary)',
    borderRadius: 'var(--radius-lg)',
    backgroundColor: 'var(--surface-primary)',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-sans)',
    fontSize: '14px',
    transition: 'all var(--transition-normal)',
    cursor: 'pointer',
    outline: 'none'
  } as const);

  const getLabelStyle = () => ({
    display: 'block',
    marginBottom: '8px',
    fontWeight: 600,
    fontSize: '14px',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-sans)'
  } as const);

  const badgeUrl = generateBadgeUrl();
  const htmlSnippet = `<img src="${badgeUrl}" alt="${badgeConfig.label} - ${badgeConfig.message}" />`;

  return (
    <div style={{
      backgroundColor: 'var(--surface-card)',
      borderRadius: 'var(--radius-xl)',
      border: '1px solid var(--border-primary)',
      padding: '24px',
      fontFamily: 'var(--font-sans)'
    }}>
      {/* Header - Matches PDF Generator layout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <div style={{
          padding: '12px',
          backgroundColor: 'var(--interactive-accent)',
          borderRadius: 'var(--radius-xl)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <svg style={{ width: '24px', height: '24px', color: 'var(--text-inverse)' }} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 style={{ 
          fontSize: '20px', 
          fontWeight: 600, 
          color: 'var(--text-primary)',
          margin: 0
        }}>
          Badge Builder
        </h2>
        <span style={{
          fontSize: '12px',
          color: 'var(--text-muted)',
          backgroundColor: 'var(--surface-tertiary)',
          padding: '4px 8px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-primary)'
        }}>
          shields.io
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-primary)',
          marginBottom: '24px'
        }}>
          {['basic', 'advanced'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '12px 24px',
                fontWeight: 600,
                transition: 'all var(--transition-normal)',
                position: 'relative' as const,
                border: 'none',
                backgroundColor: 'transparent',
                color: activeTab === tab ? 'var(--interactive-accent)' : 'var(--text-tertiary)',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                fontSize: '14px'
              }}
              onMouseOver={(e) => {
                if (activeTab !== tab) {
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
              onMouseOut={(e) => {
                if (activeTab !== tab) {
                  e.currentTarget.style.color = 'var(--text-tertiary)';
                }
              }}
            >
              <span style={{ position: 'relative', zIndex: 10 }}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </span>
              {activeTab === tab && (
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: '2px',
                  backgroundColor: 'var(--interactive-accent)',
                  borderRadius: '1px'
                }}></div>
              )}
            </button>
          ))}
        </div>

        {/* Main Content - Single column for mobile */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Preview Section */}
          <div style={{
            padding: '20px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-primary)',
            backgroundColor: 'var(--surface-secondary)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ 
                fontSize: '16px', 
                fontWeight: 600, 
                color: 'var(--text-primary)',
                margin: 0
              }}>
                Live Preview
              </h3>
              <div style={{
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: 600,
                backgroundColor: 'var(--interactive-accent)',
                color: 'var(--text-inverse)'
              }}>
                Real-time
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '20px',
              borderRadius: 'var(--radius-md)',
              marginBottom: '20px',
              backgroundColor: 'var(--surface-primary)'
            }}>
              <img
                src={badgeUrl}
                alt="Badge Preview"
                style={{
                  maxWidth: '100%',
                  height: 'auto'
                }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://img.shields.io/badge/error-invalid_config-red`;
                }}
              />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                onClick={insertBadge}
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'linear-gradient(135deg, var(--interactive-success), var(--interactive-success-hover))',
                  color: 'var(--text-inverse)',
                  border: 'none',
                  borderRadius: 'var(--radius-lg)',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.7 : 1,
                  transition: 'all var(--transition-normal)',
                  fontFamily: 'inherit'
                }}
              >
                {isLoading ? 'Inserting...' : 'Insert Badge'}
              </button>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px'
              }}>
                <button
                  onClick={copyToClipboard}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-lg)',
                    fontWeight: 600,
                    fontSize: '13px',
                    border: '1px solid var(--interactive-accent)',
                    backgroundColor: 'var(--interactive-accent)',
                    color: 'var(--text-inverse)',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'all var(--transition-normal)'
                  }}
                >
                  Copy Code
                </button>
                
                <button
                  onClick={downloadBadge}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-lg)',
                    fontWeight: 600,
                    fontSize: '13px',
                    border: '1px solid var(--border-primary)',
                    backgroundColor: 'transparent',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'all var(--transition-normal)'
                  }}
                >
                  Download
                </button>
              </div>
            </div>
          </div>

          {/* Configuration Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Label and Message */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={getLabelStyle()}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Label
                    <span style={{ fontSize: '12px', color: 'var(--interactive-accent)' }}>*</span>
                  </span>
                </label>
                <input
                  type="text"
                  value={badgeConfig.label}
                  onChange={e => updateBadgeConfig('label', e.target.value)}
                  style={getInputStyle()}
                  placeholder="e.g., version, build, license"
                  maxLength={30}
                />
                <div style={{
                  fontSize: '11px',
                  color: 'var(--text-tertiary)',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span>Left side</span>
                  <span>{badgeConfig.label.length}/30</span>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={getLabelStyle()}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Message
                    <span style={{ fontSize: '12px', color: 'var(--interactive-accent)' }}>*</span>
                  </span>
                </label>
                <input
                  type="text"
                  value={badgeConfig.message}
                  onChange={e => updateBadgeConfig('message', e.target.value)}
                  style={getInputStyle()}
                  placeholder="e.g., 1.0.0, passing, MIT"
                  maxLength={30}
                />
                <div style={{
                  fontSize: '11px',
                  color: 'var(--text-tertiary)',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span>Right side</span>
                  <span>{badgeConfig.message.length}/30</span>
                </div>
              </div>
            </div>

            {/* Color Scheme */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={getLabelStyle()}>Color Scheme</label>
              <select
                value={badgeConfig.color}
                onChange={e => updateBadgeConfig('color', e.target.value)}
                style={getSelectStyle()}
              >
                {colorOptions.map(color => (
                  <option key={color.value} value={color.value}>
                    {color.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Advanced Options */}
            {activeTab === 'advanced' && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                borderTop: '1px solid var(--border-primary)',
                paddingTop: '16px'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={getLabelStyle()}>Badge Style</label>
                  <select
                    value={badgeConfig.style}
                    onChange={e => updateBadgeConfig('style', e.target.value)}
                    style={getSelectStyle()}
                  >
                    {styleOptions.map(style => (
                      <option key={style.value} value={style.value}>
                        {style.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={getLabelStyle()}>Logo</label>
                    <select
                      value={badgeConfig.logo}
                      onChange={e => updateBadgeConfig('logo', e.target.value)}
                      style={getSelectStyle()}
                    >
                      {logoOptions.map(logo => (
                        <option key={logo.value} value={logo.value}>
                          {logo.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={getLabelStyle()}>Logo Color</label>
                    <input
                      type="text"
                      value={badgeConfig.logoColor}
                      onChange={e => updateBadgeConfig('logoColor', e.target.value)}
                      style={getInputStyle()}
                      placeholder="white, black, #FF0000"
                    />
                  </div>
                </div>

                {/* Error Style Toggle */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-primary)',
                    cursor: 'pointer',
                    backgroundColor: 'var(--surface-secondary)'
                  }}
                  onClick={() => updateBadgeConfig('isError', !badgeConfig.isError)}
                >
                  <div style={{
                    width: '18px',
                    height: '18px',
                    border: '2px solid var(--text-tertiary)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all var(--transition-normal)',
                    backgroundColor: badgeConfig.isError ? 'var(--interactive-accent)' : 'transparent',
                    borderColor: badgeConfig.isError ? 'var(--interactive-accent)' : 'var(--text-tertiary)'
                  }}>
                    {badgeConfig.isError && (
                      <svg style={{ width: '10px', height: '10px', color: 'var(--text-inverse)' }} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '14px' }}>Error Style</span>
                    <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', margin: '2px 0 0 0' }}>Forces red color</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Utility Buttons */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button
              onClick={resetToDefaults}
              style={{
                padding: '10px 16px',
                borderRadius: 'var(--radius-lg)',
                fontWeight: 600,
                fontSize: '14px',
                border: '1px solid var(--border-primary)',
                backgroundColor: 'transparent',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all var(--transition-normal)',
                flex: 1
              }}
            >
              Reset
            </button>
            
            <button
              onClick={() => setPreviewMode(prev => prev === 'light' ? 'dark' : 'light')}
              style={{
                padding: '10px 16px',
                borderRadius: 'var(--radius-lg)',
                fontWeight: 600,
                fontSize: '14px',
                border: 'none',
                backgroundColor: 'var(--surface-tertiary)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all var(--transition-normal)',
                flex: 1
              }}
            >
              {previewMode === 'light' ? 'Dark' : 'Light'} Mode
            </button>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {copied && (
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
          <svg style={{ width: '16px', height: '16px' }} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          HTML code copied to clipboard!
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
      `}</style>
    </div>
  );
}
