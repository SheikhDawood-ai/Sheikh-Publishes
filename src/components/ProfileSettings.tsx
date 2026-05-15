import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, 
  CreditCard, 
  Sparkles, 
  RefreshCcw, 
  ShieldCheck, 
  Plus, 
  Check, 
  Apple, 
  Zap,
  Globe,
  Loader2,
  Terminal,
  ChevronRight
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { aiService } from '../services/aiService';

import { useAuth } from '../context/AuthContext';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils';

type Profile = {
  id: string;
  name: string;
  niche: string;
  isPro: boolean;
};

export default function ProfileSettings() {
  const { user, subscriptionStatus, login } = useAuth();
  const isPro = subscriptionStatus === 'pro';
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [nlpInput, setNlpInput] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  
  const [skillSets, setSkillSets] = useState('');
  const [industryFocus, setIndustryFocus] = useState('');
  const [isSavingCustom, setIsSavingCustom] = useState(false);

  React.useEffect(() => {
    if (user) {
      getDoc(doc(db, 'users', user.uid)).then(docSnap => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.skillSets) setSkillSets(data.skillSets);
          if (data.industryFocus) setIndustryFocus(data.industryFocus);
        }
      });
    }
  }, [user]);

  const handleSaveCustom = async () => {
    if (!user) return;
    setIsSavingCustom(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        skillSets,
        industryFocus,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
    } finally {
      setIsSavingCustom(false);
    }
  };

  const [profiles, setProfiles] = useState<Profile[]>([
    { id: 'p1', name: 'AI Solutions Ltd', niche: 'Automation', isPro: false }
  ]);

  const handleUpgrade = async () => {
    if (!user) {
      login();
      return;
    }
    setIsUpgrading(true);
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        subscriptionStatus: 'pro',
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleNlpUpdate = async () => {
    if (!nlpInput.trim()) return;
    setIsParsing(true);
    const result = await aiService.parseProfileShift(nlpInput);
    if (result) {
      setProfiles(prev => prev.map(p => p.id === 'p1' ? { ...p, niche: result.niche || p.niche, name: result.name || p.name } : p));
      setNlpInput('');
    }
    setIsParsing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <header className="space-y-1">
        <h2 className="text-3xl font-black tracking-tighter uppercase dark:text-white">Profile Command</h2>
        <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest">Multi-Tenant Identity & Entitlement</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {/* Natural Language Update Engine */}
          <Card className="glass-card bg-zinc-950 border-zinc-800">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-amber-500" />
                <CardTitle className="text-sm font-black uppercase tracking-widest">NLP Direction Engine</CardTitle>
              </div>
              <CardDescription className="text-xs">Describe a change in your business direction. Gemini will parse and sync automatically.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <textarea 
                  value={nlpInput}
                  onChange={(e) => setNlpInput(e.target.value)}
                  placeholder="e.g. I want to pivot from general web dev to high-end AI branding focused on European startups."
                  className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-sm font-medium focus:border-amber-500 outline-none transition-all h-24 resize-none"
                />
                <Button 
                  onClick={handleNlpUpdate}
                  disabled={isParsing || !nlpInput.trim()}
                  className="absolute bottom-3 right-3 bg-white text-black hover:bg-zinc-200 h-8 px-4 text-[10px] font-black uppercase tracking-widest"
                >
                  {isParsing ? <Loader2 className="w-3 h-3 animate-spin" /> : "Sync Shift"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Customization Settings */}
          <Card className="glass-card bg-zinc-950 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-sm font-black uppercase tracking-widest">Global Preferences</CardTitle>
              <CardDescription className="text-xs">These parameters influence AI recommendations and external opportunities.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 font-mono">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black tracking-widest text-zinc-500">Industry Focus</Label>
                  <Input 
                    placeholder="E.g. Web3, MedTech, SaaS" 
                    className="bg-black border-zinc-800 text-xs" 
                    value={industryFocus}
                    onChange={(e) => setIndustryFocus(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black tracking-widest text-zinc-500">Skill Sets</Label>
                  <Input 
                    placeholder="E.g. React, Node, AI Automation" 
                    className="bg-black border-zinc-800 text-xs" 
                    value={skillSets}
                    onChange={(e) => setSkillSets(e.target.value)}
                  />
                </div>
              </div>
              <Button 
                onClick={handleSaveCustom} 
                className="w-full bg-white text-black hover:bg-zinc-200 text-[10px] font-black uppercase tracking-widest h-9"
              >
                {isSavingCustom ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : "Save Preferences"}
              </Button>
            </CardContent>
          </Card>

          {/* Business Profiles */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500">Active Profiles</h3>
              <Badge variant="outline" className={`text-[10px] uppercase ${isPro ? 'border-emerald-500 text-emerald-500' : 'border-zinc-800 text-zinc-500'}`}>
                {isPro ? 'Pro Unlocked' : 'Free Tier'}
              </Badge>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {profiles.map(p => (
                <div key={p.id} className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex items-center justify-between group hover:border-zinc-700 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center font-black">
                      {p.name[0]}
                    </div>
                    <div>
                      <div className="font-bold uppercase tracking-tight">{p.name}</div>
                      <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">{p.niche}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <RefreshCcw className="w-4 h-4 text-zinc-500" />
                    </Button>
                    <ChevronRight className="w-4 h-4 text-zinc-800 group-hover:text-zinc-500 transition-colors" />
                  </div>
                </div>
              ))}
              {!isPro && (
                <div className="p-6 rounded-2xl border border-dashed border-zinc-800 flex flex-col items-center justify-center gap-2 opacity-50">
                  <Plus className="w-6 h-6 text-zinc-700" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Multi-pro available on Pro</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Subscription Card */}
          <Card className={`glass-card overflow-hidden transition-all duration-700 ${isPro ? 'border-emerald-500/50 bg-emerald-500/[0.02]' : 'border-amber-500/30 bg-amber-500/[0.02]'}`}>
             <CardHeader className="p-6 border-b border-zinc-800/10">
               <div className="flex justify-between items-start">
                 <div className="space-y-1">
                   <div className="text-[10px] uppercase font-black tracking-[0.2em] text-zinc-500">Plan Status</div>
                   <div className="text-2xl font-black tracking-tighter uppercase">{isPro ? 'Pro Member' : 'Free Basic'}</div>
                 </div>
                 {isPro ? <Zap className="w-5 h-5 text-emerald-500 fill-emerald-500" /> : <ShieldCheck className="w-5 h-5 text-amber-500" />}
               </div>
             </CardHeader>
             <CardContent className="p-6 space-y-6">
                {!isPro ? (
                  <>
                    <ul className="space-y-3">
                      {[
                        "Multi-Business Profiles",
                        "Deep 2026 Trend Analysis",
                        "Unlimited Reddit Research",
                        "Pro Support Hub"
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs font-medium">
                          <Check className="w-3 h-3 text-amber-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="space-y-3 pt-4">
                      <Button 
                        onClick={handleUpgrade}
                        disabled={isUpgrading}
                        className="w-full bg-white text-black hover:bg-zinc-200 py-6 text-xs font-black uppercase tracking-widest shadow-[0_4px_20px_rgba(255,255,255,0.2)]"
                      >
                        {isUpgrading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                        Upgrade to Pro
                      </Button>
                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1 bg-black border-zinc-800 py-6 group">
                          <Apple className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        </Button>
                        <Button variant="outline" className="flex-1 bg-black border-zinc-800 py-6 group">
                          <Globe className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                      <p className="text-xs font-bold text-emerald-500 tracking-tight">Active subscription billed monthly.</p>
                    </div>
                    <Button variant="ghost" className="text-[10px] uppercase font-black text-zinc-500 hover:text-white tracking-widest">
                      Manage via Stripe Billing
                    </Button>
                  </div>
                )}
             </CardContent>
          </Card>

          {/* System Audit Stats */}
          <div className="space-y-4 p-4 rounded-2xl bg-zinc-950 border border-zinc-900 border-dashed">
            <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center">System Audit Log</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-xl font-black">1.0.8</div>
                <div className="text-[8px] uppercase text-zinc-600 font-mono">Kernel Vers</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-black">99.9%</div>
                <div className="text-[8px] uppercase text-zinc-600 font-mono">AI Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
