'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, onSnapshot, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Booking, Shop, Slot } from '@/lib/firebase/db';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, ArrowLeft, Loader2, CheckCircle, Clock as ClockIcon, Calendar, UserX } from 'lucide-react';
import { formatSlotDate, formatSlotTime } from '@/lib/utils/formatters';

export default function TicketView({ params }: { params: { bookingId: string } }) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [shop, setShop] = useState<Shop | null>(null);
  const [slot, setSlot] = useState<Slot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/customer/login');
    }
  }, [user, authLoading, router]);

  // Real-time listener for this specific booking
  useEffect(() => {
    const fetchInitialData = async (b: Booking) => {
      try {
        const [shopDoc, slotDoc] = await Promise.all([
          getDoc(doc(db, 'shops', b.shopId)),
          b.slotId ? getDoc(doc(db, `shops/${b.shopId}/slots`, b.slotId)) : Promise.resolve(null)
        ]);

        if (shopDoc.exists()) {
          setShop({ id: shopDoc.id, ...shopDoc.data() } as Shop);
        }
        if (slotDoc?.exists()) {
          setSlot({ id: slotDoc.id, ...slotDoc.data() } as Slot);
        }
      } catch (err) {
        console.error("Error fetching ticket details:", err);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onSnapshot(doc(db, 'bookings', params.bookingId), (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = { id: docSnapshot.id, ...docSnapshot.data() } as Booking;
        setBooking(data);
        
        // Fetch shop details if we don't have them yet
        if (!shop || !slot) {
          fetchInitialData(data);
        }
      } else {
        console.error("Booking not found");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [params.bookingId, shop, slot]);

  if (loading || !booking || !shop) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-cyan-500" size={32} />
      </div>
    );
  }

  const isServing = booking.status === 'serving';
  const isCompleted = booking.status === 'completed';
  const isNoShow = booking.status === 'no-show';
  
  const statusColor = 
    isServing ? 'from-cyan-500 to-violet-500' : 
    isCompleted ? 'from-indigo-500 to-blue-500' :
    isNoShow ? 'from-red-500 to-rose-500' :
    booking.isWaitlist ? 'from-yellow-500 to-amber-500' : 'from-green-500 to-emerald-500';

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background radial glow that reacts to status */}
      <motion.div 
        animate={{
          scale: isServing ? [1, 1.2, 1] : 1,
          opacity: isServing ? [0.3, 0.5, 0.3] : 0.1
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full mix-blend-screen filter blur-[150px] ${
          isServing ? 'bg-cyan-500' : 
          isCompleted ? 'bg-indigo-500' : 
          isNoShow ? 'bg-red-500' :
          booking.isWaitlist ? 'bg-yellow-500' : 'bg-green-500'
        }`}
      />

      <div className="w-full max-w-md relative z-10">
        <button 
          onClick={() => router.push('/customer/dashboard')}
          className="mb-8 text-foreground-muted hover:text-foreground flex items-center space-x-2 transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Back to Dashboard</span>
        </button>

        {/* The Digital Ticket */}
        <AnimatePresence mode="wait">
          <motion.div
            key={booking.status}
            initial={{ y: 50, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -50, opacity: 0, scale: 1.1 }}
            transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
            className={`glass-panel overflow-hidden relative border-t-4 ${
              isServing ? 'border-t-cyan-500 shadow-glow-cyan' : 
              isCompleted ? 'border-t-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.3)]' :
              isNoShow ? 'border-t-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)]' :
              booking.isWaitlist ? 'border-t-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.2)]' :
              'border-t-green-500 shadow-[0_0_30px_rgba(34,197,94,0.2)]'
            }`}
          >
            {/* Ticket Header Image Pattern */}
            <div className="h-32 bg-foreground/5 relative flex items-center justify-center overflow-hidden">
               <div className="absolute inset-0 opacity-10 pattern-diagonal-lines-sm" />
               <div className="text-center z-10 relative">
                 <h2 className="text-2xl font-bold tracking-tight">{shop.name}</h2>
                 <p className="text-foreground-muted text-sm">{shop.category}</p>
               </div>
            </div>

            {/* Jagged Edge Separator */}
            <div className="relative h-4 bg-background-card flex justify-between px-4 -mt-2">
              <div className="w-4 h-4 rounded-full bg-background absolute -left-2 top-0" />
              <div className="w-full border-t-2 border-dashed border-foreground/10 absolute top-2 left-0" />
              <div className="w-4 h-4 rounded-full bg-background absolute -right-2 top-0" />
            </div>

            {/* Ticket Body */}
            <div className="p-8 flex flex-col items-center">
              
              <div className="text-center mb-8">
                <p className="text-sm font-semibold text-foreground-muted tracking-widest uppercase mb-2">Token Number</p>
                <div className="text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-foreground to-foreground-muted">
                  {booking.tokenNumber}
                </div>
              </div>

              {/* Status Indicator */}
              <div className="w-full p-4 rounded-2xl bg-foreground/5 border border-foreground/5 flex items-center justify-center space-x-4 mb-6">
                {isServing ? (
                  <>
                    <ClockIcon className="text-cyan-500" size={24} />
                    <span className="font-bold text-lg text-cyan-500 text-center">It&apos;s your turn! Please proceed.</span>
                  </>
                ) : isCompleted ? (
                  <>
                    <CheckCircle className="text-indigo-500" size={24} />
                    <span className="font-bold text-lg text-indigo-500">Service Completed</span>
                  </>
                ) : isNoShow ? (
                  <>
                    <UserX className="text-red-500" size={24} />
                    <span className="font-bold text-lg text-red-500">Marked as No-Show</span>
                  </>
                ) : (
                  <>
                    <div className={`w-3 h-3 rounded-full animate-pulse ${booking.isWaitlist ? 'bg-yellow-500' : 'bg-green-500'}`} />
                    <span className={`font-semibold text-lg text-center ${booking.isWaitlist ? 'text-yellow-600' : 'text-green-600'}`}>
                      {booking.isWaitlist 
                        ? (booking.waitlistNumber ? `Waitlist Sequence #${booking.waitlistNumber}` : 'On Waitlist') 
                        : 'Booking Confirmed'}
                    </span>
                  </>
                )}
              </div>

              {/* Slot Details */}
              <div className="flex w-full justify-between gap-4 mb-8">
                <div className="flex-1 p-3 rounded-xl bg-foreground/5 border border-foreground/5 flex items-center space-x-3">
                  <Calendar size={16} className="text-cyan-500" />
                  <div className="text-left">
                    <p className="text-[10px] text-foreground-muted uppercase font-bold tracking-wider">Date</p>
                    <p className="text-sm font-semibold">{formatSlotDate(slot?.date || '')}</p>
                  </div>
                </div>
                <div className="flex-1 p-3 rounded-xl bg-foreground/5 border border-foreground/5 flex items-center space-x-3">
                  <ClockIcon size={16} className="text-cyan-500" />
                  <div className="text-left">
                    <p className="text-[10px] text-foreground-muted uppercase font-bold tracking-wider">Time</p>
                    <p className="text-sm font-semibold">{formatSlotTime(slot?.startTime || '')}</p>
                  </div>
                </div>
              </div>

              {/* Fake QR Code for realism */}
              <div className="p-4 bg-white rounded-xl mb-4">
                <QrCode size={120} className="text-black" />
              </div>
              <p className="text-xs text-foreground-muted text-center max-w-[200px]">
                Show this digital ticket to the staff when called.
              </p>
            </div>
            
            {/* Accent Footer */}
            <div className={`h-2 w-full bg-gradient-to-r ${statusColor}`} />
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
}
