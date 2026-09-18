import React from 'react';
import { Search } from 'lucide-react';

const Navbar = ({ onReset, onHowItWorksClick, onAboutClick }) => {
  return (
    <nav className="bg-gray-900 border-b border-gray-800 shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 max-w-6xl h-16 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={onReset}
        >
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <Search size={20} />
          </div>
          <span className="text-xl font-bold text-white">DocuLens</span>
        </div>
        
        <div className="flex items-center gap-6 text-sm font-medium text-gray-400">
          <button onClick={onReset} className="hover:text-blue-400 transition-colors">Analyze</button>
          <button onClick={onHowItWorksClick} className="hover:text-blue-400 transition-colors">How It Works</button>
          <button onClick={onAboutClick} className="hover:text-blue-400 transition-colors">About</button>
          <a 
            href="https://github.com/P-SaiPraneeth/DocuLens" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-gray-400 hover:text-white transition-colors ml-2"
            title="View Source on GitHub"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="22" 
              height="22" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
              <path d="M9 18c-4.51 2-5-2-7-2"></path>
            </svg>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
