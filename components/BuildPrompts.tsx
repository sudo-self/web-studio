"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Lightbulb } from "lucide-react";

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
  const [dropdownDirection, setDropdownDirection] = useState<'down' | 'up'>('down');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handlePromptClick = (prompt: string) => {
    onPromptSelect(prompt);
    setIsOpen(false);
  };

  
    useEffect(() => {
      const calculateDropdownDirection = () => {
        if (buttonRef.current) {
          const buttonRect = buttonRef.current.getBoundingClientRect();
          const spaceBelow = window.innerHeight - buttonRect.bottom;
          
        
          if (buttonRect.top > window.innerHeight / 2) {
            setDropdownDirection('up');
          } else {
            setDropdownDirection('down');
          }
        }
      };

      if (isOpen) {
        calculateDropdownDirection();
        window.addEventListener('resize', calculateDropdownDirection);
        return () => window.removeEventListener('resize', calculateDropdownDirection);
      }
    }, [isOpen]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-outline btn-sm flex items-center gap-2"
      >
        <Lightbulb size={14} />
        Prompts
        <ChevronDown
          size={14}
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className={`absolute left-0 w-96 bg-black border border-border-primary rounded-lg shadow-lg z-50 flex flex-col max-h-[80vh] ${
            dropdownDirection === 'down' 
              ? 'top-full mt-2' 
              : 'bottom-full mb-2'
          }`}
        >
          <div className="p-4 flex-shrink-0 border-b border-border-primary">
            <h4 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
              <Lightbulb size={16} />
              AI Builder Prompts
            </h4>
          </div>
          <div className="overflow-y-auto flex-1 p-4 space-y-4">
            {Object.entries(promptCategories).map(([category, prompts]) => (
              <div key={category}>
                <h5 className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-2">
                  {category}
                </h5>
                <div className="space-y-1">
                  {prompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handlePromptClick(prompt)}
                      className="w-full text-left p-2 text-sm text-text-primary hover:bg-surface-secondary rounded transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


