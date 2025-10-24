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

  // Style objects instead of class names
  const getLabelStyle = () => ({
    display: 'block',
    marginBottom: '8px',
    fontWeight: 600,
    fontSize: '14px',
    letterSpacing: '0.025em',
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-sans)'
  } as const);

  const getInputStyle = () => ({
    width: '100%',
    padding: '12px',
    border: '1px solid var(--border-primary)',
    borderRadius: 'var(--radius-lg)',
    backgroundColor: 'var(--surface-primary)',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-sans)',
    fontSize: '14px',
    transition: 'all var(--transition-normal)'
  } as const);

  const getSelectStyle = () => ({
    width: '100%',
    padding: '12px',
    border: '1px solid var(--border-primary)',
    borderRadius: 'var(--radius-lg)',
    backgroundColor: 'var(--surface-primary)',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-sans)',
    fontSize: '14px',
    transition: 'all var(--transition-normal)',
    cursor: 'pointer'
  } as const);

  const getTabStyle = (isActive: boolean) => ({
    padding: '12px 24px',
    fontWeight: 600,
    transition: 'all var(--transition-normal)',
    position: 'relative' as const,
    border: 'none',
    backgroundColor: 'transparent',
    color: isActive ? 'var(--interactive-accent)' : 'var(--text-tertiary)',
    cursor: 'pointer',
    fontFamily: 'var(--font-sans)'
  } as const);

  const badgeUrl = generateBadgeUrl();
  const htmlSnippet = `<img src="${badgeUrl}" alt="${badgeConfig.label} - ${badgeConfig.message}" />`;

  return (
    <div className="badge-builder" style={{
      minHeight: '100vh',
      padding: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background-color 0.3s ease',
      backgroundColor: 'var(--surface-secondary)',
      fontFamily: 'var(--font-sans)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1200px',
        borderRadius: 'var(--radius-2xl)',
        boxShadow: 'var(--shadow-xl)',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        backgroundColor: 'var(--surface-primary)',
        border: '1px solid var(--border-primary)'
      }}>
        
        {/* Header */}
        <div style={{
          padding: '32px',
          borderBottom: '1px solid var(--border-primary)',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: 'var(--surface-primary)'
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, var(--interactive-accent) / 5%, transparent)'
          }}></div>
          <div style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                padding: '12px',
                borderRadius: 'var(--radius-xl)',
                backgroundColor: 'var(--interactive-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg style={{ width: '24px', height: '24px', color: 'var(--text-inverse)' }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h1 style={{
                  fontSize: '28px',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, var(--interactive-accent), var(--interactive-accent-hover))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  margin: 0
                }}>
                  Badge Builder
                </h1>
                <p style={{
                  fontSize: '16px',
                  marginTop: '8px',
                  color: 'var(--text-secondary)',
                  margin: 0
                }}>
                  Create beautiful shields.io badges for your projects
                </p>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <button
                onClick={resetToDefaults}
                style={{
                  padding: '10px 20px',
                  borderRadius: 'var(--radius-lg)',
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  border: '1px solid var(--border-primary)',
                  backgroundColor: 'transparent',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = 'var(--interactive-accent)';
                  e.currentTarget.style.color = 'var(--interactive-accent)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-primary)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Reset</span>
              </button>
              
              <button
                onClick={() => setPreviewMode(prev => prev === 'light' ? 'dark' : 'light')}
                style={{
                  padding: '10px 20px',
                  borderRadius: 'var(--radius-lg)',
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  border: 'none',
                  backgroundColor: 'var(--surface-tertiary)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--interactive-accent)';
                  e.currentTarget.style.color = 'var(--text-inverse)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--surface-tertiary)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
              >
                <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {previewMode === 'light' ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  )}
                </svg>
                <span>{previewMode === 'light' ? 'Dark' : 'Light'}</span>
              </button>
            </div>
          </div>
        </div>

        <div style={{ padding: '32px' }}>
          {/* Tabs */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid var(--border-primary)',
            marginBottom: '32px'
          }}>
            {['basic', 'advanced'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={getTabStyle(activeTab === tab)}
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

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '32px',
            alignItems: 'start'
          }}>
            {/* Config Panel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px'
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
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--interactive-accent)';
                      e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                      e.target.style.transform = 'translateY(-1px)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--border-primary)';
                      e.target.style.boxShadow = 'none';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  />
                  <div style={{
                    fontSize: '12px',
                    color: 'var(--text-tertiary)',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <span>Displayed on the left</span>
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
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--interactive-accent)';
                      e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                      e.target.style.transform = 'translateY(-1px)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--border-primary)';
                      e.target.style.boxShadow = 'none';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  />
                  <div style={{
                    fontSize: '12px',
                    color: 'var(--text-tertiary)',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <span>Displayed on the right</span>
                    <span>{badgeConfig.message.length}/30</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={getLabelStyle()}>Color Scheme</label>
                <select
                  value={badgeConfig.color}
                  onChange={e => updateBadgeConfig('color', e.target.value)}
                  style={getSelectStyle()}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--interactive-accent)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--border-primary)';
                    e.target.style.boxShadow = 'none';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  {colorOptions.map(color => (
                    <option key={color.value} value={color.value}>
                      {color.name}
                    </option>
                  ))}
                </select>
              </div>

              {activeTab === 'advanced' && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px',
                  borderTop: '1px solid var(--border-primary)',
                  paddingTop: '24px'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={getLabelStyle()}>Badge Style</label>
                    <select
                      value={badgeConfig.style}
                      onChange={e => updateBadgeConfig('style', e.target.value)}
                      style={getSelectStyle()}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--interactive-accent)';
                        e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                        e.target.style.transform = 'translateY(-1px)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'var(--border-primary)';
                        e.target.style.boxShadow = 'none';
                        e.target.style.transform = 'translateY(0)';
                      }}
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
                    gap: '16px'
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={getLabelStyle()}>Logo</label>
                      <select
                        value={badgeConfig.logo}
                        onChange={e => updateBadgeConfig('logo', e.target.value)}
                        style={getSelectStyle()}
                        onFocus={(e) => {
                          e.target.style.borderColor = 'var(--interactive-accent)';
                          e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                          e.target.style.transform = 'translateY(-1px)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'var(--border-primary)';
                          e.target.style.boxShadow = 'none';
                          e.target.style.transform = 'translateY(0)';
                        }}
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
                        onFocus={(e) => {
                          e.target.style.borderColor = 'var(--interactive-accent)';
                          e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                          e.target.style.transform = 'translateY(-1px)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'var(--border-primary)';
                          e.target.style.boxShadow = 'none';
                          e.target.style.transform = 'translateY(0)';
                        }}
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '16px',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--border-primary)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      backgroundColor: 'var(--surface-secondary)'
                    }}
                    onClick={() => updateBadgeConfig('isError', !badgeConfig.isError)}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = 'var(--interactive-accent)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-primary)';
                    }}
                  >
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid var(--text-tertiary)',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease',
                      backgroundColor: badgeConfig.isError ? 'var(--interactive-accent)' : 'transparent',
                      borderColor: badgeConfig.isError ? 'var(--interactive-accent)' : 'var(--text-tertiary)'
                    }}>
                      {badgeConfig.isError && (
                        <svg style={{ width: '12px', height: '12px', color: 'var(--text-inverse)' }} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Error Style</span>
                      <p style={{ fontSize: '14px', color: 'var(--text-tertiary)', margin: '4px 0 0 0' }}>Forces red color regardless of selection</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Preview Panel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{
                padding: '24px',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-primary)',
                transition: 'all 0.3s ease',
                backgroundColor: 'var(--surface-secondary)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <h2 style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    margin: 0
                  }}>Live Preview</h2>
                  <div style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
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
                  padding: '24px',
                  borderRadius: 'var(--radius-lg)',
                  marginBottom: '24px',
                  backgroundColor: 'var(--surface-primary)',
                  transition: 'all 0.3s ease'
                }}>
                  <img
                    src={badgeUrl}
                    alt="Badge Preview"
                    style={{
                      maxWidth: '100%',
                      height: 'auto',
                      transition: 'all 0.3s ease'
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://img.shields.io/badge/error-invalid_config-red`;
                    }}
                  />
                </div>

                {/* Code Display */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <h3 style={{
                      fontWeight: 600,
                      fontSize: '14px',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: 'var(--text-secondary)'
                    }}>
                      <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      Badge URL
                    </h3>
                    <div style={{
                      padding: '16px',
                      borderRadius: 'var(--radius-lg)',
                      overflowX: 'auto',
                      border: '1px solid var(--border-primary)',
                      transition: 'all 0.3s ease',
                      backgroundColor: 'var(--surface-primary)'
                    }}>
                      <code style={{
                        fontSize: '14px',
                        fontFamily: 'var(--font-mono)',
                        wordBreak: 'break-all',
                        color: 'var(--interactive-accent)'
                      }}>
                        {badgeUrl}
                      </code>
                    </div>
                  </div>

                  <div>
                    <h3 style={{
                      fontWeight: 600,
                      fontSize: '14px',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: 'var(--text-secondary)'
                    }}>
                      <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                      HTML Embed Code
                    </h3>
                    <div style={{
                      padding: '16px',
                      borderRadius: 'var(--radius-lg)',
                      overflowX: 'auto',
                      border: '1px solid var(--border-primary)',
                      transition: 'all 0.3s ease',
                      backgroundColor: 'var(--surface-primary)'
                    }}>
                      <code style={{
                        fontSize: '14px',
                        fontFamily: 'var(--font-mono)',
                        wordBreak: 'break-all',
                        color: 'var(--interactive-accent)'
                      }}>
                        {htmlSnippet}
                      </code>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button
                    onClick={insertBadge}
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      padding: '16px',
                      backgroundColor: 'var(--interactive-success)',
                      color: 'var(--text-inverse)',
                      border: 'none',
                      borderRadius: 'var(--radius-lg)',
                      fontWeight: 600,
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '12px',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      opacity: isLoading ? 0.7 : 1,
                      fontFamily: 'inherit'
                    }}
                    onMouseOver={(e) => {
                      if (!isLoading) {
                        e.currentTarget.style.backgroundColor = 'var(--interactive-success-hover)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isLoading) {
                        e.currentTarget.style.backgroundColor = 'var(--interactive-success)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }
                    }}
                  >
                    {isLoading ? (
                      <div style={{
                        width: '18px',
                        height: '18px',
                        border: '2px solid var(--text-inverse)',
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}></div>
                    ) : (
                      <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    )}
                    <span>{isLoading ? 'Inserting...' : 'Insert Badge'}</span>
                  </button>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px'
                  }}>
                    <button
                      onClick={copyToClipboard}
                      style={{
                        padding: '12px',
                        borderRadius: 'var(--radius-lg)',
                        fontWeight: 600,
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        border: '1px solid var(--interactive-accent)',
                        backgroundColor: 'var(--interactive-accent)',
                        color: 'var(--text-inverse)',
                        cursor: 'pointer',
                        fontFamily: 'inherit'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--interactive-accent-hover)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--interactive-accent)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span>Copy Code</span>
                    </button>
                    
                    <button
                      onClick={downloadBadge}
                      style={{
                        padding: '12px',
                        borderRadius: 'var(--radius-lg)',
                        fontWeight: 600,
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        border: '1px solid var(--border-primary)',
                        backgroundColor: 'transparent',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        fontFamily: 'inherit'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.borderColor = 'var(--interactive-accent)';
                        e.currentTarget.style.color = 'var(--interactive-accent)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border-primary)';
                        e.currentTarget.style.color = 'var(--text-primary)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {copied && (
        <div style={{
          position: 'fixed',
          bottom: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'var(--interactive-success)',
          color: 'var(--text-inverse)',
          padding: '16px 24px',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-xl)',
          animation: 'fadeIn 0.4s ease-out',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          zIndex: 50
        }}>
          <svg style={{ width: '18px', height: '18px' }} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span style={{ fontWeight: 600 }}>HTML code copied to clipboard!</span>
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
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
