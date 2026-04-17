'use client';

import { motion } from 'framer-motion';
import { Store, Edit3, Trash2, Ticket, Calendar, Clock, Phone, Star } from 'lucide-react';
import { Booking, Shop, Slot } from '@/lib/firebase/db';
import { useRouter } from 'next/navigation';
import { formatSlotDate, formatSlotTime } from '@/lib/utils/formatters';

interface BookingCardProps {
  booking: Booking & { shopData?: Shop; slotData?: Slot };
  idx: number;
  onEdit: (booking: Booking & { shopData?: Shop; slotData?: Slot }) => void;
  onDelete: (booking: Booking & { shopData?: Shop; slotData?: Slot }) => void;
  onFeedback: (booking: Booking & { shopData?: Shop; slotData?: Slot }) => void;
}

export default function BookingCard({ booking, idx, onEdit, onDelete, onFeedback }: BookingCardProps) {
  const router = useRouter();

  const isCompleted = booking.status === 'completed';
  const isInactive = ['cancelled', 'no-show', 'completed'].includes(booking.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.1 }}
      onClick={() => router.push(`/ticket/${booking.id}`)}
      className="glass-panel p-6 cursor-pointer group hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-violet-500/0 to-cyan-500/0 group-hover:from-violet-500/5 group-hover:to-cyan-500/5 transition-colors duration-500"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-foreground/5 flex items-center justify-center text-foreground font-bold text-xl border border-foreground/10 shrink-0">
            <Store size={24} className="opacity-50" />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1">{booking.shopData?.name || 'Unknown Shop'}</h3>
            <div className="flex flex-wrap items-center text-sm text-foreground-muted gap-y-2">
               <span className="bg-foreground/10 px-2 py-0.5 rounded text-xs text-foreground font-medium mr-2">Token #{booking.tokenNumber}</span>
               <div className="flex items-center mr-3">
                 <Calendar size={12} className="mr-1 text-cyan-500" />
                 <span>{formatSlotDate(booking.slotData?.date || '')}</span>
               </div>
               <div className="flex items-center mr-3">
                 <Clock size={12} className="mr-1 text-cyan-500" />
                 <span>{formatSlotTime(booking.slotData?.startTime || '')}</span>
               </div>
                {booking.shopData?.phoneNumber && (
                   <div className="flex items-center text-cyan-400 font-medium">
                     <Phone size={12} className="mr-1" />
                     <span>{booking.shopData.phoneNumber}</span>
                   </div>
                )}
                <div className="flex-grow md:w-0" />
                <span className={`capitalize font-medium px-2 py-0.5 rounded-md ${
                  booking.status === 'serving' ? 'bg-cyan-500/10 text-cyan-400' : 
                  booking.status === 'completed' ? 'bg-indigo-500/10 text-indigo-400' : 
                  booking.status === 'no-show' ? 'bg-red-500/10 text-red-400' :
                  booking.isWaitlist ? 'bg-yellow-500/10 text-yellow-500' : 'bg-green-500/10 text-green-500'
                }`}>
                  {booking.status === 'waiting' 
                    ? (booking.isWaitlist ? `WL #${booking.waitlistNumber}` : 'Confirmed') 
                    : booking.status}
                </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0 self-end md:self-center">
        {isCompleted && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFeedback(booking);
            }}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 hover:bg-yellow-500 hover:text-black transition-all group/btn"
          >
            <Star size={16} className="fill-current" />
            <span className="text-sm font-bold">Review</span>
          </button>
        )}

        {!isInactive && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(booking);
              }}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-foreground/5 text-foreground-muted hover:bg-cyan-500/10 hover:text-cyan-500 transition-all border border-transparent hover:border-cyan-500/30"
            >
              <Edit3 size={18} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(booking);
              }}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-foreground/5 text-foreground-muted hover:bg-red-500/10 hover:text-red-500 transition-all border border-transparent hover:border-red-500/30"
            >
              <Trash2 size={18} />
            </button>
          </>
        )}

        <div className="text-foreground-muted transition-colors w-10 h-10 flex items-center justify-center rounded-full bg-foreground/5 hover:bg-foreground hover:text-black">
          <Ticket size={18} />
        </div>
        </div>
      </div>
    </motion.div>
  );
}
