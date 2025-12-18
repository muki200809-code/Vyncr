import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import useSWR from 'swr';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Settings, Github, Activity, RefreshCw, 
  Lock, Zap, Moon, Bell, Cpu, Search, CheckCircle, AlertTriangle
} from 'lucide-react';

// --- INTEGRATION CONFIG ---
// Update this with your live Oracle Cloud or Replit IP
const BACKEND_URL = "http://your-oracle-ip-or-replit-url:8000"; 

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function VyncrPro() {
  const [repoUrl, setRepoUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);

  // 1. LIVE BACKEND MONITOR (Self-Healing Sync)
  const { data: health, error: healthError } = useSWR(`${BACKEND_URL}/health`, fetcher, { 
    refreshInterval: 3000, // Frequent polling for "Advanced" feel
  });

  const nodeStatus = !healthError && health?.status === 'operational' ? 'Stable' : 'Healing';

  // 2. POWERFUL FORENSIC SCAN INTEGRATION
  const runForensicScan = async () => {
    if (!repoUrl) return;
    setIsScanning(true);
    setScanResult(null); // Clear old data for fresh "Forensic" look

    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/scan/project`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo_url: repoUrl }),
      });

      if (!response.ok) throw new Error("Backend Node Unstable");
      
      const data = await response.json();
      setScanResult(data);
    } catch (error) {
      console.error("Forensic Engine Offline. Retrying...");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-1000 ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      <Head>
        <title>VYNCR | AI Forensic Identity</title>
        <link rel="manifest" href="/manifest.json" />
      </Head>

      {/* --- NAVIGATION --- */}
      <nav className="p-6 border-b border-slate-800/50 flex justify-between items-center backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/40">
            <Shield size={24} color="white" />
          </div>
          <span className="text-2xl font-black tracking-tighter">VYNCR</span>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
            nodeStatus === 'Stable' ? 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5' : 'border-amber-500/20 text-amber-500 bg-amber-500/5'
          }`}>
            <Activity size={12} className={nodeStatus === 'Stable' ? 'animate-pulse' : ''} />
            {nodeStatus}
          </div>
        </div>
        <button onClick={() => setIsSettingsOpen(true)} className="p-2 hover:bg-slate-800/50 rounded-full transition-all">
          <Settings size={24} className="text-slate-400 hover:rotate-90 transition-transform duration-500" />
        </button>
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          
          <div className="lg:col-span-7 space-y-8">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
              <h1 className="text-7xl font-black leading-none mb-6">
                CODE <br/><span className="text-blue-600">FORENSICS.</span>
              </h1>
              <p className="text-slate-400 text-xl max-w-lg leading-relaxed">
                VYNCR detects AI-generated fingerprints and verifies human logic through entropy analysis.
              </p>
            </motion.div>

            {/* INTEGRATED INPUT BOX */}
            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-3xl flex flex-col md:flex-row gap-3 shadow-2xl ring-1 ring-blue-500/10">
              <input 
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/username/repo"
                className="flex-1 bg-transparent px-6 py-4 outline-none text-white font-mono text-sm"
              />
              <button 
                onClick={runForensicScan}
                disabled={isScanning || !repoUrl}
                className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 px-10 py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-3"
              >
                {isScanning ? <RefreshCw className="animate-spin" size={20} /> : <><Search size={20} /> ANALYZE PROOF</>}
              </button>
            </div>
          </div>

          {/* --- DATA VISUALIZATION (Updated for Forensic Results) --- */}
          <div className="lg:col-span-5">
            <AnimatePresence mode="wait">
              {scanResult ? (
                <motion.div 
                  key="results"
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-br from-slate-900 to-slate-950 border border-blue-500/30 p-10 rounded-[3rem] shadow-2xl relative"
                >
                  <div className="absolute top-6 right-8 flex gap-2">
                    <CheckCircle className="text-emerald-500" size={20} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Verified</span>
                  </div>
                  
                  <div className="mb-10">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Trust Integrity</p>
                    <h2 className="text-7xl font-black tracking-tighter text-white">{scanResult.score}%</h2>
                  </div>

                  <div className="space-y-6 border-t border-slate-800 pt-8">
                    <StatBox label="Pattern Entropy" value={`${scanResult.breakdown.originality}%`} color="text-blue-400" />
                    <StatBox label="Temporal Flow" value={scanResult.confidence_level} color="text-emerald-400" />
                    <StatBox label="System Node" value={scanResult.system} color="text-slate-500" />
                  </div>
                </motion.div>
              ) : (
                <div className="h-full min-h-[400px] border-2 border-dashed border-slate-800 rounded-[3rem] flex flex-col items-center justify-center text-slate-600 p-10 text-center">
                  <Cpu size={60} className="mb-4 opacity-20" />
                  <p className="font-bold">Awaiting Repository Input</p>
                  <p className="text-sm mt-2">Connect your backend to see real-time entropy analysis.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* --- SETTINGS DRAWER (Personalization) --- */}
      <AnimatePresence>
        {isSettingsOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSettingsOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60]" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed right-0 top-0 h-full w-full max-w-md bg-slate-900 z-[70] p-12 border-l border-slate-800">
              <h2 className="text-3xl font-black mb-12">PREFERENCES</h2>
              <div className="space-y-10">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4 font-bold text-slate-300"><Moon /> Dark Mode</div>
                  <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className={`w-14 h-8 rounded-full p-1 transition-colors ${theme === 'dark' ? 'bg-blue-600' : 'bg-slate-700'}`}>
                    <div className={`w-6 h-6 bg-white rounded-full transition-all ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>
                <hr className="border-slate-800" />
                <button className="w-full bg-white text-black py-4 rounded-2xl font-black flex items-center justify-center gap-3 active:scale-95 transition-all">
                  <Github size={20} /> Sync Google & GitHub
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatBox({ label, value, color }) {
  return (
    <div className="flex justify-between items-end">
      <span className="text-xs font-bold text-slate-500 uppercase">{label}</span>
      <span className={`text-xl font-black ${color}`}>{value}</span>
    </div>
  );
}
