"use client";

import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";

interface BuildPromptsProps {
  onPromptSelect: (prompt: string) => void;
}

const promptCategories = {
  "Layout & Structure": [
    "Create a responsive hero section with a call-to-action button",
    "Build a modern navigation bar with dropdown menus",
    "Design a footer with social media links and contact information",
    "Create a multi-column card layout for services",
    "Build a sidebar navigation for admin dashboards",
    "Design a full-screen landing page with smooth scrolling",
    "Create a grid-based portfolio layout",
    "Build a split-screen layout for comparison pages",
    "Design a sticky header that changes on scroll",
    "Create a masonry grid layout for image galleries",
  ],
  "UI Components": [
    "Create a modern button with hover effects",
    "Build a responsive card component with image and text",
    "Design a modal dialog with overlay",
    "Create a progress bar with animated filling",
    "Build a toggle switch component",
    "Design a breadcrumb navigation",
    "Create a pagination component",
    "Build a tooltip that appears on hover",
    "Design a loading spinner animation",
    "Create a notification toast component",
  ],
  "Forms & Inputs": [
    "Create a contact form with validation",
    "Build a login/signup form with social buttons",
    "Design a search bar with autocomplete",
    "Create a multi-step form wizard",
    "Build a file upload component with drag-and-drop",
    "Design a date picker with calendar",
    "Create a range slider for price filtering",
    "Build a color picker component",
    "Design a rating stars component",
    "Create a tags input field",
  ],
  "Data Display": [
    "Create a data table with sorting and filtering",
    "Build a chart/graph component for analytics",
    "Design a timeline for events or history",
    "Create a statistics dashboard with metrics",
    "Build a comparison table for pricing plans",
    "Design a user profile card with avatar",
    "Create a comment section with nested replies",
    "Build a product catalog with filters",
    "Design a weather widget",
    "Create a countdown timer",
  ],
  "Interactive Elements": [
    "Create an image carousel/slider",
    "Build an accordion FAQ section",
    "Design a tabbed interface",
    "Create a drag-and-drop sortable list",
    "Build a zoomable image gallery",
    "Design a video player with controls",
    "Create a map integration with markers",
    "Build a drawing canvas",
    "Design a quiz/interactive assessment",
    "Create a real-time chat interface",
  ],
  "E-commerce": [
    "Create a product card with add-to-cart",
    "Build a shopping cart sidebar",
    "Design a product quick view modal",
    "Create a wishlist/heart button",
    "Build a product filter sidebar",
    "Design a checkout process form",
    "Create a order tracking component",
    "Build a product review section",
    "Design a size/color selector",
    "Create a related products carousel",
  ],
  "Blog & Content": [
    "Create a blog post card layout",
    "Build a featured posts slider",
    "Design a newsletter signup section",
    "Create a author bio component",
    "Build a related articles section",
    "Design a table of contents sidebar",
    "Create a code syntax highlighter",
    "Build a social sharing buttons",
    "Design a comment form with preview",
    "Create a reading progress indicator",
  ],
};

export default function BuildPrompts({ onPromptSelect }: BuildPromptsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState<'right' | 'left'>('right');
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

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
        AI Prompts
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
                AI Builder Prompts
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
              Click any prompt to insert into AI chat
            </p>
          </div>
        </div>
      )}
    </div>
  );
}


