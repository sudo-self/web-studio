"use client";

import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";

interface BuildPromptsProps {
  onPromptSelect: (prompt: string) => void;
  framework: string; // Add framework prop
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
  const [popoverPosition, setPopoverPosition] = useState<'right' | 'left'>('right');
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Choose prompts based on framework
  const promptCategories = framework === "react" ? reactPromptCategories : htmlPromptCategories;

  const handlePromptClick = (prompt: string) => {
    onPromptSelect(prompt);
    setIsOpen(false);
  };

  useEffect(() => {
    const calculatePopoverPosition = () => {
      if (buttonRef.current && popoverRef.current) {
        const buttonRect = buttonRef.current.getBoundingClientRect();
        const popoverWidth = 400;
        const spaceOnRight = window.innerWidth - buttonRect.right;
        
        if (spaceOnRight < popoverWidth && buttonRect.left > popoverWidth) {
          setPopoverPosition('left');
        } else {
          setPopoverPosition('right');
        }
      }
    };

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
      calculatePopoverPosition();
      window.addEventListener('resize', calculatePopoverPosition);
      document.addEventListener('mousedown', handleClickOutside);
      
      return () => {
        window.removeEventListener('resize', calculatePopoverPosition);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-outline btn-sm flex items-center gap-2"
      >
        {framework === "react" ? "React Prompts" : "HTML Prompts"}
      </button>

      {isOpen && (
        <div
          ref={popoverRef}
          className={`
            absolute z-50 w-96 bg-black border border-border-primary 
            rounded-xl shadow-xl flex flex-col max-h-[80vh] transition-all duration-200
            ${popoverPosition === 'right' 
              ? 'left-full ml-2' 
              : 'right-full mr-2'
            }
            ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
          `}
          style={{
            top: '50%',
            transform: 'translateY(-50%)'
          }}
        >
          <div className="flex items-center justify-between p-4 border-b border-border-primary bg-black rounded-t-xl">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-text-primary">
                {framework === "react" ? "React" : "HTML"} Builder Prompts
              </h4>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Close prompts"
            >
              <X size={16} className="text-text-secondary" />
            </button>
          </div>

          <div className="overflow-y-auto flex-1 p-4 space-y-4 bg-black">
            {Object.entries(promptCategories).map(([category, prompts]) => (
              <div key={category} className="space-y-2">
                <h5 className="text-xs font-medium text-interactive-accent uppercase tracking-wide">
                  {category}
                </h5>
                <div className="space-y-1">
                  {prompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handlePromptClick(prompt)}
                      className="w-full text-left p-3 text-sm text-text-primary hover:bg-gray-800 rounded-lg border border-transparent hover:border-border-primary transition-all duration-150"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-border-primary bg-black rounded-b-xl">
            <p className="text-xs text-text-muted text-center">
              {framework === "react"
                ? "Click any prompt to generate React component"
                : "Click any prompt to generate HTML"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}


