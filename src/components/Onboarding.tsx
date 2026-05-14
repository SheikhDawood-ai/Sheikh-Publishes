import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, MessageSquare, Briefcase, Zap, Globe, Loader2, Bot } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { aiService } from '../services/aiService';

type Message = {
  role: 'bot' | 'user';
  text: string;
};

export default function Onboarding({ onComplete }: { onComplete: (profile: any) => void }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: "Welcome to LancerIntel Pro. I'm your strategic consultant. To build your opportunity engine, I need to understand your unique edge. What is your primary technical expertise or service offering?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [quickChips, setQuickChips] = useState<string[]>(["Web Development", "AI Automation", "UI/UX Design", "Marketing Strategy"]);
  const [step, setStep] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const skipOnboarding = () => {
    onComplete({
      name: "Guest Venture",
      niche: "General Freelancing",
      techStack: [],
      onboardingComplete: false,
      isGuest: true
    });
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  const handleSubmit = async (e?: React.FormEvent, overrideText?: string) => {
    if (e) e.preventDefault();
    const userMsg = overrideText || input;
    if (!userMsg.trim() || isTyping) return;

    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);
    setStreamingContent('');
    setQuickChips([]);

    try {
      const history = messages.slice(-4).map(m => ({
        role: m.role === 'bot' ? 'model' : 'user',
        parts: [{ text: m.text }]
      }));

      const response = await aiService.startOnboardingConsultant(
        userMsg, 
        history,
        (text) => setStreamingContent(text)
      );

      // Clean response and extract chips
      const rawText = response.text;
      const chipMatch = rawText.match(/CHIPS:\s*(.*)/i);
      const cleanText = chipMatch ? rawText.replace(chipMatch[0], "").trim() : rawText.trim();
      const chips = chipMatch ? chipMatch[1].split(",").map(c => c.trim()) : ["Scaling Strategy", "Market Fit", "Tech Stack"];

      setMessages(prev => [...prev, { role: 'bot', text: cleanText }]);
      setQuickChips(chips);
      setStep(prev => prev + 1);

      // After 4 steps, trigger completion
      if (step >= 3) {
        setTimeout(() => {
          onComplete({
            name: "Initial Venture",
            niche: "Strategic AI Consultant",
            techStack: ["Next.js", "Gemini API"],
            onboardingComplete: true,
            isGuest: false
          });
        }, 1500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
      setStreamingContent('');
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(30,41,59,0.2),transparent)] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl z-10"
      >
        <div className="flex flex-col items-center mb-8 gap-2">
          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            <Bot className="w-6 h-6 text-black" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter uppercase linear-gradient-text">Strategic Discovery</h1>
          <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Phase 01: Context Ingestion</p>
          <Button 
            variant="ghost" 
            onClick={skipOnboarding}
            className="text-[10px] uppercase font-bold text-zinc-500 mt-2 hover:text-white"
          >
            Skip for Now →
          </Button>
        </div>

        <Card className="glass-card bg-zinc-950/80 border-zinc-800/50 overflow-hidden">
          <CardContent className="p-0">
            <div className="h-[400px] overflow-y-auto p-6 space-y-6 scroll-smooth scrollbar-hide">
              <AnimatePresence mode="popLayout">
                {messages.map((m, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: m.role === 'bot' ? -10 : 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className={`flex ${m.role === 'bot' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                      m.role === 'bot' 
                        ? 'bg-zinc-900 text-zinc-200 rounded-tl-none border border-zinc-800' 
                        : 'bg-white text-black font-medium rounded-tr-none'
                    }`}>
                      {m.text}
                    </div>
                  </motion.div>
                ))}
                
                {isTyping && streamingContent && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed bg-zinc-900 text-zinc-200 rounded-tl-none border border-zinc-800">
                      {streamingContent}
                      <motion.span 
                        animate={{ opacity: [0, 1, 0] }} 
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        className="inline-block w-1.5 h-4 bg-amber-500 ml-1 translate-y-0.5"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {!isTyping && quickChips.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {quickChips.map((chip, idx) => (
                    <motion.button
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      onClick={() => handleSubmit(undefined, chip)}
                      className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 hover:border-amber-500/50 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-full text-[10px] font-bold uppercase tracking-widest transition-all"
                    >
                      {chip}
                    </motion.button>
                  ))}
                </div>
              )}
              
              {isTyping && !streamingContent && (
                <div className="flex gap-1 items-center p-4 bg-zinc-900 border border-zinc-800 rounded-2xl w-fit">
                  <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-zinc-400 rounded-full" />
                  <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-zinc-400 rounded-full" />
                  <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-zinc-400 rounded-full" />
                </div>
              )}
              <div ref={scrollRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-4 bg-zinc-900/50 border-t border-zinc-800 flex gap-2">
              <Input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your response..."
                className="bg-transparent border-zinc-800 focus:border-white transition-colors text-sm py-6"
                disabled={isTyping}
              />
              <Button type="submit" disabled={isTyping || !input.trim()} className="bg-white text-black hover:bg-zinc-200 h-auto px-6">
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 grid grid-cols-3 gap-4">
          {[
            { icon: Globe, label: "Real-time Grounding" },
            { icon: Zap, label: "Market Extraction" },
            { icon: MessageSquare, label: "Business Synthesis" }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-2 opacity-40">
              <item.icon className="w-4 h-4" />
              <span className="text-[8px] font-mono uppercase tracking-widest">{item.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
