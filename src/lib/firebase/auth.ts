import { auth } from "./config";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  setPersistence,
  browserSessionPersistence,
  sendPasswordResetEmail,
  confirmPasswordReset,
  ActionCodeSettings
} from "firebase/auth";

export const resetPassword = async (email: string, actionCodeSettings?: ActionCodeSettings) => {
  return await sendPasswordResetEmail(auth, email, actionCodeSettings);
};

export const confirmResetPassword = async (code: string, newPass: string) => {
  return await confirmPasswordReset(auth, code, newPass);
};


// Vendor Authentication
export const registerVendor = async (email: string, pass: string) => {
  await setPersistence(auth, browserSessionPersistence);
  return await createUserWithEmailAndPassword(auth, email, pass);
};

export const loginVendor = async (email: string, pass: string) => {
  await setPersistence(auth, browserSessionPersistence);
  return await signInWithEmailAndPassword(auth, email, pass);
};

export const logoutUser = async () => {
  const result = await signOut(auth);
  // Aggressively clear all client-side storage to prevent credential reuse
  if (typeof window !== 'undefined') {
    localStorage.clear();
    sessionStorage.clear();
  }
  return result;
};

// Customer Authentication
export const registerCustomer = async (email: string, pass: string, name: string) => {
  await setPersistence(auth, browserSessionPersistence);
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  await updateProfile(userCredential.user, { displayName: name });
  return userCredential;
};

export const loginCustomer = async (email: string, pass: string) => {
  await setPersistence(auth, browserSessionPersistence);
  return await signInWithEmailAndPassword(auth, email, pass);
};

export const loginCustomerWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  return await signInWithPopup(auth, provider);
};
