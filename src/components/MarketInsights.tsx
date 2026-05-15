import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  Flame, 
  AlertCircle, 
  ArrowRight,
  TrendingDown,
  TrendingUp,
  MessageCircle,
  Lightbulb,
  Lock,
  Loader2,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

const TRENDS = [
  { 
    id: 1, 
    topic: 'AI Agent Workflows', 
    trend: 'up', 
    percentage: '+42%', 
    color: 'text-emerald-500',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop'
  },
  { 
    id: 2, 
    topic: 'Basic Copywriting', 
    trend: 'down', 
    percentage: '-28%', 
    color: 'text-rose-500',
    image: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=800&auto=format&fit=crop'
  },
  { 
    id: 3, 
    topic: 'Web3 Compliance', 
    trend: 'up', 
    percentage: '+15%', 
    color: 'text-blue-500',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=800&auto=format&fit=crop'
  }
];

const PAIN_POINTS = [
  {
    id: 'p1',
    topic: 'Legacy System Migration',
    frustration: 'Clients are terrified of data loss during cloud migration. Existing tools are too technical for small business owners.',
    monetization: 9,
    source: 'Reddit/r/SaaS'
  },
  {
    id: 'p2',
    topic: 'Subscription Fatigue',
    frustration: 'Users are looking for lifetime deals or consumption-based pricing models due to too many monthly subs.',
    monetization: 7,
    source: 'Twitter/X'
  }
];

export default function MarketInsights() {
  const { subscriptionStatus } = useAuth();
  const isPro = subscriptionStatus === 'pro';
  const [loadingAssets, setLoadingAssets] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoadingAssets(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative">
      <div className={cn("grid grid-cols-1 lg:grid-cols-3 gap-12", !isPro && "blur-[8px] pointer-events-none select-none")}>
        {/* Trends List */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <h3 className="text-xl font-bold tracking-tighter uppercase dark:text-white">Neural Trend Vectors</h3>
          <div className="flex flex-col gap-4">
            {TRENDS.map((t) => (
              <Card key={t.id} className="dark:bg-zinc-950 border-zinc-900 group overflow-hidden">
                <div className="h-32 w-full relative overflow-hidden">
                  {loadingAssets ? (
                    <div className="absolute inset-0 bg-zinc-900 animate-pulse" />
                  ) : (
                    <img 
                      src={t.image} 
                      alt={t.topic} 
                      className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-700"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                </div>
                <CardContent className="p-5 flex items-center justify-between relative -mt-8">
                  <div>
                    <div className="text-[9px] text-zinc-500 uppercase font-black tracking-widest mb-1">Vector Focus</div>
                    <div className="text-sm font-black dark:text-white tracking-tight uppercase">{t.topic}</div>
                  </div>
                  <div className="text-right">
                    <div className={cn(t.color, "flex items-center gap-1 font-mono text-sm font-bold bg-zinc-900 px-2 py-1 rounded border border-zinc-800")}>
                      {t.trend === 'up' ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                      {t.percentage}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-amber-500 border-none text-zinc-950 shadow-[0_0_30px_rgba(245,158,11,0.1)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] uppercase font-black tracking-[0.2em] flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Intelligence Brief
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs font-bold leading-relaxed tracking-tight">
              Market is shifting towards <span className="underline decoration-black/30">Outcome-Based Pricing</span>. Fractional agencies are scaling 2.8x faster than traditional service models.
            </CardContent>
          </Card>
        </div>

        {/* Pain Point Feed */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xl font-bold tracking-tighter uppercase dark:text-white">Market Fragment Analysis</h3>
              <p className="text-[10px] font-mono text-zinc-500 uppercase">Extracting monetization gaps from social layers</p>
            </div>
            <Badge variant="outline" className="border-zinc-800 text-zinc-500 font-mono text-[9px] px-3 py-1">SCANNED: 1.2K NODES</Badge>
          </div>

          <ScrollArea className="h-[600px] pr-4">
            <div className="flex flex-col gap-6 pb-12">
              {PAIN_POINTS.map((p, idx) => (
                <motion.div 
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="dark:bg-zinc-950 border-zinc-900 group relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-amber-500/50 group-hover:w-full group-hover:opacity-5 transition-all duration-500" />
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-lg font-black tracking-tighter uppercase dark:text-white">{p.topic}</CardTitle>
                      <span className="text-[9px] uppercase font-mono text-zinc-500 tracking-widest">Source: {p.source}</span>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <p className="text-sm text-zinc-400 leading-relaxed italic border-l-2 border-zinc-800 pl-4">"{p.frustration}"</p>
                      <div className="flex items-center justify-between pt-6 border-t border-zinc-900">
                        <div className="space-y-3">
                          <div className="text-[9px] uppercase font-black text-zinc-500 tracking-[0.2em] mb-2">Monetization Velocity</div>
                          <div className="flex gap-1.5">
                            {[...Array(10)].map((_, i) => (
                              <motion.div 
                                key={i}
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                className={cn(
                                  "w-2 h-4 rounded-sm transition-colors duration-500",
                                  i < p.monetization ? "bg-amber-500" : "bg-zinc-800/50"
                                )}
                              />
                            ))}
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="h-10 text-[10px] font-black uppercase tracking-widest border-zinc-800 hover:bg-zinc-900 transition-all group-hover:translate-x-1">
                          Synthesize Business Model <ArrowRight className="ml-2 w-4 h-4 text-amber-500" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {!isPro && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-8 bg-black/20 backdrop-blur-[2px]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-12 bg-zinc-950 border border-zinc-800 rounded-[2.5rem] shadow-2xl max-w-md w-full"
          >
            <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-8 ring-1 ring-amber-500/20">
              <Lock className="w-10 h-10 text-amber-500" />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-3">Vector Intel Locked</h3>
            <p className="text-zinc-500 text-sm mb-8 uppercase tracking-widest leading-relaxed font-medium">
              Market pain-point discovery and monetization scoring requires <span className="text-white">Neural Tier Authorization</span>.
            </p>
            <Button className="w-full bg-white text-black hover:bg-zinc-200 py-7 font-black uppercase tracking-[0.2em] text-[10px] shadow-lg">
              Launch Pro Terminal
            </Button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
