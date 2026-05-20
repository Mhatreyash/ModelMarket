"use client";

import React, { useState } from 'react';
import { 
  Box, 
  Terminal, 
  ArrowRight, 
  Zap, 
  Code2, 
  FileText, 
  MessageSquare,
  Cpu,
  CheckCircle2,
  Loader2,
  ChevronRight,
  Boxes,
  CircleDollarSign
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ParticlesBackground } from '@/components/ParticlesBackground';

export default function Home() {
  const [demoState, setDemoState] = useState<'idle' | 'processing' | 'success'>('idle');
  const [resumeText, setResumeText] = useState('');
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

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

  const handleGenerate = async () => {
    if (!resumeText.trim()) return;
    
    setDemoState('processing');
    
    // Simulate UGF processing
    await new Promise(r => setTimeout(r, 2500));
    
    setDemoState('success');
  };

  return (
    <div className="min-h-screen font-sans">
      <ParticlesBackground />
      
      {/* Navbar */}
      <header className="sticky top-4 z-50 max-w-7xl mx-auto w-[calc(100%-2rem)] border border-zinc-200/80 dark:border-white/20 bg-white/60 dark:bg-black/40 backdrop-blur-2xl shadow-xl shadow-zinc-200/50 dark:shadow-lg dark:shadow-white/5 transition-colors duration-300 rounded-full">
        <div className="px-6 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium text-zinc-900 dark:text-white">
            <Box className="w-5 h-5" />
            <span>ModelMarket</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#marketplace" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">Marketplace</a>
            <a href="#demo" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">Developers</a>
            <a href="#docs" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">Docs</a>
            <a href="/dashboard" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">Console</a>
          </nav>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button 
              onClick={connectWallet}
              className="text-sm font-medium text-white dark:text-zinc-900 bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-100 px-5 py-2 rounded-full transition-all"
            >
              {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Connect Wallet'}
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-24 pb-16 px-6 relative overflow-hidden">
          <div className="max-w-3xl mx-auto text-center relative z-10">
            {/* Multi-color Mesh Gradient Behind Text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[900px] h-[400px] -z-10 pointer-events-none flex justify-center items-center opacity-90 dark:opacity-80">
              {/* Top Left: Purple/Lavender */}
              <div className="absolute w-[400px] h-[300px] bg-purple-300/60 dark:bg-purple-600/40 rounded-full blur-[90px] -translate-x-1/3 -translate-y-1/4"></div>
              {/* Top Right: Bright Peach/Orange */}
              <div className="absolute w-[400px] h-[300px] bg-orange-300/60 dark:bg-orange-600/40 rounded-full blur-[90px] translate-x-1/3 -translate-y-1/4"></div>
              {/* Bottom Left: Soft Cyan */}
              <div className="absolute w-[400px] h-[300px] bg-cyan-300/60 dark:bg-cyan-600/40 rounded-full blur-[90px] -translate-x-1/4 translate-y-1/4"></div>
              {/* Bottom Right: Warm Amber/Yellow */}
              <div className="absolute w-[400px] h-[300px] bg-amber-200/60 dark:bg-amber-600/40 rounded-full blur-[90px] translate-x-1/4 translate-y-1/4"></div>
            </div>
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Powered by UGF on Base Sepolia
            </div>
            <h1 className="text-4xl md:text-[4rem] font-serif font-semibold text-[#0f172a] dark:text-slate-100 tracking-tight leading-[1.1] mb-5">
              AI Micro-payments <br />
              <span className="text-3xl md:text-5xl font-sans font-light tracking-normal text-zinc-800 dark:text-zinc-300">
                Made Simple
              </span>
            </h1>
            <p className="text-base md:text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto mb-8 leading-relaxed">
              Access powerful AI tools through seamless gasless payments powered by UGF — no ETH, no subscriptions, no blockchain complexity.
            </p>
            <div className="flex items-center justify-center gap-4">
              <a href="#marketplace" className="bg-zinc-900 dark:bg-white text-white dark:text-black px-6 py-3 rounded-full font-medium flex items-center gap-2 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors">
                Explore Marketplace <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#demo" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white px-6 py-3 rounded-full font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                View Demo
              </a>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="docs" className="py-32 border-y border-zinc-200 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-950/50 px-6 relative overflow-hidden">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="mb-20 text-center">
              <h2 className="text-3xl font-medium text-zinc-900 dark:text-white mb-4">The Invisible Blockchain</h2>
              <p className="text-zinc-600 dark:text-zinc-400">A seamless payment experience, engineered for mainstream adoption.</p>
            </div>
            
            <div className="relative">
              {/* Vibrant Background Orbs */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1000px] h-full pointer-events-none -z-10">
                <div className="absolute -top-10 -left-10 w-72 h-72 bg-pink-400/50 dark:bg-pink-500/50 rounded-full blur-[70px]"></div>
                <div className="absolute -bottom-10 -right-10 w-80 h-80 bg-blue-400/50 dark:bg-blue-500/50 rounded-full blur-[80px]"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-purple-400/50 dark:bg-purple-500/50 rounded-full blur-[70px]"></div>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {/* Card 1 */}
                <div className="relative z-10 p-8 rounded-[2rem] border border-white/60 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-2xl shadow-xl shadow-zinc-200/50 dark:shadow-none transition-transform hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center shadow-lg shadow-pink-500/30 mb-8">
                    <Terminal className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-medium text-zinc-900 dark:text-white mb-3">1. Choose & Input</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Select a specialized AI model from our marketplace and provide your prompt or data.
                  </p>
                </div>
                
                {/* Card 2 */}
                <div className="relative z-10 p-8 rounded-[2rem] border border-white/60 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-2xl shadow-xl shadow-zinc-200/50 dark:shadow-none transition-transform hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/30 mb-8">
                    <CircleDollarSign className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-medium text-zinc-900 dark:text-white mb-3">2. Pay Micro-Amount</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Confirm a tiny payment (e.g., $0.05 Mock USD). UGF handles the ETH gas fee invisibly.
                  </p>
                </div>
                
                {/* Card 3 */}
                <div className="relative z-10 p-8 rounded-[2rem] border border-white/60 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-2xl shadow-xl shadow-zinc-200/50 dark:shadow-none transition-transform hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30 mb-8">
                    <Boxes className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-medium text-zinc-900 dark:text-white mb-3">3. Instant Generation</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Transaction clears instantly on Base Sepolia. The AI model returns the output seamlessly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Marketplace */}
        <section id="marketplace" className="py-32 px-6 relative overflow-hidden">
          {/* Vibrant Background Orbs for Marketplace */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1200px] h-full pointer-events-none -z-10">
            <div className="absolute top-20 right-20 w-80 h-80 bg-orange-400/40 dark:bg-orange-500/30 rounded-full blur-[80px]"></div>
            <div className="absolute bottom-20 left-20 w-80 h-80 bg-teal-400/40 dark:bg-teal-500/30 rounded-full blur-[80px]"></div>
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl font-medium text-zinc-900 dark:text-white mb-3">Available Models</h2>
                <p className="text-zinc-600 dark:text-zinc-400">Pay-per-use AI tools crafted by independent developers.</p>
              </div>
              <button className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1">
                View all <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="group relative z-10 p-8 rounded-[2rem] border border-white/60 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-2xl shadow-xl shadow-zinc-200/50 dark:shadow-none transition-all hover:-translate-y-1 hover:border-zinc-300 dark:hover:border-zinc-700">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-medium px-3 py-1 bg-white/50 dark:bg-zinc-900/50 border border-white/60 dark:border-white/10 rounded-full text-zinc-700 dark:text-zinc-300 backdrop-blur-md">
                    $0.10 / run
                  </span>
                </div>
                <h3 className="text-xl font-medium text-zinc-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Resume Roaster AI</h3>
                <p className="text-zinc-600 dark:text-zinc-400 mb-8 line-clamp-2 leading-relaxed">
                  Get brutal, actionable feedback on your resume from an elite tech recruiter AI model.
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500 font-medium">@recruiter_tech</span>
                  <a href="#demo" className="text-zinc-900 dark:text-white font-medium hover:underline flex items-center gap-1">Try Model <ArrowRight className="w-4 h-4" /></a>
                </div>
              </div>

              {/* Card 2 */}
              <div className="group relative z-10 p-8 rounded-[2rem] border border-white/60 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-2xl shadow-xl shadow-zinc-200/50 dark:shadow-none transition-all hover:-translate-y-1 hover:border-zinc-300 dark:hover:border-zinc-700">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-500/30">
                    <Code2 className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-medium px-3 py-1 bg-white/50 dark:bg-zinc-900/50 border border-white/60 dark:border-white/10 rounded-full text-zinc-700 dark:text-zinc-300 backdrop-blur-md">
                    $0.05 / run
                  </span>
                </div>
                <h3 className="text-xl font-medium text-zinc-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Code Reviewer Pro</h3>
                <p className="text-zinc-600 dark:text-zinc-400 mb-8 line-clamp-2 leading-relaxed">
                  Instant static analysis identifying security flaws and performance bottlenecks in your PRs.
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500 font-medium">@dev_ops</span>
                  <button className="text-zinc-900 dark:text-white font-medium hover:underline flex items-center gap-1">Try Model <ArrowRight className="w-4 h-4" /></button>
                </div>
              </div>

              {/* Card 3 */}
              <div className="group relative z-10 p-8 rounded-[2rem] border border-white/60 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-2xl shadow-xl shadow-zinc-200/50 dark:shadow-none transition-all hover:-translate-y-1 hover:border-zinc-300 dark:hover:border-zinc-700">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-fuchsia-400 to-pink-500 flex items-center justify-center shadow-lg shadow-fuchsia-500/30">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-medium px-3 py-1 bg-white/50 dark:bg-zinc-900/50 border border-white/60 dark:border-white/10 rounded-full text-zinc-700 dark:text-zinc-300 backdrop-blur-md">
                    $0.02 / run
                  </span>
                </div>
                <h3 className="text-xl font-medium text-zinc-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Social Caption Gen</h3>
                <p className="text-zinc-600 dark:text-zinc-400 mb-8 line-clamp-2 leading-relaxed">
                  High-engagement, platform-specific copy generation optimized for modern social algorithms.
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500 font-medium">@marketing_ai</span>
                  <button className="text-zinc-900 dark:text-white font-medium hover:underline flex items-center gap-1">Try Model <ArrowRight className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Live Demo */}
        <section id="demo" className="py-16 relative overflow-hidden px-6">
          {/* Ambient Background for Live Demo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1000px] h-[500px] -z-10 pointer-events-none opacity-50 dark:opacity-55">
            <div className="absolute w-[500px] h-[500px] bg-blue-400/40 dark:bg-blue-500/45 rounded-full blur-[100px] -translate-x-1/4 -translate-y-1/4"></div>
            <div className="absolute w-[500px] h-[500px] bg-amber-400/40 dark:bg-orange-500/45 rounded-full blur-[100px] translate-x-1/4 translate-y-1/4"></div>
          </div>

          <div className="max-w-5xl mx-auto relative z-10">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-medium text-zinc-900 dark:text-white mb-3">Live Integration Demo</h2>
              <p className="text-zinc-600 dark:text-zinc-400">Experience the UGF payment abstraction firsthand.</p>
            </div>

            <div className="relative z-10 border border-white/60 dark:border-white/10 rounded-[2rem] overflow-hidden bg-white/40 dark:bg-black/40 backdrop-blur-2xl shadow-xl shadow-zinc-200/50 dark:shadow-none grid md:grid-cols-2">
              
              {/* Input Side */}
              <div className="p-6 border-r border-white/60 dark:border-white/10 flex flex-col">
                <div className="flex items-center gap-2 mb-4 text-zinc-900 dark:text-white font-medium">
                  <FileText className="w-5 h-5" /> Resume Roaster AI
                </div>
                
                <div className="flex-1">
                  <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">Paste Resume Content</label>
                  <textarea 
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    className="w-full h-32 bg-white/50 dark:bg-black/50 border border-white/60 dark:border-white/10 rounded-lg p-4 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-all resize-none"
                    placeholder="E.g., Senior Software Engineer at XYZ Corp. Led a team of 5 to rebuild the core monolith into microservices..."
                  />
                </div>

                <div className="mt-6 pt-4 border-t border-white/60 dark:border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-zinc-500 mb-1">Execution Cost</div>
                    <div className="text-lg font-medium text-zinc-900 dark:text-white">$0.10 <span className="text-sm text-zinc-500 font-normal">Mock USD</span></div>
                  </div>
                  <button 
                    onClick={handleGenerate}
                    disabled={demoState === 'processing' || !resumeText.trim()}
                    className="bg-zinc-900 dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-full font-medium text-sm hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {demoState === 'processing' ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing</> : 'Analyze & Pay'}
                  </button>
                </div>
              </div>

              {/* Output Side */}
              <div className="p-6 bg-white/20 dark:bg-black/20 relative flex flex-col">
                <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-4 border-b border-white/60 dark:border-white/10 pb-3">
                  Output Console
                </div>
                
                <div className="flex-1 font-mono text-sm leading-relaxed relative">
                  {demoState === 'idle' && (
                    <div className="absolute inset-0 flex items-center justify-center text-zinc-500 dark:text-zinc-600 text-center px-6">
                      Awaiting input. Payment will be processed instantly via UGF.
                    </div>
                  )}

                  {demoState === 'processing' && (
                    <div className="space-y-4 animate-pulse">
                      <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400">
                        <Loader2 className="w-4 h-4 animate-spin text-zinc-400 dark:text-zinc-500" />
                        <span>Initializing secure connection...</span>
                      </div>
                      <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400/80">
                        <Zap className="w-4 h-4" />
                        <span>UGF intercepting $0.10 payment...</span>
                      </div>
                      <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400">
                        <CheckCircle2 className="w-4 h-4 text-green-600/50 dark:text-green-500/50" />
                        <span>Gas fee abstracted successfully.</span>
                      </div>
                      <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400">
                        <Loader2 className="w-4 h-4 animate-spin text-zinc-400 dark:text-zinc-500" />
                        <span>Awaiting AI inference...</span>
                      </div>
                    </div>
                  )}

                  {demoState === 'success' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                      <div className="inline-flex items-center gap-2 px-2 py-1 rounded bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 text-xs font-sans mb-4 border border-green-200 dark:border-green-500/20">
                        <CheckCircle2 className="w-3 h-3" /> Transaction Confirmed
                      </div>
                      
                      <div className="text-zinc-700 dark:text-zinc-300">
                        <span className="text-blue-600 dark:text-blue-400">System:</span> Analyzing provided resume...
                        <br /><br />
                        <span className="text-blue-600 dark:text-blue-400">Feedback:</span>
                        <br />
                        <span className="text-red-600 dark:text-red-400">[-]</span> Vague impact metrics detected. "Led a team" lacks scope. Quantify the team size and business outcome.
                        <br />
                        <span className="text-red-600 dark:text-red-400">[-]</span> Buzzword density is high, but actionable technical depth is missing in bullet 2.
                        <br />
                        <span className="text-green-600 dark:text-green-400">[+]</span> Strong progression shown in roles.
                        <br /><br />
                        <span className="text-blue-600 dark:text-blue-400">Verdict:</span> 6.5/10. Needs reframing for Senior roles.
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-900 bg-white dark:bg-black pt-16 pb-8 px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
          <div>
            <div className="flex items-center gap-2 font-medium text-zinc-900 dark:text-white mb-4">
              <Box className="w-5 h-5" />
              <span>ModelMarket</span>
            </div>
            <p className="text-sm text-zinc-500 max-w-xs">
              The frictionless micro-transaction hub for AI developers.
            </p>
          </div>
          <div className="flex gap-16">
            <div>
              <h4 className="text-sm font-medium text-zinc-900 dark:text-white mb-4">Platform</h4>
              <ul className="space-y-3 text-sm text-zinc-500">
                <li><a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Marketplace</a></li>
                <li><a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Developers</a></li>
                <li><a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-zinc-900 dark:text-white mb-4">Resources</h4>
              <ul className="space-y-3 text-sm text-zinc-500">
                <li><a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">GitHub</a></li>
                <li><a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">UGF SDK</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between pt-8 border-t border-zinc-200 dark:border-zinc-900 text-xs text-zinc-500 dark:text-zinc-600">
          <div>© 2026 ModelMarket Inc. All rights reserved.</div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <span>Built on Base Sepolia</span>
            <span>•</span>
            <span>Powered by UGF</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
