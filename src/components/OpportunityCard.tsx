import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  ExternalLink, 
  BarChart3, 
  Target, 
  Sparkles, 
  Loader2,
  CheckCircle2,
  Lock,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

interface Opportunity {
  id: string;
  title: string;
  platform: string;
  budget: string;
  url: string;
  tags: string[];
  scores: {
    demand: number;
    competition: number;
    monetization: number;
  };
  aiSummary: string;
}

export default function OpportunityCard({ opp }: { opp: Opportunity }) {
  const { subscriptionStatus } = useAuth();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const isGuest = subscriptionStatus === 'guest';

  const handleLaunchAnalysis = () => {
    if (isGuest) {
      toast.error("Access Restricted", {
        description: "Registration required for deep signal analysis."
      });
      return;
    }
    setIsAnalyzing(true);
    toast.loading("Deconstructing market signals...", { id: `analysis-${opp.id}` });
    
    // Simulate deep AI processing
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      toast.success("Intelligence Report Ready", {
        id: `analysis-${opp.id}`,
        description: `Analysis for ${opp.title} has been persisted to your dashboard.`
      });
    }, 4000);
  };

  const toggleSave = () => {
    if (isGuest) {
      toast.error("Login Required", {
        description: "Save opportunities to your persistent vault."
      });
      return;
    }
    setIsSaved(!isSaved);
    toast(isSaved ? "Opportunity Unsaved" : "Opportunity Vaulted", {
      icon: isSaved ? <Bookmark className="w-4 h-4" /> : <BookmarkCheck className="w-4 h-4 text-emerald-500" />,
      description: isSaved ? "Removed from your watchlist." : "Available in your saved opportunities vault."
    });
  };

  return (
    <Card className="glass-card bg-zinc-950 group h-full flex flex-col border-zinc-800/50 hover:border-amber-500/30 transition-all duration-500 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div className="flex items-center gap-2">
          <a 
            href={opp.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-[8px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors flex items-center gap-1"
          >
            {opp.platform}
            <ExternalLink className="w-2 h-2" />
          </a>
          <button 
            onClick={toggleSave}
            className={`p-1 rounded transition-colors ${isSaved ? 'text-emerald-500' : 'text-zinc-600 hover:text-zinc-400'}`}
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>
        </div>
        <span className="text-[10px] font-black text-amber-500 tracking-tighter">{opp.budget}</span>
      </CardHeader>
      
      <CardContent className="space-y-6 flex-1 flex flex-col pt-4">
        <div>
          <h3 className="text-xl font-black group-hover:text-amber-500 transition-colors uppercase leading-[0.9] tracking-tighter block mb-3">
            {opp.title}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {opp.tags.map(tag => (
              <Badge key={tag} variant="outline" className="text-[8px] border-zinc-800 bg-zinc-900/50 text-zinc-500 font-bold uppercase py-0 px-2">
                #{tag}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="relative">
          <p className={`text-[11px] text-zinc-400 leading-relaxed italic ${isGuest ? 'filter blur-[1px] select-none' : ''}`}>
            "{opp.aiSummary}"
          </p>
          {isGuest && (
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/40 backdrop-blur-sm px-3 py-1 rounded border border-zinc-800 flex items-center gap-2">
                   <Lock className="w-3 h-3 text-amber-500" />
                   <span className="text-[8px] font-black uppercase tracking-widest">Locked for Preview</span>
                </div>
             </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 py-4 border-y border-zinc-800/50 mt-auto">
          <div className="flex flex-col gap-1">
            <span className="text-[7px] text-zinc-500 uppercase font-black tracking-widest flex items-center gap-1">
               <Zap className="w-2 h-2" /> Demand
            </span>
            <div className="text-sm font-black">{opp.scores.demand}%</div>
          </div>
          <div className="flex flex-col gap-1 border-x border-zinc-900/50 px-2">
            <span className="text-[7px] text-zinc-500 uppercase font-black tracking-widest flex items-center gap-1">
               <Target className="w-2 h-2" /> Competition
            </span>
            <div className="text-sm font-black">{opp.scores.competition}%</div>
          </div>
          <div className="flex flex-col gap-1 text-right">
            <span className="text-[7px] text-zinc-500 uppercase font-black tracking-widest flex items-center gap-1 justify-end">
               <BarChart3 className="w-2 h-2" /> Value
            </span>
            <div className="text-sm font-black">{opp.scores.monetization}%</div>
          </div>
        </div>
        
        <div className="pt-4">
          <AnimatePresence mode="wait">
            {isAnalyzing ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-11 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center gap-2"
              >
                <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Deconstructing Signals...</span>
              </motion.div>
            ) : analysisComplete ? (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full h-11 bg-amber-500 text-black rounded-lg flex items-center justify-center gap-2 font-black uppercase tracking-widest text-[10px]"
              >
                <CheckCircle2 className="w-4 h-4" />
                Analysis Persisted
              </motion.div>
            ) : (
              <Button 
                onClick={handleLaunchAnalysis}
                className="w-full h-11 bg-white text-black hover:bg-zinc-200 text-[10px] font-black uppercase tracking-widest group/btn relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Sparkles className="w-3 h-3" />
                  Launch Signal Analysis
                </span>
                <motion.div 
                  initial={false}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full"
                />
              </Button>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}
