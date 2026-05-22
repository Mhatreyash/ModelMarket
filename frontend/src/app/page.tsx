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
  CheckCircle2,
  Loader2,
  ChevronRight,
  Boxes,
  CircleDollarSign,
  Calendar,
  Calculator,
  User,
  CreditCard,
  Search,
  Menu,
  X,
  Wallet,
} from 'lucide-react';
import { useUGFPayment } from '@/hooks/useUGFPayment';

export default function Home() {
  const [demoState, setDemoState] = useState<'idle' | 'processing' | 'success'>('idle');
  const [resumeText, setResumeText] = useState('');
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const { processPayment } = useUGFPayment();

  const { resolvedTheme } = useTheme();
  const [activeSection, setActiveSection] = useState<string>('AI Micro-payment Made Simple');
  const [isAtTop, setIsAtTop] = useState<boolean>(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  // List of available models
  const availableModels = [
    { id: 'resume_roaster', name: 'Resume Roaster AI', cost: 0.1 },
    { id: 'code_reviewer', name: 'Code Reviewer Pro', cost: 0.05 },
    { id: 'social_caption_gen', name: 'Social Caption Gen', cost: 0.02 },
  ];
  const [selectedModel, setSelectedModel] = useState<{ id: string; name: string; cost: number }>(availableModels[0]);

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
  const isLightSection = activeSection === 'The Invisible Blockchain';

  let headerBgClass = '';
  let headerTextClass = '';
  let headerLinkClass = '';
  let connectBtnClass = '';

  if (isLightSection) {
    // Light header style for the white section ("The Invisible Blockchain")
    headerBgClass = 'border-zinc-200/60 bg-white/70 shadow-lg shadow-zinc-200/30';
    headerTextClass = 'text-zinc-900';
    headerLinkClass = 'text-zinc-600 hover:text-zinc-900';
    connectBtnClass = 'text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 px-5 py-2 rounded-full transition-all';
  } else {
    // Dark header style for the dark sections (Hero, cobalt blue, black)
    headerBgClass = 'border-white/15 bg-black/25 shadow-xl shadow-black/20';
    headerTextClass = 'text-white';
    headerLinkClass = 'text-white/80 hover:text-white';
    connectBtnClass = 'text-sm font-medium text-zinc-900 bg-white hover:bg-zinc-100 px-5 py-2 rounded-full transition-all';
  }

  return (
    <div className="min-h-screen font-sans transition-colors duration-300">
      {/* Header (sticky) */}
      <header className={`sticky top-0 z-50 max-w-7xl mx-auto w-[calc(100%-2rem)] border backdrop-blur-2xl transition-all duration-300 ${isMobileMenuOpen ? 'rounded-[2rem] bg-black/40' : 'rounded-full'} ${headerBgClass}`}>
        <div className="relative px-6 md:px-8 h-16 flex items-center justify-between w-full">
          {/* Mobile: Hamburger Menu (always on the left) */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-full hover:bg-white/[0.04] transition-colors border border-transparent hover:border-white/10"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className={`w-5 h-5 ${headerTextClass}`} />
              ) : (
                <Menu className={`w-5 h-5 ${headerTextClass}`} />
              )}
            </button>
          </div>

          {/* Desktop Logo (aligned to left) */}
          <div className={`hidden md:flex items-center gap-2 font-medium ${headerTextClass}`}>
            <Box className="w-5 h-5" />
            <span>ModelMarket</span>
          </div>

          {/* Mobile Logo (absolutely centered) */}
          <div className={`flex md:hidden items-center gap-2 font-medium absolute left-1/2 -translate-x-1/2 ${headerTextClass}`}>
            <Box className="w-5 h-5" />
            <span>ModelMarket</span>
          </div>

          {/* Desktop Navigation (centered) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <button type="button" onClick={() => scrollToSection('The Invisible Blockchain')} className={`${headerLinkClass} transition-colors`}>Flow</button>
            <button type="button" onClick={() => scrollToSection('Available Models')} className={`${headerLinkClass} transition-colors`}>Models</button>
            <button type="button" onClick={() => scrollToSection('Live Integration Demo')} className={`${headerLinkClass} transition-colors`}>Studio</button>
            <a href="/dashboard" className={`${headerLinkClass} transition-colors`}>Dashboard</a>
          </nav>

          {/* Right Action container */}
          <div className="flex items-center justify-end gap-4">
            {/* Desktop Connect Button (shows text/address) */}
            <button onClick={connectWallet} className={`hidden md:block ${connectBtnClass}`}>
              {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Connect Wallet'}
            </button>

            {/* Mobile Connect Button (shows wallet logo icon only) */}
            <button 
              onClick={connectWallet} 
              className={`block md:hidden p-2.5 rounded-full transition-all border ${
                walletAddress 
                  ? (isLightSection 
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 shadow-sm' 
                      : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)]') 
                  : (isLightSection 
                      ? 'border-zinc-300 bg-zinc-900 text-white hover:bg-zinc-800 shadow-sm' 
                      : 'border-white/25 bg-white text-zinc-900 hover:bg-zinc-100 shadow-[0_0_15px_rgba(255,255,255,0.1)]')
              }`}
              aria-label="Connect Wallet"
            >
              <Wallet className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Panel */}
        {isMobileMenuOpen && (
          <div className="md:hidden px-6 pt-2 pb-6 flex flex-col gap-4 border-t border-white/10 mt-2 animate-in fade-in slide-in-from-top-4 duration-300">
            <button
              type="button"
              onClick={() => {
                scrollToSection('The Invisible Blockchain');
                setIsMobileMenuOpen(false);
              }}
              className={`text-left py-2 text-sm font-medium ${headerLinkClass} transition-colors`}
            >
              Flow
            </button>
            <button
              type="button"
              onClick={() => {
                scrollToSection('Available Models');
                setIsMobileMenuOpen(false);
              }}
              className={`text-left py-2 text-sm font-medium ${headerLinkClass} transition-colors`}
            >
              Models
            </button>
            <button
              type="button"
              onClick={() => {
                scrollToSection('Live Integration Demo');
                setIsMobileMenuOpen(false);
              }}
              className={`text-left py-2 text-sm font-medium ${headerLinkClass} transition-colors`}
            >
              Studio
            </button>
            <a
              href="/dashboard"
              className={`text-left py-2 text-sm font-medium ${headerLinkClass} transition-colors`}
            >
              Dashboard
            </a>
          </div>
        )}
      </header>

      <FlowArt aria-label="ModelMarket Scroll Demo">
        {/* 1 — Hero / AI Micro-payment Made Simple */}
        <FlowSection aria-label="AI Micro-payment Made Simple" style={{ backgroundColor: '#000', color: '#fff' }}>
          {/* Background Video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover pointer-events-none -z-10 opacity-60"
          >
            <source src="/assets/coins.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

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
                Explore Studio <ArrowRight className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => scrollToSection('Live Integration Demo')} className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white px-6 py-3 rounded-full font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors backdrop-blur-md">
                View Demo
              </button>
            </div>
          </div>
        </FlowSection>

        {/* 2 — Invisible Blockchain / How It Works */}
        <FlowSection aria-label="The Invisible Blockchain" style={{ backgroundColor: '#ffffff', color: '#09090b' }}>
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="mb-20 text-center">
              <h2 className="text-4xl font-semibold text-zinc-900 mb-4">The Invisible Blockchain</h2>
              <p className="text-zinc-500 max-w-xl mx-auto text-lg">A seamless payment experience, engineered for mainstream adoption.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="relative group">
                {/* Background Gradient Blobs resembling fluid 3D shapes */}
                <div className="absolute -top-8 -left-8 w-40 h-40 bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 rounded-full blur-3xl opacity-50 group-hover:opacity-75 group-hover:scale-125 transition-all duration-500 pointer-events-none" />
                <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 rounded-full blur-3xl opacity-40 group-hover:opacity-65 group-hover:scale-125 transition-all duration-500 pointer-events-none" />
                
                {/* Glassmorphic Card Container */}
                <div className="relative z-10 p-8 h-full rounded-[2rem] border border-white/60 bg-white/20 backdrop-blur-xl shadow-xl shadow-zinc-200/20 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg mb-8">
                      <Terminal className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-zinc-900 mb-3">1. Choose & Input</h3>
                    <p className="text-zinc-600 leading-relaxed font-medium">Select a specialized AI model and provide your prompt or data.</p>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="relative group">
                {/* Background Gradient Blobs resembling fluid 3D shapes */}
                <div className="absolute -top-8 -left-8 w-40 h-40 bg-gradient-to-tr from-purple-500 via-blue-500 to-cyan-500 rounded-full blur-3xl opacity-50 group-hover:opacity-75 group-hover:scale-125 transition-all duration-500 pointer-events-none" />
                <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full blur-3xl opacity-40 group-hover:opacity-65 group-hover:scale-125 transition-all duration-500 pointer-events-none" />
                
                {/* Glassmorphic Card Container */}
                <div className="relative z-10 p-8 h-full rounded-[2rem] border border-white/60 bg-white/20 backdrop-blur-xl shadow-xl shadow-zinc-200/20 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg mb-8">
                      <CircleDollarSign className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-zinc-900 mb-3">2. Pay Micro-Amount</h3>
                    <p className="text-zinc-600 leading-relaxed font-medium">Confirm a tiny payment (e.g., $0.05 Mock USD). UGF handles the ETH gas fee invisibly.</p>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="relative group">
                {/* Background Gradient Blobs resembling fluid 3D shapes */}
                <div className="absolute -top-8 -left-8 w-40 h-40 bg-gradient-to-tr from-blue-500 via-cyan-500 to-teal-400 rounded-full blur-3xl opacity-50 group-hover:opacity-75 group-hover:scale-125 transition-all duration-500 pointer-events-none" />
                <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600 rounded-full blur-3xl opacity-40 group-hover:opacity-65 group-hover:scale-125 transition-all duration-500 pointer-events-none" />
                
                {/* Glassmorphic Card Container */}
                <div className="relative z-10 p-8 h-full rounded-[2rem] border border-white/60 bg-white/20 backdrop-blur-xl shadow-xl shadow-zinc-200/20 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg mb-8">
                      <Boxes className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-zinc-900 mb-3">3. Instant Generation</h3>
                    <p className="text-zinc-600 leading-relaxed font-medium">Transaction clears instantly. The AI model returns the output seamlessly.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FlowSection>

        {/* 3 — Available Models / Studio */}
        <FlowSection aria-label="Available Models" style={{ background: 'radial-gradient(circle at 15% 35%, #0b1a4a 0%, #010618 75%)', color: '#ffffff' }}>
          <div className="max-w-7xl mx-auto relative z-10">
            {/* Glowing cyan and blue atmosphere spots behind grid */}
            <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[110px] pointer-events-none -z-10" />
            <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[110px] pointer-events-none -z-10" />

            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl font-semibold text-white mb-3">Available Models</h2>
                <p className="text-zinc-400">Pay-per-use AI tools crafted by independent developers.</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="relative group">
                {/* Glowing cyan and blue radial glow spots behind card */}
                <div className="absolute -top-12 -left-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl opacity-50 group-hover:opacity-75 group-hover:scale-110 pointer-events-none transition-all duration-500" />
                <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl opacity-40 group-hover:opacity-65 group-hover:scale-110 pointer-events-none transition-all duration-500" />

                {/* Dark Glass Card */}
                <div className="relative z-10 p-8 h-full rounded-[2.2rem] border border-sky-500/30 bg-[#060c24]/65 backdrop-blur-3xl shadow-2xl hover:border-cyan-400/50 hover:shadow-cyan-500/5 transition-all duration-500 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-[11px] font-semibold tracking-[0.2em] text-cyan-400/80 uppercase">@recruiter_tech • AI MODEL</span>
                      <span className="text-xs font-semibold px-3 py-1 bg-[#0a153b] border border-cyan-500/20 rounded-full text-cyan-300">$0.10 / run</span>
                    </div>
                    
                    <h3 className="text-2xl font-bold tracking-tight text-white mb-2">Resume Roaster AI</h3>
                    <p className="text-zinc-300/90 leading-relaxed font-normal text-sm mb-6">
                      Get brutal, actionable feedback on your resume from an elite tech recruiter AI model.
                    </p>

                    {/* Progress metrics removed for cleaner aesthetics */}
                  </div>

                  <button 
                    type="button" 
                    onClick={() => openDemoForModel({ id: 'resume_roaster', name: 'Resume Roaster AI', cost: 0.1 })} 
                    className="w-full bg-white hover:bg-white/95 text-zinc-950 font-bold py-3.5 px-6 rounded-full text-xs tracking-wider uppercase transition-all duration-300 shadow-[0_4px_20px_rgba(255,255,255,0.12)] hover:scale-[1.02] active:scale-[0.98] mt-6 flex items-center justify-center gap-2"
                  >
                    Try Model
                  </button>
                </div>
              </div>

              {/* Card 2 */}
              <div className="relative group">
                {/* Glowing cyan and blue radial glow spots behind card */}
                <div className="absolute -top-12 -left-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl opacity-50 group-hover:opacity-75 group-hover:scale-110 pointer-events-none transition-all duration-500" />
                <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl opacity-40 group-hover:opacity-65 group-hover:scale-110 pointer-events-none transition-all duration-500" />

                {/* Dark Glass Card */}
                <div className="relative z-10 p-8 h-full rounded-[2.2rem] border border-sky-500/30 bg-[#060c24]/65 backdrop-blur-3xl shadow-2xl hover:border-cyan-400/50 hover:shadow-cyan-500/5 transition-all duration-500 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-[11px] font-semibold tracking-[0.2em] text-cyan-400/80 uppercase">@dev_ops • AI MODEL</span>
                      <span className="text-xs font-semibold px-3 py-1 bg-[#0a153b] border border-cyan-500/20 rounded-full text-cyan-300">$0.05 / run</span>
                    </div>
                    
                    <h3 className="text-2xl font-bold tracking-tight text-white mb-2">Code Reviewer Pro</h3>
                    <p className="text-zinc-300/90 leading-relaxed font-normal text-sm mb-6">
                      Instant static analysis identifying security flaws and performance bottlenecks in your PRs.
                    </p>

                    {/* Progress metrics removed for cleaner aesthetics */}
                  </div>

                  <button 
                    type="button" 
                    onClick={() => openDemoForModel({ id: 'code_reviewer', name: 'Code Reviewer Pro', cost: 0.05 })} 
                    className="w-full bg-white hover:bg-white/95 text-zinc-950 font-bold py-3.5 px-6 rounded-full text-xs tracking-wider uppercase transition-all duration-300 shadow-[0_4px_20px_rgba(255,255,255,0.12)] hover:scale-[1.02] active:scale-[0.98] mt-6 flex items-center justify-center gap-2"
                  >
                    Try Model
                  </button>
                </div>
              </div>

              {/* Card 3 */}
              <div className="relative group">
                {/* Glowing cyan and blue radial glow spots behind card */}
                <div className="absolute -top-12 -left-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl opacity-50 group-hover:opacity-75 group-hover:scale-110 pointer-events-none transition-all duration-500" />
                <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl opacity-40 group-hover:opacity-65 group-hover:scale-110 pointer-events-none transition-all duration-500" />

                {/* Dark Glass Card */}
                <div className="relative z-10 p-8 h-full rounded-[2.2rem] border border-sky-500/30 bg-[#060c24]/65 backdrop-blur-3xl shadow-2xl hover:border-cyan-400/50 hover:shadow-cyan-500/5 transition-all duration-500 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-[11px] font-semibold tracking-[0.2em] text-cyan-400/80 uppercase">@marketing_ai • AI MODEL</span>
                      <span className="text-xs font-semibold px-3 py-1 bg-[#0a153b] border border-cyan-500/20 rounded-full text-cyan-300">$0.02 / run</span>
                    </div>
                    
                    <h3 className="text-2xl font-bold tracking-tight text-white mb-2">Social Caption Gen</h3>
                    <p className="text-zinc-300/90 leading-relaxed font-normal text-sm mb-6">
                      High-engagement, platform-specific copy generation optimized for modern social algorithms.
                    </p>

                    {/* Progress metrics removed for cleaner aesthetics */}
                  </div>

                  <button 
                    type="button" 
                    onClick={() => openDemoForModel({ id: 'social_caption_gen', name: 'Social Caption Gen', cost: 0.02 })} 
                    className="w-full bg-white hover:bg-white/95 text-zinc-950 font-bold py-3.5 px-6 rounded-full text-xs tracking-wider uppercase transition-all duration-300 shadow-[0_4px_20px_rgba(255,255,255,0.12)] hover:scale-[1.02] active:scale-[0.98] mt-6 flex items-center justify-center gap-2"
                  >
                    Try Model
                  </button>
                </div>
              </div>
            </div>
          </div>
        </FlowSection>

        {/* 4 — Live Integration Demo */}
        <FlowSection aria-label="Live Integration Demo" style={{ background: 'radial-gradient(circle at bottom right, #050b18 0%, #000000 80%)', color: '#ffffff' }}>
          <div className="max-w-5xl mx-auto relative z-10 w-full">
            {/* Soft background glow circles */}
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse" />
            <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse" />

            <div className="mb-10 text-center">
              <h2 className="text-3xl font-semibold text-white mb-3 tracking-tight">Live Integration Demo</h2>
              <p className="text-zinc-500 text-sm">Experience the UGF payment abstraction firsthand.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Column A (Sidebar Controller): Neon Glass Context Menu */}
              <div className="relative lg:col-span-3 rounded-[1.5rem] border border-[#22d3ee]/20 bg-[#060b13]/85 backdrop-blur-2xl shadow-[0_0_40px_rgba(34,211,238,0.08),inset_0_0_12px_rgba(34,211,238,0.03)] p-5 flex flex-col gap-6 overflow-hidden">
                {/* Dynamic Glowing Corners from reference image */}
                <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#22d3ee]/10 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -bottom-12 -left-12 w-28 h-28 bg-[#3b82f6]/10 rounded-full blur-2xl pointer-events-none" />
                
                {/* Decorative Search / Command Input */}
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
                  <input 
                    type="text" 
                    readOnly 
                    placeholder="type a command or search" 
                    className="w-full pl-9 pr-3 py-2 bg-zinc-950/40 border border-zinc-800/80 rounded-xl text-[11px] text-zinc-500 placeholder-zinc-600 focus:outline-none pointer-events-none font-sans"
                  />
                </div>

                {/* Suggestions Section */}
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600 mb-2.5 px-1 font-mono">Suggestions</div>
                  <div className="space-y-1">
                    {availableModels.map((model) => {
                      let Icon = FileText;
                      if (model.id === 'resume_roaster') Icon = Calendar;
                      if (model.id === 'code_reviewer') Icon = Calculator;
                      if (model.id === 'social_caption_gen') Icon = MessageSquare;
                      
                      const isSelected = selectedModel.id === model.id;
                      return (
                        <button
                          key={model.id}
                          type="button"
                          onClick={() => {
                            setSelectedModel(model);
                            setDemoState('idle');
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 text-left
                            ${isSelected 
                              ? 'bg-white/[0.04] border border-[#22d3ee]/40 text-white shadow-[0_0_15px_rgba(34,211,238,0.12),inset_0_1px_1px_rgba(255,255,255,0.05)] font-medium scale-[1.01]' 
                              : 'bg-transparent border border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02]'}
                          `}
                        >
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-[#22d3ee]' : 'text-zinc-500'}`} />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs truncate">{model.name}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Settings Section */}
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600 mb-2.5 px-1 font-mono">Settings</div>
                  <div className="space-y-1">
                    {/* Wallet connection */}
                    <button
                      type="button"
                      onClick={connectWallet}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 text-left text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02]"
                    >
                      <User className="w-4 h-4 text-zinc-500" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs truncate">
                          {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Profile: Connect'}
                        </div>
                      </div>
                    </button>

                    {/* Dashboard shortcut */}
                    <a
                      href="/dashboard"
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 text-left text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02]"
                    >
                      <CreditCard className="w-4 h-4 text-zinc-500" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs truncate">Billing: Dashboard</div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>

              {/* Column B (Central Dashboard): Prompt Workspace */}
              <div className="relative lg:col-span-5 rounded-[1.5rem] border border-[#22d3ee]/20 bg-[#060b13]/85 backdrop-blur-2xl shadow-[0_0_40px_rgba(34,211,238,0.08),inset_0_0_12px_rgba(34,211,238,0.03)] p-6 flex flex-col justify-between overflow-hidden">
                <div className="absolute -top-12 -left-12 w-28 h-28 bg-[#22d3ee]/5 rounded-full blur-2xl pointer-events-none" />
                
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2 text-white font-semibold text-sm">
                      <Code2 className="w-4 h-4 text-[#22d3ee]" />
                      <span>{selectedModel.name}</span>
                    </div>
                    <span className="text-[9px] font-semibold font-mono px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded-md text-zinc-500">
                      STATUS: READY
                    </span>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold tracking-wider text-zinc-500 uppercase mb-2 px-1 font-mono">
                      {selectedModel.id === 'resume_roaster' && 'Paste Resume Content'}
                      {selectedModel.id === 'code_reviewer' && 'Paste Code or PR Diff'}
                      {selectedModel.id === 'social_caption_gen' && 'Describe Your Post'}
                    </label>
                    <textarea
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      className="w-full h-44 bg-zinc-950/40 border border-zinc-800/80 focus:border-[#22d3ee]/40 rounded-xl p-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#22d3ee]/20 resize-none transition-all duration-300 font-sans"
                      placeholder={
                        selectedModel.id === 'resume_roaster'
                          ? 'E.g., Senior Software Engineer at XYZ Corp. Led a team of 5 to rebuild the core monolith into microservices...'
                          : selectedModel.id === 'code_reviewer'
                          ? 'E.g., diff --git a/app.js b/app.js\n+ const x = 1;'
                          : 'E.g., Launching a new AI product for creators!'
                      }
                    />
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-zinc-800/80 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-[9px] font-semibold tracking-widest text-zinc-500 uppercase mb-1 font-mono">Cost Per Run</div>
                    <div className="text-lg font-bold text-white tracking-tight flex items-baseline gap-1">
                      ${selectedModel.cost.toFixed(2)}
                      <span className="text-[9px] text-zinc-500 font-normal font-mono">Mock USD</span>
                    </div>
                  </div>
                  <button
                    onClick={handleGenerate}
                    disabled={demoState === 'processing' || !resumeText.trim()}
                    className="bg-white hover:bg-white/95 text-zinc-950 font-bold py-3 px-5 rounded-full text-xs tracking-wider uppercase transition-all duration-300 shadow-[0_4px_15px_rgba(255,255,255,0.1)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center gap-1.5"
                  >
                    {demoState === 'processing' ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Processing</span>
                      </>
                    ) : (
                      <>
                        <span>Analyze & Pay</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Column C (Right Pane): Output Dashboard */}
              <div className="relative lg:col-span-4 rounded-[1.5rem] border border-[#22d3ee]/20 bg-[#060b13]/85 backdrop-blur-2xl shadow-[0_0_40px_rgba(34,211,238,0.08),inset_0_0_12px_rgba(34,211,238,0.03)] p-6 flex flex-col justify-between overflow-hidden">
                <div className="absolute -bottom-12 -right-12 w-28 h-28 bg-[#3b82f6]/5 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-5 border-b border-zinc-800/80 pb-3">
                    <div className="text-[10px] font-semibold tracking-wider text-zinc-400 uppercase font-mono">
                      Output Dashboard
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>

                  <div className="flex-1 font-mono text-[11px] leading-relaxed relative min-h-[220px]">
                    {demoState === 'idle' && (
                      <div className="absolute inset-0 flex items-center justify-center text-zinc-500 text-center px-4 text-[11px] leading-relaxed font-sans">
                        Awaiting input. Payment will be processed instantly via UGF.
                      </div>
                    )}

                    {demoState === 'processing' && (
                      <div className="space-y-3.5">
                        <div className="flex items-center gap-2.5 text-zinc-400">
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                          <span>Initializing secure connection...</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-amber-200">
                          <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                          <span>UGF intercepting ${selectedModel.cost.toFixed(2)} payment...</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-zinc-400">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Gas fee abstracted successfully.</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-zinc-400">
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                          <span>Awaiting AI inference...</span>
                        </div>
                      </div>
                    )}

                    {demoState === 'success' && (
                      <div className="space-y-4">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-950/40 text-emerald-300 text-[10px] font-sans mb-3 border border-emerald-800/50">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Transaction Confirmed
                        </div>

                        <div className="text-zinc-300 space-y-2.5">
                          <div>
                            <span className="text-zinc-500 font-semibold font-mono">SYSTEM &gt;</span> Analyzing provided input...
                          </div>
                          <div>
                            <span className="text-zinc-500 font-semibold font-mono">RESULT &gt;</span>
                          </div>
                          <div className="text-[#22d3ee] font-semibold pl-2">
                            Sample output for {selectedModel.name} (mock)
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* Footer inside last section */}
            <div className="mt-12 text-center text-sm text-zinc-500">© 2026 ModelMarket Inc. All rights reserved.</div>
          </div>
        </FlowSection>
      </FlowArt>
    </div>
  );
}
