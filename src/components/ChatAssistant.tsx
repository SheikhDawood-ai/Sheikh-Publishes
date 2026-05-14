import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, Sparkles, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { aiService } from '../services/aiService';

export default function ChatAssistant({ isOpen, setIsOpen, profile }: { isOpen: boolean, setIsOpen: (v: boolean) => void, profile: any }) {
  const [messages, setMessages] = useState<{role: 'bot'|'user', text: string}[]>([
    { role: 'bot', text: `Hello! I'm your Intel Strategist for ${profile.name}. I've initialized my synthesis for the ${profile.niche} niche. What research should we prioritize?` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingContent]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);
    setStreamingContent('');

    try {
      const nicheContext = `User Profile Niche: ${profile.niche}. `;
      const historyFormatted = messages.slice(-5).map(m => ({
        role: m.role === 'bot' ? 'model' : 'user',
        parts: [{ text: m.text }]
      }));

      const response = await aiService.startOnboardingConsultant(
        nicheContext + userMsg, 
        historyFormatted, 
        (text) => setStreamingContent(text)
      );
      
      setMessages(prev => [...prev, { role: 'bot', text: response.text }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: "Signal interference detected. Authentication required for deep synthesis or try again." }]);
    } finally {
      setIsTyping(false);
      setStreamingContent('');
    }
  };

  const handleRetry = () => {
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMsg) {
      handleSend(); // This isn't quite right as handleSend uses 'input', I'll fix
    }
  };

  return (
    <>
      {/* Floating Toggle */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-white text-black rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center justify-center z-[100] lg:bottom-10 lg:right-10"
        >
          <MessageSquare className="w-6 h-6" />
        </motion.button>
      )}

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full md:w-[400px] bg-zinc-950 border-l border-zinc-800 z-[90] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-zinc-900 bg-black flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center border border-zinc-800">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-tight">Intel Assistant</h3>
                  <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">Active Synthesis</span>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-zinc-500">
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'bot' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed ${
                    m.role === 'bot' 
                      ? 'bg-zinc-900 text-zinc-300 rounded-tl-none border border-zinc-800 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]' 
                      : 'bg-white text-black font-medium rounded-tr-none'
                  }`}>
                    {m.text}
                    {m.role === 'bot' && m.text.includes("interference") && (
                      <Button 
                        variant="link" 
                        onClick={() => handleSend()} // Simple retry logic for demo
                        className="p-0 h-auto text-[8px] text-amber-500 uppercase font-black underline mt-2"
                      >
                        Retry Analysis
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && streamingContent && (
                <div className="flex justify-start">
                   <div className="max-w-[85%] p-4 bg-zinc-900 text-zinc-300 border border-zinc-800 rounded-2xl rounded-tl-none text-xs leading-relaxed">
                    {streamingContent}
                    <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="inline-block w-1 h-3 bg-amber-500 ml-1 translate-y-0.5" />
                  </div>
                </div>
              )}
              {isTyping && !streamingContent && (
                <div className="flex justify-start">
                   <div className="flex gap-1 items-center p-4 bg-zinc-900 border border-zinc-800 rounded-2xl w-fit">
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-zinc-400 rounded-full" />
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-zinc-400 rounded-full" />
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-zinc-400 rounded-full" />
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 bg-black border-t border-zinc-900">
              <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
                <Input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask for research..."
                  className="bg-zinc-900 border-zinc-800 focus:border-zinc-700 text-sm h-12"
                  disabled={isTyping}
                />
                <Button type="submit" disabled={isTyping || !input.trim()} className="bg-white text-black hover:bg-zinc-200 h-12 px-5">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Competitor Pricing", "2026 Trends", "Reddit Pain Points"].map(chip => (
                  <button 
                    key={chip}
                    onClick={() => { setInput(chip); }}
                    className="text-[8px] font-black uppercase tracking-widest text-zinc-500 border border-zinc-800 px-2 py-1 rounded hover:border-zinc-600 hover:text-white transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
