'use client';

import { Info, Calendar, Clock, ArrowLeft, Loader2, ChevronRight } from 'lucide-react';
import WaitlistAction from '@/app/[shopId]/WaitlistAction';
import { Slot } from '@/lib/firebase/db';
import { formatTime } from '@/lib/utils/slot-utils';

interface BookingSummaryCardProps {
  selectedDate: string;
  selectedTime: string | null;
  selectedSlotData: Slot | null;
  displayAsFull: boolean;
  bookingLoading: boolean;
  onConfirm: (isWaitlist: boolean) => void;
}

export default function BookingSummaryCard({
  selectedDate,
  selectedTime,
  selectedSlotData,
  displayAsFull,
  bookingLoading,
  onConfirm
}: BookingSummaryCardProps) {
  return (
    <div className="glass-panel p-6 border-border bg-card/50 backdrop-blur-md sticky top-32">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <Info className="text-cyan-500 mr-2" size={20} />
        Booking Summary
      </h2>
      
      <div className="space-y-4 mb-8">
        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
          <div className="flex items-center gap-3">
            <Calendar size={18} className="text-foreground-muted" />
            <span className="text-sm font-medium">Date</span>
          </div>
          <span className="text-sm font-bold text-foreground">
            {(() => {
              const [y, m, d] = selectedDate.split('-').map(Number);
              return new Date(y, m - 1, d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
            })()}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
          <div className="flex items-center gap-3">
            <Clock size={18} className="text-foreground-muted" />
            <span className="text-sm font-medium">Time</span>
          </div>
          <span className="text-sm font-bold text-foreground">
            {selectedTime ? formatTime(selectedTime) : 'Not selected'}
          </span>
        </div>
      </div>

      {!selectedTime ? (
        <div className="p-8 text-center border border-dashed border-border rounded-2xl flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-foreground/5 flex items-center justify-center mb-4">
            <ArrowLeft size={24} className="text-foreground-muted animate-pulse" />
          </div>
          <p className="text-sm text-foreground-muted">Please select a time slot to continue your booking</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className={`p-4 rounded-2xl border transition-all ${
            displayAsFull ? 'border-yellow-500/20 bg-yellow-500/5 text-yellow-500' : 'border-cyan-500/20 bg-cyan-500/5 text-cyan-500'
          }`}>
            <p className="text-xs font-bold uppercase tracking-wider mb-1">
              {displayAsFull ? 'Low Availability' : 'High Availability'}
            </p>
            <p className="text-sm leading-relaxed text-foreground-muted">
              {displayAsFull 
                ? 'This slot is currently at max capacity. You can join the waitlist for a chance to be served.' 
                : 'Great choice! This slot is available for an immediate confirmed booking.'}
            </p>
          </div>

          <div className="pt-4">
            {displayAsFull ? (
              <WaitlistAction
                waitlistCount={selectedSlotData?.waitlistCount || 0} 
                onJoin={() => onConfirm(true)}
                loading={bookingLoading}
              />
            ) : (
              <button
                onClick={() => onConfirm(false)}
                disabled={bookingLoading}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-500 to-cyan-400 text-white py-4 px-8 rounded-xl font-bold hover:shadow-glow-cyan transition-all disabled:opacity-70"
              >
                {bookingLoading ? <Loader2 className="animate-spin" size={20} /> : (
                  <>
                    <span>Confirm Booking</span>
                    <ChevronRight size={18} />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
