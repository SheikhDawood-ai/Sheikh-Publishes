import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Square, Play, Activity, MessageSquare, Zap, Loader2, Lock } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

type AnalysisStage = 'extracting' | 'sentiment' | 'strategy' | 'complete' | 'idle';

export default function AudioIntel() {
  const { subscriptionStatus } = useAuth();
  const isPro = subscriptionStatus === 'pro';
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState<{ time: string, text: string }[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStage, setAnalysisStage] = useState<AnalysisStage>('idle');
  const [insights, setInsights] = useState<string[]>([]);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = () => {
    setIsRecording(true);
    setTranscription([]);
    setInsights([]);
    // Mocking real-time feed
    let i = 0;
    const streamTexts = [
      "Starting audio feed analysis...",
      "Detected keywords: budget, freelance, marketplace.",
      "Client mentioned frustration with Upwork fees.",
      "Suggesting move to direct invoicing for this client tier.",
      "Analyzing pricing sentiment... stable but cautious.",
      "Final observation: demand for AI agents is spiking in the EU."
    ];

    timerRef.current = setInterval(() => {
      if (i < streamTexts.length) {
        setTranscription(prev => [...prev, { 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), 
          text: streamTexts[i] 
        }]);
        i++;
      } else {
        stopRecording();
      }
    }, 2000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setIsAnalyzing(true);
    
    // Controlled Stage Machine
    const runAnalysis = async () => {
      setAnalysisStage('extracting');
      await new Promise(r => setTimeout(r, 1200));
      setAnalysisStage('sentiment');
      await new Promise(r => setTimeout(r, 1400));
      setAnalysisStage('strategy');
      await new Promise(r => setTimeout(r, 1000));
      
      setInsights([
        "Focus on direct relationships to avoid mid-tier marketplace fees.",
        "EU market is showing 25% higher willingness to pay for specialized AI agents.",
        "Highlight 'Reduced Ops Cost' in your next proposal."
      ]);
      setAnalysisStage('complete');
      setIsAnalyzing(false);
    };

    runAnalysis();
  };

  return (
    <div className="relative">
      {!isPro && (
        <div className="absolute inset-0 z-50 rounded-2xl bg-black/60 backdrop-blur-[2px] flex items-center justify-center border border-zinc-800">
           <div className="text-center p-8 bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl max-w-sm">
             <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="w-8 h-8 text-amber-500" />
             </div>
             <h3 className="text-xl font-black uppercase tracking-tighter mb-2">Pro Intel Only</h3>
             <p className="text-zinc-500 text-xs mb-6 uppercase tracking-widest leading-relaxed">
               Real-time audio extraction and signal synthesis requires an <span className="text-white">Active Pro Tier License</span>.
             </p>
             <Button className="bg-white text-black hover:bg-zinc-200 text-[10px] font-black uppercase tracking-widest px-8">Upgrade Access</Button>
           </div>
        </div>
      )}

      <div className={cn("grid grid-cols-1 lg:grid-cols-3 gap-8", !isPro && "blur-[6px] pointer-events-none")}>
        <div className="lg:col-span-2 space-y-6">
          <header className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xl font-bold tracking-tighter uppercase dark:text-white">Live Audio Intel</h3>
              <p className="text-xs text-zinc-500 font-mono">Real-time transcription & market sentiment.</p>
            </div>
            <div className="flex gap-2">
              {!isRecording ? (
                <Button onClick={startRecording} className="bg-rose-500 hover:bg-rose-600 text-white border-none h-10 px-6 font-black uppercase text-[10px] tracking-widest">
                  <Mic className="w-4 h-4 mr-2" /> Start Live Feed
                </Button>
              ) : (
                <Button onClick={stopRecording} variant="outline" className="h-10 px-6 border-zinc-800 text-rose-500 font-black uppercase text-[10px] tracking-widest">
                  <Square className="w-4 h-4 mr-2" /> Stop Feed
                </Button>
              )}
            </div>
          </header>

          <Card className="border-zinc-200 dark:border-zinc-800 bg-black/5 dark:bg-black/20 backdrop-blur-md h-[400px] flex flex-col overflow-hidden">
            <CardHeader className="border-b border-zinc-100 dark:border-zinc-900 pb-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-[10px] uppercase font-mono tracking-widest">
                  {isRecording ? "Live Streaming" : "Standby"}
                </Badge>
                {isRecording && (
                  <div className="flex items-center gap-1">
                    <motion.div 
                      animate={{ height: [4, 12, 6, 14, 4] }} 
                      transition={{ repeat: Infinity, duration: 0.6 }}
                      className="w-1 bg-rose-500 rounded-full" 
                    />
                    <motion.div 
                      animate={{ height: [8, 4, 14, 6, 8] }} 
                      transition={{ repeat: Infinity, duration: 0.8, delay: 0.1 }}
                      className="w-1 bg-rose-500 rounded-full" 
                    />
                    <motion.div 
                      animate={{ height: [14, 6, 4, 12, 14] }} 
                      transition={{ repeat: Infinity, duration: 0.7, delay: 0.2 }}
                      className="w-1 bg-rose-500 rounded-full" 
                    />
                  </div>
                )}
              </div>
            </CardHeader>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                <AnimatePresence>
                  {transcription.map((line, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex gap-4 items-start"
                    >
                      <span className="text-[10px] font-mono text-zinc-500 mt-1 shrink-0">{line.time}</span>
                      <p className="text-sm dark:text-zinc-300 leading-relaxed font-medium">{line.text}</p>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isRecording && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-2 h-4 bg-zinc-600 ml-16"
                  />
                )}
              </div>
            </ScrollArea>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <h3 className="text-xl font-bold tracking-tighter uppercase dark:text-white">AI Intel Summary</h3>
          <Card className="border-zinc-200 dark:border-zinc-800 bg-amber-500/5 h-[400px]">
            <CardContent className="p-6">
              {isAnalyzing ? (
                <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
                  <div className="relative">
                    <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
                    <Activity className="absolute inset-0 w-4 h-4 m-auto text-amber-500/50" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-black tracking-widest text-white animate-pulse">
                      {analysisStage === 'extracting' && "Extracting Keywords..."}
                      {analysisStage === 'sentiment' && "Analyzing Market Sentiment..."}
                      {analysisStage === 'strategy' && "Generating Strategic Insights..."}
                    </p>
                    <p className="text-[8px] font-mono text-zinc-500 uppercase">Synchronizing with Market Nodes</p>
                  </div>
                </div>
              ) : insights.length > 0 ? (
                <div className="space-y-6">
                  {insights.map((insight, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.2 }}
                      className="flex gap-3"
                    >
                      <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-1" />
                      <p className="text-sm font-medium leading-tight dark:text-white">{insight}</p>
                    </motion.div>
                  ))}
                  <Button className="w-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 uppercase font-black text-[10px] tracking-widest mt-4 h-11">
                    Add to Market Scan
                  </Button>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-zinc-500 gap-3">
                  <MessageSquare className="w-12 h-12 opacity-10" />
                  <p className="text-xs font-mono tracking-widest uppercase">No live insights detected.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
