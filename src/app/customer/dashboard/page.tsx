'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ListOrdered, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';

export default function CustomerDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/customer/login');
    }
  }, [user, authLoading, router]);


  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-cyan-500" size={32} />
      </div>
    );
  }

  // wait for redirect
  if (!user) return null;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-glow-cyan rounded-full mix-blend-screen filter blur-[150px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
      
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10 w-full flex-grow flex flex-col items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
            Welcome back!
          </h1>
          <p className="text-lg text-foreground-muted max-w-xl mx-auto">
            What would you like to do today? You can search for a new destination to book a slot, or view your existing queue status.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto w-full">
          {/* New Booking Option */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            onClick={() => router.push('/customer/search')}
            className="glass-panel p-8 cursor-pointer group hover:-translate-y-2 transition-all duration-300 relative overflow-hidden flex flex-col items-center text-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-cyan-500/0 group-hover:from-cyan-500/10 group-hover:to-transparent transition-colors duration-500"></div>
            
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 mb-6 border border-cyan-500/20 group-hover:scale-110 transition-transform relative z-10">
              <Search size={32} />
            </div>
            
            <h2 className="text-2xl font-bold mb-3 relative z-10">New Booking</h2>
            <p className="text-foreground-muted relative z-10">
              Search for hospitals, salons, and banks to join a virtual queue.
            </p>
          </motion.div>

          {/* My Bookings Option */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => router.push('/customer/bookings')}
            className="glass-panel p-8 cursor-pointer group hover:-translate-y-2 transition-all duration-300 relative overflow-hidden flex flex-col items-center text-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 to-violet-500/0 group-hover:from-violet-500/10 group-hover:to-transparent transition-colors duration-500"></div>
            
            <div className="w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-500 mb-6 border border-violet-500/20 group-hover:scale-110 transition-transform relative z-10">
              <ListOrdered size={32} />
            </div>
            
            <h2 className="text-2xl font-bold mb-3 relative z-10">My Bookings</h2>
            <p className="text-foreground-muted relative z-10">
              View your active tokens, check live wait times, and see past visits.
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
