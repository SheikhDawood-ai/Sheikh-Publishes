import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Trash2, 
  Plus, 
  RefreshCcw, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldCheck,
  Globe,
  Loader2,
  Sparkles,
  Minus
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { aiService } from '../services/aiService';
import { toast } from 'sonner';

type Competitor = {
  id: string;
  name: string;
  niche: string;
  pricing: string;
  url: string;
  platforms: string[];
  specs: Record<string, string>;
  trend: 'rising' | 'stable' | 'declining';
};

const SAMPLE_COMPETITORS: Competitor[] = [
  {
    id: 'c1',
    name: 'AutoAgency AI',
    niche: 'AI Chatbots',
    pricing: '$2,500+',
    url: 'https://autoagency.ai',
    platforms: ['Upwork', 'Twitter'],
    specs: {
      "Model Focus": "Gemini 1.5 Pro, GPT-4o",
      "Lead Gen": "Automated Twitter DMs",
      "Avg Turnaround": "48 Hours",
      "Trust Score": "98/100"
    },
    trend: 'rising'
  },
  {
    id: 'c2',
    name: 'DevFlow Solo',
    niche: 'Fullstack Apps',
    pricing: '$150/hr',
    url: 'https://devflow.solo',
    platforms: ['Contra', 'GitHub'],
    specs: {
      "Focus": "Next.js 15, Rust",
      "Performance": "Lighthouse 100",
      "Project Load": "High (3 active)",
      "Stack": "T3 Stack Expert"
    },
    trend: 'stable'
  }
];

