import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  Users, 
  Briefcase, 
  Zap, 
  Settings, 
  Plus, 
  Search,
  LayoutDashboard,
  CreditCard,
  Moon,
  Sun,
  Target,
  Mic,
  ChevronDown,
  Sparkles,
  Command,
  UserCircle,
  Menu,
  ArrowRight
} from 'lucide-react';
import { Button, buttonVariants } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { cn } from '../lib/utils';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel 
} from './ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import CompetitorTracker from './CompetitorTracker';
import FinancialHub from './FinancialHub';
import MarketInsights from './MarketInsights';
import AudioIntel from './AudioIntel';
import ProfileSettings from './ProfileSettings';
import Onboarding from './Onboarding';
import Pricing from './Pricing';
import ChatAssistant from './ChatAssistant';

import { useNavigate } from 'react-router-dom';
import OpportunityCard from './OpportunityCard';
import PulseSignalCard from './PulseSignalCard';

const PULSE_SIGNALS = [
  {
    id: 's1',
    title: 'Macro Shift: The "Fractional AI Officer" Surge',
    category: 'RESEARCH',
    impact: 'High' as const,
    growRate: '400% YOY',
    sentiment: 'positive' as const,
    timeAgo: '2h ago',
    description: 'Data from LinkedIn implies a massive increase in SMEs hiring fractional AI consultants to navigate the LLM landscape without full-time overhead.',
    source: 'Gartner Industry Analysis'
  },
  {
    id: 's2',
    title: 'Technical Void: Local LLM Infrastructure',
    category: 'TECH TREND',
    impact: 'Critical' as const,
    sentiment: 'neutral' as const,
    timeAgo: '4h ago',
    description: 'Companies are pivoting from Cloud-API to local deployments (Ollama/LM Studio) due to data exfiltration fears. Massive gap for security-conscious agency owners.',
    source: 'Cybersecurity Pulse 2026'
  },
  {
    id: 's3',
    title: 'Platform Saturation: Basic Chatbot Wrappers',
    category: 'MARKET ALERT',
    impact: 'Moderate' as const,
    sentiment: 'negative' as const,
    timeAgo: '6h ago',
    description: 'Standard GPT-wrapper SaaS tools are seeing 60% churn. Market is demanding deep RAG (Retrieval-Augmented Generation) and custom agentic workflows.',
    source: 'SaaS Metrics Quarterly'
  }
];

const OPPORTUNITIES = [
  {
    id: '1',
    title: 'Enterprise AI Agent Orchestrator',
    platform: 'Upwork',
    budget: '$5k - $10k',
    url: 'https://www.upwork.com/nx/search/jobs/?q=ai+agent',
    tags: ['AI', 'n8n', 'LangChain'],
    scores: { demand: 92, competition: 45, monetization: 88 },
    aiSummary: "High demand for multilingual support automations. Most competitors are only offering basic wrappers with no knowledge-base integration."
  },
  {
    id: '2',
    title: 'Custom Shopify Data Sync',
    platform: 'Contra',
    budget: '$3.5k',
    url: 'https://contra.com/search?query=shopify',
    tags: ['E-commerce', 'Node.js', 'PostgreSQL'],
    scores: { demand: 75, competition: 30, monetization: 65 },
    aiSummary: "Niche opportunity for merchants moving from monolithic setups. Low competition but high technical depth required."
  },
  {
    id: '3',
    title: 'Low-Code Fintech Dashboard',
    platform: 'LinkedIn',
    budget: '$150/hr',
    url: 'https://www.linkedin.com/jobs/search/?keywords=low-code+fintech',
    tags: ['Fintech', 'Retool', 'Supabase'],
    scores: { demand: 88, competition: 15, monetization: 95 },
    aiSummary: "Rare high-paying hourly role. The client specifically noted frustration with previous devs failing to handle regional tax compliance."
  }
];

import { useAuth } from '../context/AuthContext';

