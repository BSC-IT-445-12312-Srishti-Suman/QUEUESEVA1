'use client';

import { Clock } from 'lucide-react';
import { formatTime } from '@/lib/utils/slot-utils';

interface TimeSlotGridProps {
  timeSlots: string[];
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
  getSlotState: (time: string) => 'already_booked' | 'available' | 'full' | 'past';
  onShowToast: (message: string) => void;
}

export default function TimeSlotGrid({ 
  timeSlots, 
  selectedTime, 
  onSelectTime, 
  getSlotState,
  onShowToast
}: TimeSlotGridProps) {
  return (
    <section>
      <div className="flex items-center space-x-2 mb-6 text-sm font-semibold uppercase tracking-widest text-foreground-muted/60">
        <Clock size={16} className="text-cyan-500" />
        <span>Available Slots</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
        {timeSlots.map((time) => {
          const state = getSlotState(time);
          const isSelected = selectedTime === time;

          return (
            <button
              key={time}
              onClick={() => {
                if (state === 'already_booked') {
                  onShowToast("You have already booked this slot!");
                  return;
                }
                if (state === 'past') {
                  onShowToast("This slot is in the past!");
                  return;
                }
                onSelectTime(time);
              }}
              className={`relative py-4 px-2 rounded-xl border text-sm font-bold transition-all text-center flex flex-col items-center justify-center min-h-[70px] ${
                state === 'past' ? 'border-border bg-foreground/5 text-foreground/20 cursor-not-allowed grayscale' :
                state === 'already_booked' ? 'border-red-500/30 bg-red-500/5 text-red-500/50 cursor-not-allowed opacity-60' :
                isSelected ? (state === 'full' ? 'border-yellow-500 bg-yellow-500/10 text-yellow-500 shadow-glow-yellow' : 'border-cyan-500 bg-cyan-500/10 text-cyan-500 shadow-glow-cyan') :
                state === 'full' ? 'border-yellow-500/20 bg-card text-yellow-500/70 hover:border-yellow-500/50' :
                'border-border bg-card text-foreground hover:border-cyan-500/20'
              }`}
            >
              <span className="text-base">{formatTime(time).split(' ')[0]}</span>
              <span className="text-[10px] opacity-60 uppercase">{formatTime(time).split(' ')[1]}</span>
              
              {state === 'full' && (
                <div className="absolute top-1 right-1">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
                </div>
              )}
              {state === 'already_booked' && <span className="text-[8px] font-black uppercase mt-1 tracking-tighter">Booked</span>}
            </button>
          );
        })}
      </div>
    </section>
  );
}