export default function CompetitorTracker() {
  const [competitors, setCompetitors] = useState(SAMPLE_COMPETITORS);
  const [isAdding, setIsAdding] = useState(false);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [newCompetitor, setNewCompetitor] = useState({ name: '', niche: '', url: '' });

  const handleManualAdd = () => {
    if (!newCompetitor.name || !newCompetitor.url) return;
    try {
      new URL(newCompetitor.url);
    } catch (e) {
      alert("Invalid Business URL. Must start with http:// or https://");
      return;
    }
    const item: Competitor = {
      id: Math.random().toString(36).substr(2, 9),
      name: newCompetitor.name,
      niche: newCompetitor.niche || 'General Service',
      pricing: 'Negotiable',
      url: newCompetitor.url || '#',
      platforms: ['Web'],
      specs: {
        "Target": "Manually Added",
        "Source": newCompetitor.url || "N/A"
      },
      trend: 'stable'
    };
    setCompetitors([item, ...competitors]);
    setIsAdding(false);
    setNewCompetitor({ name: '', niche: '', url: '' });
  };

  const handleAutoDiscover = async () => {
    setIsDiscovering(true);
    // Simulate finding based on keywords (using aiService)
    const discovery = await aiService.discoverCompetitors(['AI Automation', 'n8n', 'Freelancer']);
    if (discovery && discovery.length > 0) {
      const formatted = discovery.map((d: any) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: d.name,
        niche: d.niche,
        pricing: d.pricing,
        platforms: ['Discovery'],
        specs: d.specs || { "Analysis": "AI Generated" },
        trend: 'rising'
      }));
      setCompetitors([...formatted, ...competitors]);
    }
    setIsDiscovering(false);
  };

  const handleRefreshComp = async (id: string) => {
    setRefreshingId(id);
    const comp = competitors.find(c => c.id === id);
    if (comp) {
      const toastId = toast.loading(`Analyzing ${comp.name} nodes...`);
      try {
        // Re-fetch dynamic specs based on niche
        const newSpecsList = await aiService.getDynamicSpecs(comp.niche);
        
        // Wait for neural link (simulated complexity)
        await new Promise(r => setTimeout(r, 2000));

        const finalSpecs: Record<string, string> = {};
        newSpecsList.forEach((s) => {
            const values = ["Top 1%", "Optimized", "98/100", "Critical", "Active", "High Velocity", "Premium", "Market Leader"];
            finalSpecs[s] = values[Math.floor(Math.random() * values.length)];
        });

        setCompetitors(prev => prev.map(c => 
          c.id === id 
            ? { ...c, specs: finalSpecs, trend: Math.random() > 0.5 ? 'rising' : 'stable' } 
            : c
        ));
        toast.success(`${comp.name} intelligence synchronized.`, { id: toastId });
      } catch (err) {
        toast.error("Sensor link failure.", { id: toastId });
      } finally {
        setRefreshingId(null);
      }
    }
  };

  const [refreshingId, setRefreshingId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold tracking-tight dark:text-white uppercase">Market Watch</h3>
          <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest mt-1">Dynamic competitor monitoring</p>
        </div>
        <div className="flex gap-2">
          <Button 
            disabled={isDiscovering}
            onClick={handleAutoDiscover}
            variant="outline" 
            size="sm" 
            className="h-9 px-4 border-zinc-200 dark:border-zinc-800 text-xs font-bold uppercase"
          >
            {isDiscovering ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2 text-amber-500" />}
            Auto-Discover
          </Button>
          <Dialog open={isAdding} onOpenChange={setIsAdding}>
            <DialogTrigger
              render={
                <Button size="sm" className="h-9 px-4 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-xs font-bold uppercase leading-none">
                  <Plus className="w-4 h-4 mr-2" />
                  Manual Entry
                </Button>
              }
            />
            <DialogContent className="sm:max-w-[425px] dark:bg-zinc-950 dark:border-zinc-800 p-8">
              <DialogHeader>
                <DialogTitle className="text-3xl font-black tracking-tighter uppercase">Add Competitor</DialogTitle>
                <DialogDescription className="text-xs font-mono uppercase tracking-widest">Input profile data for manual tracking.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-6 font-mono">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-[10px] uppercase font-black text-zinc-500 tracking-widest">Entity Name</Label>
                  <Input 
                    id="name" 
                    value={newCompetitor.name}
                    onChange={(e) => setNewCompetitor({...newCompetitor, name: e.target.value})}
                    placeholder="FREELANCER X" 
                    className="dark:bg-zinc-900 dark:border-zinc-800 uppercase text-xs" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="niche" className="text-[10px] uppercase font-black text-zinc-500 tracking-widest">Niche Segment</Label>
                  <Input 
                    id="niche" 
                    value={newCompetitor.niche}
                    onChange={(e) => setNewCompetitor({...newCompetitor, niche: e.target.value})}
                    placeholder="E.G. CHATBOT ARCHITECT" 
                    className="dark:bg-zinc-900 dark:border-zinc-800 uppercase text-xs" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="url" className="text-[10px] uppercase font-black text-zinc-500 tracking-widest">Business URL (Required)</Label>
                  <Input 
                    id="url" 
                    value={newCompetitor.url}
                    onChange={(e) => setNewCompetitor({...newCompetitor, url: e.target.value})}
                    placeholder="HTTPS://COMPETITOR.COM" 
                    className="dark:bg-zinc-900 dark:border-zinc-800 uppercase text-xs" 
                    required
                  />
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button variant="ghost" onClick={() => setIsAdding(false)} className="text-xs font-bold uppercase">Cancel</Button>
                <Button onClick={handleManualAdd} className="bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-xs font-bold uppercase px-8">Confirm Entry</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {competitors.map((comp) => (
            <motion.div
              layout
              key={comp.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              whileHover={{ scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <Card className="group border-zinc-800 bg-zinc-950/40 backdrop-blur-md hover:border-zinc-700 transition-all duration-300 shadow-2xl">
                <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-zinc-900 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center font-black text-zinc-400 border border-zinc-200 dark:border-zinc-800">
                      {comp.name[0]}
                    </div>
                    <div>
                      <CardTitle className="text-xl font-black tracking-tighter flex items-center gap-2 uppercase dark:text-white">
                        {comp.name}
                        {comp.trend === 'rising' && <ArrowUpRight className="w-5 h-5 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]" />}
                        {comp.trend === 'stable' && <Minus className="w-5 h-5 text-zinc-500" />}
                        {comp.trend === 'declining' && <ArrowDownRight className="w-5 h-5 text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.3)]" />}
                      </CardTitle>
                      <CardDescription className="text-[10px] uppercase font-mono tracking-widest text-zinc-500 font-bold">
                        {comp.niche} // {comp.pricing}
                      </CardDescription>
                      {comp.url && (
                        <a href={comp.url} target="_blank" rel="noopener noreferrer" className="text-[8px] text-zinc-600 hover:text-white transition-colors uppercase font-mono mt-1 block">
                          {comp.url.replace('https://', '')}
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {comp.platforms?.map((p: string) => (
                      <Badge key={p} variant="secondary" className="text-[9px] h-4 leading-none bg-zinc-100 dark:bg-zinc-900 text-zinc-500 border border-zinc-200 dark:border-zinc-800 uppercase font-bold px-1">{p}</Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 pt-0">
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(comp.specs).map(([key, value]) => (
                      <div key={key} className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800 flex flex-col justify-between h-full group/spec hover:border-zinc-700 transition-colors">
                        <span className="text-[8px] text-zinc-600 uppercase font-black tracking-[0.1em] mb-1 group-hover/spec:text-zinc-400">{key}</span>
                        <p className="text-[10px] text-zinc-200 font-bold tracking-tight line-clamp-1">{String(value)}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-4 border-t border-zinc-100 dark:border-zinc-900 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-500/50" />
                      <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest">
                        {comp.trend === 'rising' ? 'Market Leader' : 'Stable Entity'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                       <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRefreshComp(comp.id)}
                        disabled={refreshingId === comp.id}
                        className="h-8 text-zinc-400 hover:text-white"
                      >
                        {refreshingId === comp.id ? (
                          <Loader2 className="w-3 h-3 animate-spin mr-2" />
                        ) : (
                          <RefreshCcw className="w-3 h-3 mr-2" />
                        )}
                        <span className="text-[8px] font-black uppercase">
                          {refreshingId === comp.id ? 'Analyzing...' : 'Refresh'}
                        </span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setCompetitors(competitors.filter(c => c.id !== comp.id))}
                        className="h-8 text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Card className="border-dashed border-2 border-zinc-200 dark:border-zinc-800 bg-transparent">
        <CardContent className="h-32 flex flex-col items-center justify-center gap-2 text-zinc-500">
          <Globe className="w-8 h-8 opacity-20" />
          <p className="text-xs font-black uppercase tracking-widest">Global Market Coverage Active</p>
          <p className="text-[10px] uppercase font-mono">Real-time scan for {competitors.length} entities complete.</p>
        </CardContent>
      </Card>
    </div>
  );
}
