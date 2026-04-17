'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginVendor, registerVendor } from '@/lib/firebase/auth';
import { Lock, Mail, ArrowRight, Loader2, ChevronLeft, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

export default function VendorAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await loginVendor(email, password);
      } else {
        await registerVendor(email, password);
      }
      router.push('/vendor/dashboard');
    } catch (err: unknown) {
      console.error("Auth error:", err);
      let message = 'Authentication failed. Please try again.';
      const firebaseError = err as { code?: string; message?: string };
      
      if (firebaseError.code === 'auth/invalid-credential') {
        message = 'Incorrect email or password. If you don\'t have an account, please sign up!';
      } else if (firebaseError.code === 'auth/user-not-found') {
        message = 'No account found with this email. Please sign up!';
      } else if (firebaseError.code === 'auth/wrong-password') {
        message = 'Incorrect password. Please try again.';
      } else if (firebaseError.code === 'auth/too-many-requests') {
        message = 'Too many failed attempts. Please try again later.';
      } else if (firebaseError.message) {
        message = firebaseError.message;
      }
      
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-background/50 relative overflow-hidden">
      {/* Back Button */}
      <button 
        onClick={() => router.push('/')} 
        className="absolute top-6 left-6 z-50 flex items-center space-x-2 text-foreground-muted hover:text-foreground transition-colors"
      >
        <ChevronLeft size={20} />
        <span className="text-sm font-medium">Home</span>
      </button>

      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-glow-cyan rounded-full mix-blend-screen filter blur-[128px] opacity-50"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-glow-violet rounded-full mix-blend-screen filter blur-[128px] opacity-50"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-panel p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Queue Seva <span className="text-cyan-500">Vendor</span>
            </h1>
            <p className="text-foreground-muted">
              {isLogin ? 'Welcome back! Login to manage your queue.' : 'Create an account to digitize your queue.'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground/80">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-foreground-muted">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-foreground/10 rounded-xl bg-background-card text-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all shadow-sm"
                  placeholder="vendor@queueseva.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground/80">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-foreground-muted">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-foreground/10 rounded-xl bg-background-card text-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all shadow-sm"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-foreground-muted hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {isLogin && (
                <div className="flex justify-end mt-1.5">
                  <button
                    type="button"
                    onClick={() => router.push('/forgot-password')}
                    className="text-xs text-cyan-600 hover:text-cyan-500 transition-colors font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}
            </div>

            {error && (
              <motion.p 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                className="text-red-500 text-sm"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-background bg-foreground hover:bg-foreground/90 glow-effect focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-foreground transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-cyan-600 hover:text-cyan-500 transition-colors font-medium"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
