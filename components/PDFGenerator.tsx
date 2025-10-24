"use client";

import { useRef, useState, useMemo, useEffect } from 'react';
import {
  FileText,
  Loader2,
  Download,
  Printer,
  FilePlus,
  Share2,
  X,
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

//debounce
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const pdfSizesInches = {
  Letter: [8.5, 11],
  Legal: [8.5, 14],
  Tabloid: [11, 17],
  A0: [33.1, 46.8],
  A1: [23.4, 33.1],
  A2: [16.5, 23.4],
  A3: [11.7, 16.5],
  A4: [8.3, 11.7],
  A5: [5.8, 8.3],
  A6: [4.1, 5.8],
};

interface PDFGeneratorProps {
  currentCode?: string;
}

interface PDFPayload {
  waitForTimeout: number;
  pdfOptions: {
    format: string;
    landscape: boolean;
    printBackground: boolean;
    displayHeaderFooter: boolean;
    margin: { top: string; right: string; bottom: string; left: string };
  };
  images: string[];
  url?: string;
}

export default function PDFGenerator({ currentCode = "" }: PDFGeneratorProps) {
  const [url, setUrl] = useState('https://example.com/');
  const [format, setFormat] = useState('A4');
  const [orientation, setOrientation] = useState('portrait');
  const [waitTime, setWaitTime] = useState(2000);
  const [printBackground, setPrintBackground] = useState(true);
  const [displayHeaderFooter, setDisplayHeaderFooter] = useState(false);
  const [status, setStatus] = useState('');
  const [statusColor, setStatusColor] = useState('var(--text-muted)');
  const [isLoading, setIsLoading] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [pdfInfo, setPdfInfo] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [urlError, setUrlError] = useState('');
  const [progress, setProgress] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const debouncedUrl = useDebounce(url, 500);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (isLoading) {
      interval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 500);
    } else {
      setProgress(0);
      if (interval) {
        clearInterval(interval);
      }
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isLoading]);

  const updateSizeInfo = () => {
    const size = pdfSizesInches[format as keyof typeof pdfSizesInches] || [8.3, 11.7];
    return orientation === 'portrait'
      ? `${size[0].toFixed(1)} × ${size[1].toFixed(1)} in`
      : `${size[1].toFixed(1)} × ${size[0].toFixed(1)} in`;
  };

  const sizeInfo = useMemo(() => updateSizeInfo(), [format, orientation]);

  const validateUrl = (inputUrl: string) => {
    if (!inputUrl || inputUrl === 'https://example.com/') {
      setUrlError('');
      return true;
    }
    
    try {
      const urlObj = new URL(inputUrl);
      if (!urlObj.protocol.startsWith('http')) {
        setUrlError('URL must start with http:// or https://');
        return false;
      }
      setUrlError('');
      return true;
    } catch {
      setUrlError('Please enter a valid URL');
      return false;
    }
  };

  const isValidUrl = (string: string) => {
    try { 
      new URL(string);
      return true; 
    } catch { 
      return false; 
    }
  };

  const handleImageFiles = (files: FileList) => {
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        toast.error(`Skipped non-image file: ${file.name}`);
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`Image too large: ${file.name} (max 10MB)`);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => setUploadedImages(prev => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleImageFiles(e.dataTransfer.files);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const generatePDF = async () => {
    if (url && url !== 'https://example.com/' && !isValidUrl(url)) {
      setStatus('Invalid URL. Please enter a valid one.');
      setStatusColor('var(--interactive-danger)');
      toast.error('Please enter a valid URL');
      return;
    }

    if ((!url || url === 'https://example.com/') && uploadedImages.length === 0) {
      setStatus('Please provide a URL or upload at least one image.');
      setStatusColor('var(--interactive-danger)');
      toast.error('Please provide a URL or upload images');
      return;
    }

    if (urlError) {
      setStatus('Please fix URL errors before generating PDF.');
      setStatusColor('var(--interactive-danger)');
      return;
    }

    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
      setPdfBlob(null);
    }

    setIsLoading(true);
    setStatus('');
    setPdfInfo('');
    setProgress(0);

    try {
      const payload: PDFPayload = {
        waitForTimeout: parseInt(String(waitTime), 10),
        pdfOptions: {
          format,
          landscape: orientation === 'landscape',
          printBackground,
          displayHeaderFooter,
          margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' },
        },
        images: uploadedImages,
      };

      if (url && url !== 'https://example.com/') {
        payload.url = url;
      }

      const res = await fetch('https://snapshot.jessejesse.workers.dev', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        if (res.status === 429) throw new Error('Rate limit exceeded. Please try again later.');
        if (res.status === 502) throw new Error('Service temporarily unavailable.');
        if (res.status === 413) throw new Error('File too large. Please reduce image sizes.');
        throw new Error(errorText || `HTTP Error ${res.status}`);
      }

      const blob = await res.blob();

      if (blob.size === 0) {
        throw new Error('Empty PDF generated - please try again');
      }

      setProgress(100);
      const newUrl = URL.createObjectURL(blob);
      setPdfUrl(newUrl);
      setPdfBlob(blob);
      setPdfInfo(`${format} | ${orientation} | ${(blob.size / 1024).toFixed(1)} KB | ${new Date().toLocaleDateString()}`);
      setStatus('PDF created successfully!');
      setStatusColor('var(--interactive-success)');
      toast.success('PDF generated successfully!');
    } catch (err: any) {
      console.error('PDF generation error:', err);
      setStatus(`Error: ${err.message}`);
      setStatusColor('var(--interactive-danger)');
      toast.error(`Failed to generate PDF: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const printPDF = async () => {
    if (!pdfBlob) {
      toast.error('No PDF available to print.');
      return;
    }

    setIsPrinting(true);
    try {
      const blobUrl = URL.createObjectURL(pdfBlob);
      const printWindow = window.open(blobUrl, '_blank');
      
      if (!printWindow) {
        toast.error('Pop-up blocked. Please allow pop-ups for printing.');
        return;
      }

      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
        printWindow.onafterprint = () => {
          URL.revokeObjectURL(blobUrl);
          setIsPrinting(false);
        };
      };
    } catch (error) {
      console.error('Print error:', error);
      toast.error('Print failed. Please try again.');
      setIsPrinting(false);
    }
  };

  const sharePDF = async () => {
    if (!pdfBlob) {
      toast.error('No PDF to share.');
      return;
    }

    setIsSharing(true);
    try {
      const file = new File([pdfBlob], 'webPDF.pdf', { type: 'application/pdf' });
      
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ 
          title: 'Web PDF', 
          text: 'Powered by pdf.JesseJesse.com', 
          files: [file] 
        });
        setStatus('PDF shared successfully!');
        setStatusColor('var(--interactive-success)');
        toast.success('PDF shared successfully!');
      } else {
        toast.error('Sharing not supported. Please download instead.');
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Share error:', err);
        setStatus(`Error sharing: ${err.message}`);
        setStatusColor('var(--interactive-danger)');
        toast.error('Sharing failed. Please try again.');
      }
    } finally {
      setIsSharing(false);
    }
  };

  const clearAll = () => {
    setUrl('https://example.com/');
    setUploadedImages([]);
    setUrlError('');
    setStatus('');
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
      setPdfBlob(null);
    }
    toast.success('Form cleared!');
  };


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

  return (
    <div style={{
      backgroundColor: 'var(--surface-card)',
      borderRadius: 'var(--radius-xl)',
      border: '1px solid var(--border-primary)',
      padding: '24px',
      fontFamily: 'var(--font-sans)'
    }}>
      <Toaster 
        position="top-center" 
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--surface-primary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-lg)',
            fontSize: '14px',
            fontFamily: 'var(--font-sans)'
          },
        }}
      />
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <FilePlus style={{ width: '24px', height: '24px', color: 'var(--interactive-accent)' }} />
        <h2 style={{ 
          fontSize: '20px', 
          fontWeight: 600, 
          color: 'var(--text-primary)',
          margin: 0
        }}>
          PDF Generator
        </h2>
        <span style={{
          fontSize: '12px',
          color: 'var(--text-muted)',
          backgroundColor: 'var(--surface-tertiary)',
          padding: '4px 8px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-primary)'
        }}>
          pdf.JesseJesse.com
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
        <div>
          <label style={getLabelStyle()}>Website URL</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{
              ...getInputStyle(),
              borderColor: urlError ? 'var(--interactive-danger)' : 'var(--border-primary)'
            }}
            placeholder="https://example.com"
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--interactive-accent)';
              e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = urlError ? 'var(--interactive-danger)' : 'var(--border-primary)';
              e.target.style.boxShadow = 'none';
            }}
          />
          {urlError && (
            <p style={{ 
              color: 'var(--interactive-danger)', 
              fontSize: '12px', 
              marginTop: '4px' 
            }}>
              {urlError}
            </p>
          )}
        </div>

     
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '16px' 
        }}>
          <div>
            <label style={getLabelStyle()}>PDF Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              style={getSelectStyle()}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--interactive-accent)';
                e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-primary)';
                e.target.style.boxShadow = 'none';
              }}
            >
              {Object.keys(pdfSizesInches).map((key) => (
                <option key={key} value={key}>{key}</option>
              ))}
            </select>
            <p style={{ 
              marginTop: '4px', 
              fontSize: '12px', 
              color: 'var(--text-muted)' 
            }}>
              Size: {sizeInfo}
            </p>
          </div>

          <div>
            <label style={getLabelStyle()}>Orientation</label>
            <select
              value={orientation}
              onChange={(e) => setOrientation(e.target.value)}
              style={getSelectStyle()}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--interactive-accent)';
                e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-primary)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </div>
        </div>

    
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '16px' 
        }}>
          <div>
            <label style={getLabelStyle()}>Wait Time (ms)</label>
            <input
              type="number"
              min="0"
              max="10000"
              value={waitTime}
              onChange={(e) => setWaitTime(Number(e.target.value))}
              style={getInputStyle()}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--interactive-accent)';
                e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-primary)';
                e.target.style.boxShadow = 'none';
              }}
            />
            <p style={{ 
              marginTop: '4px', 
              fontSize: '12px', 
              color: 'var(--text-muted)' 
            }}>
              Wait time before creating PDF
            </p>
          </div>
        </div>

   
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '16px',
          padding: '16px',
          backgroundColor: 'var(--surface-tertiary)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-primary)'
        }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={printBackground}
              onChange={(e) => setPrintBackground(e.target.checked)}
              style={{
                width: '16px',
                height: '16px',
                borderRadius: 'var(--radius-sm)',
                border: '1.5px solid var(--border-primary)',
                backgroundColor: printBackground ? 'var(--interactive-accent)' : 'var(--surface-primary)',
                cursor: 'pointer',
                transition: 'all var(--transition-normal)'
              }}
            />
            <span style={{ 
              fontSize: '14px', 
              color: 'var(--text-primary)',
              fontWeight: 500
            }}>
              Print Background
            </span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={displayHeaderFooter}
              onChange={(e) => setDisplayHeaderFooter(e.target.checked)}
              style={{
                width: '16px',
                height: '16px',
                borderRadius: 'var(--radius-sm)',
                border: '1.5px solid var(--border-primary)',
                backgroundColor: displayHeaderFooter ? 'var(--interactive-accent)' : 'var(--surface-primary)',
                cursor: 'pointer',
                transition: 'all var(--transition-normal)'
              }}
            />
            <span style={{ 
              fontSize: '14px', 
              color: 'var(--text-primary)',
              fontWeight: 500
            }}>
              Include Timestamp
            </span>
          </label>
        </div>

    
        <div>
          <label style={getLabelStyle()}>
            Upload Images {uploadedImages.length > 0 && `(${uploadedImages.length})`}
          </label>
          <div
            onClick={() => imageInputRef.current?.click()}
            onDragOver={onDragOver}
            onDrop={onDrop}
            style={{
              border: '2px dashed var(--interactive-accent)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all var(--transition-normal)',
              backgroundColor: 'var(--surface-primary)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--surface-tertiary)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--surface-primary)';
            }}
          >
            <p style={{ 
              color: 'var(--interactive-accent)', 
              fontWeight: 600,
              margin: 0,
              marginBottom: '4px'
            }}>
              Drop images here or click to upload
            </p>
            <p style={{ 
              color: 'var(--text-muted)', 
              fontSize: '14px',
              margin: 0
            }}>
              Supported formats: JPEG, PNG, WebP (10MB max)
            </p>
          </div>
          <input
            type="file"
            ref={imageInputRef}
            multiple
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => e.target.files && handleImageFiles(e.target.files)}
          />
          
          {uploadedImages.length > 0 && (
            <div style={{ marginTop: '12px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {uploadedImages.map((img, i) => (
                  <div key={i} style={{ position: 'relative' }}>
                    <img 
                      src={img} 
                      alt={`Uploaded ${i + 1}`} 
                      style={{
                        height: '80px',
                        width: '80px',
                        objectFit: 'cover',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-primary)'
                      }}
                    />
                    <button
                      onClick={() => removeImage(i)}
                      style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        backgroundColor: 'var(--interactive-danger)',
                        color: 'var(--text-inverse)',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        fontSize: '10px',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all var(--transition-normal)',
                        opacity: 0
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.opacity = '1';
                        e.currentTarget.style.transform = 'scale(1.1)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.opacity = '0';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                      aria-label="Remove image"
                    >
                      <X style={{ width: '12px', height: '12px' }} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setUploadedImages([])}
                style={{
                  color: 'var(--interactive-danger)',
                  fontSize: '12px',
                  marginTop: '8px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'color var(--transition-normal)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = 'var(--interactive-danger-hover)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = 'var(--interactive-danger)';
                }}
              >
                Remove all images
              </button>
            </div>
          )}
        </div>

    
        {isLoading && (
          <div style={{
            width: '100%',
            backgroundColor: 'var(--surface-tertiary)',
            borderRadius: '20px',
            height: '8px',
            overflow: 'hidden'
          }}>
            <div 
              style={{
                backgroundColor: 'var(--interactive-accent)',
                height: '100%',
                borderRadius: '20px',
                transition: 'width 0.3s ease',
                width: `${progress}%`
              }}
            />
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={generatePDF}
            disabled={isLoading}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px 20px',
              background: 'linear-gradient(135deg, var(--interactive-primary), var(--interactive-primary-hover))',
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
            onMouseOver={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(59, 130, 246, 0.3)';
              }
            }}
            onMouseOut={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          >
            {!isLoading ? (
              <>
                <FileText style={{ width: '20px', height: '20px' }} /> Create PDF
              </>
            ) : (
              <>
                <Loader2 style={{ width: '20px', height: '20px', animation: 'spin 1s linear infinite' }} /> 
                Generating... ({progress}%)
              </>
            )}
          </button>
          
          <button
            onClick={clearAll}
            disabled={isLoading}
            style={{
              padding: '12px 20px',
              background: 'transparent',
              color: 'var(--text-primary)',
              border: '1.5px solid var(--border-primary)',
              borderRadius: 'var(--radius-lg)',
              fontWeight: 600,
              fontSize: '14px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.5 : 1,
              transition: 'all var(--transition-normal)',
              fontFamily: 'inherit'
            }}
            onMouseOver={(e) => {
              if (!isLoading) {
                e.currentTarget.style.borderColor = 'var(--interactive-accent)';
                e.currentTarget.style.color = 'var(--interactive-accent)';
              }
            }}
            onMouseOut={(e) => {
              if (!isLoading) {
                e.currentTarget.style.borderColor = 'var(--border-primary)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }
            }}
          >
            Clear
          </button>
        </div>

   
        <p style={{
          fontSize: '14px',
          textAlign: 'center',
          margin: 0,
          color: statusColor
        }}>
          {status}
        </p>

    
        {pdfUrl && (
          <div style={{ marginTop: '24px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '12px' 
            }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: 600, 
                color: 'var(--text-primary)',
                margin: 0
              }}>
                PDF Preview
              </h3>
              <span style={{ 
                fontSize: '12px', 
                color: 'var(--text-muted)' 
              }}>
                {pdfInfo}
              </span>
            </div>
            <div style={{ 
              borderRadius: 'var(--radius-lg)', 
              border: '1px solid var(--border-primary)', 
              overflow: 'hidden',
              backgroundColor: 'white'
            }}>
              <iframe
                ref={iframeRef}
                src={pdfUrl}
                style={{ width: '100%', height: '384px', border: 'none' }}
                title="PDF Preview"
              />
            </div>
            
         
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '12px', 
              marginTop: '16px' 
            }}>
              <a
                download="webPDF.pdf"
                href={pdfUrl}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  background: 'linear-gradient(135deg, var(--interactive-success), var(--interactive-success-hover))',
                  color: 'var(--text-inverse)',
                  border: 'none',
                  borderRadius: 'var(--radius-lg)',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  transition: 'all var(--transition-normal)',
                  fontFamily: 'inherit'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(16, 185, 129, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Download style={{ width: '18px', height: '18px' }} /> Download
              </a>
              
              <button
                onClick={printPDF}
                disabled={isPrinting}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  background: 'linear-gradient(135deg, var(--interactive-accent), var(--interactive-accent-hover))',
                  color: 'var(--text-inverse)',
                  border: 'none',
                  borderRadius: 'var(--radius-lg)',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: isPrinting ? 'not-allowed' : 'pointer',
                  opacity: isPrinting ? 0.7 : 1,
                  transition: 'all var(--transition-normal)',
                  fontFamily: 'inherit'
                }}
                onMouseOver={(e) => {
                  if (!isPrinting) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(139, 92, 246, 0.3)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isPrinting) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                <Printer style={{ width: '18px', height: '18px' }} /> 
                {isPrinting ? 'Printing...' : 'Print'}
              </button>
              
              <button
                onClick={sharePDF}
                disabled={isSharing}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  background: 'transparent',
                  color: 'var(--text-primary)',
                  border: '1.5px solid var(--border-primary)',
                  borderRadius: 'var(--radius-lg)',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: isSharing ? 'not-allowed' : 'pointer',
                  opacity: isSharing ? 0.5 : 1,
                  transition: 'all var(--transition-normal)',
                  fontFamily: 'inherit'
                }}
                onMouseOver={(e) => {
                  if (!isSharing) {
                    e.currentTarget.style.borderColor = 'var(--interactive-accent)';
                    e.currentTarget.style.color = 'var(--interactive-accent)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isSharing) {
                    e.currentTarget.style.borderColor = 'var(--border-primary)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }
                }}
              >
                <Share2 style={{ width: '18px', height: '18px' }} />
                {isSharing ? 'Sharing...' : 'Share'}
              </button>
            </div>
          </div>
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
}
