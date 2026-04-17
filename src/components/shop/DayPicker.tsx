'use client';

import { Calendar } from 'lucide-react';

interface Day {
  dateStr: string;
  dayName: string;
  dayNumber: number;
  monthName: string;
}

interface DayPickerProps {
  days: Day[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export default function DayPicker({ days, selectedDate, onSelectDate }: DayPickerProps) {
  return (
    <section>
      <div className="flex items-center space-x-2 mb-6 text-sm font-semibold uppercase tracking-widest text-foreground-muted/60">
        <Calendar size={16} className="text-cyan-500" />
        <span>Choose Your Date</span>
      </div>
      
      <div className="flex space-x-3 overflow-x-auto pb-4 scrollbar-hide snap-x">
        {days.map((d) => (
          <button
            key={d.dateStr}
            onClick={() => onSelectDate(d.dateStr)}
            className={`flex-shrink-0 w-24 flex flex-col items-center py-4 rounded-2xl border transition-all snap-start ${
              selectedDate === d.dateStr
                ? 'border-cyan-500 bg-cyan-500/10 text-cyan-500 shadow-glow-cyan'
                : 'border-border bg-card hover:border-cyan-500/20 text-foreground'
            }`}
          >
            <span className="text-[10px] font-bold uppercase mb-1 opacity-60">{d.dayName}</span>
            <span className="text-2xl font-bold">{d.dayNumber}</span>
            <span className="text-[10px] mt-1 font-medium opacity-60 uppercase">{d.monthName}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
