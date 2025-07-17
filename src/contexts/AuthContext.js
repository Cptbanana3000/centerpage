'use client';

import { createContext, useContext, useEffect, useState } from 'react';
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
  const router = useRouter();

  // Function to refresh the current user's data from Firebase
  async function refreshUser() {
    if (auth.currentUser) {
      try {
        await reload(auth.currentUser);
        // If email is now verified, force refresh ID token to propagate claim
        if (auth.currentUser.emailVerified) {
          await auth.currentUser.getIdToken(true);
        }
        // Force update the user state with fresh data
        setUser({ ...auth.currentUser });
      } catch (error) {
        console.error('Error refreshing user:', error);
      }
    }
  }

  async function signUp(email, password) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await sendEmailVerification(user);

    const userDocRef = doc(db, "users", user.uid);
    await setDoc(userDocRef, {
      uid: user.uid,
      email: user.email,
      createdAt: serverTimestamp(),
      credits: {
        standardAnalyses: 5,
        deepScans: 0
      }
    });

    return userCredential;
  }

  function signIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function signInWithGoogle() {
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
        credits: {
          standardAnalyses: 5,
          deepScans: 0
        }
      });
    }

    return result;
  }

  async function logOut() {
    try {
      console.log('Attempting to sign out...'); // Debug log
      await signOut(auth);
      console.log('Sign out successful'); // Debug log
      setUser(null); // Explicitly set user to null
    } catch (error) {
      console.error('Error signing out:', error);
      throw error; // Re-throw so calling components can handle it
    }
  }

  async function resendVerificationEmail() {
    if (!auth.currentUser) {
      throw new Error("No user is currently signed in.");
    }
    await sendEmailVerification(auth.currentUser);
  }

  async function handlePasswordResetEmail(email) {
    const trimmedEmail = email.trim().toLowerCase();
    await sendPasswordResetEmail(auth, trimmedEmail);
  }

  async function confirmPasswordReset(code, newPassword) {
    await confirmPasswordReset(auth, code, newPassword);
  }

  async function updateUserPassword(newPassword) {
    if (!auth.currentUser) {
      throw new Error("No user is currently signed in.");
    }
    await updatePassword(auth.currentUser, newPassword);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Periodically check for email verification when user is not verified
  useEffect(() => {
    let interval;
    
    if (user && !user.emailVerified) {
      interval = setInterval(async () => {
        await refreshUser();
      }, 3000); // Check every 3 seconds
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [user]);

  // Force refresh ID token once when email becomes verified to ensure backend sees it
  useEffect(() => {
    const refreshTokenIfVerified = async () => {
      if (user && user.emailVerified) {
        try {
          await user.getIdToken(true);
        } catch (e) {
          console.error('Error refreshing ID token after verification:', e);
        }
      }
    };
    refreshTokenIfVerified();
  }, [user]);

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    logOut,
    resendVerificationEmail,
    sendPasswordResetEmail: handlePasswordResetEmail,
    confirmPasswordReset,
    updateUserPassword,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 