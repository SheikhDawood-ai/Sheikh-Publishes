import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Square, Play, Activity, MessageSquare, Zap, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';

export default function AudioIntel() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState<{ time: string, text: string }[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [insights, setInsights] = useState<string[]>([]);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = () => {
    setIsRecording(true);
    setTranscription([]);
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
    // Mocking AI Insight generation
    setTimeout(() => {
      setInsights([
        "Focus on direct relationships to avoid mid-tier marketplace fees.",
        "EU market is showing 25% higher willingness to pay for specialized AI agents.",
        "Highlight 'Reduced Ops Cost' in your next proposal."
      ]);
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-xl font-bold tracking-tighter uppercase dark:text-white">Live Audio Intel</h3>
            <p className="text-xs text-zinc-500 font-mono">Real-time transcription & market sentiment.</p>
          </div>
          <div className="flex gap-2">
            {!isRecording ? (
              <Button onClick={startRecording} className="bg-red-500 hover:bg-red-600 text-white border-none h-10 px-6">
                <Mic className="w-4 h-4 mr-2" /> Start Live Feed
              </Button>
            ) : (
              <Button onClick={stopRecording} variant="outline" className="h-10 px-6 border-zinc-200 dark:border-zinc-800">
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
                    className="w-1 bg-red-500 rounded-full" 
                  />
                  <motion.div 
                    animate={{ height: [8, 4, 14, 6, 8] }} 
                    transition={{ repeat: Infinity, duration: 0.8, delay: 0.1 }}
                    className="w-1 bg-red-500 rounded-full" 
                  />
                  <motion.div 
                    animate={{ height: [14, 6, 4, 12, 14] }} 
                    transition={{ repeat: Infinity, duration: 0.7, delay: 0.2 }}
                    className="w-1 bg-red-500 rounded-full" 
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
                    <p className="text-sm dark:text-zinc-300 leading-relaxed">{line.text}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isRecording && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-2 h-4 bg-zinc-400 ml-16"
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
                <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                <p className="text-xs uppercase font-bold tracking-widest text-zinc-500">Processing Audio Context...</p>
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
                <Button className="w-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 uppercase font-black text-[10px] tracking-widest mt-4">
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
  );
}
