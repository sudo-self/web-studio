"use client";

import { useState, useMemo, useEffect } from "react";
import { ReactElement } from "react";
import {
  FileText,
  Sparkles,
  Info,
  Wrench,
  Phone,
  SquareStack,
  CreditCard,
  Image,
  Search,
  Tag,
  Users,
  Stars,
  Type,
  Bot,
  Settings,
  Navigation,
  Sidebar,
  BarChart3,
  Mail,
  HelpCircle,
  TrendingUp,
  Clock,
  Star,
  StarOff,
  Eye,
  X,
} from "lucide-react";

import { useSettings } from "@/contexts/SettingsContext";

type AiMode = "response" | "chat";
type ChatRole = "user" | "assistant";

interface ComponentInfo {
  code: string;
  description: string;
  tags: string[];
}

interface ComponentCategories {
  [key: string]: string[];
}

interface ComponentsPanelProps {
  onInsert: (code: string) => void;
  onAiInsert: (code: string) => void;
  onOpenSettings: () => void;
  onResizeStart?: (e: React.MouseEvent) => void;
}

interface ChatMessage {
  role: ChatRole;
  content: string;
}

const components: { [key: string]: ComponentInfo } = {
  header: {
    code: `<!-- Header Component -->
<header style="background-color: #333; color: white; padding: 1rem;">
  <div style="display: flex; justify-content: space-between; align-items: center; max-width: 1200px; margin: 0 auto;">
    <h1 style="margin: 0;">My Website</h1>
    <nav>
      <a href="#" style="color: white; margin: 0 10px; text-decoration: none;">Home</a>
      <a href="#" style="color: white; margin: 0 10px; text-decoration: none;">About</a>
      <a href="#" style="color: white; margin: 0 10px; text-decoration: none;">Contact</a>
    </nav>
  </div>
</header>`,
    description: "Website header with navigation",
    tags: ["layout", "navigation", "header"]
  },

  hero: {
    code: `<!-- Hero Section -->
<section style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 4rem 2rem; text-align: center;">
  <div style="max-width: 800px; margin: 0 auto;">
    <h2 style="font-size: 2.5rem; margin-bottom: 1rem;">Welcome to Our Website</h2>
    <p style="font-size: 1.2rem; margin-bottom: 2rem;">We create amazing digital experiences</p>
    <button style="background: white; color: #333; border: none; padding: 12px 30px; font-size: 1rem; border-radius: 5px; cursor: pointer;">Get Started</button>
  </div>
</section>`,
    description: "Hero section with call-to-action",
    tags: ["layout", "hero", "cta"]
  },

  about: {
    code: `<!-- About Section -->
<section style="padding: 4rem 2rem; background-color: #f9f9f9;">
  <div style="max-width: 800px; margin: 0 auto;">
    <h2 style="text-align: center; margin-bottom: 2rem; color: #333;">About Us</h2>
    <p style="line-height: 1.6; margin-bottom: 1rem; color: #666;">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
    <p style="line-height: 1.6; color: #666;">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
  </div>
</section>`,
    description: "About section with company information",
    tags: ["layout", "content", "about"]
  },

  services: {
    code: `<!-- Services Section -->
<section style="padding: 4rem 2rem; background-color: white;">
  <div style="max-width: 1200px; margin: 0 auto;">
    <h2 style="text-align: center; margin-bottom: 3rem; color: #333;">Our Services</h2>
    <div style="display: flex; justify-content: space-around; flex-wrap: wrap; gap: 2rem;">
      <div style="flex: 1; min-width: 250px; background: #f9f9f9; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h3 style="color: #333;">Web Design</h3>
        <p style="color: #666;">Beautiful and responsive web designs.</p>
      </div>
      <div style="flex: 1; min-width: 250px; background: #f9f9f9; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h3 style="color: #333;">Development</h3>
        <p style="color: #666;">Custom web applications.</p>
      </div>
    </div>
  </div>
</section>`,
    description: "Services showcase section",
    tags: ["layout", "content", "services"]
  },

  contact: {
    code: `<!-- Contact Form -->
<section style="padding: 4rem 2rem; background-color: #f9f9f9;">
  <div style="max-width: 600px; margin: 0 auto;">
    <h2 style="text-align: center; margin-bottom: 2rem; color: #333;">Contact Us</h2>
    <form style="background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 5px; color: #333;">Name</label>
        <input type="text" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
      </div>
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 5px; color: #333;">Email</label>
        <input type="email" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
      </div>
      <button type="submit" style="background: #333; color: white; border: none; padding: 12px 30px; border-radius: 4px; cursor: pointer; width: 100%;">Send Message</button>
    </form>
  </div>
</section>`,
    description: "Contact form section",
    tags: ["forms", "contact"]
  },

  footer: {
    code: `<!-- Footer -->
<footer style="background-color: #333; color: white; padding: 2rem; text-align: center;">
  <div style="max-width: 1200px; margin: 0 auto;">
    <p>&copy; 2024 My Website. All rights reserved.</p>
    <div style="margin-top: 1rem;">
      <a href="#" style="color: white; margin: 0 10px; text-decoration: none;">Privacy Policy</a>
      <a href="#" style="color: white; margin: 0 10px; text-decoration: none;">Terms of Service</a>
    </div>
  </div>
</footer>`,
    description: "Website footer",
    tags: ["layout", "footer"]
  },

  card: {
    code: `<!-- Card Component -->
<div style="background: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden; max-width: 300px; margin: 0 auto;">
  <img src="https://studio-website-builder.vercel.app/icon-512.png" alt="Card Image" style="width: 100%; height: auto;">
  <div style="padding: 1.5rem;">
    <h3 style="margin-bottom: 0.5rem; color: #333;">Card Title</h3>
    <p style="color: #666; margin-bottom: 1rem;">This is a sample card with example content.</p>
    <button style="background: #333; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Learn More</button>
  </div>
</div>`,
    description: "Card component with image and text",
    tags: ["ui", "card", "content"]
  },

  gallery: {
    code: `<!-- Image Gallery -->
<section style="padding: 2rem; background-color: white;">
  <div style="max-width: 1200px; margin: 0 auto;">
    <h2 style="text-align: center; margin-bottom: 2rem; color: #333;">Image Gallery</h2>
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem;">
      <img src="https://studio-website-builder.vercel.app/icon-512.png" alt="Gallery Image" style="width: 100%; height: auto; border-radius: 8px;">
      <img src="https://studio-website-builder.vercel.app/icon-512.png" alt="Gallery Image" style="width: 100%; height: auto; border-radius: 8px;">
    </div>
  </div>
</section>`,
    description: "Image gallery grid",
    tags: ["content", "gallery", "images"]
  },

  seo: {
    code: `<!-- SEO Meta Tags -->
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Website Title</title>
  <meta name="description" content="Your website description for SEO">
  <meta name="keywords" content="your, keywords, here">
  <meta name="author" content="Your Name">
  <meta property="og:title" content="Your Website Title">
  <meta property="og:description" content="Your website description">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://yourwebsite.com">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Your Website Title">
  <meta name="twitter:description" content="Your website description">
  <link rel="canonical" href="https://yourwebsite.com">
</head>`,
    description: "SEO meta tags for head section",
    tags: ["seo", "meta", "head"]
  },

  "seo-schema": {
    code: `<!-- Schema.org Structured Data -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Your Website Name",
  "url": "https://yourwebsite.com",
  "description": "Your website description",
  "publisher": {
    "@type": "Organization",
    "name": "Your Organization"
  }
}
</script>`,
    description: "Schema.org structured data",
    tags: ["seo", "schema", "structured-data"]
  },

  "social-icons": {
    code: `<!-- Social Media Icons with Font Awesome -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
<div style="display: flex; gap: 15px; justify-content: center; padding: 2rem;">
  <a href="#" style="color: #333; text-decoration: none; font-size: 24px;">
    <i class="fab fa-facebook"></i>
  </a>
  <a href="#" style="color: #333; text-decoration: none; font-size: 24px;">
    <i class="fab fa-twitter"></i>
  </a>
  <a href="#" style="color: #333; text-decoration: none; font-size: 24px;">
    <i class="fab fa-instagram"></i>
  </a>
  <a href="#" style="color: #333; text-decoration: none; font-size: 24px;">
    <i class="fab fa-linkedin"></i>
  </a>
  <a href="#" style="color: #333; text-decoration: none; font-size: 24px;">
    <i class="fab fa-youtube"></i>
  </a>
</div>`,
    description: "Social media icons",
    tags: ["icons", "social", "ui"]
  },

  "feature-icons": {
    code: `<!-- Feature Icons Section -->
<section style="padding: 4rem 2rem; background-color: #f8fafc;">
  <div style="max-width: 1200px; margin: 0 auto;">
    <h2 style="text-align: center; margin-bottom: 3rem; color: #333;">Our Features</h2>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem;">
      <div style="text-align: center;">
        <div style="margin-bottom: 1rem; color: #667eea;">
          <i class="fas fa-bolt" style="font-size: 48px;"></i>
        </div>
        <h3 style="color: #333; margin-bottom: 1rem;">Fast Performance</h3>
        <p style="color: #666;">Lightning fast loading times and smooth interactions.</p>
      </div>
      <div style="text-align: center;">
        <div style="margin-bottom: 1rem; color: #667eea;">
          <i class="fas fa-shield-alt" style="font-size: 48px;"></i>
        </div>
        <h3 style="color: #333; margin-bottom: 1rem;">Secure</h3>
        <p style="color: #666;">Enterprise-grade security for your peace of mind.</p>
      </div>
      <div style="text-align: center;">
        <div style="margin-bottom: 1rem; color: #667eea;">
          <i class="fas fa-mobile-alt" style="font-size: 48px;"></i>
        </div>
        <h3 style="color: #333; margin-bottom: 1rem;">Responsive</h3>
        <p style="color: #666;">Looks great on all devices and screen sizes.</p>
      </div>
    </div>
  </div>
</section>`,
    description: "Feature showcase with icons",
    tags: ["content", "features", "icons"]
  },

  "font-icons": {
    code: `<!-- Font Awesome Icons (CDN) -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
<div style="display: flex; gap: 20px; justify-content: center; padding: 2rem;">
  <i class="fas fa-home" style="font-size: 24px; color: #333;"></i>
  <i class="fas fa-envelope" style="font-size: 24px; color: #333;"></i>
  <i class="fas fa-phone" style="font-size: 24px; color: #333;"></i>
  <i class="fas fa-share-alt" style="font-size: 24px; color: #333;"></i>
</div>`,
    description: "Font Awesome icons",
    tags: ["icons", "ui"]
  },

  navbar: {
    code: `<!-- Modern Navigation Bar -->
<nav style="background: white; box-shadow: 0 2px 10px rgba(0,0,0,0.1); padding: 1rem 2rem;">
  <div style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;">
    <div style="font-size: 1.5rem; font-weight: bold; color: #333;">Logo</div>
    <div style="display: flex; gap: 2rem;">
      <a href="#" style="text-decoration: none; color: #333; font-weight: 500;">Home</a>
      <a href="#" style="text-decoration: none; color: #333; font-weight: 500;">About</a>
      <a href="#" style="text-decoration: none; color: #333; font-weight: 500;">Services</a>
      <a href="#" style="text-decoration: none; color: #333; font-weight: 500;">Contact</a>
    </div>
    <button style="background: #667eea; color: white; border: none; padding: 8px 20px; border-radius: 5px; cursor: pointer;">Get Started</button>
  </div>
</nav>`,
    description: "Modern navigation bar",
    tags: ["navigation", "header", "ui"]
  },

  sidebar: {
    code: `<!-- Sidebar Navigation -->
<div style="display: flex; min-height: 400px;">
  <aside style="width: 250px; background: #2d3748; color: white; padding: 2rem;">
    <h3 style="margin-bottom: 2rem;">Menu</h3>
    <nav style="display: flex; flex-direction: column; gap: 1rem;">
      <a href="#" style="color: white; text-decoration: none; padding: 0.5rem; border-radius: 4px; background: #4a5568;">Dashboard</a>
      <a href="#" style="color: white; text-decoration: none; padding: 0.5rem; border-radius: 4px;">Profile</a>
      <a href="#" style="color: white; text-decoration: none; padding: 0.5rem; border-radius: 4px;">Settings</a>
      <a href="#" style="color: white; text-decoration: none; padding: 0.5rem; border-radius: 4px;">Messages</a>
    </nav>
  </aside>
  <main style="flex: 1; padding: 2rem; background: #f7fafc;">
    <h2>Main Content Area</h2>
    <p>Your content goes here...</p>
  </main>
</div>`,
    description: "Sidebar navigation layout",
    tags: ["layout", "navigation", "sidebar"]
  },

  pricing: {
    code: `<!-- Pricing Cards -->
<section style="padding: 4rem 2rem; background: #f8fafc;">
  <div style="max-width: 1200px; margin: 0 auto;">
    <h2 style="text-align: center; margin-bottom: 3rem; color: #333;">Choose Your Plan</h2>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem;">
      <div style="background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center;">
        <h3 style="color: #333;">Basic</h3>
        <div style="font-size: 2rem; font-weight: bold; color: #667eea; margin: 1rem 0;">$19<span style="font-size: 1rem; color: #666;">/month</span></div>
        <ul style="list-style: none; padding: 0; margin: 2rem 0;">
          <li style="padding: 0.5rem 0;">5 Projects</li>
          <li style="padding: 0.5rem 0;">10GB Storage</li>
          <li style="padding: 0.5rem 0;">Basic Support</li>
        </ul>
        <button style="background: #667eea; color: white; border: none; padding: 12px 30px; border-radius: 5px; cursor: pointer; width: 100%;">Get Started</button>
      </div>
      <div style="background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 8px 15px rgba(0,0,0,0.1); text-align: center; border: 2px solid #667eea;">
        <div style="background: #667eea; color: white; padding: 0.5rem; border-radius: 5px; margin: -2rem -2rem 1rem -2rem;">Most Popular</div>
        <h3 style="color: #333;">Pro</h3>
        <div style="font-size: 2rem; font-weight: bold; color: #667eea; margin: 1rem 0;">$49<span style="font-size: 1rem; color: #666;">/month</span></div>
        <ul style="list-style: none; padding: 0; margin: 2rem 0;">
          <li style="padding: 0.5rem 0;">Unlimited Projects</li>
          <li style="padding: 0.5rem 0;">50GB Storage</li>
          <li style="padding: 0.5rem 0;">Priority Support</li>
        </ul>
        <button style="background: #667eea; color: white; border: none; padding: 12px 30px; border-radius: 5px; cursor: pointer; width: 100%;">Get Started</button>
      </div>
    </div>
  </div>
</section>`,
    description: "Pricing cards section",
    tags: ["ui", "pricing", "cards"]
  },

  testimonials: {
    code: `<!-- Testimonials Section -->
<section style="padding: 4rem 2rem; background: white;">
  <div style="max-width: 1200px; margin: 0 auto;">
    <h2 style="text-align: center; margin-bottom: 3rem; color: #333;">What Our Clients Say</h2>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
      <div style="background: #f8fafc; padding: 2rem; border-radius: 10px; border-left: 4px solid #667eea;">
        <div style="color: #667eea; font-size: 1.5rem; margin-bottom: 1rem;">"</div>
        <p style="color: #666; line-height: 1.6; margin-bottom: 1rem;">This service has completely transformed our business. The results were beyond our expectations!</p>
        <div style="font-weight: bold; color: #333;">- Sarah Johnson</div>
        <div style="color: #666; font-size: 0.9rem;">CEO, Tech Solutions</div>
      </div>
      <div style="background: #f8fafc; padding: 2rem; border-radius: 10px; border-left: 4px solid #667eea;">
        <div style="color: #667eea; font-size: 1.5rem; margin-bottom: 1rem;">"</div>
        <p style="color: #666; line-height: 1.6; margin-bottom: 1rem;">Outstanding quality and professional service. Highly recommended for any business.</p>
        <div style="font-weight: bold; color: #333;">- Michael Chen</div>
        <div style="color: #666; font-size: 0.9rem;">Marketing Director</div>
      </div>
    </div>
  </div>
</section>`,
    description: "Customer testimonials section",
    tags: ["content", "testimonials", "social-proof"]
  },

  stats: {
    code: `<!-- Statistics Section -->
<section style="padding: 4rem 2rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
  <div style="max-width: 1200px; margin: 0 auto;">
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; text-align: center;">
      <div>
        <div style="font-size: 3rem; font-weight: bold; margin-bottom: 0.5rem;">500+</div>
        <div style="font-size: 1.1rem;">Happy Clients</div>
      </div>
      <div>
        <div style="font-size: 3rem; font-weight: bold; margin-bottom: 0.5rem;">99%</div>
        <div style="font-size: 1.1rem;">Satisfaction Rate</div>
      </div>
      <div>
        <div style="font-size: 3rem; font-weight: bold; margin-bottom: 0.5rem;">24/7</div>
        <div style="font-size: 1.1rem;">Support</div>
      </div>
      <div>
        <div style="font-size: 3rem; font-weight: bold; margin-bottom: 0.5rem;">5+</div>
        <div style="font-size: 1.1rem;">Years Experience</div>
      </div>
    </div>
  </div>
</section>`,
    description: "Statistics counter section",
    tags: ["content", "stats", "numbers"]
  },

  "login-form": {
    code: `<!-- Login Form -->
<div style="max-width: 400px; margin: 2rem auto; padding: 2rem; background: white; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
  <h2 style="text-align: center; margin-bottom: 2rem; color: #333;">Welcome Back</h2>
  <form>
    <div style="margin-bottom: 1rem;">
      <label style="display: block; margin-bottom: 0.5rem; color: #333; font-weight: 500;">Email</label>
      <input type="email" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 5px; font-size: 1rem;" placeholder="Enter your email">
    </div>
    <div style="margin-bottom: 1.5rem;">
      <label style="display: block; margin-bottom: 0.5rem; color: #333; font-weight: 500;">Password</label>
      <input type="password" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 5px; font-size: 1rem;" placeholder="Enter your password">
    </div>
    <button type="submit" style="width: 100%; background: #667eea; color: white; border: none; padding: 12px; border-radius: 5px; font-size: 1rem; cursor: pointer;">Sign In</button>
  </form>
  <div style="text-align: center; margin-top: 1rem;">
    <a href="#" style="color: #667eea; text-decoration: none;">Forgot password?</a>
  </div>
</div>`,
    description: "Login form component",
    tags: ["forms", "login", "authentication"]
  },

  newsletter: {
    code: `<!-- Newsletter Signup -->
<section style="padding: 4rem 2rem; background: #667eea; color: white;">
  <div style="max-width: 600px; margin: 0 auto; text-align: center;">
    <h2 style="margin-bottom: 1rem;">Stay Updated</h2>
    <p style="margin-bottom: 2rem; opacity: 0.9;">Subscribe to our newsletter for the latest updates and offers.</p>
    <form style="display: flex; gap: 1rem; max-width: 400px; margin: 0 auto;">
      <input type="email" placeholder="Enter your email" style="flex: 1; padding: 12px; border: none; border-radius: 5px; font-size: 1rem;">
      <button type="submit" style="background: white; color: #667eea; border: none; padding: 12px 24px; border-radius: 5px; font-size: 1rem; cursor: pointer; font-weight: bold;">Subscribe</button>
    </form>
  </div>
</section>`,
    description: "Newsletter signup form",
    tags: ["forms", "newsletter", "marketing"]
  },

  team: {
    code: `<!-- Team Section -->
<section style="padding: 4rem 2rem; background: #f8fafc;">
  <div style="max-width: 1200px; margin: 0 auto;">
    <h2 style="text-align: center; margin-bottom: 3rem; color: #333;">Meet Our Team</h2>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem;">
      <div style="text-align: center; background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <img src="https://studio-website-builder.vercel.app/icon-512.png" alt="Team Member" style="width: 150px; height: 150px; border-radius: 50%; margin: 0 auto 1rem;">
        <h3 style="color: #333; margin-bottom: 0.5rem;">John Doe</h3>
        <div style="color: #667eea; margin-bottom: 1rem;">CEO & Founder</div>
        <p style="color: #666;">Visionary leader with 10+ years of experience in the industry.</p>
      </div>
      <div style="text-align: center; background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <img src="https://studio-website-builder.vercel.app/icon-512.png" alt="Team Member" style="width: 150px; height: 150px; border-radius: 50%; margin: 0 auto 1rem;">
        <h3 style="color: #333; margin-bottom: 0.5rem;">Jane Smith</h3>
        <div style="color: #667eea; margin-bottom: 1rem;">Creative Director</div>
        <p style="color: #666;">Award-winning designer with a passion for innovation.</p>
      </div>
    </div>
  </div>
</section>`,
    description: "Team member showcase",
    tags: ["content", "team", "about"]
  },

  faq: {
    code: `<!-- FAQ Section -->
<section style="padding: 4rem 2rem; background: white;">
  <div style="max-width: 800px; margin: 0 auto;">
    <h2 style="text-align: center; margin-bottom: 3rem; color: #333;">Frequently Asked Questions</h2>
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem;">
        <h3 style="color: #333; margin-bottom: 0.5rem;">What is your refund policy?</h3>
        <p style="color: #666; margin: 0;">We offer a 30-day money-back guarantee for all our plans. If you're not satisfied, we'll refund your payment.</p>
      </div>
      <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem;">
        <h3 style="color: #333; margin-bottom: 0.5rem;">Do you offer technical support?</h3>
        <p style="color: #666; margin: 0;">Yes, we provide 24/7 technical support for all our customers via email, chat, and phone.</p>
      </div>
      <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem;">
        <h3 style="color: #333; margin-bottom: 0.5rem;">Can I upgrade my plan later?</h3>
        <p style="color: #666; margin: 0;">Absolutely! You can upgrade or downgrade your plan at any time from your account dashboard.</p>
      </div>
    </div>
  </div>
</section>`,
    description: "FAQ accordion section",
    tags: ["content", "faq", "help"]
  },

  breadcrumb: {
    code: `<!-- Breadcrumb Navigation -->
<nav style="padding: 1rem 2rem; background: #f7fafc;">
  <div style="max-width: 1200px; margin: 0 auto;">
    <div style="display: flex; gap: 0.5rem; font-size: 0.9rem;">
      <a href="#" style="color: #667eea; text-decoration: none;">Home</a>
      <span style="color: #a0aec0;">/</span>
      <a href="#" style="color: #667eea; text-decoration: none;">Category</a>
      <span style="color: #a0aec0;">/</span>
      <span style="color: #718096;">Current Page</span>
    </div>
  </div>
</nav>`,
    description: "Breadcrumb navigation",
    tags: ["navigation", "breadcrumb", "ui"]
  },

  modal: {
    code: `<!-- Modal Dialog -->
<div style="background: rgba(0,0,0,0.5); position: fixed; top: 0; left: 0; right: 0; bottom: 0; display: flex; align-items: center; justify-content: center; z-index: 1000;">
  <div style="background: white; padding: 2rem; border-radius: 10px; max-width: 500px; width: 90%; box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
    <h2 style="margin-bottom: 1rem; color: #333;">Modal Title</h2>
    <p style="color: #666; margin-bottom: 2rem;">This is a sample modal dialog. You can put any content here.</p>
    <div style="display: flex; gap: 1rem; justify-content: flex-end;">
      <button style="background: #e2e8f0; color: #4a5568; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Cancel</button>
      <button style="background: #667eea; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Confirm</button>
    </div>
  </div>
</div>`,
    description: "Modal dialog component",
    tags: ["ui", "modal", "dialog"]
  },

  progress: {
    code: `<!-- Progress Bars -->
<div style="max-width: 600px; margin: 2rem auto; padding: 2rem; background: white; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
  <h3 style="margin-bottom: 2rem; color: #333;">Skills & Progress</h3>
  <div style="margin-bottom: 1.5rem;">
    <div style="display: flex; justify-content: between; margin-bottom: 0.5rem;">
      <span style="color: #333;">Web Design</span>
      <span style="color: #667eea;">90%</span>
    </div>
    <div style="background: #e2e8f0; border-radius: 10px; height: 8px;">
      <div style="background: #667eea; height: 100%; width: 90%; border-radius: 10px;"></div>
    </div>
  </div>
  <div style="margin-bottom: 1.5rem;">
    <div style="display: flex; justify-content: between; margin-bottom: 0.5rem;">
      <span style="color: #333;">Development</span>
      <span style="color: #667eea;">75%</span>
    </div>
    <div style="background: #e2e8f0; border-radius: 10px; height: 8px;">
      <div style="background: #667eea; height: 100%; width: 75%; border-radius: 10px;"></div>
    </div>
  </div>
</div>`,
    description: "Progress bar component",
    tags: ["ui", "progress", "skills"]
  },

  timeline: {
    code: `<!-- Timeline -->
<div style="max-width: 800px; margin: 2rem auto; padding: 2rem;">
  <h3 style="margin-bottom: 2rem; color: #333; text-align: center;">Our Journey</h3>
  <div style="position: relative;">
    <div style="display: flex; margin-bottom: 2rem;">
      <div style="flex: 0 0 100px; text-align: right; padding-right: 2rem;">
        <div style="font-weight: bold; color: #667eea;">2020</div>
      </div>
      <div style="flex: 1; padding-left: 2rem; border-left: 2px solid #667eea; position: relative;">
        <div style="width: 12px; height: 12px; background: #667eea; border-radius: 50%; position: absolute; left: -7px; top: 5px;"></div>
        <h4 style="color: #333; margin-bottom: 0.5rem;">Company Founded</h4>
        <p style="color: #666; margin: 0;">Started our journey with a small team and big dreams.</p>
      </div>
    </div>
    <div style="display: flex; margin-bottom: 2rem;">
      <div style="flex: 0 0 100px; text-align: right; padding-right: 2rem;">
        <div style="font-weight: bold; color: #667eea;">2022</div>
      </div>
      <div style="flex: 1; padding-left: 2rem; border-left: 2px solid #667eea; position: relative;">
        <div style="width: 12px; height: 12px; background: #667eea; border-radius: 50%; position: absolute; left: -7px; top: 5px;"></div>
        <h4 style="color: #333; margin-bottom: 0.5rem;">Series A Funding</h4>
        <p style="color: #666; margin: 0;">Raised $5M to expand our services and team.</p>
      </div>
    </div>
  </div>
</div>`,
    description: "Timeline component",
    tags: ["content", "timeline", "history"]
  }
};

