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
      
      // Simulate loading for better UX
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

  // Enhanced styling functions using your design system
  const getInputClasses = () =>
    `w-full p-3 border-2 rounded-xl focus:outline-none focus:ring-3 focus:ring-accent-color/30 transition-all duration-300 ${
      previewMode === 'dark' 
        ? 'bg-surface-tertiary border-panel-border text-text-primary placeholder-text-muted' 
        : 'bg-surface-primary border-panel-border text-text-primary placeholder-text-muted'
    } hover:border-accent-color/50`;

  const getSelectClasses = () =>
    `w-full p-3 border-2 rounded-xl focus:outline-none focus:ring-3 focus:ring-accent-color/30 transition-all duration-300 cursor-pointer ${
      previewMode === 'dark' 
        ? 'bg-surface-tertiary border-panel-border text-text-primary' 
        : 'bg-surface-primary border-panel-border text-text-primary'
    } hover:border-accent-color/50`;

  const getLabelClasses = () =>
    `block mb-3 font-semibold text-sm uppercase tracking-wide ${
      previewMode === 'dark' ? 'text-text-secondary' : 'text-text-secondary'
    }`;

  const getTabClasses = (isActive: boolean) =>
    `py-4 px-6 font-semibold transition-all duration-300 relative group ${
      isActive 
        ? 'text-accent-color' 
        : `${previewMode === 'dark' ? 'text-text-tertiary hover:text-text-secondary' : 'text-text-tertiary hover:text-text-secondary'}`
    }`;

  const badgeUrl = generateBadgeUrl();
  const htmlSnippet = `<img src="${badgeUrl}" alt="${badgeConfig.label} - ${badgeConfig.message}" />`;

  return (
    <div className={`min-h-screen p-6 flex items-center justify-center transition-colors duration-500 ${
      previewMode === 'dark' ? 'bg-surface-secondary' : 'bg-surface-secondary'
    }`}>
      <div className={`w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 transform hover:shadow-3xl ${
        previewMode === 'dark' ? 'bg-surface-primary' : 'bg-surface-primary'
      }`}>
        
        {/* Enhanced Header */}
        <div className={`p-8 border-b transition-colors duration-500 relative overflow-hidden ${
          previewMode === 'dark' ? 'border-panel-border' : 'border-panel-border'
        }`}>
          <div className="absolute inset-0 bg-gradient-to-r from-accent-color/5 to-transparent"></div>
          <div className="relative flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-2xl transition-all duration-500 ${
                previewMode === 'dark' ? 'bg-accent-color/20' : 'bg-accent-color/10'
              }`}>
                <svg className="w-8 h-8 text-accent-color" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-accent-color to-purple-500 bg-clip-text text-transparent">
                  Badge Builder
                </h1>
                <p className={`text-lg mt-2 ${
                  previewMode === 'dark' ? 'text-text-tertiary' : 'text-text-tertiary'
                }`}>
                  Create beautiful shields.io badges for your projects
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={resetToDefaults}
                className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 border-2 ${
                  previewMode === 'dark' 
                    ? 'border-panel-border hover:border-accent-color text-text-secondary hover:text-accent-color' 
                    : 'border-panel-border hover:border-accent-color text-text-secondary hover:text-accent-color'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Reset</span>
              </button>
              
              <button
                onClick={() => setPreviewMode(prev => prev === 'light' ? 'dark' : 'light')}
                className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                  previewMode === 'dark' 
                    ? 'bg-accent-color hover:bg-accent-color-hover text-text-inverse' 
                    : 'bg-surface-tertiary hover:bg-accent-color/10 text-text-primary'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

        <div className="p-8">
          {/* Enhanced Tabs */}
          <div className={`flex border-b mb-10 ${
            previewMode === 'dark' ? 'border-panel-border' : 'border-panel-border'
          }`}>
            {['basic', 'advanced'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={getTabClasses(activeTab === tab)}
              >
                <span className="relative z-10">
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </span>
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-accent-color rounded-t-full"></div>
                )}
                <div className="absolute inset-0 bg-accent-color/10 rounded-xl scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300"></div>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
            {/* Enhanced Config Panel */}
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className={getLabelClasses()}>
                    <span className="flex items-center gap-2">
                      Label
                      <span className="text-xs text-accent-color">*</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    value={badgeConfig.label}
                    onChange={e => updateBadgeConfig('label', e.target.value)}
                    className={getInputClasses()}
                    placeholder="e.g., version, build, license"
                    maxLength={30}
                  />
                  <div className="text-xs text-text-tertiary flex justify-between">
                    <span>Displayed on the left</span>
                    <span>{badgeConfig.label.length}/30</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className={getLabelClasses()}>
                    <span className="flex items-center gap-2">
                      Message
                      <span className="text-xs text-accent-color">*</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    value={badgeConfig.message}
                    onChange={e => updateBadgeConfig('message', e.target.value)}
                    className={getInputClasses()}
                    placeholder="e.g., 1.0.0, passing, MIT"
                    maxLength={30}
                  />
                  <div className="text-xs text-text-tertiary flex justify-between">
                    <span>Displayed on the right</span>
                    <span>{badgeConfig.message.length}/30</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className={getLabelClasses()}>Color Scheme</label>
                <select
                  value={badgeConfig.color}
                  onChange={e => updateBadgeConfig('color', e.target.value)}
                  className={getSelectClasses()}
                >
                  {colorOptions.map(color => (
                    <option key={color.value} value={color.value}>
                      {color.name}
                    </option>
                  ))}
                </select>
              </div>

              {activeTab === 'advanced' && (
                <div className={`space-y-8 border-t pt-8 ${
                  previewMode === 'dark' ? 'border-panel-border' : 'border-panel-border'
                }`}>
                  <div className="space-y-3">
                    <label className={getLabelClasses()}>Badge Style</label>
                    <select
                      value={badgeConfig.style}
                      onChange={e => updateBadgeConfig('style', e.target.value)}
                      className={getSelectClasses()}
                    >
                      {styleOptions.map(style => (
                        <option key={style.value} value={style.value}>
                          {style.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className={getLabelClasses()}>Logo</label>
                      <select
                        value={badgeConfig.logo}
                        onChange={e => updateBadgeConfig('logo', e.target.value)}
                        className={getSelectClasses()}
                      >
                        {logoOptions.map(logo => (
                          <option key={logo.value} value={logo.value}>
                            {logo.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className={getLabelClasses()}>Logo Color</label>
                      <input
                        type="text"
                        value={badgeConfig.logoColor}
                        onChange={e => updateBadgeConfig('logoColor', e.target.value)}
                        className={getInputClasses()}
                        placeholder="white, black, #FF0000"
                      />
                    </div>
                  </div>

                  <div
                    className={`flex items-center space-x-4 p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer group ${
                      previewMode === 'dark'
                        ? 'bg-accent-color/10 border-accent-color/30 hover:border-accent-color'
                        : 'bg-accent-color/5 border-accent-color/20 hover:border-accent-color'
                    }`}
                    onClick={() => updateBadgeConfig('isError', !badgeConfig.isError)}
                  >
                    <div className={`w-6 h-6 border-2 rounded-lg flex items-center justify-center transition-all duration-300 ${
                      badgeConfig.isError 
                        ? 'bg-accent-color border-accent-color scale-110' 
                        : `${previewMode === 'dark' ? 'border-text-tertiary group-hover:border-accent-color' : 'border-text-tertiary group-hover:border-accent-color'}`
                    }`}>
                      {badgeConfig.isError && (
                        <svg className="w-3 h-3 text-text-inverse" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <span className="font-semibold text-text-primary">Error Style</span>
                      <p className="text-sm text-text-tertiary mt-1">Forces red color regardless of selection</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Preview Panel */}
            <div className="space-y-8">
              <div className={`p-8 rounded-3xl border-2 transition-all duration-500 ${
                previewMode === 'dark' 
                  ? 'bg-surface-tertiary border-panel-border' 
                  : 'bg-surface-secondary border-panel-border'
              }`}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-xl font-bold ${
                    previewMode === 'dark' ? 'text-text-primary' : 'text-text-primary'
                  }`}>Live Preview</h2>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    previewMode === 'dark' ? 'bg-accent-color/20 text-accent-color' : 'bg-accent-color/10 text-accent-color'
                  }`}>
                    Real-time
                  </div>
                </div>
                
                <div className={`flex justify-center p-8 rounded-2xl mb-8 transition-all duration-500 ${
                  previewMode === 'dark' ? 'bg-surface-primary' : 'bg-surface-primary'
                }`}>
                  <img
                    src={badgeUrl}
                    alt="Badge Preview"
                    className="max-w-full h-auto transition-all duration-500 hover:scale-105 hover:rotate-1"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://img.shields.io/badge/error-invalid_config-red`;
                    }}
                  />
                </div>

                {/* Enhanced Code Display */}
                <div className="space-y-6">
                  <div>
                    <h3 className={`font-semibold text-sm mb-3 flex items-center gap-2 ${
                      previewMode === 'dark' ? 'text-text-secondary' : 'text-text-secondary'
                    }`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      Badge URL
                    </h3>
                    <div className={`p-4 rounded-xl overflow-x-auto border transition-all duration-300 ${
                      previewMode === 'dark' ? 'bg-surface-primary border-panel-border' : 'bg-surface-primary border-panel-border'
                    }`}>
                      <code className="text-sm font-mono break-all text-accent-color">
                        {badgeUrl}
                      </code>
                    </div>
                  </div>

                  <div>
                    <h3 className={`font-semibold text-sm mb-3 flex items-center gap-2 ${
                      previewMode === 'dark' ? 'text-text-secondary' : 'text-text-secondary'
                    }`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                      HTML Embed Code
                    </h3>
                    <div className={`p-4 rounded-xl overflow-x-auto border transition-all duration-300 ${
                      previewMode === 'dark' ? 'bg-surface-primary border-panel-border' : 'bg-surface-primary border-panel-border'
                    }`}>
                      <code className="text-sm font-mono break-all text-accent-color">
                        {htmlSnippet}
                      </code>
                    </div>
                  </div>
                </div>
                
                {/* Enhanced Action Buttons */}
                <div className="mt-8 space-y-4">
                  <button
                    onClick={insertBadge}
                    disabled={isLoading}
                    className="w-full px-6 py-4 bg-success-color hover:bg-success-color-hover text-text-inverse rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-text-inverse border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    )}
                    <span>{isLoading ? 'Inserting...' : 'Insert Badge'}</span>
                  </button>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={copyToClipboard}
                      className={`px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 border-2 transform hover:scale-105 active:scale-95 ${
                        previewMode === 'dark'
                          ? 'border-accent-color bg-accent-color/10 hover:bg-accent-color/20 text-accent-color'
                          : 'border-accent-color bg-accent-color/5 hover:bg-accent-color/10 text-accent-color'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span>Copy Code</span>
                    </button>
                    
                    <button
                      onClick={downloadBadge}
                      className={`px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 border-2 transform hover:scale-105 active:scale-95 ${
                        previewMode === 'dark'
                          ? 'border-panel-border hover:border-accent-color text-text-primary hover:text-accent-color'
                          : 'border-panel-border hover:border-accent-color text-text-primary hover:text-accent-color'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* Enhanced Toast Notification */}
      {copied && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-success-color text-text-inverse px-6 py-4 rounded-xl shadow-2xl animate-fadeIn flex items-center space-x-3 z-50">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span className="font-semibold">HTML code copied to clipboard!</span>
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
        .animate-fadeIn { 
          animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .shadow-3xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
}
