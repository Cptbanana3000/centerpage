'use client';

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  sendPasswordResetEmail,
  confirmPasswordReset,
  updatePassword,
  reload,
  GithubAuthProvider,
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { app } from '@/services/firebase';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

const auth = getAuth(app);
const db = getFirestore(app);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    if (!auth.currentUser) return;
    try {
      await reload(auth.currentUser);
      if (auth.currentUser.emailVerified) {
        await auth.currentUser.getIdToken(true);
      }
      setUser(auth.currentUser);
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  }, []);

  const signUp = useCallback(async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await sendEmailVerification(user);
    const userDocRef = doc(db, "users", user.uid);
    await setDoc(userDocRef, {
      uid: user.uid,
      email: user.email,
      createdAt: serverTimestamp(),
      credits: { standardAnalyses: 3, deepScans: 0 },
    });
    return userCredential;
  }, []);

  const signIn = useCallback((email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
        credits: { standardAnalyses: 3, deepScans: 0 },
      });
    }
    return result;
  }, []);

  // --- GITHUB SOCIAL LOGIN ---
  const signInWithGitHub = useCallback(async () => {
    const provider = new GithubAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
        credits: { standardAnalyses: 3, deepScans: 0 },
      });
    }
    return result;
  }, []);
  // --- END GITHUB SOCIAL LOGIN ---
  

  const logOut = useCallback(async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }, []);

  const resendVerificationEmail = useCallback(async () => {
    if (!auth.currentUser) throw new Error("No user is currently signed in.");
    await sendEmailVerification(auth.currentUser);
  }, []);

  const handlePasswordResetEmail = useCallback(async (email) => {
    const trimmedEmail = email.trim().toLowerCase();
    await sendPasswordResetEmail(auth, trimmedEmail);
  }, []);

  const confirmPasswordReset = useCallback(async (code, newPassword) => {
    await confirmPasswordReset(auth, code, newPassword);
  }, []);

  const updateUserPassword = useCallback(async (newPassword) => {
    if (!auth.currentUser) throw new Error("No user is currently signed in.");
    await updatePassword(auth.currentUser, newPassword);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user && !user.emailVerified) {
      const interval = setInterval(() => refreshUser(), 3000);
      return () => clearInterval(interval);
    }
  }, [user, refreshUser]);

  useEffect(() => {
    if (user && user.emailVerified) {
      user.getIdToken(true).catch(e => console.error('Error refreshing ID token:', e));
    }
  }, [user]);

  const value = useMemo(() => ({
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithGitHub, // <-- Export GitHub login
    logOut,
    resendVerificationEmail,
    sendPasswordResetEmail: handlePasswordResetEmail,
    confirmPasswordReset,
    updateUserPassword,
    refreshUser,
  }), [user, loading, signUp, signIn, signInWithGoogle, signInWithGitHub, logOut, resendVerificationEmail, handlePasswordResetEmail, confirmPasswordReset, updateUserPassword, refreshUser]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 