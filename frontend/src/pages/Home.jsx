import React, { useState } from 'react';
import { UploadCloud, FileText, Type, AlertCircle } from 'lucide-react';
import { analyzeDocuments } from '../api';

const InputSection = ({ label, docState, setDocState }) => {
  const [activeTab, setActiveTab] = useState('file'); // 'file' or 'text'

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setDocState({ type: 'file', file, text: '' });
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 flex-1 flex flex-col">
      <h3 className="text-lg font-semibold text-white mb-4">{label}</h3>
      
      {/* Tabs */}
      <div className="flex bg-gray-900 rounded-lg p-1 mb-6">
        <button 
          onClick={() => { setActiveTab('file'); setDocState({ type: 'file', file: null, text: '' }); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'file' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <FileText size={16} /> Upload PDF
        </button>
        <button 
          onClick={() => { setActiveTab('text'); setDocState({ type: 'text', file: null, text: '' }); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'text' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Type size={16} /> Paste Text
        </button>
      </div>

      {activeTab === 'file' ? (
        <div className="flex-grow flex flex-col">
          <div 
            className="flex-grow border-2 border-dashed border-gray-600 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-750 transition-colors cursor-pointer"
            onClick={() => document.getElementById(`upload-${label}`).click()}
          >
            <input 
              type="file" 
              id={`upload-${label}`} 
              accept=".pdf" 
              className="hidden" 
              onChange={handleFileChange}
            />
            {docState.file ? (
              <>
                <FileText size={48} className="text-blue-500 mb-4" />
                <h4 className="text-white font-medium break-all">{docState.file.name}</h4>
                <p className="text-sm text-gray-400 mt-1">{(docState.file.size / 1024 / 1024).toFixed(2)} MB</p>
                <p className="text-xs text-blue-400 mt-4">Click to change file</p>
              </>
            ) : (
              <>
                <div className="bg-gray-900 w-16 h-16 rounded-full flex items-center justify-center mb-4 text-blue-500">
                  <UploadCloud size={32} />
                </div>
                <h4 className="text-gray-300 font-medium mb-1">Click to browse</h4>
                <p className="text-sm text-gray-500">PDF files only</p>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-grow flex flex-col">
          <textarea
            className="flex-grow w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none custom-scrollbar"
            placeholder="Paste your text here..."
            value={docState.text}
            onChange={(e) => setDocState({ type: 'text', file: null, text: e.target.value })}
          />
        </div>
      )}
    </div>
  );
};

const Home = ({ onAnalysisComplete, isLoading, setIsLoading, error, setError }) => {
  const [doc1, setDoc1] = useState({ type: 'file', file: null, text: '' });
  const [doc2, setDoc2] = useState({ type: 'file', file: null, text: '' });
  const [threshold, setThreshold] = useState(0.50);

  const isDocReady = (doc) => {
    if (doc.type === 'file' && doc.file) return true;
    if (doc.type === 'text' && doc.text.trim().length > 0) return true;
    return false;
  };

  const isReady = isDocReady(doc1) && isDocReady(doc2);

  const startAnalysis = async () => {
    if (!isReady) {
      setError('Please provide content for both Document 1 and Document 2.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await analyzeDocuments(doc1, doc2, threshold);
      onAnalysisComplete(data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'An error occurred during analysis');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin mb-8"></div>
        <h2 className="text-2xl font-semibold mb-2 text-white">Analyzing Content</h2>
        <p className="text-gray-400 max-w-md text-center">
          Extracting text, generating semantic embeddings, and performing deep comparisons. This may take a moment...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-10">
      <div className="text-center mb-12 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
          Detect Semantic Similarities<br/>
          <span className="text-blue-500 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
            Beyond Exact Matches
          </span>
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Uncover disguised paraphrasing and structural changes. Compare two documents or text passages side-by-side using advanced AI embeddings.
        </p>
      </div>

      <div className="w-full max-w-5xl">
        {error && (
          <div className="bg-red-900/30 text-red-400 p-4 rounded-xl flex items-start gap-3 mb-6 border border-red-800">
            <AlertCircle className="shrink-0 mt-0.5" size={18} />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6 mb-8 h-[400px]">
          <InputSection label="Document 1" docState={doc1} setDocState={setDoc1} />
          <div className="hidden md:flex items-center justify-center text-gray-600 font-bold italic">VS</div>
          <InputSection label="Document 2" docState={doc2} setDocState={setDoc2} />
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="text-white font-semibold mb-1">Sensitivity Threshold</h4>
              <p className="text-xs text-gray-400">
                Lower catches more subtle similarities, higher requires nearly identical phrasing.
              </p>
            </div>
            <div className="bg-gray-900 px-4 py-2 rounded-lg text-blue-400 font-bold border border-gray-700">
              {Math.round(threshold * 100)}%
            </div>
          </div>
          
          <input 
            type="range" 
            min="0.3" 
            max="0.95" 
            step="0.01" 
            value={threshold} 
            onChange={(e) => setThreshold(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        <button 
          onClick={startAnalysis}
          disabled={!isReady}
          className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2 ${
            isReady 
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 hover:-translate-y-0.5' 
              : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
          }`}
        >
          {isReady ? 'Start Analysis' : 'Provide content to begin'}
        </button>
      </div>
    </div>
  );
};

export default Home;
