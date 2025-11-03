"use client"

import React, { useState } from 'react';
import { Download, Globe, Package, CheckCircle, AlertCircle, Upload, Key, Loader, Zap, FileJson, Building, Palette, Image, Copy, Cpu } from 'lucide-react';

interface APKBuilderProps {
  onInsert?: (code: string) => void;
}

export default function APKBuilder({ onInsert }: APKBuilderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showAPKBuilder, setShowAPKBuilder] = useState(false);

  const openAPKBuilder = () => {
    setIsLoading(true);
    setShowAPKBuilder(true);
    setIsLoading(false);
  };

  const closeAPKBuilder = () => {
    setShowAPKBuilder(false);
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
          <Package style={{ width: '24px', height: '24px', color: 'var(--text-inverse)' }} />
        </div>
        <h2 style={{
          fontSize: '20px',
          fontWeight: 600,
          color: 'var(--text-primary)',
          margin: 0
        }}>
          APK Builder
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
        <div style={{
          padding: '20px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-primary)',
          backgroundColor: 'var(--surface-secondary)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <Package style={{ width: '48px', height: '48px', color: 'var(--interactive-accent)', margin: '0 auto 16px' }} />
            <h3 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              margin: '0 0 8px 0'
            }}>
              Build Android APK
            </h3>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '14px',
              lineHeight: '1.5',
              margin: 0
            }}>
              Convert your website into a native Android APK with custom branding, icons, and themes.
            </p>
          </div>

          <div style={{
            backgroundColor: 'var(--surface-primary)',
            padding: '16px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-primary)',
            marginBottom: '20px'
          }}>
            <h4 style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              margin: '0 0 12px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Zap style={{ width: '16px', height: '16px' }} />
              Features
            </h4>
            <ul style={{
              color: 'var(--text-secondary)',
              fontSize: '13px',
              lineHeight: '1.6',
              margin: 0,
              paddingLeft: '20px'
            }}>
              <li>Custom app name and branding</li>
              <li>Multiple icon choices</li>
              <li>Theme color customization</li>
              <li>Real-time build progress</li>
              <li>GitHub Actions integration</li>
              <li>Direct APK download</li>
            </ul>
          </div>

          <button
            onClick={openAPKBuilder}
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
              cursor: 'pointer',
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
                Opening APK Builder...
              </>
            ) : (
              <>
                <Download style={{ width: '18px', height: '18px' }} />
                Open APK Builder
              </>
            )}
          </button>
        </div>

        {showAPKBuilder && (
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90vw',
            height: '90vh',
            backgroundColor: 'var(--surface-primary)',
            borderRadius: 'var(--radius-xl)',
            border: '2px solid var(--border-primary)',
            boxShadow: 'var(--shadow-2xl)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--border-primary)',
              backgroundColor: 'var(--surface-secondary)',
              borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Package style={{ width: '18px', height: '18px' }} />
                APK Builder - apk.jessejesse.com
              </h3>
              <button
                onClick={closeAPKBuilder}
                style={{
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-primary)',
                  backgroundColor: 'transparent',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: '13px',
                  fontWeight: 600,
                  transition: 'all var(--transition-normal)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                Close
              </button>
            </div>
            <iframe
              src="https://apk.jessejesse.com"
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                borderRadius: '0 0 var(--radius-xl) var(--radius-xl)'
              }}
              title="APK Builder"
              allow="camera; microphone; fullscreen"
            />
          </div>
        )}

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
            <li>Visit apk.jessejesse.com</li>
            <li>Enter your website URL</li>
            <li>Customize app name and icon</li>
            <li>Build and download APK</li>
            <li>Install on Android device</li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
