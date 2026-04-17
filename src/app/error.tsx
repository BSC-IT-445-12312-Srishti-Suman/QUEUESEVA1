'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCcw, AlertTriangle, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-red-500/10 rounded-full mix-blend-screen filter blur-[150px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-violet-500/10 rounded-full mix-blend-screen filter blur-[150px] opacity-20 translate-y-1/4 -translate-x-1/4"></div>

      <main className="max-w-2xl mx-auto px-6 py-12 relative z-10 w-full text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="glass-panel p-12 flex flex-col items-center border-red-500/20"
        >
          <div className="w-24 h-24 rounded-3xl bg-red-500/10 flex items-center justify-center text-red-500 mb-8 border border-red-500/20">
            <AlertTriangle size={48} />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 text-foreground">
            Something went wrong!
          </h1>
          
          <p className="text-lg text-foreground-muted mb-10 max-w-md">
            We encountered an unexpected error while processing your request. Don&apos;t worry, our team has been notified.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <button
              onClick={() => reset()}
              className="flex items-center justify-center space-x-2 bg-foreground text-background px-8 py-3 rounded-2xl font-semibold hover:bg-foreground/90 transition-all shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1"
            >
              <RefreshCcw size={18} />
              <span>Try Again</span>
            </button>
            
            <Link 
              href="/"
              className="flex items-center justify-center space-x-2 bg-white/5 border border-foreground/10 px-8 py-3 rounded-2xl font-semibold hover:bg-white/10 transition-all hover:-translate-y-1"
            >
              <Home size={18} />
              <span>Go Home</span>
            </Link>
          </div>
          
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 p-4 bg-red-500/5 rounded-xl border border-red-500/10 text-left w-full overflow-auto max-h-40">
              <p className="text-xs font-mono text-red-500 whitespace-pre-wrap">
                {error.message}
              </p>
            </div>
          )}
        </motion.div>
      </main>
      
      {/* Decorative footer line */}
      <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-violet-500"></div>
    </div>
  );
}
