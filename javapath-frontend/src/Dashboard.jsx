import React, { useState, useContext, useEffect, useRef } from 'react';
import axios from 'react-shadow'; // wait, normal axios
import axiosOriginal from 'axios';
import { AuthContext } from './AuthContext';
import { 
  Play, CheckCircle, Code, MessageSquare, 
  Sparkles, Terminal, BookOpen, ChevronRight, 
  Trophy, ShieldCheck, Briefcase, User, LogOut, Send, AlertTriangle, Settings, RefreshCw, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

const axios = axiosOriginal;

// Custom Branded SVG Logo Component
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

const CHALLENGES = [
  { id: 1, title: "The Main Method", topic: "Syntax", desc: "Your first entry point into the corporate world.", initialCode: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello Corporate World");\n    }\n}` },
  { id: 2, title: "Variables & Encapsulation", topic: "Basics", desc: "Create a private balance variable and provide a secure Getter and Setter.", initialCode: `public class BankAccount {\n    // Add your private variable and getters/setters here\n    \n    public static void main(String[] args) {\n        BankAccount acc = new BankAccount();\n        System.out.println("Secure System Booted");\n    }\n}` },
  { id: 3, title: "Conditionals (Auth System)", topic: "Logic", desc: "Write an if-else block to check if user role is 'ADMIN'.", initialCode: `public class Auth {\n    public static void main(String[] args) {\n        String role = "USER";\n        // Write auth logic\n    }\n}` },
  { id: 4, title: "Loops (Data Processing)", topic: "Loops", desc: "Iterate over an array of transactions and sum them.", initialCode: `public class DataProcessor {\n    public static void main(String[] args) {\n        int[] transactions = {100, 250, 50, 400};\n        // Sum the transactions\n    }\n}` },
  { id: 5, title: "Polymorphism", topic: "OOP", desc: "Implement interfaces for flexible payment processors.", initialCode: `interface PaymentProcessor {\n    void process();\n}\n\npublic class StripeProcessor implements PaymentProcessor {\n    public void process() { System.out.println("Stripe"); }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        PaymentProcessor p = new StripeProcessor();\n        p.process();\n    }\n}` },
];

const Dashboard = () => {
  const { user, progress, updateProgress, logout, chatHistory, setChatHistory, API_BASE_URL } = useContext(AuthContext);
  const [activeChallengeId, setActiveChallengeId] = useState(1);
  const [code, setCode] = useState(CHALLENGES[0].initialCode);
  
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Layout drawers
  const [showChat, setShowChat] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  
  // Chat state
  const [chatMessage, setChatMessage] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [assistanceLevel, setAssistanceLevel] = useState("max"); // basic or max
  const chatEndRef = useRef(null);

  // Diagnostics
  const [diagnostics, setDiagnostics] = useState([]);

  const activeChallenge = CHALLENGES.find(c => c.id === activeChallengeId);

  // Determine user title dynamically
  const solvedCount = progress.length;
  let careerTitle = "Junior Intern";
  if (solvedCount >= 4) careerTitle = "Mid-Level Engineer";
  else if (solvedCount >= 2) careerTitle = "Associate Developer";

  // Linter parser
  useEffect(() => {
    const checkJavaSyntax = (codeText) => {
      const errors = [];
      if (!codeText) return errors;

      const openBraces = (codeText.match(/\{/g) || []).length;
      const closeBraces = (codeText.match(/\}/g) || []).length;
      if (openBraces !== closeBraces) {
        errors.push(`Curly Braces: Unmatched. Open braces: ${openBraces}, Closed: ${closeBraces}`);
      }

      const openParens = (codeText.match(/\(/g) || []).length;
      const closeParens = (codeText.match(/\)/g) || []).length;
      if (openParens !== closeParens) {
        errors.push(`Parentheses: Unmatched. Open parens: ${openParens}, Closed: ${closeParens}`);
      }

      let cleanText = codeText.replace(/\/\*[\s\S]*?\*\//g, (match) => '\n'.repeat((match.match(/\n/g) || []).length));
      
      const lines = cleanText.split('\n');
      lines.forEach((line, index) => {
        let trimmed = line.trim();
        
        const commentIndex = trimmed.indexOf('//');
        if (commentIndex !== -1) {
          const beforeComment = trimmed.substring(0, commentIndex);
          const quoteCount = (beforeComment.match(/"/g) || []).length;
          if (quoteCount % 2 === 0) {
            trimmed = beforeComment.trim();
          }
        }

        if (trimmed.length === 0) return;
        
        if (trimmed.startsWith('@')) return;
        if (trimmed.endsWith('{') || trimmed.endsWith('}') || trimmed.endsWith(';') || trimmed.endsWith(',')) return;
        if (trimmed.includes('class ') || trimmed.includes('interface ') || trimmed.includes('enum ')) return;
        
        if (trimmed.includes('public ') || trimmed.includes('private ') || trimmed.includes('protected ')) {
          if (trimmed.includes('(') && !trimmed.endsWith(';')) return; 
        }
        
        if (trimmed.startsWith('if') || trimmed.startsWith('for') || trimmed.startsWith('while') || 
            trimmed.startsWith('switch') || trimmed.startsWith('else') || trimmed.startsWith('try') || 
            trimmed.startsWith('catch') || trimmed.startsWith('finally') || trimmed.startsWith('static')) return;

        errors.push(`Line ${index + 1}: Missing semicolon ';' at end of statement.`);
      });

      return errors;
    };

    const errors = checkJavaSyntax(code);
    setDiagnostics(errors);
  }, [code]);

  useEffect(() => {
    const c = CHALLENGES.find(ch => ch.id === activeChallengeId);
    if (c) setCode(c.initialCode);
  }, [activeChallengeId]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, showChat]);

  const handleRunCode = async () => {
    setIsLoading(true);
    setOutput("");
    try {
      const response = await axios.post(`${API_BASE_URL}/api/execute`, { code });
      setOutput(response.data.output || "No output returned.");
      
      if (!response.data.error && !progress.includes(activeChallengeId)) {
        updateProgress([...progress, activeChallengeId]);
      }
    } catch (err) {
      setOutput("Error connecting to compiler.");
    }
    setIsLoading(false);
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!chatMessage.trim()) return;

    const userMessage = chatMessage;
    setChatMessage("");
    
    setChatHistory([...chatHistory, { role: "user", text: userMessage }]);
    setIsChatLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/chat`, { 
        message: userMessage,
        code, 
        taskDescription: activeChallenge.desc,
        assistanceLevel
      });
      setChatHistory(response.data.history);
    } catch (err) {
      setChatHistory(prev => [...prev, { role: "model", text: "Error connecting to AI mentor." }]);
    }
    setIsChatLoading(false);
  };

  const handleResetProgress = async () => {
    if (window.confirm("Are you sure you want to reset all your challenge progress? This cannot be undone.")) {
      await updateProgress([]);
      setActiveChallengeId(1);
      setShowProfile(false);
    }
  };

  const handleClearChatHistory = async () => {
    if (window.confirm("Clear all conversation history with Gemini?")) {
      try {
        await axios.post(`${API_BASE_URL}/api/chat/clear`);
        setChatHistory([]);
        alert("Conversation history cleared.");
      } catch (err) {
        alert("Failed to clear chat history.");
      }
    }
  };

  const openGeminiReview = () => {
    setShowChat(true);
    if (chatHistory.length === 0) {
      setChatMessage("Review my current code and suggest the better and best ways to structure it.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      
      {/* --- TOP NAVIGATION BAR --- */}
      <nav className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2.5">
          <Logo className="w-8 h-8" />
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            JavaPath Pro
          </span>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Career Rank</span>
            <span className="text-xs font-bold text-slate-700">{careerTitle}</span>
          </div>
          <div className="w-32 h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
            <motion.div 
              initial={{ width: 0 }} 
              animate={{ width: `${(progress.length / CHALLENGES.length) * 100}%` }} 
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" 
            />
          </div>
          
          {/* Profile User Badge Button */}
          <button 
            onClick={() => setShowProfile(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 border border-slate-200/80 shadow-sm p-1 rounded-full px-4.5 transition-all active:scale-95 group"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 text-white flex items-center justify-center font-bold text-xs shadow-md">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900">{user?.username}</span>
            <Settings className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 group-hover:rotate-45 transition-all" />
          </button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* --- LEFT SIDEBAR: CURRICULUM --- */}
        <aside className="w-72 bg-white border-r border-slate-200 overflow-y-auto hidden lg:block shadow-sm">
          <div className="p-6">
            <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-5">Enterprise Curriculum</h3>
            <div className="space-y-2">
              {CHALLENGES.map((day) => {
                const isCompleted = progress.includes(day.id);
                const isCurrent = activeChallengeId === day.id;
                const isUnlocked = day.id === 1 || progress.includes(day.id - 1);
                
                return (
                  <div 
                    key={day.id}
                    onClick={() => isUnlocked && setActiveChallengeId(day.id)}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isCurrent ? 'bg-blue-50/50 border-blue-200 shadow-sm cursor-default' : 
                      isUnlocked ? 'hover:bg-slate-50 border-transparent hover:border-slate-100 cursor-pointer' : 'opacity-40 cursor-not-allowed grayscale border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        isCompleted ? 'bg-emerald-100 text-emerald-700' : 
                        isCurrent ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        TASK {day.id}
                      </span>
                      {isCompleted && <CheckCircle className="w-4.5 h-4.5 text-emerald-500" />}
                      {!isUnlocked && <ShieldCheck className="w-4.5 h-4.5 text-slate-300" />}
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 tracking-tight">{day.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-1">{day.topic}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* --- MAIN WORKSPACE --- */}
        <main className="flex-1 flex flex-col md:flex-row overflow-hidden bg-white">
          {/* CHALLENGE INFO */}
          <section className="w-full md:w-[400px] border-r border-slate-200 flex flex-col bg-slate-50/50">
            <div className="p-6 overflow-y-auto flex-1">
              <div className="flex items-center gap-1.5 text-blue-600 mb-4 font-bold text-xs">
                <Briefcase className="w-3.5 h-3.5" />
                <span className="uppercase tracking-wide">Corporate Ticket #JP-20{activeChallengeId}</span>
              </div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight mb-4">{activeChallenge?.title}</h1>
              
              <div className="prose prose-slate text-sm leading-relaxed">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm my-4">
                  <h5 className="font-extrabold text-[10px] text-slate-400 uppercase tracking-widest mb-2.5">OBJECTIVE</h5>
                  <p className="text-slate-700 font-medium italic">"{activeChallenge?.desc}"</p>
                </div>
              </div>

              {/* GEMINI DRAWER BOX TRIGGER */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                onClick={openGeminiReview}
                className="mt-8 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-5 rounded-2xl text-white shadow-lg shadow-blue-200 cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4.5 h-4.5 text-blue-200 animate-pulse" />
                  <span className="text-[10px] font-extrabold uppercase tracking-widest">Gemini AI Mentor</span>
                </div>
                <p className="text-xs opacity-90 leading-relaxed">"Need help or want to inspect alternative design patterns? Click here to chat with your Senior Mentor."</p>
              </motion.div>
            </div>
          </section>

          {/* CODE EDITOR */}
          <section className="flex-1 flex flex-col bg-[#FDFDFD] relative">
            <div className="h-12 bg-white border-b border-slate-200 flex items-center justify-between px-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="ml-4 text-xs font-mono text-slate-400">Workspace.java</span>
              </div>
              <button 
                onClick={handleRunCode}
                disabled={isLoading}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 text-white px-5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-100 hover:shadow-emerald-200"
              >
                <Play className="w-3 h-3 fill-current" />
                {isLoading ? "Compiling..." : "Deploy & Run"}
              </button>
            </div>

            {/* REAL-TIME LINTER DISPLAY */}
            {diagnostics.length > 0 && (
              <div className="absolute top-14 left-4 right-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 shadow-lg z-10 flex flex-col gap-1 max-h-28 overflow-y-auto">
                <div className="flex items-center gap-1.5 font-bold text-xs text-red-800">
                  <AlertTriangle className="w-4.5 h-4.5 text-red-600" />
                  <span>Real-Time Syntax Diagnostics:</span>
                </div>
                <ul className="list-disc list-inside text-xs pl-1">
                  {diagnostics.map((err, i) => <li key={i}>{err}</li>)}
                </ul>
              </div>
            )}
            
            <textarea 
              className="flex-1 p-6 font-mono text-sm bg-white focus:outline-none resize-none text-slate-700 leading-relaxed"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck="false"
            />

            {/* BUILD OUTPUT CONSOLE: FULL LIGHT THEME */}
            <div className="h-48 border-t border-slate-200 bg-slate-55 flex flex-col bg-[#F8FAFC]">
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-200 bg-slate-100/50">
                <Terminal className="w-4 h-4 text-slate-500" />
                <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest">Build Output</span>
              </div>
              <div className="p-4 font-mono text-xs text-slate-800 overflow-y-auto whitespace-pre-wrap flex-1 bg-white">
                {isLoading && <p className="text-blue-600 animate-pulse">{'>'} Compiling artifacts...</p>}
                <p className="text-slate-800 font-bold underline mb-1">Output:</p>
                <p className="text-slate-600">{output || "> Click 'Deploy & Run' to see output..."}</p>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* --- GEMINI CHAT DRAWER --- */}
      <AnimatePresence>
        {showChat && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]"
              onClick={() => setShowChat(false)}
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-slate-50 z-[70] shadow-2xl flex flex-col border-l border-slate-200"
            >
              <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex justify-between items-center shadow-md z-10">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-blue-200" />
                  <div>
                    <h2 className="text-base font-extrabold tracking-tight">Gemini Mentor</h2>
                    <p className="text-[10px] opacity-80">Senior Staff Engineer</p>
                  </div>
                </div>
                <button onClick={() => setShowChat(false)} className="hover:bg-black/10 p-2 rounded-full transition-colors font-bold">
                  ✕
                </button>
              </div>

              {/* Assistance Level Toggle */}
              <div className="px-4 py-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between shadow-inner">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Assistance Level:</span>
                <div className="flex gap-1.5 bg-slate-200 p-0.5 rounded-lg">
                  <button 
                    onClick={() => setAssistanceLevel("basic")}
                    className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${
                      assistanceLevel === 'basic' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Hints Only
                  </button>
                  <button 
                    onClick={() => setAssistanceLevel("max")}
                    className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${
                      assistanceLevel === 'max' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Full Solutions
                  </button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {chatHistory.length === 0 && (
                  <div className="text-center text-slate-400 mt-10 text-xs">
                    No chat history yet. Ask for a code review!
                  </div>
                )}
                {chatHistory.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs shadow-sm leading-relaxed ${
                      msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-700'
                    }`}>
                      {msg.role === 'model' ? (
                        <div className="prose prose-sm max-w-none prose-blue">
                           <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>
                      ) : (
                        msg.text
                      )}
                    </div>
                  </div>
                ))}
                {isChatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-slate-200 text-slate-400 px-4 py-3 rounded-2xl text-xs flex items-center gap-2 shadow-sm">
                      <Sparkles className="w-4 h-4 animate-pulse text-blue-500" />
                      Mentor is typing...
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-white border-t border-slate-200">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input 
                    type="text" 
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Ask Gemini about your code..."
                    className="flex-1 border border-slate-200 rounded-full px-4.5 py-2 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-slate-50 focus:bg-white"
                  />
                  <button 
                    type="submit"
                    disabled={!chatMessage.trim() || isChatLoading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white p-2.5 rounded-full transition-colors flex items-center justify-center shadow-md active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- USER PROFILE MODAL --- */}
      <AnimatePresence>
        {showProfile && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[80] flex items-center justify-center p-4"
              onClick={() => setShowProfile(false)}
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-3xl border border-slate-200 w-full max-w-md overflow-hidden shadow-2xl z-[90]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header Profile Badge */}
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 h-28 relative">
                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-white p-1 shadow-lg">
                    <div className="w-full h-full rounded-full bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 text-white flex items-center justify-center font-extrabold text-2xl">
                      {user?.username?.charAt(0).toUpperCase()}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-12 text-center">
                  <h2 className="text-xl font-extrabold text-slate-800">{user?.username}</h2>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">{careerTitle}</p>
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-slate-50 border border-slate-200/60 p-3 rounded-2xl text-center">
                      <Trophy className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Solved</span>
                      <span className="text-base font-black text-slate-800">{progress.length} / {CHALLENGES.length}</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-200/60 p-3 rounded-2xl text-center">
                      <Sparkles className="w-5 h-5 text-indigo-500 mx-auto mb-1" />
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Percentage</span>
                      <span className="text-base font-black text-slate-800">{Math.round((progress.length / CHALLENGES.length) * 100)}%</span>
                    </div>
                  </div>

                  {/* Settings / Controls */}
                  <div className="mt-8 border-t border-slate-100 pt-6 space-y-3">
                    <button 
                      onClick={handleClearChatHistory}
                      className="w-full border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors active:scale-[0.98]"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Clear AI Conversation History</span>
                    </button>
                    <button 
                      onClick={handleResetProgress}
                      className="w-full border border-red-100 hover:bg-red-50/50 text-red-600 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors active:scale-[0.98]"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-red-400" />
                      <span>Reset All Challenge Progress</span>
                    </button>
                  </div>

                  {/* Sign Out */}
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <button 
                      onClick={() => {
                        logout();
                        setShowProfile(false);
                      }}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md"
                    >
                      <LogOut className="w-4 h-4 text-slate-400" />
                      <span>Sign Out Account</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- FOOTER STATUS --- */}
      <footer className="h-8 bg-white border-t border-slate-200 px-6 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        <div className="flex gap-4">
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"/> Server: Connected</span>
          <span>Latency: 12ms</span>
        </div>
        <div className="flex gap-4">
          <span>Java Version: 17 (LTS)</span>
          <span className="text-blue-600">Progress: {Math.round((progress.length / CHALLENGES.length) * 100)}% Completed</span>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
