import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Zap, Sparkles, Shield, Rocket, Loader2, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { useAuth } from '../context/AuthContext';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils';
import PaymentModal from './PaymentModal';

export default function Pricing({ onUpgrade }: { onUpgrade: (tier: string) => void }) {
  const { user, subscriptionStatus, login } = useAuth();
  const [upgrading, setUpgrading] = useState(false);
  const [selectedTier, setSelectedTier] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const tiers = [
    {
      name: "Free",
      id: "free",
      price: "$0",
      description: "Basic access to market signals",
      features: ["1 Active Profile", "Limited Pulse Feed", "Standard Analysis", "Manual Signal Sync"],
      icon: Shield,
      buttonText: "Current Plan",
      featured: false
    },
    {
      name: "Pro",
      id: "pro",
      price: "$99",
      description: "Unlimited intelligence for agencies",
      features: ["Unlimited Profiles", "Deep Market Intelligence", "Financial Hub access", "Audio Signal Extraction", "Priority Support", "Dedicated Strategist"],
      icon: Sparkles,
      buttonText: "Get Pro Access",
      featured: true
    }
  ];

  const handleInitiateUpgrade = (tier: any) => {
    if (!user) {
      login();
      return;
    }
    setSelectedTier(tier);
    setShowPaymentModal(true);
  };

  const handleUpgradeSuccess = async () => {
    if (!user) return;
    setUpgrading(true);
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        subscriptionStatus: 'pro',
        updatedAt: serverTimestamp()
      });
      onUpgrade('pro');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
    } finally {
      setUpgrading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      <div className="text-center space-y-4">
        <h2 className="text-4xl lg:text-6xl font-black tracking-tighter uppercase italic">Monetize Your Edge</h2>
        <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.2em]">Tiered Strategic Intelligence for High-Output Lancers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {tiers.map((tier, idx) => {
          const isCurrent = subscriptionStatus === tier.id;
          const showGPay = tier.id === 'pro' && subscriptionStatus !== 'pro';

          return (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className={`h-full bg-zinc-950 border-zinc-800 flex flex-col relative overflow-hidden ${tier.featured ? 'border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.1)]' : ''}`}>
                {tier.featured && (
                  <div className="absolute top-0 right-0 py-1.5 px-4 bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest leading-none translate-x-[25%] translate-y-[25%] rotate-45">
                    Best Value
                  </div>
                )}
                <CardHeader className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg bg-zinc-900 border border-zinc-800 ${tier.featured ? 'text-amber-500' : 'text-zinc-400'}`}>
                      <tier.icon className="w-6 h-6" />
                    </div>
                    <div className="text-right">
                      <span className="text-3xl font-black">{tier.price}</span>
                      <span className="text-[10px] text-zinc-500 font-semibold block uppercase">/ MONTH</span>
                    </div>
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-black tracking-tighter uppercase">{tier.name}</CardTitle>
                    <CardDescription className="text-zinc-500 text-xs mt-1">{tier.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-8 flex flex-col">
                  <ul className="space-y-3 flex-1">
                    {tier.features.map(feature => (
                      <li key={feature} className="flex gap-3 text-xs text-zinc-400 items-start">
                        <Check className="w-4 h-4 text-amber-500 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="pt-6">
                    {isCurrent ? (
                      <div className="w-full bg-zinc-900/50 border border-zinc-800 text-zinc-600 font-black text-[10px] uppercase tracking-[0.3em] py-5 text-center rounded-lg">
                        Tactical Hold • Active
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {!user ? (
                          <Button onClick={login} className="w-full bg-white text-black font-black uppercase tracking-widest py-6 h-14">
                            Login to Upgrade
                          </Button>
                        ) : upgrading ? (
                           <Button disabled className="w-full bg-zinc-800 text-zinc-500 font-black uppercase tracking-widest py-6 h-14 gap-2">
                             <Loader2 className="w-4 h-4 animate-spin" /> Processing
                           </Button>
                        ) : (
                          <Button 
                            onClick={() => handleInitiateUpgrade(tier)} 
                            className={`w-full py-6 h-14 font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 text-xs ${
                              tier.featured ? 'bg-white text-black hover:bg-zinc-200' : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                            }`}
                          >
                             {tier.buttonText} <ArrowRight className="ml-2 w-4 h-4" />
                          </Button>
                        )}
                        <p className="text-[9px] text-center text-zinc-600 font-mono uppercase tracking-widest">Quantum-Encrypted Gateway</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {selectedTier && (
        <PaymentModal 
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handleUpgradeSuccess}
          tier={selectedTier}
        />
      )}

      <div className="bg-zinc-900/30 border border-zinc-800 rounded-3xl p-12 text-center space-y-6 max-w-4xl mx-auto">
        <Rocket className="w-10 h-10 text-amber-500 mx-auto" />
        <h3 className="text-2xl font-black tracking-tighter uppercase leading-none">Enterprise License?</h3>
        <p className="text-zinc-400 text-sm max-w-lg mx-auto">Scaling a development agency or research firm? We offer custom seat pricing and dedicated private instances.</p>
        <Button variant="outline" className="border-zinc-800 hover:bg-zinc-900 font-black uppercase tracking-widest text-[10px]">
          Talk to a Strategist
        </Button>
      </div>
    </div>
  );
}
