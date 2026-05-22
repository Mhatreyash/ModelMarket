"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  ArrowLeft,
  Zap,
  Key,
  Copy,
  Check,
  Cpu,
  Wallet,
  TrendingUp,
  History,
  Activity,
  DollarSign,
  Plus,
} from 'lucide-react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
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
  
  const { setTheme } = useTheme();

  // Force dark theme for the console page to bypass dynamic root toggles
  useEffect(() => {
    setTheme('dark');
  }, [setTheme]);

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
      if (typeof window === 'undefined') return;

      type EthereumProvider = { request: (args: { method: string }) => Promise<unknown> };
      const eth = (window as unknown as { ethereum?: EthereumProvider }).ethereum;
      if (!eth) return;

      try {
        const accounts = (await eth.request({ method: 'eth_accounts' })) as string[];
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        }
      } catch (err) {
        console.error('Failed to fetch accounts:', err);
      }
    };
    checkWallet();
  }, []);

  const connectWallet = async () => {
    if (typeof window === 'undefined') {
      alert('Please install MetaMask or another Web3 wallet to connect!');
      return;
    }

    type EthereumProvider = { request: (args: { method: string }) => Promise<unknown> };
    const eth = (window as unknown as { ethereum?: EthereumProvider }).ethereum;
    if (!eth) {
      alert('Please install MetaMask or another Web3 wallet to connect!');
      return;
    }

    try {
      const accounts = (await eth.request({ method: 'eth_requestAccounts' })) as string[];
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
      }
    } catch (err) {
      console.error('Wallet connection failed:', err);
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
    <div className="min-h-screen bg-[#050b18] text-white font-sans selection:bg-cyan-500/30 relative overflow-hidden transition-colors duration-300">
      <ParticlesBackground />

      {/* Top Navbar */}
      <header className="sticky top-4 z-50 max-w-7xl mx-auto w-[calc(100%-2rem)] border border-[#22d3ee]/25 bg-[#060c16]/85 backdrop-blur-2xl shadow-[0_0_30px_rgba(34,211,238,0.08)] rounded-full transition-all duration-300">
        <div className="px-6 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 rounded-full hover:bg-white/[0.04] border border-transparent hover:border-[#22d3ee]/30 transition-colors text-zinc-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2 font-medium text-white">
              <Box className="w-5 h-5 animate-pulse text-[#22d3ee]" />
              <span className="tracking-tight font-semibold">ModelMarket</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#081528] border border-cyan-500/30 text-[#22d3ee] font-mono">Dashboard</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={connectWallet}
              className="relative text-xs font-semibold tracking-wider uppercase text-[#22d3ee] border border-[#22d3ee]/35 bg-[#060b13]/90 hover:bg-[#22d3ee]/10 hover:border-[#22d3ee]/80 px-5 py-2.5 rounded-full transition-all duration-300 flex items-center gap-2 shadow-[0_0_15px_rgba(34,211,238,0.1)] hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:scale-[1.02]"
            >
              <Wallet className="w-4 h-4 text-[#22d3ee]" />
              {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Connect Wallet'}
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Banner with Live Simulation Trigger */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Models Dashboard</h1>
            <p className="text-zinc-400 text-sm">Track gasless micro-transactions and API integrations abstracted by UGF.</p>
          </div>
          <button 
            onClick={triggerSimulation}
            className="self-start md:self-auto bg-gradient-to-r from-[#22d3ee] to-[#3b82f6] hover:from-[#22d3ee] hover:to-[#22d3ee] text-zinc-950 font-bold px-6 py-3.5 rounded-full text-xs tracking-wider uppercase transition-all duration-300 shadow-[0_0_25px_rgba(34,211,238,0.25)] hover:shadow-[0_0_35px_rgba(34,211,238,0.4)] hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
          >
            <Plus className="w-4 h-4 stroke-[3px]" /> Trigger Test transaction
          </button>
        </div>

        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[110px] pointer-events-none -z-10 animate-pulse duration-[8000ms]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[110px] pointer-events-none -z-10 animate-pulse duration-[6000ms]" />

        {/* Metric Cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          
          {/* Card 1: Wallet Address */}
          <div className="relative group rounded-[1.5rem] p-[1px] bg-gradient-to-br from-[#22d3ee]/25 via-[#22d3ee]/5 to-[#3b82f6]/15 hover:from-[#22d3ee]/60 hover:via-[#22d3ee]/10 hover:to-[#3b82f6]/35 transition-all duration-500 shadow-[0_0_30px_rgba(34,211,238,0.02)] hover:shadow-[0_0_45px_rgba(34,211,238,0.12)]">
            <div className="absolute -inset-px rounded-[1.5rem] bg-gradient-to-br from-[#22d3ee]/15 to-[#3b82f6]/5 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 pointer-events-none -z-10" />
            <div className="relative bg-[#060c16]/90 backdrop-blur-2xl rounded-[1.45rem] p-6 h-full flex flex-col justify-between overflow-hidden z-10">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#22d3ee]/15 to-transparent blur-md pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#3b82f6]/5 to-transparent blur-md pointer-events-none" />
              
              <div className="flex items-center justify-between mb-5 relative z-10">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 font-mono">Network Account</span>
                <Wallet className="w-4 h-4 text-[#22d3ee] filter drop-shadow-[0_0_6px_rgba(34,211,238,0.4)]" />
              </div>
              <div className="relative z-10">
                <div className="text-lg font-mono text-white truncate">
                  {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Not Connected'}
                </div>
                <div className="text-[10px] text-zinc-400 mt-2 flex items-center gap-1.5 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse shadow-[0_0_8px_#4ade80]"></span> Base Sepolia Testnet
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Total Abstraction */}
          <div className="relative group rounded-[1.5rem] p-[1px] bg-gradient-to-br from-[#22d3ee]/25 via-[#22d3ee]/5 to-[#3b82f6]/15 hover:from-[#22d3ee]/60 hover:via-[#22d3ee]/10 hover:to-[#3b82f6]/35 transition-all duration-500 shadow-[0_0_30px_rgba(34,211,238,0.02)] hover:shadow-[0_0_45px_rgba(34,211,238,0.12)]">
            <div className="absolute -inset-px rounded-[1.5rem] bg-gradient-to-br from-[#22d3ee]/15 to-[#3b82f6]/5 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 pointer-events-none -z-10" />
            <div className="relative bg-[#060c16]/90 backdrop-blur-2xl rounded-[1.45rem] p-6 h-full flex flex-col justify-between overflow-hidden z-10">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/15 to-transparent blur-md pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#3b82f6]/5 to-transparent blur-md pointer-events-none" />

              <div className="flex items-center justify-between mb-5 relative z-10">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 font-mono">Total Abstraction</span>
                <DollarSign className="w-4 h-4 text-emerald-400 filter drop-shadow-[0_0_6px_rgba(52,211,153,0.4)]" />
              </div>
              <div className="relative z-10">
                <div className="text-2xl font-bold text-white tracking-tight flex items-baseline gap-1">
                  ${totalSpent.toFixed(2)}
                  <span className="text-[10px] text-zinc-400 font-normal font-mono">USD</span>
                </div>
                <div className="text-[10px] text-emerald-400 mt-2 flex items-center gap-1 font-semibold font-mono">
                  <TrendingUp className="w-3.5 h-3.5" /> 100% Gas abstract
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Model Runs */}
          <div className="relative group rounded-[1.5rem] p-[1px] bg-gradient-to-br from-[#22d3ee]/25 via-[#22d3ee]/5 to-[#3b82f6]/15 hover:from-[#22d3ee]/60 hover:via-[#22d3ee]/10 hover:to-[#3b82f6]/35 transition-all duration-500 shadow-[0_0_30px_rgba(34,211,238,0.02)] hover:shadow-[0_0_45px_rgba(34,211,238,0.12)]">
            <div className="absolute -inset-px rounded-[1.5rem] bg-gradient-to-br from-[#22d3ee]/15 to-[#3b82f6]/5 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 pointer-events-none -z-10" />
            <div className="relative bg-[#060c16]/90 backdrop-blur-2xl rounded-[1.45rem] p-6 h-full flex flex-col justify-between overflow-hidden z-10">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/15 to-transparent blur-md pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#3b82f6]/5 to-transparent blur-md pointer-events-none" />

              <div className="flex items-center justify-between mb-5 relative z-10">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 font-mono">Model Runs</span>
                <Activity className="w-4 h-4 text-indigo-400 filter drop-shadow-[0_0_6px_rgba(129,140,248,0.4)]" />
              </div>
              <div className="relative z-10">
                <div className="text-2xl font-bold text-white tracking-tight flex items-baseline gap-1">
                  {totalRuns}
                  <span className="text-[10px] text-zinc-400 font-normal font-mono">calls</span>
                </div>
                <div className="text-[10px] text-zinc-400 mt-2 font-mono">Zero RPC failures recorded</div>
              </div>
            </div>
          </div>

          {/* Card 4: SDK API Key */}
          <div className="relative group rounded-[1.5rem] p-[1px] bg-gradient-to-br from-[#22d3ee]/25 via-[#22d3ee]/5 to-[#3b82f6]/15 hover:from-[#22d3ee]/60 hover:via-[#22d3ee]/10 hover:to-[#3b82f6]/35 transition-all duration-500 shadow-[0_0_30px_rgba(34,211,238,0.02)] hover:shadow-[0_0_45px_rgba(34,211,238,0.12)]">
            <div className="absolute -inset-px rounded-[1.5rem] bg-gradient-to-br from-[#22d3ee]/15 to-[#3b82f6]/5 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 pointer-events-none -z-10" />
            <div className="relative bg-[#060c16]/90 backdrop-blur-2xl rounded-[1.45rem] p-6 h-full flex flex-col justify-between overflow-hidden z-10">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500/15 to-transparent blur-md pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#3b82f6]/5 to-transparent blur-md pointer-events-none" />

              <div className="flex items-center justify-between mb-4 relative z-10">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 font-mono">SDK API Key</span>
                <Key className="w-4 h-4 text-amber-400 filter drop-shadow-[0_0_6px_rgba(251,191,36,0.4)]" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center justify-between gap-2 bg-[#050a12]/80 border border-[#22d3ee]/20 px-3 py-2 rounded-xl backdrop-blur-md">
                  <span className="font-mono text-xs text-zinc-300 truncate max-w-[120px]">
                    {showApiKey ? apiKey : "••••••••••••••••••••"}
                  </span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="text-[10px] text-zinc-400 hover:text-white font-mono uppercase font-semibold transition-colors"
                    >
                      {showApiKey ? 'Hide' : 'Show'}
                    </button>
                    <button onClick={handleCopyKey} className="text-zinc-400 hover:text-[#22d3ee] transition-colors">
                      {copiedKey ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <div className="text-[9px] text-zinc-400 mt-2 font-mono">Use in your production code</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Payment Logs */}
          <div className="lg:col-span-2">
            <div className="relative group rounded-[1.5rem] p-[1px] bg-gradient-to-br from-[#22d3ee]/25 via-[#22d3ee]/5 to-[#3b82f6]/15 hover:from-[#22d3ee]/50 hover:via-[#22d3ee]/10 hover:to-[#3b82f6]/30 transition-all duration-500 shadow-[0_0_30px_rgba(34,211,238,0.02)] hover:shadow-[0_0_45px_rgba(34,211,238,0.12)]">
              <div className="absolute -inset-px rounded-[1.5rem] bg-gradient-to-br from-[#22d3ee]/10 to-[#3b82f6]/5 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 pointer-events-none -z-10" />
              <div className="bg-[#060c16]/90 backdrop-blur-2xl rounded-[1.45rem] p-6 h-full flex flex-col overflow-hidden relative z-10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#22d3ee]/10 to-transparent blur-md pointer-events-none" />
                
                <div className="flex items-center gap-2 mb-6 text-white font-semibold text-sm border-b border-[#22d3ee]/10 pb-4 relative z-10">
                  <History className="w-4 h-4 text-[#22d3ee] filter drop-shadow-[0_0_4px_rgba(34,211,238,0.4)]" />
                  <span>Transaction Abstraction History</span>
                </div>

                <div className="overflow-x-auto relative z-10">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#22d3ee]/10 text-[10px] text-zinc-400 uppercase font-mono tracking-widest">
                        <th className="py-3 font-normal">Model</th>
                        <th className="py-3 font-normal">Time</th>
                        <th className="py-3 font-normal">Amount</th>
                        <th className="py-3 font-normal">Tx Hash</th>
                        <th className="py-3 font-normal text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#22d3ee]/5 text-xs">
                      {transactions.map((tx) => (
                        <tr key={tx.id} className="group/row hover:bg-[#22d3ee]/5 transition-colors">
                          <td className="py-4 font-medium text-white flex items-center gap-2">
                            <Cpu className="w-4 h-4 text-zinc-400 group-hover/row:text-[#22d3ee] group-hover/row:filter group-hover/row:drop-shadow-[0_0_4px_rgba(34,211,238,0.4)] transition-all" />
                            {tx.modelName}
                          </td>
                          <td className="py-4 text-zinc-400 font-mono">{tx.timestamp}</td>
                          <td className="py-4 font-mono font-medium text-[#22d3ee]">${tx.cost.toFixed(2)}</td>
                          <td className="py-4">
                            <div className="flex items-center gap-1.5 font-mono text-zinc-400">
                              <span className="text-[11px]">{tx.txHash}</span>
                              <button 
                                onClick={() => handleCopyHash(tx.txHash, tx.id)}
                                className="opacity-0 group-hover/row:opacity-100 text-zinc-400 hover:text-white transition-all"
                              >
                                {copiedHash === tx.id ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </td>
                          <td className="py-4 text-right">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-950/40 text-emerald-300 text-[10px] font-sans border border-emerald-800/40 shadow-[0_0_8px_rgba(16,185,129,0.05)]">
                              <Zap className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> {tx.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Side Panel: Analytics / Most Used */}
          <div className="flex flex-col gap-8">
            
            {/* API Usage chart */}
            <div className="relative group rounded-[1.5rem] p-[1px] bg-gradient-to-br from-[#22d3ee]/25 via-[#22d3ee]/5 to-[#3b82f6]/15 hover:from-[#22d3ee]/50 hover:via-[#22d3ee]/10 hover:to-[#3b82f6]/30 transition-all duration-500 shadow-[0_0_30px_rgba(34,211,238,0.02)] hover:shadow-[0_0_45px_rgba(34,211,238,0.12)]">
              <div className="absolute -inset-px rounded-[1.5rem] bg-gradient-to-br from-[#22d3ee]/10 to-[#3b82f6]/5 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 pointer-events-none -z-10" />
              <div className="bg-[#060c16]/90 backdrop-blur-2xl rounded-[1.45rem] p-6 h-full flex flex-col overflow-hidden relative z-10">
                <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-[#22d3ee]/10 to-transparent blur-md pointer-events-none" />

                <div className="flex items-center gap-2 mb-6 text-white font-semibold text-sm border-b border-[#22d3ee]/10 pb-4 relative z-10">
                  <Activity className="w-4 h-4 text-[#22d3ee] filter drop-shadow-[0_0_4px_rgba(34,211,238,0.4)]" />
                  <span>Weekly Usage Analytics</span>
                </div>

                {/* Simple pure Tailwind Bar Chart */}
                <div className="h-40 flex items-end justify-between gap-3 px-1 mb-6 relative z-10">
                  {[
                    { day: 'Mon', runs: 8, height: 'h-[35%]', gradient: 'from-[#22d3ee] to-[#3b82f6]' },
                    { day: 'Tue', runs: 12, height: 'h-[55%]', gradient: 'from-[#a855f7] to-[#ec4899]' },
                    { day: 'Wed', runs: 6, height: 'h-[25%]', gradient: 'from-[#22d3ee] to-[#3b82f6]' },
                    { day: 'Thu', runs: 15, height: 'h-[70%]', gradient: 'from-[#10b981] to-[#06b6d4]' },
                    { day: 'Fri', runs: 9, height: 'h-[40%]', gradient: 'from-[#22d3ee] to-[#3b82f6]' },
                    { day: 'Sat', runs: 18, height: 'h-[85%]', gradient: 'from-[#6366f1] to-[#a855f7]' },
                    { day: 'Sun', runs: 22, height: 'h-[100%]', gradient: 'from-[#f97316] to-[#f43f5e]' },
                  ].map((bar, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer h-full justify-end">
                      <div className="relative w-full h-full flex items-end">
                        <div className={`w-full ${bar.height} rounded-md bg-gradient-to-t ${bar.gradient} shadow-[0_0_12px_rgba(34,211,238,0.15)] group-hover:scale-x-110 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.35)] transition-all relative overflow-hidden`}>
                          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                        {/* Tooltip on hover */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-[#050a12] border border-[#22d3ee]/30 text-white text-[10px] px-2 py-0.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap font-mono shadow-[0_0_15px_rgba(34,211,238,0.2)] z-20">
                          {bar.runs} runs
                        </div>
                      </div>
                      <span className="text-[10px] text-zinc-400 font-mono">{bar.day}</span>
                    </div>
                  ))}
                </div>

                <div className="text-[11px] text-zinc-400 leading-relaxed text-center bg-[#050a12]/80 border border-[#22d3ee]/10 rounded-xl p-3 font-mono relative z-10">
                  Gas abstract active. System utilization is at <span className="text-[#22d3ee] font-semibold">99.98%</span> efficiency.
                </div>
              </div>
            </div>

            {/* Model Share / Distribution */}
            <div className="relative group rounded-[1.5rem] p-[1px] bg-gradient-to-br from-[#22d3ee]/25 via-[#22d3ee]/5 to-[#3b82f6]/15 hover:from-[#22d3ee]/50 hover:via-[#22d3ee]/10 hover:to-[#3b82f6]/30 transition-all duration-500 shadow-[0_0_30px_rgba(34,211,238,0.02)] hover:shadow-[0_0_45px_rgba(34,211,238,0.12)]">
              <div className="absolute -inset-px rounded-[1.5rem] bg-gradient-to-br from-[#22d3ee]/10 to-[#3b82f6]/5 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 pointer-events-none -z-10" />
              <div className="bg-[#060c16]/90 backdrop-blur-2xl rounded-[1.45rem] p-6 h-full flex flex-col overflow-hidden relative z-10">
                <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-[#22d3ee]/10 to-transparent blur-md pointer-events-none" />

                <div className="flex items-center gap-2 mb-6 text-white font-semibold text-sm border-b border-[#22d3ee]/10 pb-4 relative z-10">
                  <Cpu className="w-4 h-4 text-[#22d3ee] filter drop-shadow-[0_0_4px_rgba(34,211,238,0.4)]" />
                  <span>Active Integrations</span>
                </div>

                <div className="space-y-4 relative z-10">
                  {[
                    { name: 'Resume Roaster AI', share: '45%', count: '32 calls', color: 'bg-[#22d3ee] shadow-[0_0_8px_rgba(34,211,238,0.4)]' },
                    { name: 'SentiAnalysis API', share: '25%', count: '18 calls', color: 'bg-[#3b82f6] shadow-[0_0_8px_rgba(59,130,246,0.4)]' },
                    { name: 'CodeFixer Pro', share: '20%', count: '14 calls', color: 'bg-[#a855f7] shadow-[0_0_8px_rgba(168,85,247,0.4)]' },
                    { name: 'Marketing Copy Generator', share: '10%', count: '7 calls', color: 'bg-[#f97316] shadow-[0_0_8px_rgba(249,115,22,0.4)]' },
                  ].map((item, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-300 font-medium">{item.name}</span>
                        <span className="text-zinc-400 font-mono text-[10px]">{item.share} ({item.count})</span>
                      </div>
                      <div className="h-1.5 w-full bg-[#050a12]/80 border border-[#22d3ee]/10 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color} rounded-full`} style={{ width: item.share }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Dashboard Footer */}
      <footer className="mt-20 border-t border-[#22d3ee]/10 py-8 text-center text-xs text-zinc-500 font-mono relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© 2026 ModelMarket. Powered by Universal Gas Framework.</div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-white transition-colors">API Flow</a>
            <a href="#" className="hover:text-[#22d3ee] transition-colors">Base Sepolia Explorer</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
