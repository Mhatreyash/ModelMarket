"use client";

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import FlowArt, { FlowSection } from '@/components/ui/story-scroll';
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
  CircleDollarSign,
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useUGFPayment } from '@/hooks/useUGFPayment';

export default function Home() {
  const [demoState, setDemoState] = useState<'idle' | 'processing' | 'success'>('idle');
  const [resumeText, setResumeText] = useState('');
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const { processPayment } = useUGFPayment();

  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('AI Micro-payment Made Simple');
  const [isAtTop, setIsAtTop] = useState<boolean>(true);
  // List of available models
  const availableModels = [
    { id: 'resume_roaster', name: 'Resume Roaster AI', cost: 0.1 },
    { id: 'code_reviewer', name: 'Code Reviewer Pro', cost: 0.05 },
    { id: 'social_caption_gen', name: 'Social Caption Gen', cost: 0.02 },
  ];
  const [selectedModel, setSelectedModel] = useState<{ id: string; name: string; cost: number }>(availableModels[0]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Track which FlowSection is currently visible to adapt header colors
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll('[data-flow-section]')) as HTMLElement[];
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const label = entry.target.getAttribute('aria-label') || '';
            setActiveSection(label);
          }
        });
      },
      { threshold: 0.6 },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Detect if the window is scrolled to top (to handle white strip/header initial state)
  useEffect(() => {
    const onScroll = () => setIsAtTop(window.scrollY < 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToSection = (label: string) => {
    const el = document.querySelector(`[data-flow-section][aria-label="${label}"]`) as HTMLElement | null;
    if (!el) return;

    const smoothScrollTo = (targetY: number, duration = 1100) => {
      const startY = window.scrollY;
      const diff = targetY - startY;
      let startTime: number | null = null;

      const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

      const step = (time: number) => {
        if (startTime === null) startTime = time;
        const elapsed = time - startTime;
        const progress = Math.min(1, elapsed / duration);
        const eased = easeInOutCubic(progress);
        window.scrollTo(0, Math.round(startY + diff * eased));
        if (elapsed < duration) requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
    };

    const rect = el.getBoundingClientRect();
    const targetY = rect.top + window.scrollY;
    smoothScrollTo(targetY, 1100);
  };

  const openDemoForModel = (model: { id: string; name: string; cost: number }, prefill?: string) => {
    setSelectedModel(model);
    if (prefill) setResumeText(prefill);
    // small timeout to allow state to update before scrolling
    setTimeout(() => scrollToSection('Live Integration Demo'), 80);
  };

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && typeof (window as any).ethereum !== 'undefined') {
      try {
        const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        }
      } catch (err) {
        console.error('Wallet connection failed:', err);
      }
    } else {
      alert('Please install MetaMask or another Web3 wallet to connect!');
    }
  };

  const handleGenerate = async () => {
    if (!resumeText.trim()) return;

    setDemoState('processing');
    const txHash = await processPayment(selectedModel.cost, selectedModel.id);

    if (txHash) {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4001';
        await fetch(`${backendUrl}/payments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            txHash,
            model: selectedModel.id,
            modelName: selectedModel.name,
            cost: selectedModel.cost,
            wallet: walletAddress,
            prompt: resumeText,
          }),
        });
        console.log('Logged payment to backend');
      } catch (err) {
        console.error('Failed to log to backend', err);
      }

      setDemoState('success');
    } else {
      setDemoState('idle');
    }
  };

  const isDark = resolvedTheme === 'dark';

  // Header color mapping based on active section
  let headerTextClass = 'text-white';
  let headerLinkClass = 'text-white/90 hover:text-white';
  let connectBtnClass = 'text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 px-5 py-2 rounded-full transition-all';

  if (isDark) {
    // Dark theme: prefer white text unless the active section is the light "Available Models"
    if (activeSection === 'Available Models') {
      headerTextClass = 'text-zinc-900';
      headerLinkClass = 'text-zinc-600 hover:text-zinc-900';
      connectBtnClass = 'text-sm font-medium text-black bg-white hover:bg-zinc-100 px-5 py-2 rounded-full transition-all';
    } else {
      headerTextClass = 'text-white';
      headerLinkClass = 'text-white/90 hover:text-white';
      connectBtnClass = 'text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 px-5 py-2 rounded-full transition-all';
    }
  } else {
    // Light theme: prefer dark text when at top or on the light section
    const isLightHeader = isAtTop || activeSection === 'Available Models';
    if (isLightHeader) {
      headerTextClass = 'text-zinc-900';
      headerLinkClass = 'text-zinc-600 hover:text-zinc-900';
      connectBtnClass = 'text-sm font-medium text-black bg-white hover:bg-zinc-100 px-5 py-2 rounded-full transition-all';
    } else {
      headerTextClass = 'text-white';
      headerLinkClass = 'text-white/90 hover:text-white';
      connectBtnClass = 'text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 px-5 py-2 rounded-full transition-all';
    }
  }

  return (
    <div className="min-h-screen font-sans transition-colors duration-300">
      {/* Header (sticky) */}
      <header className="sticky top-0 z-50 max-w-7xl mx-auto w-[calc(100%-2rem)] border border-white/20 bg-white/10 dark:border-black/20 dark:bg-black/20 backdrop-blur-2xl shadow-xl shadow-zinc-200/50 dark:shadow-lg dark:shadow-white/5 transition-all duration-300 rounded-full">
        <div className="px-6 md:px-8 h-16 flex items-center justify-between">
          <div className={`flex items-center gap-2 font-medium ${headerTextClass}`}>
            <Box className="w-5 h-5" />
            <span>ModelMarket</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <button type="button" onClick={() => scrollToSection('Available Models')} className={`${headerLinkClass} transition-colors`}>Marketplace</button>
            <button type="button" onClick={() => scrollToSection('Live Integration Demo')} className={`${headerLinkClass} transition-colors`}>Developers</button>
            <button type="button" onClick={() => scrollToSection('The Invisible Blockchain')} className={`${headerLinkClass} transition-colors`}>Docs</button>
            <a href="/dashboard" className={`${headerLinkClass} transition-colors`}>Console</a>
          </nav>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button onClick={connectWallet} className={connectBtnClass}>
              {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Connect Wallet'}
            </button>
          </div>
        </div>
      </header>

      <FlowArt aria-label="ModelMarket Scroll Demo">
        {/* 1 — Hero / AI Micro-payment Made Simple */}
        <FlowSection aria-label="AI Micro-payment Made Simple" style={{ backgroundColor: '#fd5200', color: '#fff' }}>
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-medium text-white/90 mb-6 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Powered by UGF on Base Sepolia
            </div>

            <h1 className="text-4xl md:text-[4rem] font-serif font-semibold text-white tracking-tight leading-[1.1] mb-5">
              AI Micro-payments <br />
              <span className="text-3xl md:text-5xl font-sans font-light tracking-normal text-white/95">Made Simple</span>
            </h1>

            <p className="text-base md:text-lg text-white/90 max-w-xl mx-auto mb-8 leading-relaxed">
              Access powerful AI tools through seamless gasless payments powered by UGF — no ETH, no subscriptions, no blockchain complexity.
            </p>

            <div className="flex items-center justify-center gap-4">
              <button type="button" onClick={() => scrollToSection('Available Models')} className="bg-zinc-900 dark:bg-white text-white dark:text-black px-6 py-3 rounded-full font-medium flex items-center gap-2 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-lg">
                Explore Marketplace <ArrowRight className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => scrollToSection('Live Integration Demo')} className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white px-6 py-3 rounded-full font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors backdrop-blur-md">
                View Demo
              </button>
            </div>
          </div>
        </FlowSection>

        {/* 2 — Invisible Blockchain / How It Works */}
        <FlowSection aria-label="The Invisible Blockchain" style={{ backgroundColor: '#000', color: '#fff' }}>
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="mb-20 text-center">
              <h2 className="text-3xl font-medium text-white mb-4">The Invisible Blockchain</h2>
              <p className="text-zinc-300">A seamless payment experience, engineered for mainstream adoption.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="relative z-10 p-8 rounded-[2rem] border border-white/20 bg-white/5 backdrop-blur-2xl shadow-xl shadow-zinc-200/20">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center shadow-lg mb-8">
                  <Terminal className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-medium text-white mb-3">1. Choose & Input</h3>
                <p className="text-zinc-300 leading-relaxed">Select a specialized AI model and provide your prompt or data.</p>
              </div>

              <div className="relative z-10 p-8 rounded-[2rem] border border-white/20 bg-white/5 backdrop-blur-2xl shadow-xl shadow-zinc-200/20">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center shadow-lg mb-8">
                  <CircleDollarSign className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-medium text-white mb-3">2. Pay Micro-Amount</h3>
                <p className="text-zinc-300 leading-relaxed">Confirm a tiny payment (e.g., $0.05 Mock USD). UGF handles the ETH gas fee invisibly.</p>
              </div>

              <div className="relative z-10 p-8 rounded-[2rem] border border-white/20 bg-white/5 backdrop-blur-2xl shadow-xl shadow-zinc-200/20">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center shadow-lg mb-8">
                  <Boxes className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-medium text-white mb-3">3. Instant Generation</h3>
                <p className="text-zinc-300 leading-relaxed">Transaction clears instantly. The AI model returns the output seamlessly.</p>
              </div>
            </div>
          </div>
        </FlowSection>

        {/* 3 — Available Models / Marketplace */}
        <FlowSection aria-label="Available Models" style={{ backgroundColor: '#F5F0E8', color: '#000' }}>
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl font-medium text-zinc-900 mb-3">Available Models</h2>
                <p className="text-zinc-600">Pay-per-use AI tools crafted by independent developers.</p>
              </div>
              <button className="text-sm text-zinc-600 hover:text-zinc-900 flex items-center gap-1">
                View all <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="group relative z-10 p-8 rounded-[2rem] border bg-white/60 backdrop-blur-2xl shadow-xl transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-lg">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-medium px-3 py-1 bg-white/50 rounded-full text-zinc-700">$0.10 / run</span>
                </div>
                <h3 className="text-xl font-medium text-zinc-900 mb-3">Resume Roaster AI</h3>
                <p className="text-zinc-600 mb-8 leading-relaxed">Get brutal, actionable feedback on your resume from an elite tech recruiter AI model.</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500 font-medium">@recruiter_tech</span>
                  <button type="button" onClick={() => openDemoForModel({ id: 'resume_roaster', name: 'Resume Roaster AI', cost: 0.1 })} className="text-zinc-900 font-medium hover:underline flex items-center gap-1">Try Model <ArrowRight className="w-4 h-4" /></button>
                </div>
              </div>

              <div className="group relative z-10 p-8 rounded-[2rem] border bg-white/60 backdrop-blur-2xl shadow-xl transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-lg">
                    <Code2 className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-medium px-3 py-1 bg-white/50 rounded-full text-zinc-700">$0.05 / run</span>
                </div>
                <h3 className="text-xl font-medium text-zinc-900 mb-3">Code Reviewer Pro</h3>
                <p className="text-zinc-600 mb-8 leading-relaxed">Instant static analysis identifying security flaws and performance bottlenecks in your PRs.</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500 font-medium">@dev_ops</span>
                  <button type="button" onClick={() => openDemoForModel({ id: 'code_reviewer', name: 'Code Reviewer Pro', cost: 0.05 })} className="text-zinc-900 font-medium hover:underline flex items-center gap-1">Try Model <ArrowRight className="w-4 h-4" /></button>
                </div>
              </div>

              <div className="group relative z-10 p-8 rounded-[2rem] border bg-white/60 backdrop-blur-2xl shadow-xl transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-fuchsia-400 to-pink-500 flex items-center justify-center shadow-lg">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-medium px-3 py-1 bg-white/50 rounded-full text-zinc-700">$0.02 / run</span>
                </div>
                <h3 className="text-xl font-medium text-zinc-900 mb-3">Social Caption Gen</h3>
                <p className="text-zinc-600 mb-8 leading-relaxed">High-engagement, platform-specific copy generation optimized for modern social algorithms.</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500 font-medium">@marketing_ai</span>
                  <button type="button" onClick={() => openDemoForModel({ id: 'social_caption_gen', name: 'Social Caption Gen', cost: 0.02 })} className="text-zinc-900 font-medium hover:underline flex items-center gap-1">Try Model <ArrowRight className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          </div>
        </FlowSection>

        {/* 4 — Live Integration Demo */}
        <FlowSection aria-label="Live Integration Demo" style={{ backgroundColor: '#1A3DE8', color: '#fff' }}>
          <div className="max-w-5xl mx-auto relative z-10">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-medium text-white mb-3">Live Integration Demo</h2>
              <p className="text-zinc-200">Experience the UGF payment abstraction firsthand.</p>
            </div>

            {/* Model Switcher Button Group */}
            <div className="flex justify-center gap-3 mb-6">
              {availableModels.map((model) => (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => setSelectedModel(model)}
                  className={`px-4 py-2 rounded-full font-medium text-sm border transition-all
                    ${selectedModel.id === model.id
                      ? 'bg-white text-blue-900 border-white shadow-lg'
                      : 'bg-white/10 text-white border-white/30 hover:bg-white/20'}
                  `}
                  aria-pressed={selectedModel.id === model.id}
                >
                  {model.name}
                </button>
              ))}
            </div>

            <div className="relative z-10 border border-white/20 rounded-[2rem] overflow-hidden bg-white/10 backdrop-blur-2xl shadow-xl grid md:grid-cols-2">
              <div className="p-6 border-r border-white/10 flex flex-col bg-white/5">
                <div className="flex items-center gap-2 mb-4 text-white font-medium">
                  <FileText className="w-5 h-5" /> {selectedModel?.name || 'Resume Roaster AI'}
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-zinc-200 mb-2">
                    {selectedModel.id === 'resume_roaster' && 'Paste Resume Content'}
                    {selectedModel.id === 'code_reviewer' && 'Paste Code or PR Diff'}
                    {selectedModel.id === 'social_caption_gen' && 'Describe Your Post'}
                  </label>
                  <textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    className="w-full h-32 bg-white/10 border border-white/10 rounded-lg p-4 text-sm text-white focus:outline-none resize-none"
                    placeholder={
                      selectedModel.id === 'resume_roaster'
                        ? 'E.g., Senior Software Engineer at XYZ Corp. Led a team of 5 to rebuild the core monolith into microservices...'
                        : selectedModel.id === 'code_reviewer'
                        ? 'E.g., diff --git a/app.js b/app.js\\n+ const x = 1;'
                        : 'E.g., Launching a new AI product for creators!'
                    }
                  />
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-white/80 mb-1">Execution Cost</div>
                    <div className="text-lg font-medium text-white">
                      ${selectedModel.cost.toFixed(2)} <span className="text-sm text-white/70 font-normal">Mock USD</span>
                    </div>
                  </div>
                  <button
                    onClick={handleGenerate}
                    disabled={demoState === 'processing' || !resumeText.trim()}
                    className="bg-white text-black px-6 py-2.5 rounded-full font-medium text-sm hover:bg-zinc-200 disabled:opacity-50 flex items-center gap-2"
                  >
                    {demoState === 'processing' ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing</> : 'Analyze & Pay'}
                  </button>
                </div>
              </div>

              <div className="p-6 bg-white/5 relative flex flex-col text-white">
                <div className="text-sm font-medium text-white mb-4 border-b border-white/10 pb-3">Output Console</div>

                <div className="flex-1 font-mono text-sm leading-relaxed relative">
                  {demoState === 'idle' && (
                    <div className="absolute inset-0 flex items-center justify-center text-white/80 text-center px-6">
                      Awaiting input. Payment will be processed instantly via UGF.
                    </div>
                  )}

                  {demoState === 'processing' && (
                    <div className="space-y-4 animate-pulse">
                      <div className="flex items-center gap-3 text-white/80">
                        <Loader2 className="w-4 h-4 animate-spin text-white/80" />
                        <span>Initializing secure connection...</span>
                      </div>
                      <div className="flex items-center gap-3 text-blue-200">
                        <Zap className="w-4 h-4" />
                        <span>UGF intercepting ${selectedModel.cost.toFixed(2)} payment...</span>
                      </div>
                      <div className="flex items-center gap-3 text-white/80">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        <span>Gas fee abstracted successfully.</span>
                      </div>
                      <div className="flex items-center gap-3 text-white/80">
                        <Loader2 className="w-4 h-4 animate-spin text-white/80" />
                        <span>Awaiting AI inference...</span>
                      </div>
                    </div>
                  )}

                  {demoState === 'success' && (
                    <div className="space-y-4">
                      <div className="inline-flex items-center gap-2 px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-sans mb-4 border border-green-200">
                        <CheckCircle2 className="w-3 h-3" /> Transaction Confirmed
                      </div>

                      <div className="text-white">
                        <span className="text-blue-200">System:</span> Analyzing provided input...
                        <br /><br />
                        <span className="text-blue-200">Result:</span>
                        <br />
                        <span className="text-green-300">Sample output for {selectedModel.name} (mock)</span>
                        <br /><br />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer inside last section */}
            <div className="mt-12 text-center text-sm text-white/80">© 2026 ModelMarket Inc. All rights reserved.</div>
          </div>
        </FlowSection>
      </FlowArt>
    </div>
  );
}
