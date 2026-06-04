import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { motion } from 'framer-motion';
import { KeyRound, User as UserIcon, Sparkles } from 'lucide-react';

const Logo = ({ className = "w-12 h-12" }) => (
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

const Login = () => {
  const { login, register } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await login(username, password);
      } else {
        await register(username, password);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Soft Pastel Background Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100 rounded-full filter blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-100 rounded-full filter blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="backdrop-blur-md bg-white/80 border border-slate-200/60 rounded-3xl p-8 shadow-xl shadow-slate-200/50">
          
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-3"
            >
              <Logo className="w-16 h-16 mx-auto" />
            </motion.div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              JavaPath Pro
            </h1>
            <p className="text-slate-500 text-sm mt-2 font-medium">
              Accelerate your engineering journey with AI mentorship
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="bg-red-50 border border-red-200 text-red-600 p-3.5 rounded-xl text-xs font-semibold mb-6 flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Username</label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input 
                  type="text" 
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm shadow-inner"
                  placeholder="alex_dev"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Password</label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm shadow-inner"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full relative group overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
            >
              <span className="absolute inset-0 bg-white/15 opacity-0 group-hover:opacity-100 transition-opacity" />
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-purple-100" />
                  <span>{isLogin ? 'Sign In to Dashboard' : 'Launch New Account'}</span>
                </>
              )}
            </button>
          </form>

          {/* Selector */}
          <div className="mt-8 text-center border-t border-slate-100 pt-6">
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold transition-colors"
            >
              {isLogin ? (
                <>New to JavaPath? <span className="text-blue-600 hover:underline">Start your career path here</span></>
              ) : (
                <>Already on the path? <span className="text-blue-600 hover:underline">Sign in</span></>
              )}
            </button>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default Login;
