'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-red-500/10 rounded-full mix-blend-screen filter blur-[150px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-500/10 rounded-full mix-blend-screen filter blur-[150px] opacity-20 translate-y-1/4 -translate-x-1/4"></div>

      <main className="max-w-2xl mx-auto px-6 py-12 relative z-10 w-full text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="glass-panel p-12 flex flex-col items-center"
        >
          <div className="w-24 h-24 rounded-3xl bg-red-500/10 flex items-center justify-center text-red-500 mb-8 border border-red-500/20">
            <span className="text-4xl font-bold">404</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 text-foreground">
            Page Not Found
          </h1>
          
          <p className="text-lg text-foreground-muted mb-10 max-w-md">
            The queue you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Link 
              href="/"
              className="flex items-center justify-center space-x-2 bg-foreground text-background px-8 py-3 rounded-2xl font-semibold hover:bg-foreground/90 transition-all shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1"
            >
              <Home size={18} />
              <span>Back to Home</span>
            </Link>
            
            <button 
              onClick={() => window.history.back()}
              className="flex items-center justify-center space-x-2 bg-white/5 border border-foreground/10 px-8 py-3 rounded-2xl font-semibold hover:bg-white/10 transition-all hover:-translate-y-1"
            >
              <ArrowLeft size={18} />
              <span>Go Back</span>
            </button>
          </div>
        </motion.div>
      </main>
      
      {/* Decorative footer line */}
      <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-amber-500"></div>
    </div>
  );
}
