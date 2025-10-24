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

// Hook debounce
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

export default function PDFGenerator({ currentCode = "" }: PDFGeneratorProps) {
  const [url, setUrl] = useState('https://example.com/');
  const [format, setFormat] = useState('A4');
  const [orientation, setOrientation] = useState('portrait');
  const [waitTime, setWaitTime] = useState(2000);
  const [printBackground, setPrintBackground] = useState(true);
  const [displayHeaderFooter, setDisplayHeaderFooter] = useState(false);
  const [status, setStatus] = useState('');
  const [statusColor, setStatusColor] = useState('gray');
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
      setStatusColor('red');
      toast.error('Please enter a valid URL');
      return;
    }

    if ((!url || url === 'https://example.com/') && uploadedImages.length === 0) {
      setStatus('Please provide a URL or upload at least one image.');
      setStatusColor('red');
      toast.error('Please provide a URL or upload images');
      return;
    }

    if (urlError) {
      setStatus('Please fix URL errors before generating PDF.');
      setStatusColor('red');
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
      const payload = {
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
      setStatusColor('green');
      toast.success('PDF generated successfully!');
    } catch (err: any) {
      console.error('PDF generation error:', err);
      setStatus(`Error: ${err.message}`);
      setStatusColor('red');
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
        setStatusColor('green');
        toast.success('PDF shared successfully!');
      } else {
        toast.error('Sharing not supported. Please download instead.');
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Share error:', err);
        setStatus(`Error sharing: ${err.message}`);
        setStatusColor('red');
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

  return (
    <div className="pdf-generator bg-component-bg rounded-xl border border-panel-border p-6">
      <Toaster 
        position="top-center" 
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--surface-primary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-primary)',
          },
        }}
      />
      
      <div className="flex items-center gap-3 mb-6">
        <FilePlus className="w-6 h-6 text-accent-color" />
        <h2 className="text-xl font-semibold text-text-primary">PDF Generator</h2>
        <span className="text-xs text-text-muted bg-surface-tertiary px-2 py-1 rounded border border-panel-border">
          pdf.JesseJesse.com
        </span>
      </div>

      <div className="space-y-4">
        {/* URL Input */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">Website URL</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className={`w-full p-3 rounded-lg bg-component-bg text-text-primary border ${
              urlError ? 'border-red-500' : 'border-panel-border'
            } focus:outline-none focus:ring-2 focus:ring-accent-color focus:border-transparent transition-all`}
            placeholder="https://example.com"
          />
          {urlError && <p className="text-red-400 text-xs mt-1">{urlError}</p>}
        </div>

        {/* PDF Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">PDF Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full p-3 rounded-lg bg-component-bg text-text-primary border border-panel-border focus:outline-none focus:ring-2 focus:ring-accent-color focus:border-transparent transition-all"
            >
              {Object.keys(pdfSizesInches).map((key) => (
                <option key={key} value={key}>{key}</option>
              ))}
            </select>
            <p className="mt-1 text-xs text-text-muted">Size: {sizeInfo}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Orientation</label>
            <select
              value={orientation}
              onChange={(e) => setOrientation(e.target.value)}
              className="w-full p-3 rounded-lg bg-component-bg text-text-primary border border-panel-border focus:outline-none focus:ring-2 focus:ring-accent-color focus:border-transparent transition-all"
            >
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </div>
        </div>

        {/* Advanced Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Wait Time (ms)</label>
            <input
              type="number"
              min="0"
              max="10000"
              value={waitTime}
              onChange={(e) => setWaitTime(Number(e.target.value))}
              className="w-full p-3 rounded-lg bg-component-bg text-text-primary border border-panel-border focus:outline-none focus:ring-2 focus:ring-accent-color focus:border-transparent transition-all"
            />
            <p className="mt-1 text-xs text-text-muted">Wait time before creating PDF</p>
          </div>
        </div>

        {/* Checkboxes */}
        <div className="flex flex-wrap items-center gap-4 p-4 bg-surface-tertiary rounded-lg">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={printBackground}
              onChange={(e) => setPrintBackground(e.target.checked)}
              className="rounded border-panel-border bg-component-bg text-accent-color focus:ring-accent-color focus:ring-2"
            />
            <span className="text-sm text-text-primary">Print Background</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={displayHeaderFooter}
              onChange={(e) => setDisplayHeaderFooter(e.target.checked)}
              className="rounded border-panel-border bg-component-bg text-accent-color focus:ring-accent-color focus:ring-2"
            />
            <span className="text-sm text-text-primary">Include Timestamp</span>
          </label>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Upload Images {uploadedImages.length > 0 && `(${uploadedImages.length})`}
          </label>
          <div
            onClick={() => imageInputRef.current?.click()}
            onDragOver={onDragOver}
            onDrop={onDrop}
            className="border-2 border-dashed border-accent-color rounded-lg p-6 text-center cursor-pointer hover:bg-surface-tertiary transition-colors"
          >
            <p className="text-accent-color font-medium">Drop images here or click to upload</p>
            <p className="text-text-muted text-sm mt-1">Supported formats: JPEG, PNG, WebP (10MB max)</p>
          </div>
          <input
            type="file"
            ref={imageInputRef}
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files && handleImageFiles(e.target.files)}
          />
          
          {uploadedImages.length > 0 && (
            <div className="mt-3">
              <div className="flex flex-wrap gap-2">
                {uploadedImages.map((img, i) => (
                  <div key={i} className="relative group">
                    <img 
                      src={img} 
                      alt={`Uploaded ${i + 1}`} 
                      className="h-20 w-20 object-cover rounded border border-panel-border"
                    />
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      aria-label="Remove image"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setUploadedImages([])}
                className="text-red-400 text-xs mt-2 hover:text-red-300 transition-colors"
              >
                Remove all images
              </button>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {isLoading && (
          <div className="w-full bg-surface-tertiary rounded-full h-2">
            <div 
              className="bg-accent-color h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={generatePDF}
            disabled={isLoading}
            className="btn btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {!isLoading ? (
              <>
                <FileText className="w-5 h-5" /> Create PDF
              </>
            ) : (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Generating... ({progress}%)
              </>
            )}
          </button>
          
          <button
            onClick={clearAll}
            disabled={isLoading}
            className="btn btn-outline px-4 disabled:opacity-50"
          >
            Clear
          </button>
        </div>

        {/* Status */}
        <p className={`text-sm text-center ${
          statusColor === 'green' ? 'text-green-400' :
          statusColor === 'red' ? 'text-red-400' : 'text-text-muted'
        }`}>
          {status}
        </p>

        {/* PDF Preview */}
        {pdfUrl && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium text-text-primary">PDF Preview</h3>
              <span className="text-xs text-text-muted">{pdfInfo}</span>
            </div>
            <div className="rounded-lg border border-panel-border overflow-hidden bg-white">
              <iframe
                ref={iframeRef}
                src={pdfUrl}
                className="w-full h-96"
                style={{ border: 'none' }}
                title="PDF Preview"
              />
            </div>
            
            {/* Action Buttons for PDF */}
            <div className="flex flex-wrap gap-3 mt-4">
              <a
                download="webPDF.pdf"
                href={pdfUrl}
                className="btn btn-success flex items-center gap-2"
              >
                <Download className="w-5 h-5" /> Download
              </a>
              
              <button
                onClick={printPDF}
                disabled={isPrinting}
                className="btn btn-accent flex items-center gap-2 disabled:opacity-50"
              >
                <Printer className="w-5 h-5" /> 
                {isPrinting ? 'Printing...' : 'Print'}
              </button>
              
              <button
                onClick={sharePDF}
                disabled={isSharing}
                className="btn btn-outline flex items-center gap-2 disabled:opacity-50"
              >
                <Share2 className="w-5 h-5" />
                {isSharing ? 'Sharing...' : 'Share'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
