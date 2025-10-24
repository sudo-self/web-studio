"use client";

import { useId } from "react";

interface GridPatternProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  squares?: Array<[x: number, y: number]>;
  strokeDasharray?: string;
  className?: string;
  perspective?: boolean;
  color?: string;
  intensity?: "light" | "medium" | "dark";
  [key: string]: unknown;
}

export function GridPattern({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  strokeDasharray = "0",
  squares,
  className = "",
  perspective = true,
  color = "accent", 
  intensity = "medium",
  ...props
}: GridPatternProps) {
  const id = useId();


  const intensityConfig = {
    light: {
      patternOpacity: 0.4,
      gradientOpacity: 0.3,
      lineOpacity: 0.3,
      squareOpacity: 0.15,
      centerOpacity: 0.4
    },
    medium: {
      patternOpacity: 0.7,
      gradientOpacity: 0.5,
      lineOpacity: 0.5,
      squareOpacity: 0.25,
      centerOpacity: 0.6
    },
    dark: {
      patternOpacity: 0.9,
      gradientOpacity: 0.7,
      lineOpacity: 0.7,
      squareOpacity: 0.35,
      centerOpacity: 0.8
    }
  };

  const config = intensityConfig[intensity];

  const accentColor = "var(--interactive-accent, #0891b2)";
  const accentColorLight = "var(--interactive-accent-light, #0e7490)";
  
  return (
    <>
      {perspective && (
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div 
            className="absolute inset-0 transform-gpu" 
            style={{
              transform: 'perspective(1000px) rotateX(60deg) scale(1.2)',
              transformOrigin: 'center bottom',
            }}
          >
            <svg
              aria-hidden="true"
              className={`h-full w-full ${className}`}
              {...props}
            >
              <defs>
            
                <pattern
                  id={`${id}-pattern`}
                  width={width}
                  height={height}
                  patternUnits="userSpaceOnUse"
                  x={x}
                  y={y}
                >
                  <path
                    d={`M.5 ${height}V.5H${width}`}
                    fill="none"
                    stroke={accentColor}
                    strokeWidth="0.75"
                    strokeDasharray={strokeDasharray}
                    opacity="0.6"
                  />
                </pattern>

             
                <linearGradient id={`${id}-gradient`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={accentColor} stopOpacity={config.gradientOpacity * 0.8} />
                  <stop offset="50%" stopColor={accentColor} stopOpacity={config.gradientOpacity * 0.4} />
                  <stop offset="100%" stopColor={accentColor} stopOpacity={config.gradientOpacity * 0.1} />
                </linearGradient>

             
                <radialGradient id={`${id}-highlight`} cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={accentColor} stopOpacity="0.1" />
                  <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
                </radialGradient>
              </defs>
              
        
              <rect 
                width="100%" 
                height="100%" 
                fill={`url(#${id}-pattern)`} 
                opacity={config.patternOpacity}
              />
              
           
              <rect 
                width="100%" 
                height="100%" 
                fill={`url(#${id}-gradient)`} 
                opacity={config.gradientOpacity}
              />
              
     
              <g stroke={accentColor} strokeWidth="0.5" opacity={config.lineOpacity}>

                {Array.from({ length: Math.ceil(1000 / width) + 2 }).map((_, i) => (
                  <line
                    key={`v-${i}`}
                    x1={x + i * width}
                    y1="0"
                    x2={x + i * width}
                    y2="100%"
                  />
                ))}
            
                {Array.from({ length: Math.ceil(1000 / height) + 2 }).map((_, i) => (
                  <line
                    key={`h-${i}`}
                    x1="0"
                    y1={y + i * height}
                    x2="100%"
                    y2={y + i * height}
                  />
                ))}
              </g>

        
              {squares && (
                <g 
                  fill={accentColor} 
                  fillOpacity={config.squareOpacity * 0.3}
                  stroke={accentColorLight}
                  strokeWidth="1"
                  strokeOpacity={config.squareOpacity}
                >
                  {squares.map(([gridX, gridY]) => (
                    <rect
                      key={`${gridX}-${gridY}`}
                      width={width - 2}
                      height={height - 2}
                      x={gridX * width + 1}
                      y={gridY * height + 1}
                      rx="3"
                    />
                  ))}
                </g>
              )}

   
              <g>
                <circle
                  cx="50%"
                  cy="50%"
                  r="6"
                  fill={`url(#${id}-highlight)`}
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="3"
                  fill={accentColor}
                  stroke={accentColorLight}
                  strokeWidth="1.5"
                  opacity={config.centerOpacity}
                />
              </g>

           
              <g stroke={accentColor} strokeWidth="1" opacity={config.lineOpacity * 0.8}>
              
                <line x1="20" y1="10" x2="20" y2="30" />
                <line x1="10" y1="20" x2="30" y2="20" />
                
               
                <line x1="calc(100% - 20)" y1="10" x2="calc(100% - 20)" y2="30" />
                <line x1="calc(100% - 10)" y1="20" x2="calc(100% - 30)" y2="20" />
                

                <line x1="20" y1="calc(100% - 10)" x2="20" y2="calc(100% - 30)" />
                <line x1="10" y1="calc(100% - 20)" x2="30" y2="calc(100% - 20)" />
                
           
                <line x1="calc(100% - 20)" y1="calc(100% - 10)" x2="calc(100% - 20)" y2="calc(100% - 30)" />
                <line x1="calc(100% - 10)" y1="calc(100% - 20)" x2="calc(100% - 30)" y2="calc(100% - 20)" />
              </g>
            </svg>
          </div>
          
       
          <div 
            className="absolute bottom-0 left-0 right-0 h-48"
            style={{
              background: `linear-gradient(to top, 
                color-mix(in srgb, ${accentColor} 5%, transparent 95%) 0%,
                color-mix(in srgb, ${accentColor} 2%, transparent 98%) 50%,
                transparent 100%)`,
              transform: 'perspective(1000px) rotateX(60deg) scale(1.2)',
              transformOrigin: 'center bottom',
            }}
          />
        </div>
      )}
      
  
      {!perspective && (
        <svg
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 h-full w-full fill-gray-400/30 stroke-current -z-10 ${className}`}
          style={{ color: accentColor, opacity: 0.4 }}
          {...props}
        >
          <defs>
            <pattern
              id={id}
              width={width}
              height={height}
              patternUnits="userSpaceOnUse"
              x={x}
              y={y}
            >
              <path
                d={`M.5 ${height}V.5H${width}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray={strokeDasharray}
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
          {squares && (
            <svg x={x} y={y} className="overflow-visible">
              {squares.map(([x, y]) => (
                <rect
                  strokeWidth="0"
                  key={`${x}-${y}`}
                  width={width - 1}
                  height={height - 1}
                  x={x * width + 1}
                  y={y * height + 1}
                  fill={accentColor}
                  fillOpacity={0.2}
                />
              ))}
            </svg>
          )}
        </svg>
      )}
    </>
  );
}



