import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  statusResolved: boolean;
  subscriptionStatus: 'guest' | 'free' | 'pro' | null;
  login: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusResolved, setStatusResolved] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'guest' | 'free' | 'pro' | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        setLoading(true); // Re-enter loading for entitlement fetch
        const userDocRef = doc(db, 'users', currentUser.uid);
        
        // Ensure doc exists for new users (immediate initialization)
        const docSnap = await getDoc(userDocRef);
        if (!docSnap.exists()) {
          await setDoc(userDocRef, {
            uid: currentUser.uid,
            email: currentUser.email,
            subscriptionStatus: 'free',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
        }

        // Real-time listener for entititements
        const unsubscribeDoc = onSnapshot(userDocRef, (snap) => {
          if (snap.exists()) {
            setSubscriptionStatus(snap.data().subscriptionStatus || 'free');
          } else {
            setSubscriptionStatus('free');
          }
          setLoading(false);
          setStatusResolved(true);
        }, (error) => {
          console.error("Critical: Entitlement Signal Interrupted", error);
          setSubscriptionStatus('free');
          setLoading(false);
          setStatusResolved(true);
        });

        return () => unsubscribeDoc();
      } else {
        setSubscriptionStatus('guest');
        setLoading(false);
        setStatusResolved(true);
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
      throw error;
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error) {
      console.error("Email login failed:", error);
      throw error;
    }
  };

  const signupWithEmail = async (email: string, pass: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, pass);
    } catch (error) {
      console.error("Email signup failed:", error);
      throw error;
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
    <AuthContext.Provider value={{ user, loading, statusResolved, subscriptionStatus, login, loginWithEmail, signupWithEmail, logout }}>
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
