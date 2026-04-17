'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Store, User, ArrowRight } from 'lucide-react';

export default function HomeLanding() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-glow-cyan rounded-full mix-blend-screen filter blur-[150px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-glow-violet rounded-full mix-blend-screen filter blur-[150px] opacity-20 translate-y-1/4 -translate-x-1/4"></div>

      <main className="max-w-5xl mx-auto px-6 py-12 relative z-10 w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-foreground/5 py-2 px-4 rounded-full text-sm font-medium mb-6 text-foreground-muted border border-foreground/10">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
            <span>Welcome to Queue Seva</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground-muted">
            Skip the line. <br className="hidden md:block" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-violet-500">Wait smarter.</span>
          </h1>
          <p className="text-lg md:text-xl text-foreground-muted max-w-2xl mx-auto mb-10">
            A digital token system to effortlessly manage queues and appointments. Choose how you want to continue.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Customer Option */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            onClick={() => router.push('/customer/login')}
            className="glass-panel p-8 cursor-pointer group hover:-translate-y-2 transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-cyan-500/0 group-hover:from-cyan-500/10 group-hover:to-transparent transition-colors duration-500"></div>
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 mb-6 border border-cyan-500/20 group-hover:scale-110 transition-transform">
                <User size={32} />
              </div>
              
              <h2 className="text-2xl font-bold mb-3 group-hover:text-cyan-400 transition-colors">I am a Customer</h2>
              <p className="text-foreground-muted mb-8 flex-grow">
                Search for hospitals, salons, banks, and more. Select a time slot, join the virtual waiting list, and get live updates on your wait time.
              </p>
              
              <div className="flex items-center text-cyan-500 font-medium">
                Enter as Customer
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </motion.div>

          {/* Vendor Option */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => router.push('/vendor/login')}
            className="glass-panel p-8 cursor-pointer group hover:-translate-y-2 transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 to-violet-500/0 group-hover:from-violet-500/10 group-hover:to-transparent transition-colors duration-500"></div>
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-500 mb-6 border border-violet-500/20 group-hover:scale-110 transition-transform">
                <Store size={32} />
              </div>
              
              <h2 className="text-2xl font-bold mb-3 group-hover:text-violet-400 transition-colors">I am a Vendor</h2>
              <p className="text-foreground-muted mb-8 flex-grow">
                Register your business, digitize your queues, and seamlessly manage customer appointments. Notify users in real-time.
              </p>
              
              <div className="flex items-center text-violet-500 font-medium">
                Login / Register
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      
      {/* Decorative footer line */}
      <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-violet-500 shadow-[0_0_20px_rgba(6,182,212,0.5)]"></div>
    </div>
  );
}
