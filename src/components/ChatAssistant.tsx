import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Loader2, 
  Zap,
  Terminal,
  BrainCircuit,
  MessagesSquare
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { useAuth } from '../context/AuthContext';
import { aiService } from '../services/aiService';
import { toast } from 'sonner';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export default function ChatAssistant({ profile }: { profile: any }) {
  const { user, subscriptionStatus } = useAuth();
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(`chat_history_${profile.id}`);
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        role: 'assistant',
        content: `Neural link established for ${profile.name}. I've synthesized market signals for the ${profile.niche} sector. What's our next objective?`,
        timestamp: new Date().toISOString(),
      }
    ];
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isGuest = subscriptionStatus === 'guest';

  const [processingStage, setProcessingStage] = useState<'analyzing' | 'sentiment' | 'formulating' | 'idle'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [lastPrompt, setLastPrompt] = useState<string>('');

  const [customContext, setCustomContext] = useState('');

  useEffect(() => {
    if (user) {
      getDoc(doc(db, 'users', user.uid)).then(docSnap => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          let ctx = '';
          if (data.skillSets) ctx += ` User Skills: ${data.skillSets}.`;
          if (data.industryFocus) ctx += ` Industry Focus: ${data.industryFocus}.`;
          setCustomContext(ctx);
        }
      });
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(`chat_history_${profile.id}`, JSON.stringify(messages));
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, profile.id]);

  const handleSend = async (text: string = input) => {
    const messageText = text.trim();
    if (!messageText || isLoading) return;

    if (isGuest && messages.length >= 4) {
      toast.error("Protocol Restrict", {
        description: "Standard account required for extended neural sessions."
      });
      return;
    }

    const lastMsg = messages[messages.length - 1];
    const isRetry = lastMsg && lastMsg.role === 'user' && lastMsg.content === messageText;

    if (!isRetry) {
      const userMsg: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: messageText,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, userMsg]);
    }
    
    setLastPrompt(messageText);
    setInput('');
    setIsLoading(true);
    setProcessingStage('analyzing');
    setError(null);

    try {
      const context = `User Profile: ${profile.name}, Niche: ${profile.niche}.${customContext} `;
      const history = messages.slice(-6).map(m => ({
        role: m.role,
        content: m.content
      }));

      // Stage switch for UX
      setTimeout(() => setProcessingStage('sentiment'), 800);
      setTimeout(() => setProcessingStage('formulating'), 1600);

      const reply = await aiService.chat(context + messageText, history);
      
      if (!reply) throw new Error("Neural response nullified.");

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: reply,
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error("Neural Error:", err);
      setError(err?.message || "Signal interference detected.");
      toast.error("Signal Lost", { description: "Neural link severed. Potential frequency interference." });
    } finally {
      setIsLoading(false);
      setProcessingStage('idle');
    }
  };

  const quickPrompts = [
    { label: "Analyze Pricing", icon: <Terminal className="w-3 h-3" /> },
    { label: "Predict Trends", icon: <BrainCircuit className="w-3 h-3" /> },
    { label: "Identify Gaps", icon: <Sparkles className="w-3 h-3" /> }
  ];

  return (
    <div className="flex flex-col h-full bg-zinc-950/50 rounded-xl border border-zinc-800/50 overflow-hidden">
      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-hide"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${
                  msg.role === 'user' 
                    ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' 
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 shadow-glow-sm'
                }`}>
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`space-y-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-4 rounded-2xl text-[11px] leading-relaxed relative ${
                    msg.role === 'user' 
                      ? 'bg-amber-500 text-black font-bold rounded-tr-none' 
                      : 'bg-zinc-900 text-zinc-300 border border-zinc-800 rounded-tl-none shadow-glow-zinc'
                  }`}>
                    {msg.content}
                    {msg.role === 'assistant' && (
                      <div className="absolute -left-[22px] top-0 bottom-0 w-px bg-gradient-to-b from-amber-500/50 to-transparent" />
                    )}
                  </div>
                  <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest px-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3 items-center text-zinc-500">
               <div className="w-8 h-8 rounded-lg border border-zinc-800 bg-zinc-900 flex items-center justify-center">
                 <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest animate-pulse">
                {processingStage === 'analyzing' ? 'Analyzing Neural Network...' : 
                 processingStage === 'sentiment' ? 'Evaluating Query Sentiment...' : 'Formulating Strategic Output...'}
               </span>
            </div>
          </div>
        )}

        {error && !isLoading && (
          <div className="flex justify-center p-4">
            <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-6 flex flex-col items-center gap-3 text-center max-w-sm">
                <span className="text-[10px] font-black uppercase tracking-widest text-rose-500">Neural Sync Failed</span>
                <p className="text-[10px] text-zinc-500 leading-relaxed uppercase tracking-tighter">{error}</p>
                <Button 
                  onClick={() => handleSend(lastPrompt)}
                  variant="outline" 
                  className="h-8 border-rose-500/30 text-rose-500 hover:bg-rose-500/10 text-[9px] font-black uppercase"
                >
                  Retry Analysis
                </Button>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-6 bg-zinc-950 border-t border-zinc-900">
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
          {quickPrompts.map((p) => (
            <button
              key={p.label}
              onClick={() => handleSend(p.label)}
              disabled={isLoading}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/50 text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-white hover:border-zinc-700 transition-all whitespace-nowrap group"
            >
              <div className="text-zinc-600 group-hover:text-amber-500 transition-colors">
                {p.icon}
              </div>
              {p.label}
            </button>
          ))}
        </div>
        
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isGuest && messages.length >= 4 ? "Upgrade to continue session..." : "Enter neural query..."}
            disabled={isLoading || (isGuest && messages.length >= 4)}
            className="h-12 bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 pr-12 focus-visible:ring-amber-500/20 focus-visible:border-amber-500/50"
          />
          <Button 
            type="submit"
            disabled={!input.trim() || isLoading || (isGuest && messages.length >= 4)}
            size="icon"
            className="absolute right-1 top-1 bottom-1 w-10 h-10 bg-white text-black hover:bg-zinc-200 transition-all active:scale-95"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
        
        <div className="mt-3 flex items-center justify-between">
           <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[8px] font-black uppercase text-zinc-600 tracking-widest">Quantum Engine: Ready</span>
           </div>
           {isGuest && (
             <span className="text-[8px] font-black uppercase text-amber-500 tracking-widest">
               Preview Mode: {messages.length-1}/3 messages
             </span>
           )}
        </div>
      </div>
    </div>
  );
}
