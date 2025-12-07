
import React, { useState, useEffect, useRef } from 'react';
import { ViewState, ToolConfig, BlogPost } from '../types.ts';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  setView: (view: ViewState, params?: any) => void;
  tools: ToolConfig[];
  blogPosts: BlogPost[];
}

// --- PREMIUM BRAND LOGO COMPONENT ---
const BrandLogo = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="brandGrad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FF0033" />
        <stop offset="50%" stopColor="#FF0000" />
        <stop offset="100%" stopColor="#CC0000" />
      </linearGradient>
    </defs>
    
    {/* Main Screen/Panel Shape */}
    <rect x="4" y="12" width="56" height="40" rx="12" fill="url(#brandGrad)" className="drop-shadow-lg" />
    
    {/* The Play Button (Clean White) */}
    <path d="M26 24 L44 32 L26 40 V24 Z" fill="white" />
    
    {/* The AI/Tech Node (Top Right) - Symbolizing Intelligence */}
    <circle cx="50" cy="12" r="6" fill="#0F0F0F" stroke="white" strokeWidth="2" />
    <circle cx="50" cy="12" r="2" fill="white" />
    <path d="M50 18 V22" stroke="white" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const Layout: React.FC<LayoutProps> = ({ children, currentView, setView, tools, blogPosts }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // --- SEARCH STATE ---
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{tools: ToolConfig[], blogs: BlogPost[]} | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchResults(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim().length > 1) {
      const lowerQ = query.toLowerCase();
      const matchedTools = tools.filter(t => 
        t.name.toLowerCase().includes(lowerQ) || t.description.toLowerCase().includes(lowerQ)
      );
      const matchedBlogs = blogPosts.filter(b => 
        b.title.toLowerCase().includes(lowerQ) || b.excerpt.toLowerCase().includes(lowerQ)
      );
      setSearchResults({ tools: matchedTools, blogs: matchedBlogs });
    } else {
      setSearchResults(null);
    }
  };

  const handleResultClick = (view: ViewState, params: any) => {
    setView(view, params);
    setSearchQuery('');
    setSearchResults(null);
    setMobileMenuOpen(false);
  };

  const NavLink = ({ view, label }: { view: ViewState; label: string }) => (
    <button
      onClick={() => {
        setView(view);
        setMobileMenuOpen(false);
      }}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        currentView === view
          ? 'text-yt-red bg-white/10'
          : 'text-gray-300 hover:text-white hover:bg-white/5'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col bg-yt-dark text-white font-sans selection:bg-yt-red selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-panel border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            
            {/* Logo */}
            <div className="flex items-center cursor-pointer group flex-shrink-0" onClick={() => setView(ViewState.HOME)}>
              <BrandLogo className="w-10 h-10 mr-2 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-xl font-bold tracking-tight hidden sm:block">YTPANEL<span className="text-yt-red">.IN</span></span>
            </div>
            
            {/* Search Bar (Desktop + Mobile) */}
            <div className="flex-grow max-w-md relative" ref={searchRef}>
               <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <i className="fa-solid fa-magnifying-glass text-gray-500"></i>
                 </div>
                 <input
                   type="text"
                   className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-full leading-5 bg-black/20 text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-black/50 focus:border-yt-red sm:text-sm transition-colors"
                   placeholder="Search tools & guides..."
                   value={searchQuery}
                   onChange={handleSearch}
                   onFocus={(e) => handleSearch(e)}
                 />
               </div>
               
               {/* Search Dropdown Results */}
               {searchResults && (searchResults.tools.length > 0 || searchResults.blogs.length > 0) && (
                 <div className="absolute top-full left-0 w-full mt-2 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                    {/* Tools Section */}
                    {searchResults.tools.length > 0 && (
                      <div className="p-2">
                        <div className="text-xs font-bold text-gray-500 uppercase px-3 py-2">Tools</div>
                        {searchResults.tools.map(tool => (
                          <div 
                            key={tool.id}
                            onClick={() => handleResultClick(ViewState.TOOL, { toolId: tool.id })}
                            className="flex items-center px-3 py-2 hover:bg-white/5 rounded-lg cursor-pointer group"
                          >
                             <div className={`w-8 h-8 rounded flex items-center justify-center bg-gray-800 mr-3 ${tool.color}`}>
                                <i className={`fa-solid ${tool.icon}`}></i>
                             </div>
                             <div className="text-sm font-medium text-gray-200 group-hover:text-white">{tool.name}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Blogs Section */}
                    {searchResults.blogs.length > 0 && (
                      <div className="p-2 border-t border-white/10">
                        <div className="text-xs font-bold text-gray-500 uppercase px-3 py-2">Articles</div>
                        {searchResults.blogs.map(post => (
                          <div 
                             key={post.id}
                             onClick={() => handleResultClick(ViewState.BLOG_POST, { blogId: post.id })}
                             className="px-3 py-2 hover:bg-white/5 rounded-lg cursor-pointer"
                          >
                             <div className="text-sm font-medium text-gray-200 hover:text-yt-red truncate">{post.title}</div>
                             <div className="text-xs text-gray-500">{post.readTime}</div>
                          </div>
                        ))}
                      </div>
                    )}
                 </div>
               )}
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:block">
              <div className="ml-4 flex items-baseline space-x-4">
                <NavLink view={ViewState.HOME} label="Home" />
                <NavLink view={ViewState.BLOG} label="Blog" />
                <NavLink view={ViewState.ABOUT} label="About" />
                <NavLink view={ViewState.CONTACT} label="Contact" />
              </div>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
              >
                <i className={`fa-solid ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-yt-gray border-t border-white/10">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col">
              <NavLink view={ViewState.HOME} label="Home" />
              <NavLink view={ViewState.BLOG} label="Blog" />
              <NavLink view={ViewState.ABOUT} label="About Us" />
              <NavLink view={ViewState.CONTACT} label="Contact" />
              <NavLink view={ViewState.PRIVACY} label="Privacy Policy" />
              <NavLink view={ViewState.TERMS} label="Terms" />
              <NavLink view={ViewState.DISCLAIMER} label="Disclaimer" />
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4 cursor-pointer" onClick={() => setView(ViewState.HOME)}>
                <BrandLogo className="w-8 h-8 mr-2" />
                <span className="text-lg font-bold">YTPANEL.IN</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                The ultimate AI-powered toolkit for YouTube creators. Optimize your channel, rank higher, and grow faster with our secure, compliant, and free tools.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li onClick={() => setView(ViewState.HOME)} className="cursor-pointer hover:text-yt-red">Tools Dashboard</li>
                <li onClick={() => setView(ViewState.BLOG)} className="cursor-pointer hover:text-yt-red">Creator Blog</li>
                <li onClick={() => setView(ViewState.ABOUT)} className="cursor-pointer hover:text-yt-red">About Us</li>
                <li onClick={() => setView(ViewState.CONTACT)} className="cursor-pointer hover:text-yt-red">Contact Support</li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li onClick={() => setView(ViewState.PRIVACY)} className="cursor-pointer hover:text-yt-red">Privacy Policy</li>
                <li onClick={() => setView(ViewState.TERMS)} className="cursor-pointer hover:text-yt-red">Terms of Service</li>
                <li onClick={() => setView(ViewState.DISCLAIMER)} className="cursor-pointer hover:text-yt-red">Disclaimer</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} YTPANEL.IN. All rights reserved. Not affiliated with YouTube/Google.
          </div>
        </div>
      </footer>
    </div>
  );
};
