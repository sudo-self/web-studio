"use client";

import React, { useState } from 'react';
import { Copy, Check, Palette, Zap, Droplets, PaintBucket } from 'lucide-react';

interface ColorPaletteProps {
  onInsert?: (code: string) => void;
}

interface ColorCategory {
  name: string;
  description: string;
  colors: { [key: string]: string };
}

export default function ColorPalette({ onInsert }: ColorPaletteProps) {
  const [activeCategory, setActiveCategory] = useState('selago');
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('colors');
  const [isLoading, setIsLoading] = useState(false);

  const colorCategories: { [key: string]: ColorCategory } = {
    selago: {
      name: 'Selago',
      description: 'Soft purple palette for backgrounds and accents',
      colors: {
        '50': '#f7f6fc',
        '100': '#efecf9',
        '200': '#e4dff5',
        '300': '#cfc4ee',
        '400': '#b6a3e2',
        '500': '#9c7dd5',
        '600': '#8a61c6',
        '700': '#794eb3',
        '800': '#654196',
        '900': '#55377b',
        '950': '#352253',
      }
    },
    sulu: {
      name: 'Sulu',
      description: 'Vibrant green palette for success and actions',
      colors: {
        '50': '#f3fee7',
        '100': '#e3fccb',
        '200': '#c8f89e',
        '300': '#9df05b',
        '400': '#82e536',
        '500': '#62cb17',
        '600': '#49a20e',
        '700': '#397b10',
        '800': '#306113',
        '900': '#2a5314',
        '950': '#122e05',
      }
    },
    blueBayoux: {
      name: 'Blue Bayoux',
      description: 'Sophisticated blue-gray for text and borders',
      colors: {
        '50': '#f5f8fa',
        '100': '#ebeff3',
        '200': '#d2dce5',
        '300': '#abc0ce',
        '400': '#7d9db3',
        '500': '#5d829a',
        '600': '#4a6a82',
        '700': '#3c5468',
        '800': '#344858',
        '900': '#2f3f4b',
        '950': '#1f2832',
      }
    },
    lochmara: {
      name: 'Lochmara',
      description: 'Bright blue palette for primary actions',
      colors: {
        '50': '#f1f8fe',
        '100': '#e2f0fc',
        '200': '#bfe0f8',
        '300': '#86c9f3',
        '400': '#46adea',
        '500': '#1e92d9',
        '600': '#1280cc',
        '700': '#0e5d96',
        '800': '#104f7c',
        '900': '#134267',
        '950': '#0d2a44',
      }
    },
    tussock: {
      name: 'Tussock',
      description: 'Warm amber palette for warnings and highlights',
      colors: {
        '50': '#f9f6ed',
        '100': '#f1e9d0',
        '200': '#e5d4a3',
        '300': '#d5b66f',
        '400': '#c89c48',
        '500': '#b8883a',
        '600': '#9f6b2f',
        '700': '#7f5029',
        '800': '#6b4128',
        '900': '#5c3827',
        '950': '#351d13',
      }
    },
    reds: {
      name: 'Reds',
      description: 'Bold red palette for errors and alerts',
      colors: {
        '50': '#fef2f2',
        '100': '#fee2e2',
        '200': '#fecaca',
        '300': '#fca5a5',
        '400': '#f87171',
        '500': '#ef4444',
        '600': '#dc2626',
        '700': '#b91c1c',
        '800': '#991b1b',
        '900': '#7f1d1d',
        '950': '#450a0a',
      }
    }
  };

  const copyToClipboard = async (colorValue: string, colorName: string) => {
    try {
      await navigator.clipboard.writeText(colorValue);
      setCopiedColor(colorName);
      setTimeout(() => setCopiedColor(null), 2000);
    } catch (err) {
      console.error('Failed to copy color: ', err);
    }
  };

  const insertColor = async (colorValue: string, colorName: string) => {
    if (!onInsert) return;
    
    setIsLoading(true);
    try {
      // Insert as CSS variable or hex value based on context
      const cssSnippet = `color: ${colorValue}; /* ${colorName} */`;
      onInsert(cssSnippet);
      
      await new Promise(resolve => setTimeout(resolve, 500));
    } finally {
      setIsLoading(false);
    }
  };

  const copyAllVariables = async () => {
    const variables = Object.entries(colorCategories)
      .map(([categoryKey, category]) => 
        Object.entries(category.colors)
          .map(([shade, color]) => `--color-${categoryKey}-${shade}: ${color};`)
          .join('\n')
      )
      .join('\n\n');

    try {
      await navigator.clipboard.writeText(`:root {\n${variables}\n}`);
      setCopiedColor('all-variables');
      setTimeout(() => setCopiedColor(null), 2000);
    } catch (err) {
      console.error('Failed to copy variables: ', err);
    }
  };

  const getTextColor = (bgColor: string) => {
    const hex = bgColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.6 ? '#1f2937' : '#ffffff';
  };

  // Style objects matching Badge Builder
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

  const getLabelStyle = () => ({
    display: 'block',
    marginBottom: '8px',
    fontWeight: 600,
    fontSize: '14px',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-sans)'
  } as const);

  const currentCategory = colorCategories[activeCategory];

  return (
    <div style={{
      backgroundColor: 'var(--surface-card)',
      borderRadius: 'var(--radius-xl)',
      border: '1px solid var(--border-primary)',
      padding: '24px',
      fontFamily: 'var(--font-sans)'
    }}>
      {/* Header - Matches Badge Builder layout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <div style={{
          padding: '12px',
          backgroundColor: 'var(--interactive-accent)',
          borderRadius: 'var(--radius-xl)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Palette style={{ width: '24px', height: '24px', color: 'var(--text-inverse)' }} />
        </div>
        <h2 style={{ 
          fontSize: '20px', 
          fontWeight: 600, 
          color: 'var(--text-primary)',
          margin: 0
        }}>
          Color Palette
        </h2>
        <span style={{
          fontSize: '12px',
          color: 'var(--text-muted)',
          backgroundColor: 'var(--surface-tertiary)',
          padding: '4px 8px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-primary)'
        }}>
          {Object.keys(colorCategories).length} palettes
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-primary)',
          marginBottom: '24px'
        }}>
          {['colors', 'css'].map(tab => (
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

        {/* Main Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Category Selection */}
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
                Color Palette
              </h3>
              <div style={{
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: 600,
                backgroundColor: 'var(--interactive-accent)',
                color: 'var(--text-inverse)'
              }}>
                {currentCategory.name}
              </div>
            </div>

            {/* Category Tabs */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '8px',
              marginBottom: '16px'
            }}>
              {Object.entries(colorCategories).map(([key, category]) => (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  style={{
                    padding: '12px 8px',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-primary)',
                    backgroundColor: activeCategory === key ? category.colors['500'] : 'var(--surface-primary)',
                    color: activeCategory === key ? getTextColor(category.colors['500']) : 'var(--text-primary)',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all var(--transition-normal)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    justifyContent: 'center'
                  }}
                >
                  <div 
                    style={{ 
                      width: '12px', 
                      height: '12px', 
                      borderRadius: '50%',
                      backgroundColor: activeCategory === key ? getTextColor(category.colors['500']) : category.colors['500'],
                      border: activeCategory === key ? `2px solid ${getTextColor(category.colors['500'])}` : 'none'
                    }}
                  />
                  {category.name}
                </button>
              ))}
            </div>

            <p style={{ 
              fontSize: '14px', 
              color: 'var(--text-secondary)',
              margin: 0,
              lineHeight: '1.5'
            }}>
              {currentCategory.description}
            </p>
          </div>

          {/* Color Grid */}
          {activeTab === 'colors' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: '12px',
              marginBottom: '16px'
            }}>
              {Object.entries(currentCategory.colors).map(([shade, colorValue]) => {
                const colorName = `${activeCategory}-${shade}`;
                const textColor = getTextColor(colorValue);
                const isCopied = copiedColor === colorName;

                return (
                  <div
                    key={shade}
                    style={{
                      backgroundColor: colorValue,
                      borderRadius: 'var(--radius-lg)',
                      padding: '16px',
                      cursor: 'pointer',
                      transition: 'all var(--transition-normal)',
                      border: '1px solid var(--border-primary)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onClick={() => copyToClipboard(colorValue, colorName)}
                    onDoubleClick={() => onInsert && insertColor(colorValue, colorName)}
                  >
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      marginBottom: '12px'
                    }}>
                      <span 
                        style={{ 
                          fontSize: '12px',
                          fontWeight: 700,
                          padding: '4px 8px',
                          borderRadius: '6px',
                          backgroundColor: textColor === '#ffffff' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)',
                          color: textColor
                        }}
                      >
                        {shade}
                      </span>
                      {isCopied ? (
                        <Check style={{ width: '16px', height: '16px', color: textColor }} />
                      ) : (
                        <Copy style={{ width: '16px', height: '16px', color: textColor, opacity: 0.7 }} />
                      )}
                    </div>
                    
                    <div style={{ color: textColor }}>
                      <div style={{ 
                        fontSize: '13px', 
                        fontWeight: 700, 
                        marginBottom: '4px',
                        fontFamily: 'monospace'
                      }}>
                        {colorValue.toUpperCase()}
                      </div>
                      <div style={{ 
                        fontSize: '11px', 
                        opacity: 0.9 
                      }}>
                        {isCopied ? 'Copied!' : 'Click to copy'}
                      </div>
                    </div>

                    {isCopied && (
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: 'currentColor',
                        opacity: 0.1,
                        animation: 'fadeIn 0.3s ease-out'
                      }} />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* CSS Variables Tab */}
          {activeTab === 'css' && (
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
                margin: '0 0 16px 0'
              }}>
                CSS Variables
              </h3>
              <div style={{
                backgroundColor: 'var(--surface-primary)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                overflow: 'auto',
                maxHeight: '300px'
              }}>
                <pre style={{ 
                  margin: 0, 
                  fontSize: '13px',
                  fontFamily: 'monospace',
                  color: 'var(--text-primary)',
                  lineHeight: '1.5'
                }}>
                  {`:root {\n${Object.entries(colorCategories)
                    .map(([categoryKey, category]) => 
                      `  /* ${category.name} */\n` +
                      Object.entries(category.colors)
                        .map(([shade, color]) => `  --color-${categoryKey}-${shade}: ${color};`)
                        .join('\n')
                    )
                    .join('\n\n')}\n}`}
                </pre>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {onInsert && (
              <button
                onClick={() => insertColor(currentCategory.colors['500'], `${currentCategory.name}-500`)}
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
                  fontFamily: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <PaintBucket style={{ width: '16px', height: '16px' }} />
                {isLoading ? 'Inserting...' : 'Insert Primary Color'}
              </button>
            )}

            <div style={{
              display: 'grid',
              gridTemplateColumns: onInsert ? '1fr 1fr' : '1fr',
              gap: '8px'
            }}>
              <button
                onClick={copyAllVariables}
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
                  transition: 'all var(--transition-normal)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Droplets style={{ width: '14px', height: '14px' }} />
                Copy CSS Variables
              </button>
              
              {onInsert && (
                <button
                  onClick={copyAllVariables}
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
                    transition: 'all var(--transition-normal)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Zap style={{ width: '14px', height: '14px' }} />
                  Quick Actions
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {copiedColor && (
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
          <Check style={{ width: '16px', height: '16px' }} />
          {copiedColor === 'all-variables' 
            ? 'CSS variables copied to clipboard!' 
            : 'Color copied to clipboard!'}
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