const SidebarItem = ({ icon: Icon, label, active = false, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
      active 
        ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.1)]' 
        : 'text-zinc-500 hover:text-white hover:bg-zinc-900'
    }`}
  >
    <Icon className={`w-4 h-4 ${active ? '' : 'group-hover:scale-110 transition-transform'}`} />
    <span className="text-sm font-bold tracking-tight uppercase tracking-widest text-[10px]">{label}</span>
  </button>
);

export default function Dashboard() {
  const { user, login, logout, subscriptionStatus, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('feed');
  const [showOnboarding, setShowOnboarding] = useState(() => !localStorage.getItem('lancer_intel_profile'));
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const isPro = subscriptionStatus === 'pro';
  const isFree = subscriptionStatus === 'free';
  const isGuest = subscriptionStatus === 'guest';

  const [activeProfile, setActiveProfile] = useState(() => {
    const saved = localStorage.getItem('lancer_intel_profile');
    return saved ? JSON.parse(saved) : { id: 'p1', name: 'AI Solutions Ltd', niche: 'Automation', isGuest: true };
  });
  const [profiles] = useState([
    { id: 'p1', name: 'Freelance Profile', niche: 'Automation', isGuest: false },
    { id: 'p2', name: 'Agency Profile', niche: 'SaaS Labs', isGuest: false }
  ]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (user) {
      // Sync active profile name with user display name if it's the default
      if (activeProfile.name === 'AI Solutions Ltd' && user.displayName) {
        setActiveProfile(prev => ({ ...prev, name: user.displayName! }));
      }
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('lancer_intel_profile', JSON.stringify(activeProfile));
  }, [activeProfile]);

  const handleOnboardingComplete = (profile: any) => {
    setActiveProfile(profile);
    setShowOnboarding(false);
    setActiveTab('feed');
  };

  const navigateToTab = (tab: string) => {
    const restrictedTabs = ['market', 'audio'];
    if (isGuest && restrictedTabs.includes(tab)) {
      setShowAuthModal(true);
      return;
    }
    if (!isPro && restrictedTabs.includes(tab)) {
      setActiveTab('pricing');
      return;
    }
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  const handleUpgrade = (tier: string) => {
    // In real app, the subscription status will update via Firestore listener
    setActiveTab('feed');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Command className="w-12 h-12 text-white animate-pulse" />
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em]">Synching Quantum Edge...</span>
        </div>
      </div>
    );
  }

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-black text-white flex selection:bg-white selection:text-black relative overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
          />
        )}
      </AnimatePresence>
      {/* Auth Modal for Guests */}
      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent className="bg-zinc-950 border-zinc-800 text-white max-w-md p-8">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black tracking-tighter uppercase mb-2">Deep Intelligence Locked</DialogTitle>
            <DialogDescription className="text-zinc-400 text-sm">
              You are currently in <span className="text-white font-bold">PREVIEW MODE</span>. To unlock persistent market research, financial auditing, and AI signal extraction, please initialize your profile.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-6">
            <Button onClick={() => { setShowAuthModal(false); navigate('/auth'); }} className="w-full bg-white text-black hover:bg-zinc-200 font-black uppercase tracking-widest py-6 gap-2">
              <Sparkles className="w-4 h-4" /> Create Profile
            </Button>
            <Button variant="outline" onClick={() => { setShowAuthModal(false); navigate('/auth'); }} className="w-full border-zinc-800 text-zinc-500 font-black uppercase tracking-widest">
              Login Existing Account
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <aside className={`fixed lg:static inset-y-0 left-0 w-72 border-r border-zinc-800 p-8 flex flex-col gap-10 bg-black/80 lg:bg-black/50 backdrop-blur-xl z-[60] transition-transform duration-500 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center justify-between lg:justify-start gap-3 group cursor-pointer" onClick={() => navigateToTab('feed')}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)] group-hover:scale-105 transition-transform">
              <Command className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter uppercase leading-none">LancerIntel</h1>
              <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest mt-1 inline-block border border-zinc-800 px-1 rounded">Pro v1.08</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsSidebarOpen(false)}>
            <ChevronDown className="w-5 h-5 rotate-90" />
          </Button>
        </div>

        <nav className="flex flex-col gap-2">
          <SidebarItem icon={LayoutDashboard} label="Pulse Feed" active={activeTab === 'feed'} onClick={() => navigateToTab('feed')} />
          <SidebarItem icon={Target} label="Opportunities" active={activeTab === 'opportunities'} onClick={() => navigateToTab('opportunities')} />
          <SidebarItem icon={Users} label="Competitors" active={activeTab === 'competitors'} onClick={() => navigateToTab('competitors')} />
          <SidebarItem icon={TrendingUp} label="Insights" active={activeTab === 'market'} onClick={() => navigateToTab('market')} />
          <SidebarItem icon={Mic} label="Audio Intel" active={activeTab === 'audio'} onClick={() => navigateToTab('audio')} />
          <SidebarItem icon={CreditCard} label="Payment Hub" active={activeTab === 'finance'} onClick={() => navigateToTab('finance')} />
          <SidebarItem icon={Zap} label="Pricing" active={activeTab === 'pricing'} onClick={() => navigateToTab('pricing')} />
        </nav>

        <div className="mt-auto space-y-6">
          <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Active Focus</span>
              <Badge className="bg-amber-500 text-black text-[8px] font-black h-4 px-1 leading-none uppercase">{activeProfile.niche}</Badge>
            </div>
            <div className="text-sm font-bold truncate">{activeProfile.name}</div>
          </div>
          
          <div className="flex items-center justify-between px-2">
            <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-white" onClick={() => setActiveTab('settings')}>
              <Settings className={`w-5 h-5 ${activeTab === 'settings' ? 'text-white' : ''}`} />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="User" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                ) : (
                  <UserCircle className="w-5 h-5 text-zinc-400" />
                )}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_50%_0%,rgba(30,41,59,0.1),transparent_50%)]">
        <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-zinc-800 px-6 lg:px-12 py-4 lg:py-6 flex items-center justify-between">
          <div className="flex items-center gap-4 lg:gap-6">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="w-5 h-5 text-white" />
            </Button>
            <h2 className="text-xl lg:text-2xl font-black tracking-tighter uppercase whitespace-nowrap">
              {activeTab === 'feed' ? 'Intelligence Pulse' : 
               activeTab === 'opportunities' ? 'Global Markets' :
               activeTab === 'competitors' ? 'Competitive Map' :
               activeTab === 'finance' ? 'Payout Gateway' : 
               activeTab === 'audio' ? 'Signal Extraction' :
               activeTab === 'pricing' ? 'Upgrade License' :
               activeTab === 'settings' ? 'Command Center' : 'Market Trends'}
            </h2>
            <div className="h-6 w-px bg-zinc-800" />
            <DropdownMenu>
              <DropdownMenuTrigger className={cn(buttonVariants({ variant: "outline" }), "h-9 px-4 text-[10px] uppercase font-black tracking-widest border-zinc-800 hover:bg-zinc-900 gap-2 flex items-center justify-center")}>
                <Sparkles className="w-3 h-3 text-amber-500" />
                {activeProfile.name}
                <ChevronDown className="w-3 h-3 text-zinc-500" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-zinc-950 border-zinc-800">
                <DropdownMenuLabel className="text-[10px] uppercase text-zinc-500">Business Profiles</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-800" />
                {profiles.map(p => (
                  <DropdownMenuItem 
                    key={p.id} 
                    onClick={() => setActiveProfile(p)}
                    className="flex justify-between items-center group cursor-pointer"
                  >
                    <span className="text-xs font-bold">{p.name}</span>
                    {p.id === activeProfile.id && <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
                  </DropdownMenuItem>
                ))}
                {isPro && (
                  <>
                    <DropdownMenuSeparator className="bg-zinc-800" />
                    <DropdownMenuItem className="text-[10px] uppercase font-black text-amber-500 cursor-pointer" onClick={() => setActiveTab('settings')}>
                      + Add New Profile (Pro)
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator className="bg-zinc-800" />
                {isGuest ? (
                  <DropdownMenuItem onClick={login} className="text-[10px] uppercase font-black text-white hover:bg-white hover:text-black cursor-pointer">
                    Login / Sign Up
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={logout} className="text-[10px] uppercase font-black text-rose-500 cursor-pointer">
                    Sign Out
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-4">
            {isGuest && (
              <Button onClick={login} className="h-9 px-4 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200">
                Login / Sign Up
              </Button>
            )}
            <div className="hidden md:flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500" />
                <Input className="pl-10 w-64 h-9 bg-zinc-900/50 border-zinc-800 font-mono text-[10px] uppercase tracking-widest" placeholder="Research markets..." />
              </div>
              <Button size="icon" variant="outline" className="h-9 w-9 border-zinc-800">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        <section className="p-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'opportunities' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                  {OPPORTUNITIES.map((opp) => (
                    <OpportunityCard key={opp.id} opp={opp} />
                  ))}
                </div>
              )}

              {activeTab === 'feed' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-8">
                    <div className="space-y-1">
                       <h3 className="text-xl font-black uppercase tracking-tight">Active Market Signals</h3>
                       <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Real-time global intelligence nexus</p>
                    </div>
                    <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-500 bg-emerald-500/5 px-3 py-1">Tactical Link Established</Badge>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {PULSE_SIGNALS.map((signal) => (
                      <PulseSignalCard key={signal.id} signal={signal} onExplore={() => setIsChatOpen(true)} />
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'competitors' && <CompetitorTracker />}
              {activeTab === 'finance' && <FinancialHub />}
              {activeTab === 'market' && <MarketInsights />}
              {activeTab === 'audio' && <AudioIntel />}
              {activeTab === 'pricing' && <Pricing onUpgrade={handleUpgrade} />}
              {activeTab === 'settings' && <ProfileSettings />}
            </motion.div>
          </AnimatePresence>
        </section>
      </main>
      <ChatAssistant isOpen={isChatOpen} setIsOpen={setIsChatOpen} profile={activeProfile} />
    </div>
  );
}
