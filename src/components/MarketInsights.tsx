import React from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  Flame, 
  AlertCircle, 
  ArrowRight,
  TrendingDown,
  TrendingUp,
  MessageCircle,
  Lightbulb
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';

const TRENDS = [
  { id: 1, topic: 'AI Agent Workflows', trend: 'up', percentage: '+42%', color: 'text-emerald-500' },
  { id: 2, topic: 'Basic Copywriting', trend: 'down', percentage: '-28%', color: 'text-red-500' },
  { id: 3, topic: 'Web3 Compliance', trend: 'up', percentage: '+15%', color: 'text-blue-500' }
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
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Trends List */}
      <div className="lg:col-span-1 flex flex-col gap-6">
        <h3 className="text-xl font-bold tracking-tighter uppercase dark:text-white">Active Trends</h3>
        <div className="flex flex-col gap-3">
          {TRENDS.map((t) => (
            <Card key={t.id} className="dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Topic</div>
                  <div className="text-sm font-bold dark:text-white">{t.topic}</div>
                </div>
                <div className="text-right">
                  <div className={t.color + " flex items-center gap-1 font-mono text-sm font-bold"}>
                    {t.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {t.percentage}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-amber-500 border-none text-zinc-900">
          <CardHeader>
            <CardTitle className="text-sm uppercase font-black tracking-widest flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Pro Tip
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs font-medium leading-relaxed">
            Market is shifting towards **Outcome-Based Pricing**. Agencies that charge per-lead are growing 2.5x faster than hourly freelancers.
          </CardContent>
        </Card>
      </div>

      {/* Pain Point Feed */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold tracking-tighter uppercase dark:text-white">Pain Point Discovery</h3>
          <Badge variant="secondary" className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-mono text-[9px]">Scanned: 1.2k comments</Badge>
        </div>

        <ScrollArea className="h-[500px] pr-4">
          <div className="flex flex-col gap-6">
            {PAIN_POINTS.map((p) => (
              <motion.div 
                key={p.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 group overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-amber-500 opacity-50 transition-all group-hover:w-full group-hover:opacity-5" />
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-black tracking-tighter uppercase dark:text-white">{p.topic}</CardTitle>
                    <span className="text-[10px] uppercase font-mono text-zinc-500">Source: {p.source}</span>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-zinc-500 leading-relaxed italic">"{p.frustration}"</p>
                    <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
                      <div className="flex items-center gap-4">
                        <div>
                          <div className="text-[9px] uppercase font-bold text-zinc-400">Monetization Score</div>
                          <div className="flex gap-1 mt-1">
                            {[...Array(10)].map((_, i) => (
                              <div key={i} className={`w-1.5 h-3 rounded-full ${i < p.monetization ? 'bg-amber-500' : 'bg-zinc-200 dark:bg-zinc-800'}`} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 text-xs font-bold uppercase transition-transform group-hover:translate-x-1">
                        Analyze Opportunity <ArrowRight className="ml-2 w-4 h-4" />
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
  );
}
