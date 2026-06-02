import React, { useState } from 'react';
import axios from 'axios';
import { 
  Play, CheckCircle, Code, MessageSquare, 
  Sparkles, Terminal, BookOpen, ChevronRight, 
  Trophy, ShieldCheck, Briefcase, User 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

// --- CONFIGURATION / CONTENT ---
const DAYS_DATA = [
  { id: 1, title: "The Main Method", topic: "Syntax", status: "completed", desc: "Your first entry point into the corporate world." },
  { id: 2, title: "Variables & Types", topic: "Basics", status: "current", desc: "Learning how memory works in high-scale apps." },
  { id: 15, title: "Polymorphism", topic: "OOP", status: "locked", desc: "Making code flexible for future-proof systems." },
  { id: 30, title: "The Final Deployment", topic: "Capstone", status: "locked", desc: "Build a Banking System Microservice." },
];

const App = () => {
  const [activeTab, setActiveTab] = useState('task');
  const [code, setCode] = useState(`public class Main {\n    public static void main(String[] args) {\n        // Your corporate journey begins here\n        System.out.println("Hello Corporate World");\n    }\n}`);
  const [showGemini, setShowGemini] = useState(false);
  const [progress, setProgress] = useState(12);

  const [output, setOutput] = useState("");
  const [aiFeedback, setAiFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Function to Run Code via JDoodle
  const handleRunCode = async () => {
    setIsLoading(true);
    setOutput("");
    try {
      const response = await axios.post(`${API_BASE_URL}/api/execute`, { code });
      setOutput(response.data.output || "No output returned.");
    } catch (err) {
      setOutput("Error connecting to compiler.");
    }
    setIsLoading(false);
  };

  // Function to get Gemini AI Review
  const handleGeminiReview = async () => {
    setShowGemini(true);
    setAiFeedback("Analyzing your code with Gemini AI...");
    try {
      const response = await axios.post(`${API_BASE_URL}/api/review`, { 
        code, 
        taskDescription: "Refactor Payment Gateway with Encapsulation" 
      });
      setAiFeedback(response.data.feedback);
    } catch (err) {
      setAiFeedback("Gemini is currently unavailable.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex flex-col">
      {/* --- TOP NAVIGATION BAR --- */}
      <nav className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Code className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight">JavaPath <span className="text-blue-600">Pro</span></span>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Career Rank</span>
            <span className="text-sm font-bold text-slate-700">Junior Java Intern</span>
          </div>
          <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <motion.div 
              initial={{ width: 0 }} 
              animate={{ width: `${progress}%` }} 
              className="h-full bg-blue-500" 
            />
          </div>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-1 rounded-full px-3">
            <User className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-700">Alex_Dev</span>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* --- LEFT SIDEBAR: 30-DAY ROADMAP --- */}
        <aside className="w-72 bg-white border-r border-slate-200 overflow-y-auto hidden lg:block">
          <div className="p-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">30-Day Sprint</h3>
            <div className="space-y-1">
              {DAYS_DATA.map((day) => (
                <div 
                  key={day.id}
                  className={`p-3 rounded-xl cursor-pointer transition-all ${
                    day.status === 'current' ? 'bg-blue-50 border border-blue-100' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      day.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 
                      day.status === 'current' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      DAY {day.id}
                    </span>
                    {day.status === 'completed' && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                    {day.status === 'locked' && <ShieldCheck className="w-4 h-4 text-slate-300" />}
                  </div>
                  <h4 className="text-sm font-bold text-slate-700">{day.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">{day.topic}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* --- MAIN WORKSPACE --- */}
        <main className="flex-1 flex flex-col md:flex-row overflow-hidden bg-white">
          {/* CONTENT PANEL */}
          <section className="w-full md:w-[400px] border-r border-slate-200 flex flex-col bg-slate-50/50">
            <div className="p-6 overflow-y-auto">
              <div className="flex items-center gap-2 text-blue-600 mb-4">
                <Briefcase className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-tighter">Corporate Ticket #JP-204</span>
              </div>
              <h1 className="text-2xl font-black text-slate-800 mb-4">Refactor Payment Gateway</h1>
              
              <div className="prose prose-slate text-sm leading-relaxed">
                <p>Welcome to the **Fintech Module**. In professional environments, we never expose raw data.</p>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm my-4">
                  <h5 className="font-bold text-xs text-slate-400 mb-2">OBJECTIVE</h5>
                  <p className="text-slate-700 font-medium italic">"Create a private balance variable and provide a secure Getter and Setter. This is called Encapsulation."</p>
                </div>
              </div>

              {/* GEMINI INTEGRATED BOX */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="mt-8 bg-gradient-to-br from-blue-600 to-indigo-700 p-4 rounded-2xl text-white shadow-lg shadow-blue-200 cursor-pointer"
                onClick={handleGeminiReview}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-blue-200" />
                  <span className="text-xs font-bold uppercase tracking-widest">Gemini AI Mentor</span>
                </div>
                <p className="text-sm opacity-90">"I noticed your logic is correct, but we can make it more 'Thread-Safe' for corporate use. Click to see how."</p>
              </motion.div>
            </div>
          </section>

          {/* CODE EDITOR PANEL */}
          <section className="flex-1 flex flex-col bg-[#FDFDFD]">
            <div className="h-12 bg-white border-b border-slate-200 flex items-center justify-between px-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="ml-4 text-xs font-mono text-slate-400">Main.java</span>
              </div>
              <button 
                onClick={handleRunCode}
                disabled={isLoading}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white px-4 py-1.5 rounded-lg text-sm font-bold transition-all shadow-md shadow-emerald-100"
              >
                <Play className="w-3 h-3 fill-current" />
                {isLoading ? "Running..." : "Deploy & Run"}
              </button>
            </div>
            
            <textarea 
              className="flex-1 p-6 font-mono text-sm bg-white focus:outline-none resize-none text-slate-700 leading-relaxed"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck="false"
            />

            {/* CONSOLE / OUTPUT */}
            <div className="h-48 border-t border-slate-200 bg-slate-900 flex flex-col">
              <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-800 bg-slate-800/50">
                <Terminal className="w-4 h-4 text-slate-400" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Build Output</span>
              </div>
              <div className="p-4 font-mono text-xs text-emerald-400 overflow-y-auto whitespace-pre-wrap">
                <p>{'>'} Compiling artifacts...</p>
                <p>{'>'} Security scans passed (100%)</p>
                <p className="text-white mt-2 font-bold underline">Output:</p>
                <p className="text-white mt-1">{output || "> Click 'Deploy & Run' to see output..."}</p>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* --- GEMINI INTERACTIVE DRAWER --- */}
      <AnimatePresence>
        {showGemini && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]"
              onClick={() => setShowGemini(false)}
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col"
            >
              <div className="p-6 bg-blue-600 text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-6 h-6" />
                  <div>
                    <h2 className="text-lg font-bold">Gemini Reviewer</h2>
                    <p className="text-xs opacity-70">Senior Staff Engineer Engine</p>
                  </div>
                </div>
                <button onClick={() => setShowGemini(false)} className="hover:bg-blue-700 p-2 rounded-full transition-colors">
                  ✕
                </button>
              </div>

              <div className="flex-1 p-6 overflow-y-auto space-y-6">
                <div className="prose prose-sm text-slate-600">
                  <ReactMarkdown>{aiFeedback}</ReactMarkdown>
                </div>
                {aiFeedback !== "Analyzing your code with Gemini AI..." && (
                  <div className="p-4 rounded-xl border border-blue-100 bg-blue-50 mt-4">
                    <p className="text-sm font-medium text-blue-800">Ready to take the next step?</p>
                    <button 
                      onClick={() => setShowGemini(false)}
                      className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-bold text-sm shadow-md transition-colors"
                    >
                      Close Review
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- FOOTER STATUS --- */}
      <footer className="h-8 bg-white border-t border-slate-200 px-6 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        <div className="flex gap-4">
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"/> Server: Connected</span>
          <span>Latency: 24ms</span>
        </div>
        <div className="flex gap-4">
          <span>Java Version: 21 (LTS)</span>
          <span className="text-blue-600">30 Day Path: 12% Completed</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
