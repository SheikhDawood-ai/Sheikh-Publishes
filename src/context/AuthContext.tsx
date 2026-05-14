import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  User 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  subscriptionStatus: 'guest' | 'free' | 'pro';
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'guest' | 'free' | 'pro'>('guest');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Authenticated user
        const userDocRef = doc(db, 'users', currentUser.uid);
        
        // Listen for real-time updates to subscription status
        const unsubscribeDoc = onSnapshot(userDocRef, async (docSnap) => {
          if (docSnap.exists()) {
            setSubscriptionStatus(docSnap.data().subscriptionStatus || 'free');
          } else {
            // New user initialization
            const initialData = {
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName,
              subscriptionStatus: 'free',
              createdAt: new Date().toISOString()
            };
            await setDoc(userDocRef, initialData);
            setSubscriptionStatus('free');
          }
          setLoading(false);
        });

        return () => unsubscribeDoc();
      } else {
        // Guest mode
        setSubscriptionStatus('guest');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, subscriptionStatus, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
