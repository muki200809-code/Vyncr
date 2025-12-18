import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import useSWR from 'swr';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Settings, Github, Activity, RefreshCw, 
  Cpu, Search, CheckCircle, Menu, X, Info
} from 'lucide-react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"; 
const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function VyncrAdaptive() {
  const [repoUrl, setRepoUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);

  const { data: health, error: healthError } = useSWR(`${BACKEND_URL}/health`, fetcher, { 
    refreshInterval: 3000, 
  });
  const nodeStatus = !healthError && health?.status === 'operational' ? 'Stable' : 'Healing';

  const runForensicScan = async () => {
    if (!repoUrl) return;
    setIsScanning(true);
    setScanResult(null);
    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/scan/project`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo_url: repoUrl }),
      });
      const data = await response.json();
      setScanResult(data);
    } catch (e) { console.error(e); } finally { setIsScanning(false); }
  };

  return (
    <div className={`min-h-screen transition-all ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <Head><title>VYNCR | Adaptive Forensics</title></Head>

      {/* --- RESPONSIVE NAV --- */}
      <nav className="px-4 py-4 md:px-8 border-b border-slate-800/40 backdrop-blur-xl sticky top-0 z-[100] flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-500/20">
            <Shield size={20} className="text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter">VYNCR</span>
          <StatusBadge status={nodeStatus} />
        </div>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="text-slate-400 hover:text-white transition-colors">
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button onClick={() => setIsMenuOpen(true)} className="p-2 hover:bg-slate-800/50 rounded-full">
            <Settings size={22} className="text-slate-400" />
          </button>
        </div>

        {/* Mobile Nav Toggle */}
        <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24}/> : <Menu size={24}/>}
        </button>
      </nav>

      {/* --- HERO & INPUT --- */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          <div className="space-y-6 md:space-y-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-5xl md:text-8xl font-black leading-tight tracking-tighter">
                ACCURATE <br/><span className="text-blue-600">PROOFS.</span>
              </h1>
              <p className="text-slate-400 text-lg md:text-xl max-w-md mt-4">
                Verify human logic vs AI automation across entire repositories in seconds.
              </p>
            </motion.div>

            {/* TOUCH-OPTIMIZED INPUT */}
            <div className="p-2 md:p-3 rounded-2xl md:rounded-3xl bg-slate-900/40 border border-slate-800 flex flex-col md:flex-row gap-2 shadow-xl">
              <input 
                value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="Paste Repo URL..."
                className="flex-1 bg-transparent px-4 py-3 md:px-6 md:py-4 outline-none font-mono text-sm"
              />
              <button 
                onClick={runForensicScan} disabled={isScanning || !repoUrl}
                className="bg-blue-600 hover:bg-blue-500 px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-white transition-all flex items-center justify-center gap-2"
              >
                {isScanning ? <RefreshCw className="animate-spin" /> : <Search size={20} />}
                <span>{isScanning ? 'ANALYZING' : 'SCAN NOW'}</span>
              </button>
            </div>
          </div>

          {/* --- ADAPTIVE RESULT CARD --- */}
          <div className="w-full">
            <AnimatePresence mode="wait">
              {scanResult ? (
                <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-900 border border-blue-500/20 rounded-[2.5rem] p-6 md:p-12 shadow-2xl">
                  <div className="flex justify-between items-start mb-10">
                    <div>
                      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Trust Integrity</p>
                      <h2 className="text-6xl md:text-8xl font-black">{scanResult.score}%</h2>
                    </div>
                    <div className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1">
                      <CheckCircle size={12} /> VERIFIED
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 pt-8 border-t border-slate-800/50">
                    <StatBlock label="Entropy" value={`${scanResult.breakdown.originality}%`} info="Measures code logic randomness." />
                    <StatBlock label="Structural" value={`${scanResult.breakdown.structural_variance}%`} info="Measures code burstiness." />
                    <StatBlock label="Confidence" value={scanResult.confidence_level} info="System analysis certainty." />
                    <StatBoxMobile label="Node" value={scanResult.system} />
                  </div>
                </motion.div>
              ) : (
                <div className="aspect-square md:aspect-video border-2 border-dashed border-slate-800 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-700 text-center p-6">
                  <Cpu size={48} className="mb-4 opacity-10" />
                  <p className="font-bold">Waiting for input...</p>
                  <p className="text-xs mt-1">AI vs Human detection requires a valid GitHub URL.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* --- OVERLAY MENU (Mobile & Settings) --- */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed inset-0 bg-slate-950 z-[1000] p-8 md:max-w-md md:left-auto border-l border-slate-800 shadow-2xl">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-2xl font-black">OPTIONS</h2>
              <button onClick={() => setIsMenuOpen(false)}><X /></button>
            </div>
            <div className="space-y-6">
              <MenuOption label="Theme" action={() => setTheme(theme === 'dark' ? 'light' : 'dark')} value={theme.toUpperCase()} />
              <MenuOption label="GitHub Sync" action={() => {}} value="CONNECTED" />
              <MenuOption label="Notifications" action={() => {}} value="ENABLED" />
              <div className="pt-10">
                <button className="w-full bg-blue-600 p-4 rounded-xl font-black text-white">SAVE PREFERENCES</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function StatusBadge({ status }) {
  const isStable = status === 'Stable';
  return (
    <div className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase flex items-center gap-1 border ${isStable ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5' : 'border-amber-500/30 text-amber-500 bg-amber-500/5'}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${isStable ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
      {status}
    </div>
  );
}

function StatBlock({ label, value, info }) {
  return (
    <div className="group relative">
      <div className="flex justify-between items-center mb-1">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
        <Info size={10} className="text-slate-700 group-hover:text-blue-500 transition-colors" />
      </div>
      <div className="text-xl md:text-2xl font-black text-white">{value}</div>
      <div className="absolute top-full left-0 mt-2 bg-slate-800 text-[10px] p-2 rounded hidden group-hover:block z-50 w-40 border border-slate-700 shadow-xl">
        {info}
      </div>
    </div>
  );
}

function StatBoxMobile({ label, value }) {
  return (
    <div className="bg-slate-800/20 p-3 rounded-xl border border-slate-800/40">
       <span className="text-[9px] font-bold text-slate-600 uppercase block mb-1">{label}</span>
       <span className="text-sm font-black text-slate-400">{value}</span>
    </div>
  );
}

function MenuOption({ label, action, value }) {
  return (
    <button onClick={action} className="w-full flex justify-between items-center p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-blue-500/50 transition-all">
      <span className="font-bold text-slate-400">{label}</span>
      <span className="text-xs font-black text-blue-500">{value}</span>
    </button>
  );
}
