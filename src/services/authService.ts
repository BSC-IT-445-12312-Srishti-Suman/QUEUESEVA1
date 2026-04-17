import { 
  resetPassword as firebaseResetPassword,
  confirmResetPassword as firebaseConfirmResetPassword 
} from "@/lib/firebase/auth";
import { ActionCodeSettings } from "firebase/auth";

/**
 * Service to handle authentication business logic.
 */
export const authService = {
  /**
   * Triggers a password reset email for the given email address.
   * @param email The registered email address.
   */
  async requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
    try {
      if (!email || !email.includes('@')) {
        return { success: false, message: 'Please enter a valid email address.' };
      }

      const actionCodeSettings: ActionCodeSettings = {
        url: `${window.location.origin}/reset-password`,
        handleCodeInApp: true,
      };

      await firebaseResetPassword(email, actionCodeSettings);

      return { 
        success: true, 
        message: 'Password reset link sent to your email.' 
      };
    } catch (error: unknown) {
      console.error("Error in requestPasswordReset:", error);
      
      let errorMessage = 'An error occurred. Please try again.';
      const firebaseError = error as { code?: string };
      
      if (firebaseError.code === 'auth/user-not-found' || firebaseError.code === 'auth/invalid-email') {
        errorMessage = 'This email is not registered with us. Please sign up first!';
      } else if (firebaseError.code === 'auth/too-many-requests') {
        errorMessage = 'Too many attempts. Please try again later.';
      }
      
      return { success: false, message: errorMessage };
    }
  },

  /**
   * Finalizes the password reset using the OOB code.
   * @param code The OOB code from the email link.
   * @param newPass The new password chosen by the user.
   */
  async handlePasswordReset(code: string, newPass: string): Promise<{ success: boolean; message: string }> {
    try {
      if (!code) {
        return { success: false, message: 'Invalid or expired reset link.' };
      }
      if (newPass.length < 6) {
        return { success: false, message: 'Password must be at least 6 characters long.' };
      }

      await firebaseConfirmResetPassword(code, newPass);
      return { 
        success: true, 
        message: 'Your password has been successfully reset!' 
      };
    } catch (error: unknown) {
      console.error("Error in handlePasswordReset:", error);
      
      let errorMessage = 'Failed to reset password. The link may have expired.';
      const firebaseError = error as { code?: string };
      
      if (firebaseError.code === 'auth/weak-password') {
        errorMessage = 'Your new password is too weak.';
      } else if (firebaseError.code === 'auth/expired-action-code') {
        errorMessage = 'Your reset link has expired. Please request a new one.';
      } else if (firebaseError.code === 'auth/invalid-action-code') {
        errorMessage = 'Your reset link is invalid. Please request a new one.';
      }
      
      return { success: false, message: errorMessage };
    }
  }
};
