import React, { useState } from 'react';
import { FileText, Layers, AlertTriangle, CheckCircle, ArrowLeft, Download, Maximize2 } from 'lucide-react';

const Analysis = ({ data, onReset }) => {
  const [selectedMatch, setSelectedMatch] = useState(null);

  const { summary, documents, document_similarity, passage_matches } = data;

  const downloadReport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "doculens_report.json");
    document.body.appendChild(downloadAnchorNode); 
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="py-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <button 
          onClick={onReset}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-medium text-sm bg-gray-800 py-2 px-4 rounded-lg border border-gray-700 shadow-sm hover:bg-gray-700"
        >
          <ArrowLeft size={16} /> New Analysis
        </button>
        <h2 className="text-2xl font-bold text-white">Analysis Results</h2>
        <button 
          onClick={downloadReport}
          className="flex items-center gap-2 text-blue-400 hover:text-white hover:bg-blue-600 transition-colors font-medium text-sm bg-gray-800 py-2 px-4 rounded-lg border border-blue-900 shadow-sm"
        >
          <Download size={16} /> Export JSON
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 p-5 rounded-xl border border-gray-700 shadow-sm flex flex-col justify-between">
          <div className="text-gray-400 mb-2 flex items-center gap-2"><FileText size={18} /> Sources</div>
          <div className="text-3xl font-bold text-white">{summary.documents_analyzed}</div>
        </div>
        <div className="bg-gray-800 p-5 rounded-xl border border-gray-700 shadow-sm flex flex-col justify-between">
          <div className="text-gray-400 mb-2 flex items-center gap-2"><Layers size={18} /> Total Sections</div>
          <div className="text-3xl font-bold text-white">{summary.total_chunks}</div>
        </div>
        <div className="bg-gray-800 p-5 rounded-xl border border-gray-700 shadow-sm flex flex-col justify-between">
          <div className="text-gray-400 mb-2 flex items-center gap-2"><AlertTriangle size={18} /> Peak Similarity</div>
          <div className="text-3xl font-bold text-orange-400">{(summary.highest_similarity * 100).toFixed(1)}%</div>
        </div>
        <div className="bg-gray-800 p-5 rounded-xl border border-gray-700 shadow-sm flex flex-col justify-between">
          <div className="text-gray-400 mb-2 flex items-center gap-2"><CheckCircle size={18} /> Potential Matches</div>
          <div className="text-3xl font-bold text-blue-400">{summary.potential_matches}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Docs & Matrix */}
        <div className="lg:col-span-1 space-y-8">
          
          <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-sm p-6">
            <h3 className="font-bold text-lg mb-4 text-white">Source Overview</h3>
            <div className="space-y-3">
              {documents.map((doc, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-gray-900 rounded-lg border border-gray-700">
                  <span className="font-medium text-sm text-gray-200 truncate w-32" title={doc.name}>{doc.name}</span>
                  <div className="text-xs text-gray-500 flex gap-3">
                    <span>{doc.pages} pgs</span>
                    <span>{doc.chunks} chks</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-sm p-6">
            <h3 className="font-bold text-lg mb-1 text-white">Similarity Matrix</h3>
            <p className="text-xs text-gray-400 mb-4">Highest semantic similarity between pairs</p>
            <div className="space-y-4">
              {document_similarity.map((sim, idx) => (
                <div key={idx} className="border-b border-gray-700 pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between text-sm font-medium mb-2">
                    <span className="text-gray-300 truncate w-24" title={sim.document_a}>{sim.document_a}</span>
                    <span className="text-gray-500">vs</span>
                    <span className="text-gray-300 truncate w-24 text-right" title={sim.document_b}>{sim.document_b}</span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">Semantic</span>
                        <span className="font-semibold text-gray-200">{(sim.semantic_similarity * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-900 rounded-full h-1.5">
                        <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${sim.semantic_similarity * 100}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">Lexical (TF-IDF)</span>
                        <span className="font-semibold text-gray-200">{(sim.lexical_similarity * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-900 rounded-full h-1.5">
                        <div className="bg-indigo-400 h-1.5 rounded-full" style={{ width: `${sim.lexical_similarity * 100}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">Exact Match</span>
                        <span className="font-semibold text-gray-200">{(sim.exact_similarity * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-900 rounded-full h-1.5">
                        <div className="bg-gray-500 h-1.5 rounded-full" style={{ width: `${sim.exact_similarity * 100}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>

        {/* Right Column: Passages */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-sm p-6 h-full flex flex-col">
            <h3 className="font-bold text-lg mb-1 text-white">Passage Matches</h3>
            <p className="text-sm text-gray-400 mb-6">Showing most semantically similar passages</p>
            
            {passage_matches.length === 0 ? (
              <div className="flex-grow flex flex-col items-center justify-center text-gray-500">
                <CheckCircle size={48} className="mb-4 text-green-500" />
                <p>No significant similarities found above threshold.</p>
              </div>
            ) : (
              <div className="space-y-4 flex-grow overflow-y-auto pr-2 custom-scrollbar max-h-[700px]">
                {passage_matches.map((match, idx) => (
                  <div 
                    key={idx} 
                    className="border border-gray-700 rounded-xl overflow-hidden hover:border-gray-500 transition-colors bg-gray-900"
                  >
                    <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex justify-between items-center">
                      <span className="text-xs font-bold text-blue-400 bg-blue-900/30 px-3 py-1 rounded-full border border-blue-800">
                        {(match.semantic_similarity * 100).toFixed(1)}% Match
                      </span>
                      <div className="flex gap-4 text-xs font-medium text-gray-400">
                        <span>{match.document_a} (Pg {match.page_a})</span>
                        <span>vs</span>
                        <span>{match.document_b} (Pg {match.page_b})</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-700">
                      <div className="p-4 text-sm text-gray-300 leading-relaxed">
                        <p className="mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Source 1</p>
                        {match.text_a}
                      </div>
                      <div className="p-4 text-sm text-gray-300 leading-relaxed bg-yellow-900/10">
                        <p className="mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Source 2</p>
                        {match.text_b}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
