
import React, { useState, useEffect, useCallback } from 'react';
import { ConversionHistoryItem } from './types';
import { parseMeasurement } from './services/geminiService';
import VisualRuler from './components/VisualRuler';

const IN_TO_MM = 25.4;

const App: React.FC = () => {
  const [inches, setInches] = useState<string>('1');
  const [mm, setMm] = useState<string>('25.4');
  const [history, setHistory] = useState<ConversionHistoryItem[]>([]);
  const [smartInput, setSmartInput] = useState<string>('');
  const [isParsing, setIsParsing] = useState(false);
  const [lastDirection, setLastDirection] = useState<'in2mm' | 'mm2in'>('in2mm');

  const addToHistory = useCallback((fromVal: number, fromUnit: 'in' | 'mm', toVal: number, toUnit: 'in' | 'mm') => {
    const newItem: ConversionHistoryItem = {
      id: Math.random().toString(36).substr(2, 9),
      fromValue: fromVal,
      fromUnit,
      toValue: toVal,
      toUnit,
      timestamp: Date.now(),
    };
    setHistory(prev => [newItem, ...prev].slice(0, 10));
  }, []);

  const handleInchChange = (val: string) => {
    setInches(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      const converted = num * IN_TO_MM;
      setMm(converted.toFixed(4).replace(/\.?0+$/, ''));
      setLastDirection('in2mm');
    } else {
      setMm('');
    }
  };

  const handleMmChange = (val: string) => {
    setMm(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      const converted = num / IN_TO_MM;
      setInches(converted.toFixed(4).replace(/\.?0+$/, ''));
      setLastDirection('mm2in');
    } else {
      setInches('');
    }
  };

  const handleSmartSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!smartInput.trim() || isParsing) return;

    setIsParsing(true);
    const result = await parseMeasurement(smartInput);
    setIsParsing(false);

    if (result && !isNaN(result.value)) {
      handleInchChange(result.value.toString());
      setSmartInput('');
      addToHistory(result.value, 'in', result.value * IN_TO_MM, 'mm');
    }
  };

  const handleSaveCurrent = () => {
    const iVal = parseFloat(inches);
    const mVal = parseFloat(mm);
    if (!isNaN(iVal) && !isNaN(mVal)) {
      if (lastDirection === 'in2mm') {
        addToHistory(iVal, 'in', mVal, 'mm');
      } else {
        addToHistory(mVal, 'mm', iVal, 'in');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Precision <span className="text-blue-600">Metric</span> Converter
          </h1>
          <p className="text-lg text-slate-500">Fast, accurate inches to millimeters conversion with AI smart parsing.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Converter Card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  {/* Inches Input */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-600 uppercase tracking-wider">Inches (in)</label>
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        value={inches}
                        onChange={(e) => handleInchChange(e.target.value)}
                        className="block w-full px-5 py-4 text-2xl font-bold bg-slate-50 border-2 border-transparent rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none mono"
                        placeholder="0.00"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">in</div>
                    </div>
                  </div>

                  {/* Swap Icon (Decorative/Visual) */}
                  <div className="hidden md:flex justify-center">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/></svg>
                    </div>
                  </div>

                  {/* Millimeters Input */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-600 uppercase tracking-wider">Millimeters (mm)</label>
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        value={mm}
                        onChange={(e) => handleMmChange(e.target.value)}
                        className="block w-full px-5 py-4 text-2xl font-bold bg-slate-50 border-2 border-transparent rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none mono"
                        placeholder="0.00"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">mm</div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="text-sm text-slate-500">
                    <span className="font-bold text-slate-700 italic">Formula:</span> 1 inch = 25.4 mm
                  </div>
                  <button
                    onClick={handleSaveCurrent}
                    className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                    Save Result
                  </button>
                </div>
              </div>
            </div>

            {/* Smart Input Card */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10H12V2z"/><path d="M12 12L2.1 12.3"/><path d="M12 12l9.8 3.6"/><path d="M12 12l-5.3 8.3"/></svg>
                </div>
                <h2 className="text-xl font-bold">AI Smart Parser</h2>
              </div>
              <p className="text-blue-100 mb-6 text-sm">Type natural measurements like "half an inch", "5 foot 10", or "quarter inch".</p>
              
              <form onSubmit={handleSmartSubmit} className="relative">
                <input
                  type="text"
                  value={smartInput}
                  onChange={(e) => setSmartInput(e.target.value)}
                  placeholder="e.g., 3 and a quarter inches"
                  className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-md"
                />
                <button
                  type="submit"
                  disabled={isParsing || !smartInput.trim()}
                  className="absolute right-2 top-2 bottom-2 px-6 bg-white text-blue-600 rounded-lg font-bold shadow-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isParsing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      Parsing...
                    </div>
                  ) : "Convert"}
                </button>
              </form>
            </div>

            {/* Visual Ruler */}
            <VisualRuler inches={parseFloat(inches) || 0} />
          </div>

          {/* History Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-800">Recent History</h2>
                <button 
                  onClick={() => setHistory([])}
                  className="text-xs font-medium text-slate-400 hover:text-red-500 transition-colors"
                >
                  Clear All
                </button>
              </div>

              {history.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <div className="mx-auto w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  </div>
                  <p className="text-sm text-slate-400">No conversions yet.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {history.map((item) => (
                    <div key={item.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 group transition-all hover:border-blue-200 hover:bg-blue-50/30">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-medium text-slate-400">{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <div className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-white border border-slate-200 rounded uppercase text-slate-500">
                          {item.fromUnit} to {item.toUnit}
                        </div>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-slate-700 mono">{item.fromValue} <span className="text-xs text-slate-400">{item.fromUnit}</span></span>
                        <svg className="text-slate-300" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                        <span className="text-lg font-bold text-blue-600 mono">{item.toValue.toFixed(2)} <span className="text-xs text-blue-400">{item.toUnit}</span></span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick References */}
            <div className="bg-slate-800 rounded-2xl p-6 text-slate-300 shadow-xl">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 7v14"/><path d="M3 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h18a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/><path d="M3 7h18"/><path d="M9 11h6"/><path d="M9 15h6"/><path d="M9 19h6"/></svg>
                Quick Ref
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-1 border-b border-slate-700/50">
                  <span>1/4 inch</span>
                  <span className="font-medium text-white">6.35 mm</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-700/50">
                  <span>1/2 inch</span>
                  <span className="font-medium text-white">12.7 mm</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-700/50">
                  <span>3/4 inch</span>
                  <span className="font-medium text-white">19.05 mm</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-700/50">
                  <span>1 inch</span>
                  <span className="font-medium text-white">25.4 mm</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span>12 inches (1 ft)</span>
                  <span className="font-medium text-white">304.8 mm</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
