// /components/StatusBar.tsx

export default function StatusBar() {
  return (
    <div className="status-bar">
      {/* Left Section - AI Web Studio */}
      <a
        href="https://studio.jessejesse.com"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-surface-tertiary border border-transparent hover:border-interactive-accent/30"
      >
        <div className="relative">
          <div className="w-2 h-2 bg-interactive-accent rounded-full animate-ping absolute -top-0.5 -right-0.5" />
          <div className="w-8 h-8 bg-gradient-to-br from-interactive-accent to-interactive-accent-hover rounded-lg flex items-center justify-center text-white text-lg font-bold shadow-lg">
            AI
          </div>
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-text-primary group-hover:text-interactive-accent transition-colors">
            Web Studio
          </span>
          <span className="text-xs text-text-tertiary group-hover:text-text-secondary transition-colors">
            studio.JesseJesse.com
          </span>
        </div>
      </a>

      {/* Center Section - Colorado Flag */}
      <div className="group flex items-center gap-3 px-6 py-2 rounded-lg transition-all duration-300 hover:bg-surface-tertiary border border-transparent hover:border-interactive-accent/30 cursor-default">
        <img 
          src="./colorado.svg" 
          alt="Colorado" 
          className="w-10 h-10 transition-all duration-300 group-hover:scale-110 group-hover:brightness-110"
        />
        <div className="flex flex-col">
          <span className="font-bold text-text-primary group-hover:text-interactive-accent transition-colors tracking-wide">
            &#9825;
          </span>
          <span className="text-xs text-text-tertiary group-hover:text-text-secondary transition-colors">
            JesseJesse.com
          </span>
        </div>
      </div>

      {/* Right Section - GitHub */}
      <a
        href="https://github.com/sudo-self/web-studio"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-surface-tertiary border border-transparent hover:border-interactive-accent/30"
      >
        <div className="flex flex-col items-end">
          <span className="font-semibold text-text-primary group-hover:text-interactive-accent transition-colors">
            GitHub
          </span>
          <span className="text-xs text-text-tertiary group-hover:text-text-secondary transition-colors flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            @sudo-self
          </span>
        </div>
        <div className="w-8 h-8 bg-surface-primary rounded-lg flex items-center justify-center border border-border-primary group-hover:border-interactive-accent/50 transition-colors">
          <svg className="w-5 h-5 text-text-tertiary group-hover:text-interactive-accent transition-colors" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        </div>
      </a>

      <style jsx>{`
        .status-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 64px;
          background: var(--surface-primary);
          border-top: 1px solid var(--border-primary);
          padding: 0 24px;
          position: relative;
          z-index: 10;
        }

        .status-bar::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--interactive-accent), transparent);
          opacity: 0.6;
        }

        @media (max-width: 768px) {
          .status-bar {
            padding: 0 16px;
            height: 56px;
          }
          
          .status-bar > * {
            padding: 8px 12px;
          }
          
          .status-bar span {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
}


