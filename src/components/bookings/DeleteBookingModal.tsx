'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Loader2, Trash2 } from 'lucide-react';
import { Booking, Shop, Slot } from '@/lib/firebase/db';

interface DeleteBookingModalProps {
  booking: (Booking & { shopData?: Shop; slotData?: Slot }) | null;
  onClose: () => void;
  onConfirm: (booking: Booking & { shopData?: Shop; slotData?: Slot }) => void;
  loading: boolean;
}

export default function DeleteBookingModal({
  booking,
  onClose,
  onConfirm,
  loading
}: DeleteBookingModalProps) {
  return (
    <AnimatePresence>
      {booking && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
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
            className="relative w-full max-w-sm glass-panel p-8 border border-foreground/10 shadow-2xl"
          >
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mx-auto mb-6">
                <AlertCircle size={32} />
              </div>
              <h2 className="text-2xl font-bold mb-2">Cancel Booking?</h2>
              <p className="text-foreground-muted mb-8 text-sm">
                Are you sure you want to cancel your booking at <span className="text-foreground font-semibold">{booking.shopData?.name}</span>? This action cannot be undone.
              </p>

              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => onConfirm(booking)}
                  disabled={loading}
                  className="w-full py-4 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : (
                    <>
                      <Trash2 size={18} />
                      <span>Yes, Cancel Booking</span>
                    </>
                  )}
                </button>
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="w-full py-4 text-foreground-muted font-medium hover:text-foreground transition-colors"
                >
                  Keep Booking
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
