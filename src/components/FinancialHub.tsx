import React, { useState } from 'react';
import { 
  CreditCard, 
  Wallet, 
  CheckCircle2, 
  ExternalLink,
  Shield,
  Smartphone,
  Lock,
  Sparkles,
  TrendingDown,
  Loader2,
  PieChart
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { aiService } from '../services/aiService';

const PAYMENT_METHODS = [
  { id: 'paypal', name: 'PayPal', type: 'Global', integrated: true, icon: Wallet },
  { id: 'gpay', name: 'Google Pay', type: 'Global', integrated: true, icon: Smartphone },
  { id: 'stripe', name: 'Bank Card (via Stripe)', type: 'Global', integrated: true, icon: CreditCard }
];

const MOCK_SPENDING = [
  { id: '1', amount: 120, category: 'Software', date: '2023-11-01', description: 'n8n Cloud' },
  { id: '2', amount: 450, category: 'Hardware', date: '2023-11-05', description: 'Monitor' },
  { id: '3', amount: 50, category: 'API', date: '2023-11-10', description: 'OpenAI API' }
];

export default function FinancialHub() {
  const [methods] = useState(PAYMENT_METHODS);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [advice, setAdvice] = useState<any>(null);

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    const result = await aiService.getFinancialAdvice(MOCK_SPENDING, "AI Automation Agency");
    setAdvice(result);
    setIsAnalyzing(false);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-zinc-900 border-none text-white overflow-hidden relative min-h-[160px]">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Shield className="w-24 h-24" />
          </div>
          <CardHeader>
            <CardTitle className="text-xs uppercase font-mono tracking-widest text-zinc-500">Available Balance</CardTitle>
            <div className="text-4xl font-black tracking-tighter mt-2">$12,450.00</div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button size="sm" className="bg-white text-black hover:bg-zinc-200 h-8 text-xs font-bold uppercase">Withdraw</Button>
              <Button size="sm" variant="outline" className="border-zinc-700 hover:bg-zinc-800 h-8 text-xs font-bold uppercase">Details</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 flex flex-col justify-between p-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase font-mono tracking-widest text-zinc-500">AI Financial Advice</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            {isAnalyzing ? (
              <div className="flex items-center gap-2 text-zinc-500 animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-[10px] font-bold uppercase">Synthesizing...</span>
              </div>
            ) : advice ? (
              <div className="space-y-1">
                <p className="text-[10px] dark:text-zinc-300 leading-tight italic line-clamp-2">"{advice.summary}"</p>
                <div className="flex gap-1 mt-2">
                  <Badge variant="outline" className="text-[8px] uppercase border-emerald-500/30 text-emerald-500">Save 15% found</Badge>
                </div>
              </div>
            ) : (
              <p className="text-[10px] text-zinc-500 italic">No analysis run for this period.</p>
            )}
          </CardContent>
          <div className="p-4 pt-0">
            <Button 
              onClick={runAnalysis}
              disabled={isAnalyzing}
              variant="outline" 
              className="w-full h-8 text-[10px] font-black uppercase tracking-widest border-zinc-200 dark:border-zinc-800"
            >
              <Sparkles className="w-3 h-3 mr-2 text-amber-500" />
              Generate Advice
            </Button>
          </div>
        </Card>

        <Card className="dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
          <CardHeader>
            <CardTitle className="text-xs uppercase font-mono tracking-widest text-zinc-500">Tax Estimation</CardTitle>
            <div className="text-2xl font-black tracking-tighter mt-1 border-b-2 border-emerald-500 inline-block">$1,867.50</div>
          </CardHeader>
          <CardContent>
            <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest mt-2">Projected PK Region Tax</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black tracking-tighter uppercase dark:text-white">Integration Hub</h3>
            <Badge variant="outline" className="text-[10px] border-zinc-200 dark:border-zinc-800 font-mono uppercase">
              <Lock className="w-3 h-3 mr-1" />
              E2E Encrypted
            </Badge>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {methods.map((method) => (
              <Card key={method.id} className="border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950/50 backdrop-blur-sm">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center border border-zinc-200 dark:border-zinc-800">
                      <method.icon className="w-5 h-5 text-zinc-500" />
                    </div>
                    <div>
                      <div className="text-xs font-black uppercase dark:text-white tracking-tight">{method.name}</div>
                      <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">{method.type}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end mr-4">
                      <span className="text-[8px] font-black uppercase text-zinc-400 tracking-widest">Status</span>
                      <span className="text-[10px] font-bold text-emerald-500 uppercase">Live</span>
                    </div>
                    <Switch checked />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-black tracking-tighter uppercase dark:text-white">AI Financial Insights</h3>
          <Card className="border-zinc-800 bg-zinc-950/50 backdrop-blur-md overflow-hidden">
            <CardContent className="p-0">
              {advice ? (
                <div className="divide-y divide-zinc-900">
                  <div className="p-6 space-y-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Overview</span>
                    <p className="text-xs text-zinc-300 leading-relaxed italic">"{advice.summary}"</p>
                  </div>
                  
                  <div className="p-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block mb-4">Strategic Action Items</span>
                    <div className="space-y-3">
                      {advice.suggestions?.map((s: any, i: number) => (
                        <div key={i} className="flex items-start gap-4 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 group hover:border-amber-500/30 transition-colors">
                          <div className="w-8 h-8 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-amber-500 shrink-0 font-black text-[10px]">
                            0{i+1}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-[11px] font-black uppercase text-white tracking-tight">{s.title}</h4>
                            <p className="text-[10px] text-zinc-400 mt-1">{s.action}</p>
                            <Badge variant="outline" className="mt-2 text-[8px] bg-emerald-500/10 text-emerald-500 border-none px-2 py-0">Impact: {s.impact}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 bg-zinc-900/20">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Savings Matrix</span>
                      <div className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">Live Scan Output</div>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {advice.savings?.map((s: string, i: number) => (
                        <div key={i} className="flex items-center justify-between py-2 border-b border-zinc-900 last:border-0">
                          <span className="text-[10px] text-zinc-400 font-medium">{s}</span>
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-[400px] flex flex-col items-center justify-center text-center gap-4 text-zinc-500 p-6">
                  <PieChart className="w-12 h-12 opacity-10" />
                  <p className="text-[10px] font-mono tracking-widest uppercase">Run analysis to identify financial leakages.</p>
                  <Button onClick={runAnalysis} variant="outline" className="border-zinc-800 text-[10px] uppercase font-black tracking-widest">Initiate Audit</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
