import React from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown, 
  MessageSquare, 
  ShieldCheck, 
  ArrowUpRight,
  Info,
  Clock
} from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface PulseSignal {
  id: string;
  title: string;
  category: string;
  impact: 'High' | 'Critical' | 'Moderate';
  description: string;
  source: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  timeAgo?: string;
  growthRate?: string;
}

export default function PulseSignalCard({ signal, onExplore }: { signal: PulseSignal, onExplore: () => void }) {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'Critical': return 'text-rose-500 border-rose-500/30 bg-rose-500/5';
      case 'High': return 'text-amber-500 border-amber-500/30 bg-amber-500/5';
      default: return 'text-sky-500 border-sky-500/30 bg-sky-500/5';
    }
  };

  return (
    <Card className="bg-zinc-950 border-zinc-800/50 group overflow-hidden hover:border-zinc-700 transition-all duration-300">
      <div className="flex flex-col md:flex-row">
        <div className="p-6 flex-1 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline" className="bg-zinc-900 border-zinc-800 text-zinc-500 text-[8px] font-black uppercase tracking-widest px-2">
              {signal.category}
            </Badge>
            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded border text-[8px] font-black uppercase tracking-widest ${getImpactColor(signal.impact)}`}>
              <Info className="w-2 h-2" />
              Impact: {signal.impact}
            </div>
            {signal.growthRate && (
              <div className="flex items-center gap-1 text-[8px] font-mono text-emerald-500 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-widest">
                <TrendingUp className="w-2 h-2" />
                {signal.growthRate}
              </div>
            )}
            <div className="flex items-center gap-1 text-[8px] font-mono text-zinc-600 uppercase tracking-widest ml-auto">
              <Clock className="w-2 h-2" />
              {signal.timeAgo || 'Recently'}
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-xl font-black uppercase tracking-tighter group-hover:text-amber-500 transition-colors leading-none">
              {signal.title}
            </h4>
            <p className="text-[11px] text-zinc-400 leading-relaxed max-w-2xl font-medium">
              {signal.description}
            </p>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                <ShieldCheck className="w-2.5 h-2.5 text-zinc-500" />
              </div>
              <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">Verified by {signal.source}</span>
            </div>
            {signal.sentiment && (
              <div className="flex items-center gap-1.5">
                 <div className={`w-1.5 h-1.5 rounded-full ${signal.sentiment === 'positive' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'}`} />
                 <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">Sentiment: {signal.sentiment}</span>
              </div>
            )}
          </div>
        </div>

        <div className="md:w-56 bg-zinc-900/20 p-6 flex flex-col justify-center items-center border-l border-zinc-800/50 group-hover:bg-zinc-900/40 transition-colors">
          <Button 
            onClick={onExplore}
            size="sm" 
            variant="outline" 
            className="w-full border-zinc-800 bg-zinc-950 text-[9px] uppercase font-black tracking-widest gap-2 h-10 hover:bg-white hover:text-black transition-all duration-300"
          >
            Tactical Brief <ArrowUpRight className="w-3 h-3" />
          </Button>
          <div className="mt-4 flex flex-col items-center gap-1">
             <div className="flex gap-0.5">
                {[1,2,3,4,5].map(i => <div key={i} className="w-1.5 h-3 bg-zinc-800 rounded-sm" />)}
             </div>
             <span className="text-[7px] text-zinc-700 uppercase font-black font-mono">Confidence 88%</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
