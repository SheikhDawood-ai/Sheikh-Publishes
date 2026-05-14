import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Command, 
  Mail, 
  Lock, 
  ArrowRight, 
  Github, 
  Chrome, 
  Loader2,
  ShieldCheck,
  Zap,
  Globe,
  CheckCircle2
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    try {
      await login();
      navigate('/');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate email login
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 selection:bg-white selection:text-black">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[20%] w-[500px] h-[500px] bg-amber-500/[0.02] rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8 z-10"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.15)]">
            <Command className="w-10 h-10 text-black" />
          </div>
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-black tracking-tighter uppercase italic italic-gradient-text">
               {isLogin ? 'Access Gateway' : 'Network Entry'}
            </h1>
            <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.3em]">
               {isLogin ? 'Securing Strategic Edge' : 'Initializing New Protocol'}
            </p>
          </div>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-3xl space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
          
          <div className="space-y-4">
            <Button 
               onClick={handleGoogleLogin}
               disabled={isSubmitting}
               className="w-full h-14 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white font-black uppercase tracking-widest text-[10px] gap-3"
            >
              <Chrome className="w-4 h-4" />
              Continue with Google Intelligence
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-900"></div></div>
            <div className="relative flex justify-center text-[8px] uppercase font-black tracking-widest leading-none">
              <span className="bg-zinc-950 px-4 text-zinc-600">Secure Direct Access</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">Protocol Identifier</label>
               <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <Input 
                  type="email" 
                  placeholder="nexus@lancerintel.ai" 
                  className="h-14 pl-12 bg-zinc-900 border-zinc-800 focus:border-zinc-500 font-mono text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
               </div>
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">Neural Key</label>
               <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    className="h-14 pl-12 bg-zinc-900 border-zinc-800 focus:border-zinc-500 font-mono text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
               </div>
            </div>

            <Button 
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 bg-white text-black hover:bg-zinc-200 font-black uppercase tracking-[0.2em] text-[10px] gap-2 mt-4"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              {isLogin ? 'Initiate Link' : 'Register Signature'}
            </Button>
          </form>

          <div className="text-center pt-4">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
            >
              {isLogin ? "Missing credentials? Request Access" : "Existing protocol? Enter Gateway"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 opacity-40">
           <div className="flex flex-col items-center gap-2">
              <Zap className="w-4 h-4" />
              <span className="text-[7px] font-black uppercase tracking-widest">Instant Sync</span>
           </div>
           <div className="flex flex-col items-center gap-2">
              <Globe className="w-4 h-4" />
              <span className="text-[7px] font-black uppercase tracking-widest">Global Edge</span>
           </div>
           <div className="flex flex-col items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-[7px] font-black uppercase tracking-widest">Verified Intel</span>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
