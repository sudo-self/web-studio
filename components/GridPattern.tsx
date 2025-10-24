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
  ...props
}: GridPatternProps) {
  const id = useId();

  return (
    <>

      {perspective && (
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 transform-gpu" style={{
            transform: 'perspective(1000px) rotateX(60deg) scale(1.2)',
            transformOrigin: 'center bottom',
          }}>
            <svg
              aria-hidden="true"
              className="h-full w-full fill-gray-400/20 stroke-gray-500/30"
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
                    stroke="currentColor"
                    strokeWidth="0.5"
                    strokeDasharray={strokeDasharray}
                  />
                </pattern>
                <linearGradient id={`${id}-gradient`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgb(107 114 128 / 0.3)" />
                  <stop offset="50%" stopColor="rgb(107 114 128 / 0.15)" />
                  <stop offset="100%" stopColor="rgb(107 114 128 / 0.05)" />
                </linearGradient>
              </defs>
              
         
              <rect 
                width="100%" 
                height="100%" 
                fill={`url(#${id}-pattern})`} 
                opacity="0.8"
              />
              
     
              <rect 
                width="100%" 
                height="100%" 
                fill={`url(#${id}-gradient})`} 
                opacity="0.6"
              />
              
          
              <g stroke="rgb(107 114 128 / 0.4)" strokeWidth="0.25">
               
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
                <g fill="rgb(107 114 128 / 0.1)" stroke="rgb(107 114 128 / 0.2)" strokeWidth="0.5">
                  {squares.map(([gridX, gridY]) => (
                    <rect
                      key={`${gridX}-${gridY}`}
                      width={width - 2}
                      height={height - 2}
                      x={gridX * width + 1}
                      y={gridY * height + 1}
                      rx="2"
                    />
                  ))}
                </g>
              )}

              <circle
                cx="50%"
                cy="50%"
                r="4"
                fill="rgb(107 114 128 / 0.4)"
                stroke="rgb(107 114 128 / 0.6)"
                strokeWidth="1"
              />
            </svg>
          </div>
          
  
          <div 
            className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/10 to-transparent"
            style={{
              transform: 'perspective(1000px) rotateX(60deg) scale(1.2)',
              transformOrigin: 'center bottom',
            }}
          />
        </div>
      )}
      

      {!perspective && (
        <svg
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 h-full w-full fill-gray-400/10 stroke-neutral-700 -z-10 ${className}`}
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
                />
              ))}
            </svg>
          )}
        </svg>
      )}
    </>
  );
}