const componentCategories: ComponentCategories = {
  "Layout": ["header", "hero", "about", "services", "contact", "footer", "sidebar"],
  "Navigation": ["navbar", "breadcrumb"],
  "Content": ["card", "gallery", "team", "testimonials", "stats", "timeline", "faq"],
  "Forms": ["contact", "login-form", "newsletter"],
  "UI Components": ["modal", "progress", "pricing"],
  "SEO": ["seo", "seo-schema"],
  "Icons": ["social-icons", "feature-icons", "font-icons"]
};

const getComponentIcon = (componentKey: string): ReactElement => {
  const icons: { [key: string]: ReactElement } = {
    header: <FileText size={16} />,
    hero: <Sparkles size={16} />,
    about: <Info size={16} />,
    services: <Wrench size={16} />,
    contact: <Phone size={16} />,
    footer: <SquareStack size={16} />,
    card: <CreditCard size={16} />,
    gallery: <Image size={16} />,
    seo: <Search size={16} />,
    "seo-schema": <Tag size={16} />,
    "social-icons": <Users size={16} />,
    "feature-icons": <Stars size={16} />,
    "font-icons": <Type size={16} />,
    navbar: <Navigation size={16} />,
    sidebar: <Sidebar size={16} />,
    pricing: <CreditCard size={16} />,
    testimonials: <Users size={16} />,
    stats: <BarChart3 size={16} />,
    "login-form": <Mail size={16} />,
    newsletter: <Mail size={16} />,
    team: <Users size={16} />,
    faq: <HelpCircle size={16} />,
    breadcrumb: <Navigation size={16} />,
    modal: <SquareStack size={16} />,
    progress: <TrendingUp size={16} />,
    timeline: <Clock size={16} />,
  };
  return icons[componentKey] || <FileText size={16} />;
};

