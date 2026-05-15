import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CreditCard, 
  Smartphone, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  X,
  Loader2,
  ArrowRight,
  Sparkles,
  Zap
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { toast } from 'sonner';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  tier: {
    name: string;
    price: string;
  };
}

const METHODS = [
  { id: 'card', label: 'Credit Card', icon: <CreditCard className="w-4 h-4" />, sub: 'Visa, MC, Amex' },
  { id: 'gpay', label: 'Google Pay', icon: <Smartphone className="w-4 h-4" />, sub: 'Fast Checkout' },
];

export default function PaymentModal({ isOpen, onClose, onSuccess, tier }: PaymentModalProps) {
  const { user } = useAuth();
  const [step, setStep] = useState<'method' | 'details' | 'processing' | 'success'>('method');
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [formData, setFormData] = useState({ name: '', number: '', expiry: '', cvv: '' });

  if (!isOpen) return null;

  const handleProcess = async () => {
    if (!user) {
      toast.error("Auth Link Severed", { description: "You must be logged in to initialize a subscription." });
      return;
    }

    setStep('processing');
    
    try {
      // Simulate payment network delay
      await new Promise(r => setTimeout(r, 2500));
      
      // Update Firestore Entitlement
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        subscriptionStatus: tier.name.toLowerCase() === 'pro' ? 'pro' : 'free',
        updatedAt: serverTimestamp()
      });

      if (selectedMethod === 'gpay') {
        toast.success("Google Pay Authorized", {
          description: "Mastercard •••• 4242 processed successfully."
        });
      }

      setStep('success');
      setTimeout(() => {
        onSuccess();
        onClose();
        setStep('method'); // Reset
      }, 2000);
    } catch (err) {
      console.error("Payment sync failure:", err);
      toast.error("Protocol Sync Failure", { description: "Payment authorized, but profile link failed. Retrying..." });
      // In a real app we'd have a reconciliation loop
      setStep('method');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl relative overflow-hidden active-link-border"
      >
        <div className="p-6 border-b border-zinc-900 bg-black flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded bg-amber-500 flex items-center justify-center text-black">
               <ShieldCheck className="w-5 h-5" />
             </div>
             <div>
               <h3 className="text-sm font-black uppercase tracking-tighter italic">Secure Checkout</h3>
               <p className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest leading-none mt-0.5">Quantum-Link Encrypted</p>
             </div>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {step === 'method' && (
              <motion.div 
                key="method"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Selected Tier</span>
                  <div className="flex justify-between items-end border-b border-zinc-800 pb-2">
                    <h4 className="text-2xl font-black italic uppercase tracking-tighter">{tier.name} License</h4>
                    <span className="text-amber-500 font-bold mb-1">{tier.price}<span className="text-[10px] text-zinc-500">/mo</span></span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {METHODS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMethod(m.id)}
                      className={`flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                        selectedMethod === m.id 
                          ? 'bg-white border-white text-black' 
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${selectedMethod === m.id ? 'bg-zinc-100' : 'bg-black'}`}>
                        {m.icon}
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-black uppercase tracking-tight">{m.label}</div>
                        <div className={`text-[9px] font-medium uppercase opacity-60`}>{m.sub}</div>
                      </div>
                    </button>
                  ))}
                </div>

                <Button 
                  onClick={() => {
                    if (selectedMethod === 'gpay') handleProcess();
                    else setStep('details');
                  }} 
                  className="w-full bg-white text-black hover:bg-zinc-200 py-6 font-black uppercase tracking-widest transition-transform active:scale-95"
                >
                  {selectedMethod === 'gpay' ? 'Authorizing Google Pay...' : 'Register Method'} 
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </motion.div>
            )}

            {step === 'details' && (
              <motion.div 
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-zinc-500 items-center flex gap-2">
                    <CreditCard className="w-3 h-3" /> Cardholder Identity
                  </label>
                  <Input 
                    placeholder="FULL LEGAL NAME" 
                    className="bg-zinc-900 border-zinc-800 h-11 text-xs font-bold tracking-tight uppercase"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-zinc-500">Neural Token (Card Number)</label>
                  <Input 
                    placeholder="4242 4242 4242 4242" 
                    className="bg-zinc-900 border-zinc-800 h-11 text-xs font-mono"
                    value={formData.number}
                    onChange={(e) => setFormData({...formData, number: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-zinc-500">Expiration</label>
                    <Input 
                      placeholder="MM/YY" 
                      className="bg-zinc-900 border-zinc-800 h-11 text-xs font-mono"
                      value={formData.expiry}
                      onChange={(e) => setFormData({...formData, expiry: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-zinc-500">Security Cipher</label>
                    <Input 
                      placeholder="CVC" 
                      className="bg-zinc-900 border-zinc-800 h-11 text-xs font-mono"
                      value={formData.cvv}
                      onChange={(e) => setFormData({...formData, cvv: e.target.value})}
                    />
                  </div>
                </div>

                <div className="pt-4 space-y-4">
                   <div className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg flex items-center justify-between">
                     <span className="text-[10px] font-bold text-zinc-500 uppercase">License Charge</span>
                     <span className="text-sm font-black text-amber-500">{tier.price}</span>
                   </div>
                   <Button onClick={handleProcess} className="w-full bg-amber-500 text-black hover:bg-amber-400 py-6 font-black uppercase tracking-widest gap-2">
                     <Zap className="w-4 h-4" /> Finalize Signal Link
                   </Button>
                </div>
              </motion.div>
            )}

            {step === 'processing' && (
              <motion.div 
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12 flex flex-col items-center justify-center text-center space-y-6"
              >
                <div className="relative">
                  <Loader2 className="w-16 h-16 text-amber-500 animate-spin" />
                  <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-white animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-black uppercase tracking-tighter">Synchronizing Node</h4>
                  <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Validating financial credentials across global ledger...</p>
                </div>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div 
                key="success"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="py-12 flex flex-col items-center justify-center text-center space-y-6"
              >
                <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.3)]">
                  <CheckCircle2 className="w-12 h-12 text-black" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-2xl font-black uppercase italic tracking-tighter">Link Established</h4>
                  <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Pro tier capabilities are now active. Rerouting to Intel Pulse.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-4 bg-zinc-900 border-t border-zinc-800 text-center">
          <div className="flex items-center justify-center gap-2 text-zinc-600">
            <Lock className="w-3 h-3" />
            <span className="text-[8px] font-mono uppercase tracking-[0.2em]">Sandbox Mode Active • No Real Charges</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
