import React, { useState, useRef } from 'react';
import Home from './pages/Home';
import Analysis from './pages/Analysis';
import Navbar from './components/Navbar';
import { X } from 'lucide-react';

function App() {
  const [analysisData, setAnalysisData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  
  const footerRef = useRef(null);

  const handleAnalysisComplete = (data) => {
    setAnalysisData(data);
    setIsLoading(false);
  };

  const handleReset = () => {
    setAnalysisData(null);
    setError(null);
  };

  const handleAboutClick = () => {
    if (footerRef.current) {
      footerRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-950">
      <Navbar 
        onReset={handleReset} 
        onHowItWorksClick={() => setShowHowItWorks(true)}
        onAboutClick={handleAboutClick}
      />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        {!analysisData ? (
          <Home 
            onAnalysisComplete={handleAnalysisComplete}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            error={error}
            setError={setError}
          />
        ) : (
          <Analysis data={analysisData} onReset={handleReset} />
        )}
      </main>
      
      <footer ref={footerRef} className="border-t border-gray-800 py-10 text-center text-gray-500 text-sm bg-gray-900 mt-auto shadow-inner">
        <div className="max-w-4xl mx-auto px-4">
          <p className="mb-3 text-lg">DocuLens - AI Document Similarity & Integrity Analyzer &copy; 2026</p>
          <div className="inline-block px-6 py-2 bg-gray-800 rounded-full border border-gray-700 shadow-sm">
            <p className="text-blue-400 font-semibold tracking-wide">Made by SaiPraneeth</p>
          </div>
        </div>
      </footer>

      {/* How It Works Modal */}
      {showHowItWorks && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 max-w-2xl w-full p-8 relative shadow-2xl">
            <button 
              onClick={() => setShowHowItWorks(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors bg-gray-700 hover:bg-gray-600 rounded-full p-1"
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-bold text-white mb-6">How DocuLens Works</h2>
            
            <div className="space-y-6 text-gray-300">
              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-2">1. Deep Semantic AI</h3>
                <p className="leading-relaxed">Unlike traditional plagiarism checkers that just look for exact matching words, DocuLens uses a HuggingFace Transformer model (<code>all-MiniLM-L6-v2</code>) to convert your text into multi-dimensional vectors. This means it understands the <strong>actual meaning</strong> of your sentences.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-2">2. Processing & Chunking</h3>
                <p className="leading-relaxed">When you upload a PDF or paste text, the system cleans the text and splits it into logical chunks. It then runs thousands of mathematical comparisons (Cosine Similarity) between every chunk from Source 1 against every chunk from Source 2.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-2">3. Three-Tier Similarity</h3>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li><strong className="text-white">Semantic:</strong> Catches paraphrasing and restructured sentences where the meaning is identical.</li>
                  <li><strong className="text-white">Lexical:</strong> Uses TF-IDF to find overlapping keywords and vocabulary.</li>
                  <li><strong className="text-white">Exact:</strong> Word-for-word identical matching.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-2">4. Completely Private</h3>
                <p className="leading-relaxed">DocuLens runs 100% locally on your machine. No documents are uploaded to external APIs, and no databases are used. Your data stays entirely private and is cleared when you refresh.</p>
              </div>
            </div>
            
            <button 
              onClick={() => setShowHowItWorks(false)}
              className="mt-8 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-lg"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
