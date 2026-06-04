import React, { useState, useContext, useEffect, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { 
  Play, CheckCircle, Code, MessageSquare, 
  Sparkles, Terminal, BookOpen, ChevronRight, 
  Trophy, ShieldCheck, Briefcase, User, LogOut, Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

// Expanded realistic challenges
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

  // Chat UI state
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  const activeChallenge = CHALLENGES.find(c => c.id === activeChallengeId);

  useEffect(() => {
    // When challenge changes, update code
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
      
      // Auto complete if not error
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
    
    // Optimistic update
    setChatHistory([...chatHistory, { role: "user", text: userMessage }]);
    setIsChatLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/chat`, { 
        message: userMessage,
        code, 
        taskDescription: activeChallenge.desc 
      });
      setChatHistory(response.data.history);
    } catch (err) {
      setChatHistory(prev => [...prev, { role: "model", text: "Error connecting to AI mentor." }]);
    }
    setIsChatLoading(false);
  };

  const openGeminiReview = () => {
    setShowChat(true);
    if (chatHistory.length === 0) {
      setChatMessage("Review my code and tell me what I should improve for a corporate setting.");
      // Just populate input, user can press enter
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
              animate={{ width: `${(progress.length / CHALLENGES.length) * 100}%` }} 
              className="h-full bg-blue-500" 
            />
          </div>
          <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 p-1 rounded-full px-3">
            <div className="flex items-center gap-2">
               <User className="w-4 h-4 text-slate-500" />
               <span className="text-sm font-medium text-slate-700">{user?.username}</span>
            </div>
            <button onClick={logout} className="p-1 hover:bg-slate-200 rounded-full text-slate-500">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* --- LEFT SIDEBAR: CHALLENGES --- */}
        <aside className="w-72 bg-white border-r border-slate-200 overflow-y-auto hidden lg:block">
          <div className="p-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Curriculum</h3>
            <div className="space-y-1">
              {CHALLENGES.map((day) => {
                const isCompleted = progress.includes(day.id);
                const isCurrent = activeChallengeId === day.id;
                // If previous is completed, or it's the first one, it's unlocked
                const isUnlocked = day.id === 1 || progress.includes(day.id - 1);
                
                return (
                  <div 
                    key={day.id}
                    onClick={() => isUnlocked && setActiveChallengeId(day.id)}
                    className={`p-3 rounded-xl transition-all ${
                      isCurrent ? 'bg-blue-50 border border-blue-100 cursor-default' : 
                      isUnlocked ? 'hover:bg-slate-50 cursor-pointer' : 'opacity-50 cursor-not-allowed grayscale'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isCompleted ? 'bg-emerald-100 text-emerald-700' : 
                        isCurrent ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        TASK {day.id}
                      </span>
                      {isCompleted && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                      {!isUnlocked && <ShieldCheck className="w-4 h-4 text-slate-300" />}
                    </div>
                    <h4 className="text-sm font-bold text-slate-700">{day.title}</h4>
                    <p className="text-xs text-slate-500 mt-1">{day.topic}</p>
                  </div>
                );
              })}
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
                <span className="text-xs font-bold uppercase tracking-tighter">Corporate Ticket #JP-20{activeChallengeId}</span>
              </div>
              <h1 className="text-2xl font-black text-slate-800 mb-4">{activeChallenge?.title}</h1>
              
              <div className="prose prose-slate text-sm leading-relaxed">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm my-4">
                  <h5 className="font-bold text-xs text-slate-400 mb-2">OBJECTIVE</h5>
                  <p className="text-slate-700 font-medium italic">"{activeChallenge?.desc}"</p>
                </div>
              </div>

              {/* GEMINI INTEGRATED BOX */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="mt-8 bg-gradient-to-br from-blue-600 to-indigo-700 p-4 rounded-2xl text-white shadow-lg shadow-blue-200 cursor-pointer"
                onClick={openGeminiReview}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-blue-200" />
                  <span className="text-xs font-bold uppercase tracking-widest">Gemini AI Mentor</span>
                </div>
                <p className="text-sm opacity-90">"Need help or a code review? Click here to chat with your Senior Java Mentor."</p>
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
                <span className="ml-4 text-xs font-mono text-slate-400">Workspace.java</span>
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
                {isLoading && <p>{'>'} Compiling artifacts...</p>}
                <p className="text-white font-bold underline mb-1">Output:</p>
                <p className="text-white">{output || "> Click 'Deploy & Run' to see output..."}</p>
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
              <div className="p-4 bg-blue-600 text-white flex justify-between items-center shadow-md z-10">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-6 h-6" />
                  <div>
                    <h2 className="text-lg font-bold">Gemini Mentor</h2>
                    <p className="text-xs opacity-70">Senior Staff Engineer</p>
                  </div>
                </div>
                <button onClick={() => setShowChat(false)} className="hover:bg-blue-700 p-2 rounded-full transition-colors">
                  ✕
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {chatHistory.length === 0 && (
                  <div className="text-center text-slate-400 mt-10 text-sm">
                    No chat history yet. Ask for a code review!
                  </div>
                )}
                {chatHistory.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                      msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-700'
                    }`}>
                      {msg.role === 'model' ? (
                        <div className="prose prose-sm prose-blue max-w-none">
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
                    <div className="bg-white border border-slate-200 text-slate-400 px-4 py-3 rounded-2xl text-sm flex items-center gap-2 shadow-sm">
                      <Sparkles className="w-4 h-4 animate-pulse text-blue-500" />
                      Thinking...
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
                    className="flex-1 border border-slate-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                  <button 
                    type="submit"
                    disabled={!chatMessage.trim() || isChatLoading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white p-2 rounded-full transition-colors flex items-center justify-center w-10 h-10 shadow-md"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- FOOTER STATUS --- */}
      <footer className="h-8 bg-white border-t border-slate-200 px-6 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        <div className="flex gap-4">
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"/> Server: Connected</span>
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
