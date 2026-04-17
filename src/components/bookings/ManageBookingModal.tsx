'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit3, Calendar, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { Booking, Shop, Slot } from '@/lib/firebase/db';
import { formatSlotDate, formatSlotTime } from '@/lib/utils/formatters';

interface ManageBookingModalProps {
  booking: (Booking & { shopData?: Shop; slotData?: Slot }) | null;
  onClose: () => void;
  onReschedule: (booking: Booking & { shopData?: Shop; slotData?: Slot }) => void;
  loading: boolean;
}

export default function ManageBookingModal({ 
  booking, 
  onClose, 
  onReschedule,
  loading 
}: ManageBookingModalProps) {
  return (
    <AnimatePresence>
      {booking && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md glass-panel p-8 border border-foreground/10 shadow-2xl"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-foreground-muted hover:text-foreground transition-colors"
            >
              <X size={20} />
            </button>

            <div className="mb-8">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 mb-4">
                <Edit3 size={32} />
              </div>
              <h2 className="text-2xl font-bold">Manage Booking</h2>
              <p className="text-foreground-muted">Modify your appointment at {booking.shopData?.name}</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center p-4 rounded-xl bg-foreground/5 border border-foreground/5">
                <Calendar className="text-cyan-500 mr-4" size={20} />
                <div>
                  <p className="text-xs text-foreground-muted uppercase font-bold tracking-wider">Date</p>
                  <p className="font-semibold">{formatSlotDate(booking.slotData?.date || '')}</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 rounded-xl bg-foreground/5 border border-foreground/5">
                <Clock className="text-cyan-500 mr-4" size={20} />
                <div>
                  <p className="text-xs text-foreground-muted uppercase font-bold tracking-wider">Time Slot</p>
                  <p className="font-semibold">{formatSlotTime(booking.slotData?.startTime || '')}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/10 flex items-start space-x-3">
                <AlertCircle className="text-yellow-500 shrink-0 mt-0.5" size={16} />
                <p className="text-xs text-yellow-500/80 leading-relaxed">
                  Rescheduling will cancel your current token and position in the queue. You will need to select a new slot.
                </p>
              </div>
            </div>

            <div className="flex flex-col space-y-3">
              <button
                onClick={() => onReschedule(booking)}
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 py-4 px-6 rounded-xl bg-cyan-500 text-black font-bold hover:shadow-glow-cyan transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : (
                  <>
                    <Clock size={18} />
                    <span>Reschedule Booking</span>
                  </>
                )}
              </button>
              
              <button
                onClick={onClose}
                disabled={loading}
                className="w-full py-3 px-6 rounded-xl border border-foreground/10 text-foreground-muted font-medium hover:bg-foreground/5 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