const generateHtml = (bodyContent: string) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
          margin: 0; 
          padding: 0; 
          min-height: 100vh; 
          background: #ffffff;
          line-height: 1.6;
        }
        * { box-sizing: border-box; }
      </style>
    </head>
    <body>${bodyContent}</body>
  </html>
`;

export default function ComponentsPanel({
  onInsert,
  onAiInsert,
  onOpenSettings,
  onResizeStart,
}: ComponentsPanelProps) {
  const { settings } = useSettings();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [mode, setMode] = useState<AiMode>("response");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [previewComponent, setPreviewComponent] = useState<string | null>(null);
  const [recentComponents, setRecentComponents] = useState<string[]>([]);

  // Load favorites and recent components from localStorage
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    try {
      const savedFavorites = localStorage.getItem('component-favorites');
      if (savedFavorites) {
        setFavorites(new Set(JSON.parse(savedFavorites)));
      }

      const savedRecent = localStorage.getItem('recent-components');
      if (savedRecent) {
        setRecentComponents(JSON.parse(savedRecent));
      }
    } catch (e) {
      console.error('Failed to load data from localStorage:', e);
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem('component-favorites', JSON.stringify(Array.from(favorites)));
    } catch (e) {
      console.error('Failed to save favorites:', e);
    }
  }, [favorites]);

  // Filter components based on search
  const filteredComponents = useMemo(() => {
    if (!searchTerm) return componentCategories;
    
    const filtered: ComponentCategories = {};
    Object.entries(componentCategories).forEach(([category, comps]) => {
      const filteredComps = comps.filter(compKey => {
        const comp = components[compKey];
        return (
          compKey.toLowerCase().includes(searchTerm.toLowerCase()) ||
          comp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          comp.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      });
      if (filteredComps.length > 0) {
        filtered[category] = filteredComps;
      }
    });
    return filtered;
  }, [searchTerm]);

  const toggleFavorite = (componentKey: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(componentKey)) {
        newFavorites.delete(componentKey);
      } else {
        newFavorites.add(componentKey);
      }
      return newFavorites;
    });
  };

  const handleInsert = (componentKey: string) => {
    const component = components[componentKey];
    if (!component) return;

    // Add to recent components (limit to 10)
    setRecentComponents(prev => {
      const filtered = prev.filter(key => key !== componentKey);
      const updated = [componentKey, ...filtered].slice(0, 10);
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('recent-components', JSON.stringify(updated));
        } catch (e) {
          console.error('Failed to save recent components:', e);
        }
      }
      
      return updated;
    });

    onInsert(component.code);
  };

  const askAi = async () => {
  if (!prompt.trim()) return;
  setLoading(true);
  setResponse("Connecting to GPT-OSS-20B via Cloudflare tunnel...");

  try {
    let aiText = "";
    const baseUrl = settings.aiEndpoint;

    console.log(`Making AI request to: ${baseUrl} with model: openai/gpt-oss-20b`);

    // Use your specific model
    const modelToUse = "openai/gpt-oss-20b";

    if (mode === "response") {
      const res = await fetch(`${baseUrl}/v1/chat/completions`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          model: modelToUse,
          messages: [
            {
              role: "system",
              content: "You are a professional web development assistant. Return only HTML/CSS/JS code. Do not include explanations, instructions, or markdown wrappers."
            },
            {
              role: "user",
              content: `Generate clean, ready-to-use HTML/CSS/JS code for: ${prompt}. Return only code. No explanations, comments, or extra text. Do not output markdown instructions.`
            }
          ],
          max_tokens: 1000,
          temperature: 0.7,
          stream: false
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server responded with ${res.status}: ${errorText}`);
      }
      
      const data = await res.json();
      aiText = data.choices?.[0]?.message?.content || "";
      
    } else {
      // Chat mode
      const updatedHistory = [...chatHistory, { role: "user" as ChatRole, content: prompt }];
      const res = await fetch(`${baseUrl}/v1/chat/completions`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          model: modelToUse,
          messages: [
            {
              role: "system",
              content: "You are a professional web development assistant. Return only HTML/CSS/JS code. Do not include explanations, instructions, or markdown wrappers."
            },
            ...updatedHistory
          ],
          max_tokens: 1000,
          temperature: 0.7,
          stream: false
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server responded with ${res.status}: ${errorText}`);
      }
      
      const data = await res.json();
      aiText = data.choices?.[0]?.message?.content || "";
      setChatHistory([...updatedHistory, { role: "assistant" as ChatRole, content: aiText }]);
    }

    // Strip code block formatting
    const cleanedText = aiText
      .replace(/^```(?:html|js|css)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    setResponse(cleanedText || "AI responded with empty content. Please try again.");

    if (cleanedText) {
      onAiInsert(`\n<!-- AI Generated by GPT-OSS-20B -->\n${cleanedText}\n`);
    }
  } catch (err) {
    console.error('AI request failed:', err);
    const errorMessage = err instanceof Error 
      ? err.message 
      : `Error connecting to AI server at ${settings.aiEndpoint}.`;
    setResponse(errorMessage);
  } finally {
    setLoading(false);
    setPrompt("");
  }
};
return (
  <div className="flex flex-col h-full overflow-hidden relative">
    {/* Resize Handle on the right side */}
    {onResizeStart && (
      <div
        className="absolute -right-2 top-0 bottom-0 w-4 cursor-col-resize z-20 hover:bg-accent-color hover:bg-opacity-50 transition-colors"
        onMouseDown={onResizeStart}
      />
    )}

    {/* Compact Header */}
    <div className="!p-2 border-b border-panel-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs font-medium text-text-secondary">
          <SquareStack size={12} />
          <span>Components</span>
        </div>
        
        <div className="flex items-center gap-1">
          {/* Search Toggle */}
          <button
            onClick={() => setSearchTerm(searchTerm ? '' : ' ')}
            className="!p-1.5 hover:bg-component-hover rounded transition-colors"
            title="Search"
          >
            <Search size={12} />
          </button>
          
          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="!p-1.5 hover:bg-component-hover rounded transition-colors"
            title="Settings"
          >
            <Settings size={12} />
          </button>
        </div>
      </div>
      
      {/* Search Bar - Appears only when search is active */}
      {searchTerm !== '' && (
        <div className="mt-2 relative">
          <input
            type="text"
            placeholder="Type to search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-2 pr-6 py-1 bg-component-bg border border-panel-border rounded text-xs focus:outline-none focus:border-accent-color text-foreground"
            autoFocus
          />
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-foreground text-xs"
          >
            ×
          </button>
        </div>
      )}
    </div>
      
      {/* Components List */}
      <div className="flex-1 overflow-auto min-h-0">
        <div className="components-list">
          {/* Recently Used Section */}
          {recentComponents.length > 0 && (
            <div className="component-category">
              <div className="category-title flex items-center gap-2">
                <Clock size={14} />
                Recently Used ({recentComponents.length})
              </div>
              {recentComponents.map((key) => (
                <div
                  key={key}
                  className="component-item group"
                  onClick={() => handleInsert(key)}
                >
                  <div className="component-icon">
                    {getComponentIcon(key)}
                  </div>
                  <span className="component-name flex-1">
                    {key.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ")}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewComponent(key);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Preview component"
                    >
                      <Eye size={14} className="text-text-muted hover:text-foreground" />
                    </button>
                    <button
                      onClick={(e) => toggleFavorite(key, e)}
                      className={`transition-opacity ${
                        favorites.has(key) ? "opacity-100 text-yellow-500" : "opacity-0 group-hover:opacity-100 text-text-muted"
                      }`}
                      title={favorites.has(key) ? "Remove from favorites" : "Add to favorites"}
                    >
                      {favorites.has(key) ? (
                        <Star size={14} className="fill-yellow-500" />
                      ) : (
                        <Star size={14} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Favorites Section */}
          {favorites.size > 0 && (
            <div className="component-category">
              <div className="category-title flex items-center gap-2">
                <Star size={14} className="text-yellow-500" />
                Favorites ({favorites.size})
              </div>
              {Array.from(favorites).map((key) => (
                <div
                  key={key}
                  className="component-item group"
                  onClick={() => handleInsert(key)}
                >
                  <div className="component-icon">
                    {getComponentIcon(key)}
                  </div>
                  <span className="component-name flex-1">
                    {key.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ")}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewComponent(key);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Preview component"
                    >
                      <Eye size={14} className="text-text-muted hover:text-foreground" />
                    </button>
                    <button
                      onClick={(e) => toggleFavorite(key, e)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-yellow-500"
                      title="Remove from favorites"
                    >
                      <StarOff size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Regular Categories */}
          {Object.entries(filteredComponents).map(([category, keys]) => (
            <div key={category} className="component-category">
              <div className="category-title">{category}</div>
              {keys.map((key) => (
                <div
                  key={key}
                  className="component-item group"
                  onClick={() => handleInsert(key)}
                >
                  <div className="component-icon">
                    {getComponentIcon(key)}
                  </div>
                  <span className="component-name flex-1">
                    {key.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ")}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewComponent(key);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Preview component"
                    >
                      <Eye size={14} className="text-text-muted hover:text-foreground" />
                    </button>
                    <button
                      onClick={(e) => toggleFavorite(key, e)}
                      className={`transition-opacity ${
                        favorites.has(key) ? "opacity-100 text-yellow-500" : "opacity-0 group-hover:opacity-100 text-text-muted"
                      }`}
                      title={favorites.has(key) ? "Remove from favorites" : "Add to favorites"}
                    >
                      {favorites.has(key) ? (
                        <Star size={14} className="fill-yellow-500" />
                      ) : (
                        <Star size={14} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}

          {/* No Results Message */}
          {searchTerm && Object.keys(filteredComponents).length === 0 && (
            <div className="text-center py-8 text-text-muted">
              <Search size={32} className="mx-auto mb-2 opacity-50" />
              <p>No components found for "{searchTerm}"</p>
              <button
                onClick={() => setSearchTerm("")}
                className="btn btn-secondary btn-sm mt-2"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Component Preview Modal */}
      {previewComponent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-panel-bg rounded-lg p-4 max-w-4xl w-full mx-auto max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                Preview: {previewComponent.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ")}
              </h3>
              <button 
                onClick={() => setPreviewComponent(null)}
                className="text-text-muted hover:text-foreground"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 border rounded-lg overflow-hidden bg-white">
              <iframe
                srcDoc={generateHtml(components[previewComponent].code)}
                className="w-full h-full min-h-[400px]"
                title="Component Preview"
              />
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleInsert(previewComponent)}
                className="btn btn-primary flex-1"
              >
                Insert Component
              </button>
              <button
                onClick={() => setPreviewComponent(null)}
                className="btn btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Section Header with Endpoint Indicator */}
      <div className="ai-section">
        <div className="panel-header">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Bot size={18} style={{ color: "var(--accent-color)" }} />
              <h3>AI Assistant</h3>
            </div>
            <div className="text-xs text-text-muted bg-component-bg px-2 py-1 rounded">
              {settings.aiEndpoint.replace('http://', '')}
            </div>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="mode-toggle">
          <label className="mode-option">
            <input
              type="radio"
              value="response"
              checked={mode === "response"}
              onChange={() => setMode("response")}
            />
            Stateless
          </label>
          <label className="mode-option">
            <input
              type="radio"
              value="chat"
              checked={mode === "chat"}
              onChange={() => setMode("chat")}
            />
            Chat
          </label>
        </div>

        {/* Prompt Input */}
        <textarea
          className="prompt-textarea"
          placeholder="Ask AI to generate code..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) askAi();
          }}
        />

        {/* Ask AI Button */}
        <button
          className="btn btn-accent"
          onClick={askAi}
          disabled={loading}
        >
          <Bot size={16} />
          {loading ? "Asking AI..." : "Ask AI"}
        </button>

        {/* AI Response */}
        {response && (
          <div>
            <div className="response-label">AI Response</div>
            <div className="ai-response">
              {response}
            </div>
          </div>
        )}

        {/* Chat History */}
        {mode === "chat" && chatHistory.length > 0 && (
          <div>
            <div className="response-label">Chat History</div>
            <div className="chat-history">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`chat-message ${msg.role}`}>
                  <div className={`message-role ${msg.role}`}>
                    {msg.role.toUpperCase()}
                  </div>
                  <div>{msg.content}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}





















































