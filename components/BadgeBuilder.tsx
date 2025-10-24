"use client";

import React, { useState } from 'react';

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
    label: 'sudo_self',
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
  const [previewMode, setPreviewMode] = useState('light');

  const colorOptions = [
    'brightgreen', 'green', 'yellow', 'yellowgreen', 'orange',
    'red', 'blue', 'lightgrey', 'pink', 'purple'
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
  ];

  const styleOptions = [
    { name: 'Flat', value: 'flat' },
    { name: 'Plastic', value: 'plastic' },
    { name: 'Flat Square', value: 'flat-square' },
    { name: 'For the Badge', value: 'for-the-badge' }
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

  const insertBadge = () => {
    const badgeUrl = generateBadgeUrl();
    const htmlSnippet = `<img src="${badgeUrl}" alt="${badgeConfig.label} - ${badgeConfig.message}" />`;
    onInsert(htmlSnippet);
  };

  const downloadBadge = () => {
    const link = document.createElement('a');
    link.href = generateBadgeUrl();
    link.download = `${badgeConfig.label}-${badgeConfig.message}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getInputClasses = () =>
    `w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors duration-200 ${
      previewMode === 'dark' 
        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
    }`;

  const getSelectClasses = () =>
    `w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors duration-200 ${
      previewMode === 'dark' 
        ? 'bg-gray-700 border-gray-600 text-white' 
        : 'bg-white border-gray-300 text-gray-900'
    }`;

  const getLabelClasses = () =>
    `block mb-2 font-semibold ${
      previewMode === 'dark' ? 'text-gray-200' : 'text-gray-700'
    }`;

  const getTabClasses = (isActive: boolean) =>
    `py-3 px-6 font-medium transition-colors duration-200 relative ${
      isActive 
        ? 'text-pink-600' 
        : `${previewMode === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
    }`;

  const badgeUrl = generateBadgeUrl();
  const htmlSnippet = `<img src="${badgeUrl}" alt="${badgeConfig.label} - ${badgeConfig.message}" />`;

  return (
    <div className={`min-h-screen p-4 flex items-center justify-center transition-colors duration-300 ${
      previewMode === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className={`w-full max-w-4xl rounded-2xl shadow-xl overflow-hidden transition-colors duration-300 ${
        previewMode === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        
        {/* Header */}
        <div className={`p-6 border-b transition-colors duration-300 ${
          previewMode === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                previewMode === 'dark' ? 'bg-pink-900' : 'bg-pink-100'
              }`}>
                <svg className="w-6 h-6 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Badge Builder</h1>
                <p className={`text-sm ${
                  previewMode === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Create custom shields.io badges
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setPreviewMode(prev => prev === 'light' ? 'dark' : 'light')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 ${
                previewMode === 'dark' 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {previewMode === 'light' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                )}
              </svg>
              <span>{previewMode === 'light' ? 'Dark' : 'Light'} Mode</span>
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Tabs */}
          <div className={`flex border-b mb-8 ${
            previewMode === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            {['basic', 'advanced'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={getTabClasses(activeTab === tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-pink-600"></div>
                )}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Config Panel */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={getLabelClasses()}>Label</label>
                  <input
                    type="text"
                    value={badgeConfig.label}
                    onChange={e => updateBadgeConfig('label', e.target.value)}
                    className={getInputClasses()}
                    placeholder="Enter label text"
                  />
                </div>
                <div>
                  <label className={getLabelClasses()}>Message</label>
                  <input
                    type="text"
                    value={badgeConfig.message}
                    onChange={e => updateBadgeConfig('message', e.target.value)}
                    className={getInputClasses()}
                    placeholder="Enter message text"
                  />
                </div>
              </div>

              <div>
                <label className={getLabelClasses()}>Color</label>
                <select
                  value={badgeConfig.color}
                  onChange={e => updateBadgeConfig('color', e.target.value)}
                  className={getSelectClasses()}
                >
                  {colorOptions.map(color => (
                    <option key={color} value={color}>
                      {color.charAt(0).toUpperCase() + color.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {activeTab === 'advanced' && (
                <div className={`space-y-6 border-t pt-6 ${
                  previewMode === 'dark' ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <div>
                    <label className={getLabelClasses()}>Style</label>
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
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
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
                    <div>
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
                    className={`flex items-center space-x-3 p-4 rounded-lg border transition-colors duration-200 cursor-pointer ${
                      previewMode === 'dark'
                        ? 'bg-pink-900 border-pink-700 text-pink-200'
                        : 'bg-pink-50 border-pink-200 text-pink-800'
                    }`}
                    onClick={() => updateBadgeConfig('isError', !badgeConfig.isError)}
                  >
                    <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors duration-200 ${
                      badgeConfig.isError 
                        ? 'bg-pink-500 border-pink-500' 
                        : `${previewMode === 'dark' ? 'border-gray-500' : 'border-gray-300'}`
                    }`}>
                      {badgeConfig.isError && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className="font-medium">Error Style (forces red color)</span>
                  </div>
                </div>
              )}
            </div>

            {/* Preview Panel */}
            <div className="space-y-6">
              <div className={`p-6 rounded-xl border-2 transition-colors duration-300 ${
                previewMode === 'dark' 
                  ? 'bg-gray-900 border-gray-700' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <h2 className={`text-lg font-semibold mb-4 ${
                  previewMode === 'dark' ? 'text-gray-200' : 'text-gray-800'
                }`}>Preview</h2>
                <div className={`flex justify-center p-4 rounded-lg ${
                  previewMode === 'dark' ? 'bg-gray-800' : 'bg-white'
                }`}>
                  <img
                    src={badgeUrl}
                    alt="Badge Preview"
                    className="max-w-full h-auto transition-transform duration-300 hover:scale-105"
                  />
                </div>

                {/* Badge Syntax Display */}
                <div className="mt-6 space-y-4">
                  <div>
                    <h3 className={`font-semibold text-sm mb-2 ${
                      previewMode === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>Badge URL</h3>
                    <div className={`p-3 rounded-lg overflow-x-auto ${
                      previewMode === 'dark' ? 'bg-gray-900 text-cyan-400' : 'bg-gray-100 text-gray-800'
                    }`}>
                      <code className="text-sm font-mono break-all">
                        {badgeUrl}
                      </code>
                    </div>
                  </div>

                  <div>
                    <h3 className={`font-semibold text-sm mb-2 ${
                      previewMode === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>HTML Code</h3>
                    <div className={`p-3 rounded-lg overflow-x-auto ${
                      previewMode === 'dark' ? 'bg-gray-900 text-cyan-400' : 'bg-gray-100 text-gray-800'
                    }`}>
                      <code className="text-sm font-mono break-all">
                        {htmlSnippet}
                      </code>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 space-y-3">
                  <button
                    onClick={insertBadge}
                    className="w-full px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Insert Badge</span>
                  </button>

                  <button
                    onClick={copyToClipboard}
                    className="w-full px-4 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>Copy HTML Code</span>
                  </button>
                  
                  <button
                    onClick={downloadBadge}
                    className={`w-full px-4 py-3 border-2 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2 ${
                      previewMode === 'dark'
                        ? 'border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white'
                        : 'border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>Download SVG</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {copied && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg animate-fadeIn flex items-center space-x-2">
          <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span>HTML code copied to clipboard!</span>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translate(-50%, 10px); }
          100% { opacity: 1; transform: translate(-50%, 0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </div>
  );
}
