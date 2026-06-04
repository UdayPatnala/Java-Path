import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { motion } from 'framer-motion';
import { Code, Sparkles, Terminal, ShieldCheck, ArrowRight, Play, Briefcase, Award } from 'lucide-react';

const Logo = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="50%" stopColor="#8B5CF6" />
        <stop offset="100%" stopColor="#EC4899" />
      </linearGradient>
    </defs>
    <path d="M30 35 Q45 15 50 35 T70 35" stroke="url(#logoGrad)" strokeWidth="6" strokeLinecap="round" fill="none" />
    <path d="M40 25 Q55 10 60 25 T80 25" stroke="url(#logoGrad)" strokeWidth="4" strokeLinecap="round" fill="none" />
    <path d="M25 45 C25 68, 75 68, 75 45 C75 35, 25 35, 25 45 Z" fill="url(#logoGrad)" />
    <path d="M72 48 C85 48, 85 58, 72 58" stroke="url(#logoGrad)" strokeWidth="5" strokeLinecap="round" fill="none" />
    <path d="M20 75 L80 75" stroke="url(#logoGrad)" strokeWidth="6" strokeLinecap="round" />
  </svg>
);

const Landing = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500 selection:text-white relative overflow-hidden">
      
      {/* Soft Background Pastels */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-100/40 rounded-full filter blur-[120px] -z-10" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-purple-100/30 rounded-full filter blur-[120px] -z-10" />

      {/* --- NAVBAR --- */}
      <header className="h-16 border-b border-slate-200/60 bg-white/70 backdrop-blur-md sticky top-0 z-50 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
          <Logo className="w-8 h-8" />
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            JavaPath Pro
          </span>
        </div>

        <nav className="flex items-center gap-4">
          {token ? (
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 px-5 rounded-full transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button 
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-xs py-2.5 px-6 rounded-full transition-all shadow-sm active:scale-95"
            >
              Sign In
            </button>
          )}
        </nav>
      </header>

      {/* --- HERO SECTION --- */}
      <section className="max-w-6xl mx-auto px-6 pt-16 md:pt-24 text-center pb-12 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 bg-white border border-slate-200 p-1.5 px-4 rounded-full shadow-sm text-slate-600 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-purple-500 animate-pulse" />
            <span>Interactive Enterprise Learning Engine</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-slate-850 tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Master Java the <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Enterprise Way</span>
          </h1>

          <p className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
            Accelerate your engineering onboarding with real-time compilation warnings, sandbox execution, and a contextual AI staff engineer who guides you through corporate support tickets.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              onClick={() => navigate(token ? '/dashboard' : '/login')}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm py-3.5 px-8 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Mock IDE Graphic */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-16 md:mt-20 border border-slate-200/80 rounded-2xl bg-white p-2.5 shadow-2xl shadow-slate-200 max-w-4xl mx-auto"
        >
          <div className="h-6 bg-slate-50 rounded-t-xl border-b border-slate-100 flex items-center px-4 gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-400" />
            <div className="w-2 h-2 rounded-full bg-yellow-400" />
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="ml-3 text-[10px] text-slate-400 font-mono">Workspace.java - JavaPath Pro IDE</span>
          </div>
          <div className="bg-slate-900 text-slate-100 font-mono text-[11px] md:text-xs text-left p-6 rounded-b-xl overflow-hidden shadow-inner leading-relaxed">
            <p className="text-slate-500">// Task 2: Encapsulate banking variables securely</p>
            <p className="text-purple-400">public class <span className="text-blue-400">BankAccount</span> &#123;</p>
            <p className="text-purple-400">&nbsp;&nbsp;&nbsp;&nbsp;private double <span className="text-yellow-400">balance</span>;</p>
            <p className="text-slate-500">&nbsp;&nbsp;&nbsp;&nbsp;// Protected setter checks constraints...</p>
            <p className="text-purple-400">&nbsp;&nbsp;&nbsp;&nbsp;public void <span className="text-blue-400">setBalance</span>(double amt) &#123;</p>
            <p className="text-purple-400">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if (amt &gt; 0) balance = amt;</p>
            <p className="text-purple-400">&nbsp;&nbsp;&nbsp;&nbsp;&#125;</p>
            <p className="text-purple-400">&#125;</p>
            <div className="mt-4 border-t border-slate-800 pt-4 flex justify-between items-center text-[10px] text-emerald-400">
              <span>{'>'} Build output: Secure encapsulation constraints active.</span>
              <span className="bg-emerald-500/10 px-2 py-0.5 rounded text-[8px] font-bold uppercase border border-emerald-500/20 text-emerald-400">100% Correct</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section className="bg-white border-y border-slate-200/60 py-20 px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-black text-slate-850 tracking-tight">Built to emulate real engineering workflows</h2>
            <p className="text-slate-500 text-sm font-semibold max-w-xl mx-auto uppercase tracking-widest">Learn by writing production code, not dragging puzzle blocks</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-50 border border-slate-200/50 p-6 rounded-2xl space-y-3 hover:shadow-md transition-shadow">
              <div className="bg-blue-100 text-blue-600 p-2.5 rounded-xl w-fit">
                <Terminal className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-slate-800">Real-Time Diagnostics</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                Our lightweight static compiler analyzes brackets, parentheses, and semicolons as you type to highlight syntax errors instantly.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200/50 p-6 rounded-2xl space-y-3 hover:shadow-md transition-shadow">
              <div className="bg-purple-100 text-purple-600 p-2.5 rounded-xl w-fit">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-slate-800">Gemini Staff Architect</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                Adjust the assistance level to toggle between conceptual clues (Hints Only) and code refactors showing standard vs. best performance choices.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200/50 p-6 rounded-2xl space-y-3 hover:shadow-md transition-shadow">
              <div className="bg-pink-100 text-pink-600 p-2.5 rounded-xl w-fit">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-slate-800">Corporate Backlog Simulation</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                Work through real company tickets that mimic design patterns, auth gateways, stream aggregates, and interchangeable payment engines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- RECRUITING & STATS --- */}
      <section className="py-20 px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-1 text-xs font-bold rounded-full w-fit flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5" />
            <span>Graduate with a Verified Title</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-850 tracking-tight leading-tight">
            Earn your way to the Mid-Level Engineer status
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed font-medium">
            Completing tasks sequentially updates your persistent profile data. Watch your career score rise from Junior Intern to Mid-Level Developer, proving you can refactor polymorphic interfaces and write thread-safe systems.
          </p>
        </div>

        <div className="bg-gradient-to-tr from-slate-900 to-indigo-950 p-8 rounded-3xl text-white space-y-6 shadow-xl">
          <div className="flex justify-between items-center pb-4 border-b border-white/10">
            <div>
              <p className="text-[10px] font-extrabold tracking-widest text-slate-400 uppercase">Interactive Curriculum</p>
              <h4 className="text-lg font-bold mt-1">Enterprise Syllabus</h4>
            </div>
            <span className="text-xs bg-white/10 px-3 py-1 rounded-full text-indigo-200 font-bold border border-white/5">5 Core Modules</span>
          </div>
          <ul className="space-y-3 text-xs">
            <li className="flex items-center gap-2.5 opacity-90"><CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" /> Syntax (The standard entry Point)</li>
            <li className="flex items-center gap-2.5 opacity-90"><CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" /> Basics (Encapsulating payment data fields)</li>
            <li className="flex items-center gap-2.5 opacity-90"><CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" /> Logic (Configuring role-based auth routers)</li>
            <li className="flex items-center gap-2.5 opacity-90"><CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" /> Iteration (Aggregating transactions ledgers)</li>
            <li className="flex items-center gap-2.5 opacity-90"><CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" /> OOP (Interchangeable polymorphic adapters)</li>
          </ul>
        </div>
      </section>

      {/* --- CALL TO ACTION FOOTER --- */}
      <section className="bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 py-16 px-6 text-center text-white relative">
        <div className="absolute inset-0 bg-grid-white/5 -z-10" />
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Ready to launch your Java engineering career?</h2>
          <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Gain immediate access to compiler test environments, AI mentorship code reviews, and persistent profile ranking tracking.
          </p>
          <div className="pt-4">
            <button 
              onClick={() => navigate(token ? '/dashboard' : '/login')}
              className="bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm py-4.5 px-10 rounded-2xl transition-all shadow-lg active:scale-95 inline-flex items-center gap-2"
            >
              <span>{token ? 'Go to your Workspace' : 'Get Started & Log In'}</span>
              <ArrowRight className="w-4 h-4 text-slate-800" />
            </button>
          </div>
        </div>
      </section>

      <footer className="py-8 bg-slate-950 border-t border-white/5 px-6 text-center text-slate-600 text-xs">
        <p>&copy; 2026 JavaPath Pro. Crafted with Google AI Studio Gemini API integration. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
