"use client";

import React, { useState, useRef } from 'react';
import { Download, Globe, Package, CheckCircle, AlertCircle, Upload, Key, Loader, Zap, FileJson, Building, Palette, Image, Copy, Cpu } from 'lucide-react';

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
    customIcon: null as File | null,
    includeServiceWorker: false,
    serviceWorkerUrl: '/sw.js',
    serviceWorkerScope: '/'
  });

  const [manifestUrl, setManifestUrl] = useState('');
  const [manifestContent, setManifestContent] = useState('');
  const [serviceWorkerContent, setServiceWorkerContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'building' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
    
    const manifest: ManifestData = {
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

    return manifest;
  };

  const generateServiceWorker = (): string => {
    return `// Service Worker for ${formData.name || 'PWA App'}
const CACHE_NAME = '${formData.short_name.toLowerCase()}-v1.0.0';
const urlsToCache = [
  '/',
  '${formData.start_url}',
  '/manifest.json',
  // Add other assets you want to cache
];

self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          // Return cached version or fetch from network
          return response || fetch(event.request);
        })
    );
  }
});

// Handle push notifications
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body || 'New notification',
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    tag: data.tag || 'general',
    data: data.url || '/',
    actions: [
      {
        action: 'open',
        title: 'Open App'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Notification', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow(event.notification.data)
    );
  }
});`;
  };

  const saveToTurso = async (manifestData: ManifestData): Promise<string> => {
    const uuid = crypto.randomUUID();
    const fileName = `${uuid}-manifest.json`;
    
    try {
      const response = await fetch('/api/save-manifest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: uuid,
          filename: fileName,
          manifest_data: manifestData,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to save manifest: ${response.statusText}`);
      }

      const data = await response.json();
      return data.url || `${baseUrl}/api/manifests/${fileName}`;
      
    } catch (error) {
      console.error('Error saving to Turso:', error);
      const blob = new Blob([JSON.stringify(manifestData, null, 2)], { type: 'application/json' });
      return URL.createObjectURL(blob);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      
      if (formData.includeServiceWorker) {
        const swContent = generateServiceWorker();
        setServiceWorkerContent(swContent);
      }
      
      const url = await saveToTurso(manifestData);
      setManifestUrl(url);
      
      const blob = new Blob([manifestString], { type: 'application/json' });
      const urlBlob = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = urlBlob;
      a.download = 'manifest.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(urlBlob);
      
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

  const downloadServiceWorkerFile = () => {
    const blob = new Blob([serviceWorkerContent], { type: 'application/javascript' });
    const urlBlob = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = urlBlob;
    a.download = 'sw.js';
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
        <div style={{
          padding: '20px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-primary)',
          backgroundColor: 'var(--surface-secondary)'
        }}>
          <form onSubmit={handleSubmit}>
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
                        (e.target as HTMLImageElement).src = fallbackIcon;
                      }}
                    />
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{icon.name}</div>
                  </div>
                ))}
              </div>

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

            <div style={{ marginBottom: '20px' }}>
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
                  name="includeServiceWorker"
                  checked={formData.includeServiceWorker}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '4px',
                    opacity: isLoading ? 0.6 : 1
                  }}
                />
                <Cpu style={{ width: '16px', height: '16px' }} />
                Include Service Worker (Offline Support)
              </label>
              <p style={{
                color: 'var(--text-muted)',
                fontSize: '12px',
                marginTop: '4px',
                marginLeft: '24px'
              }}>
                Adds offline caching and push notification support
              </p>
            </div>

            {formData.includeServiceWorker && (
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
                    Service Worker URL
                  </label>
                  <input
                    type="text"
                    name="serviceWorkerUrl"
                    value={formData.serviceWorkerUrl}
                    onChange={handleInputChange}
                    placeholder="/sw.js"
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1.5px solid var(--border-primary)',
                      borderRadius: 'var(--radius-lg)',
                      backgroundColor: 'var(--surface-secondary)',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '14px',
                      opacity: isLoading ? 0.6 : 1
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
                    Service Worker Scope
                  </label>
                  <input
                    type="text"
                    name="serviceWorkerScope"
                    value={formData.serviceWorkerScope}
                    onChange={handleInputChange}
                    placeholder="/"
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1.5px solid var(--border-primary)',
                      borderRadius: 'var(--radius-lg)',
                      backgroundColor: 'var(--surface-secondary)',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '14px',
                      opacity: isLoading ? 0.6 : 1
                    }}
                  />
                </div>
              </div>
            )}

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

          {status === 'success' && manifestUrl && (
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

              <div style={{
                padding: '16px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-primary)',
                backgroundColor: 'var(--surface-primary)'
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
                  <Globe style={{ width: '14px', height: '14px' }} />
                  Your Hosted Manifest URL
                </h4>
                <div style={{
                  backgroundColor: 'var(--surface-secondary)',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  fontFamily: 'monospace',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  wordBreak: 'break-all',
                  marginBottom: '8px',
                  border: '1px solid var(--border-primary)'
                }}>
                  {manifestUrl}
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => copyToClipboard(manifestUrl, 'manifest-url')}
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
                    Copy URL
                  </button>
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
                    Download File
                  </button>
                </div>
              </div>

              {formData.includeServiceWorker && serviceWorkerContent && (
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
                    <Cpu style={{ width: '14px', height: '14px' }} />
                    Service Worker Generated
                  </h4>
                  <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: '13px',
                    lineHeight: '1.5',
                    margin: '0 0 12px 0'
                  }}>
                    Download the service worker file and place it in your app's root directory.
                  </p>
                  <button
                    onClick={downloadServiceWorkerFile}
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
                    Download Service Worker
                  </button>
                </div>
              )}

              <div style={{
                padding: '16px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-info)',
                backgroundColor: 'var(--surface-info)'
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
                  Use the hosted URL with Bubblewrap:
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
                  bubblewrap init --manifest {manifestUrl}
                </div>
              </div>

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
            <li>bubblewrap init --manifest YOUR_MANIFEST_URL</li>
            <li>bubblewrap build</li>
            <li>SHA-256</li>
            <li>keytool -list -v -keystore android.keystore</li>
          </ul>
        </div>
      </div>

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
          {copiedItem === 'manifest-url'
            ? 'Manifest URL copied!'
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
