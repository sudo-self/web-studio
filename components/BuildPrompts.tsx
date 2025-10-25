"use client";

import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";

interface BuildPromptsProps {
  onPromptSelect: (prompt: string) => void;
  framework: string;
}

const htmlPromptCategories = {
  "Layout & Structure": [
    "Create a responsive hero section with a call-to-action button",
    "Build a modern navigation bar with dropdown menus",
    "Design a footer with social media links and contact information",
    "Create a multi-column card layout for services",
    "Build a sidebar navigation for admin dashboards",
    "Design a full-screen landing page with smooth scrolling",
  ],
  "UI Components": [
    "Create a modern button with hover effects",
    "Build a responsive card component with image and text",
    "Design a modal dialog with overlay",
    "Create a progress bar with animated filling",
    "Build a toggle switch component",
  ],
  "Forms & Inputs": [
    "Create a contact form with validation",
    "Build a login/signup form with social buttons",
    "Design a search bar with autocomplete",
    "Create a multi-step form wizard",
  ],
};

const reactPromptCategories = {
  "Interactive Components": [
    "Create a counter with increment, decrement, and reset buttons",
    "Build a todo list with add, complete, and delete functionality",
    "Design a tabs component with 3 tabs showing different content",
    "Create an accordion FAQ with expand/collapse animation",
    "Build a modal that opens and closes with backdrop",
  ],
  "Forms & Validation": [
    "Create a contact form with name, email, message fields and validation",
    "Build a login form with email/password and remember me checkbox",
    "Design a registration form with password strength indicator",
    "Create a search input with live filtering results",
  ],
  "Data Display": [
    "Create a data table with sorting by column headers",
    "Build a card grid showing 6 products with images and prices",
    "Design a timeline showing company milestones",
    "Create a statistics dashboard with 4 metric cards",
  ],
  "Interactive Lists": [
    "Create a shopping cart with add/remove items and total price",
    "Build a todo list with filtering (all, active, completed)",
    "Design a comment section with nested replies",
    "Create a product list with quantity increment/decrement",
  ],
  "UI Patterns": [
    "Create a stepper/wizard component with 3 steps",
    "Build a image gallery with lightbox on click",
    "Design a dropdown menu that opens on click",
    "Create a notification toast that auto-dismisses",
  ],
};

export default function BuildPrompts({ onPromptSelect, framework }: BuildPromptsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const promptCategories = framework === "react" ? reactPromptCategories : htmlPromptCategories;

  const handlePromptClick = (prompt: string) => {
    onPromptSelect(prompt);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  return (
    <div className="relative">
      {/* Button matching Badge Builder style */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 16px',
          borderRadius: 'var(--radius-lg)',
          fontWeight: 600,
          fontSize: '14px',
          border: '1px solid var(--border-primary)',
          backgroundColor: 'var(--surface-primary)',
          color: 'var(--text-primary)',
          cursor: 'pointer',
          fontFamily: 'var(--font-sans)',
          transition: 'all var(--transition-normal)',
          width: '100%',
          justifyContent: 'center'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--surface-secondary)';
          e.currentTarget.style.borderColor = 'var(--interactive-accent)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--surface-primary)';
          e.currentTarget.style.borderColor = 'var(--border-primary)';
        }}
      >
        <img
          src={framework === "react" ? "./react.svg" : "./html5.svg"}
          alt={`${framework} icon`}
          style={{ width: '16px', height: '16px' }}
        />
        {framework === "react" ? "Prompts" : "Prompts"}
      </button>

      {isOpen && (
        <div
          ref={popoverRef}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: '8px',
            width: '400px',
            backgroundColor: 'var(--surface-card)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-primary)',
            boxShadow: 'var(--shadow-xl)',
            zIndex: 50,
            fontFamily: 'var(--font-sans)'
          }}
        >
          {/* Header with SVG icon */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px',
            borderBottom: '1px solid var(--border-primary)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-xl)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <img
                      src={framework === "react" ? "./react.svg" : "./html5.svg"}
                      alt={`${framework} icon`}
                      style={{ width: '25px', height: '25px' }}
                    />
                  </div>
              <div>
                <p style={{
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                  margin: 0
                }}>
                  Click any prompt to have AI generate the code
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                padding: '8px',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                backgroundColor: 'transparent',
                color: 'var(--text-tertiary)',
                cursor: 'pointer',
                transition: 'all var(--transition-normal)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--surface-tertiary)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--text-tertiary)';
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Content Area */}
          <div style={{
            maxHeight: '400px',
            overflowY: 'auto',
            padding: '20px'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {Object.entries(promptCategories).map(([category, prompts]) => (
                <div key={category} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <h4 style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'var(--interactive-accent)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    margin: 0
                  }}>
                    {category}
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {prompts.map((prompt, index) => (
                      <button
                        key={index}
                        onClick={() => handlePromptClick(prompt)}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '12px 16px',
                          borderRadius: 'var(--radius-lg)',
                          border: '1px solid var(--border-primary)',
                          backgroundColor: 'var(--surface-primary)',
                          color: 'var(--text-primary)',
                          fontSize: '14px',
                          cursor: 'pointer',
                          transition: 'all var(--transition-normal)',
                          fontFamily: 'inherit'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--surface-secondary)';
                          e.currentTarget.style.borderColor = 'var(--interactive-accent)';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--surface-primary)';
                          e.currentTarget.style.borderColor = 'var(--border-primary)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div style={{
            padding: '16px 20px',
            borderTop: '1px solid var(--border-primary)',
            backgroundColor: 'var(--surface-secondary)',
            borderBottomLeftRadius: 'var(--radius-xl)',
            borderBottomRightRadius: 'var(--radius-xl)'
          }}>
            <p style={{
              fontSize: '12px',
              color: 'var(--text-muted)',
              textAlign: 'center',
              margin: 0
            }}>
              {framework === "react"
                ? "Prompts will generate React components with inline styles"
                : "Prompts will generate responsive HTML with inline CSS"
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
}


