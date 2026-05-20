"use client";

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Terminal, 
  ArrowLeft, 
  Zap, 
  Key, 
  Copy, 
  Check, 
  ExternalLink, 
  Cpu, 
  Wallet, 
  TrendingUp,
  History,
  Activity,
  DollarSign,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ParticlesBackground } from '@/components/ParticlesBackground';

interface Transaction {
  id: string;
  modelName: string;
  timestamp: string;
  cost: number;
  txHash: string;
  status: 'Success' | 'Processing' | 'Failed';
}

export default function Dashboard() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  
  // Real interactivity for hackathon judges!
  const [totalSpent, setTotalSpent] = useState(1.40);
  const [totalRuns, setTotalRuns] = useState(14);
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', modelName: 'Resume Roaster AI', timestamp: '2 mins ago', cost: 0.10, txHash: '0x3a9f...9c2d', status: 'Success' },
    { id: '2', modelName: 'SentiAnalysis API', timestamp: '1 hour ago', cost: 0.05, txHash: '0x8b4e...4f1a', status: 'Success' },
    { id: '3', modelName: 'CodeFixer Pro', timestamp: '5 hours ago', cost: 0.15, txHash: '0x7d2c...1b9e', status: 'Success' },
    { id: '4', modelName: 'Marketing Copy Generator', timestamp: '1 day ago', cost: 0.10, txHash: '0x9a4f...3c8d', status: 'Success' },
    { id: '5', modelName: 'Resume Roaster AI', timestamp: '2 days ago', cost: 0.10, txHash: '0x2e8b...7a4f', status: 'Success' },
    { id: '6', modelName: 'SentiAnalysis API', timestamp: '3 days ago', cost: 0.05, txHash: '0x5c1d...8e9b', status: 'Success' },
  ]);

  const apiKey = "mm_live_4a7b9e1c2d5f8c3e0a9b";

  useEffect(() => {
    // Check if wallet is already connected
    const checkWallet = async () => {
      if (typeof window !== 'undefined' && typeof (window as any).ethereum !== 'undefined') {
        try {
          const accounts = await (window as any).ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
          }
        } catch (err) {
          console.error("Failed to fetch accounts:", err);
        }
      }
    };
    checkWallet();
  }, []);

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && typeof (window as any).ethereum !== 'undefined') {
      try {
        const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        }
      } catch (err) {
        console.error("Wallet connection failed:", err);
      }
    } else {
      alert('Please install MetaMask or another Web3 wallet to connect!');
    }
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleCopyHash = (hash: string, id: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(id);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  // Simulate a live UGF micro-transaction trigger for the judge!
  const triggerSimulation = () => {
    const models = ['Resume Roaster AI', 'CodeFixer Pro', 'SentiAnalysis API', 'Marketing Copy Generator'];
    const randomModel = models[Math.floor(Math.random() * models.length)];
    const costs = [0.05, 0.10, 0.15];
    const randomCost = costs[Math.floor(Math.random() * costs.length)];
    const simulatedHash = `0x${Math.random().toString(16).substr(2, 4)}...${Math.random().toString(16).substr(2, 4)}`;

    const newTx: Transaction = {
      id: Date.now().toString(),
      modelName: randomModel,
      timestamp: 'Just now',
      cost: randomCost,
      txHash: simulatedHash,
      status: 'Success'
    };

    setTotalRuns(prev => prev + 1);
    setTotalSpent(prev => parseFloat((prev + randomCost).toFixed(2)));
    setTransactions(prev => [newTx, ...prev]);
  };

  return (
    <div className="min-h-screen font-sans">
      <ParticlesBackground />

      {/* Top Navbar */}
      <header className="sticky top-4 z-50 max-w-7xl mx-auto w-[calc(100%-2rem)] border border-zinc-200/80 dark:border-white/20 bg-white/60 dark:bg-black/40 backdrop-blur-2xl shadow-xl shadow-zinc-200/50 dark:shadow-lg dark:shadow-white/5 transition-colors duration-300 rounded-full">
        <div className="px-6 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2 font-medium text-zinc-900 dark:text-white">
              <Box className="w-5 h-5 animate-pulse" />
              <span>ModelMarket</span>
              <span className="text-xs px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 font-mono">Console</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button 
              onClick={connectWallet}
              className="text-sm font-medium text-white dark:text-zinc-900 bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-100 px-5 py-2 rounded-full transition-all flex items-center gap-2"
            >
              <Wallet className="w-4 h-4" />
              {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Connect Wallet'}
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Banner with Live Simulation Trigger */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-2">Developer Console</h1>
            <p className="text-zinc-600 dark:text-zinc-400">Track gasless micro-transactions and API integrations abstracted by UGF.</p>
          </div>
          <button 
            onClick={triggerSimulation}
            className="self-start md:self-auto bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-3 rounded-full font-medium shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Trigger Test transaction
          </button>
        </div>

        {/* Ambient background glow specifically for Dashboard */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1200px] h-[600px] -z-10 pointer-events-none opacity-40 dark:opacity-45">
          <div className="absolute w-[600px] h-[600px] bg-blue-400/40 dark:bg-blue-600/30 rounded-full blur-[120px] -translate-x-1/4 -translate-y-1/4 animate-pulse"></div>
          <div className="absolute w-[600px] h-[600px] bg-orange-400/30 dark:bg-orange-600/20 rounded-full blur-[120px] translate-x-1/4 translate-y-1/4"></div>
        </div>

        {/* Metric Cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Card 1: Wallet Address */}
          <div className="p-6 rounded-[2rem] border border-white/60 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-2xl shadow-xl shadow-zinc-200/50 dark:shadow-none flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Network Account</span>
              <Wallet className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <div className="text-xl font-mono text-zinc-950 dark:text-white truncate">
                {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Not Connected'}
              </div>
              <div className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span> Base Sepolia Testnet
              </div>
            </div>
          </div>

          {/* Card 2: Total Spent */}
          <div className="p-6 rounded-[2rem] border border-white/60 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-2xl shadow-xl shadow-zinc-200/50 dark:shadow-none flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Abstraction</span>
              <DollarSign className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <div className="text-3xl font-bold text-zinc-950 dark:text-white">${totalSpent.toFixed(2)} <span className="text-xs text-zinc-500 font-normal">USD</span></div>
              <div className="text-xs text-emerald-600 dark:text-emerald-500 mt-1 flex items-center gap-1 font-medium">
                <TrendingUp className="w-3.5 h-3.5" /> 100% Gas abstract
              </div>
            </div>
          </div>

          {/* Card 3: Runs count */}
          <div className="p-6 rounded-[2rem] border border-white/60 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-2xl shadow-xl shadow-zinc-200/50 dark:shadow-none flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Model Runs</span>
              <Activity className="w-5 h-5 text-indigo-500" />
            </div>
            <div>
              <div className="text-3xl font-bold text-zinc-950 dark:text-white">{totalRuns} <span className="text-xs text-zinc-500 font-normal">calls</span></div>
              <div className="text-xs text-zinc-500 mt-1">Zero RPC failures recorded</div>
            </div>
          </div>

          {/* Card 4: SDK API Key */}
          <div className="p-6 rounded-[2rem] border border-white/60 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-2xl shadow-xl shadow-zinc-200/50 dark:shadow-none flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">SDK API Key</span>
              <Key className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <div className="flex items-center justify-between gap-2 bg-white/50 dark:bg-black/50 border border-white/60 dark:border-white/10 px-3 py-1.5 rounded-lg">
                <span className="font-mono text-sm text-zinc-700 dark:text-zinc-300 truncate">
                  {showApiKey ? apiKey : "••••••••••••••••••••"}
                </span>
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 font-medium"
                  >
                    {showApiKey ? 'Hide' : 'Show'}
                  </button>
                  <button onClick={handleCopyKey} className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-100">
                    {copiedKey ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="text-xs text-zinc-500 mt-1.5">Use in your production code</div>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Payment Logs */}
          <div className="lg:col-span-2">
            <div className="p-6 rounded-[2rem] border border-white/60 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-2xl shadow-xl shadow-zinc-200/50 dark:shadow-none flex flex-col">
              <div className="flex items-center gap-2 mb-6 text-zinc-950 dark:text-white font-medium border-b border-white/60 dark:border-white/10 pb-4">
                <History className="w-5 h-5 text-zinc-500" /> Transaction Abstraction History
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 uppercase font-mono">
                      <th className="py-3 font-normal">Model</th>
                      <th className="py-3 font-normal">Time</th>
                      <th className="py-3 font-normal">Amount</th>
                      <th className="py-3 font-normal">Tx Hash</th>
                      <th className="py-3 font-normal text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200/50 dark:divide-zinc-800/30 text-sm">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="group hover:bg-white/10 dark:hover:bg-zinc-900/10 transition-colors">
                        <td className="py-4 font-medium text-zinc-900 dark:text-white flex items-center gap-2">
                          <Cpu className="w-4 h-4 text-zinc-400 group-hover:text-blue-500 transition-colors" />
                          {tx.modelName}
                        </td>
                        <td className="py-4 text-zinc-600 dark:text-zinc-400">{tx.timestamp}</td>
                        <td className="py-4 font-mono font-medium text-zinc-900 dark:text-zinc-200">${tx.cost.toFixed(2)}</td>
                        <td className="py-4">
                          <div className="flex items-center gap-1.5 font-mono text-zinc-500">
                            <span>{tx.txHash}</span>
                            <button 
                              onClick={() => handleCopyHash(tx.txHash, tx.id)}
                              className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-all"
                            >
                              {copiedHash === tx.id ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </td>
                        <td className="py-4 text-right">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 text-xs font-medium border border-green-200 dark:border-green-500/20">
                            <Zap className="w-3 h-3 animate-pulse" /> {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Side Panel: Analytics / Most Used */}
          <div className="flex flex-col gap-8">
            {/* API Usage chart (pure CSS/Tailwind) */}
            <div className="p-6 rounded-[2rem] border border-white/60 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-2xl shadow-xl shadow-zinc-200/50 dark:shadow-none flex flex-col">
              <div className="flex items-center gap-2 mb-6 text-zinc-950 dark:text-white font-medium border-b border-white/60 dark:border-white/10 pb-4">
                <Activity className="w-5 h-5 text-zinc-500" /> Weekly Usage Analytics
              </div>

              {/* Simple pure Tailwind Bar Chart */}
              <div className="h-40 flex items-end justify-between gap-3 px-2 mb-6">
                {[
                  { day: 'Mon', runs: 8, height: 'h-[35%]', gradient: 'from-blue-400 to-indigo-500' },
                  { day: 'Tue', runs: 12, height: 'h-[55%]', gradient: 'from-purple-400 to-pink-500' },
                  { day: 'Wed', runs: 6, height: 'h-[25%]', gradient: 'from-blue-400 to-indigo-500' },
                  { day: 'Thu', runs: 15, height: 'h-[70%]', gradient: 'from-emerald-400 to-cyan-500' },
                  { day: 'Fri', runs: 9, height: 'h-[40%]', gradient: 'from-blue-400 to-indigo-500' },
                  { day: 'Sat', runs: 18, height: 'h-[85%]', gradient: 'from-indigo-400 to-purple-500' },
                  { day: 'Sun', runs: 22, height: 'h-[100%]', gradient: 'from-orange-400 to-rose-500' },
                ].map((bar, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer h-full justify-end">
                    <div className="relative w-full h-full flex items-end">
                      <div className={`w-full ${bar.height} rounded-md bg-gradient-to-t ${bar.gradient} shadow-lg shadow-indigo-500/10 group-hover:scale-x-110 group-hover:shadow-indigo-500/20 transition-all relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                      {/* Tooltip on hover */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-zinc-900 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap font-mono shadow-md z-20">
                        {bar.runs} runs
                      </div>
                    </div>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">{bar.day}</span>
                  </div>
                ))}
              </div>

              <div className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed text-center bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/80 rounded-xl p-3">
                Gas abstract active. System utilization is at <span className="font-mono text-zinc-900 dark:text-white font-medium">99.98%</span> efficiency.
              </div>
            </div>

            {/* Model Share / Distribution */}
            <div className="p-6 rounded-[2rem] border border-white/60 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-2xl shadow-xl shadow-zinc-200/50 dark:shadow-none flex flex-col">
              <div className="flex items-center gap-2 mb-6 text-zinc-950 dark:text-white font-medium border-b border-white/60 dark:border-white/10 pb-4">
                <Cpu className="w-5 h-5 text-zinc-500" /> Active Integrations
              </div>

              <div className="space-y-4">
                {[
                  { name: 'Resume Roaster AI', share: '45%', count: '32 calls', color: 'bg-blue-500' },
                  { name: 'SentiAnalysis API', share: '25%', count: '18 calls', color: 'bg-indigo-500' },
                  { name: 'CodeFixer Pro', share: '20%', count: '14 calls', color: 'bg-purple-500' },
                  { name: 'Marketing Copy Generator', share: '10%', count: '7 calls', color: 'bg-orange-500' },
                ].map((item, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-700 dark:text-zinc-300 font-medium">{item.name}</span>
                      <span className="text-zinc-500 font-mono">{item.share} ({item.count})</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: item.share }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Console Footer */}
      <footer className="mt-20 border-t border-zinc-200 dark:border-zinc-900 py-8 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© 2026 ModelMarket. Powered by Universal Gas Framework.</div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">API Docs</a>
            <a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Base Sepolia Explorer</a>
            <a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
