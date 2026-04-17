'use client';

import { Loader2, ArrowRight } from 'lucide-react';

interface WaitlistActionProps {
  waitlistCount: number;
  onJoin: () => void;
  loading: boolean;
}

export default function WaitlistAction({ waitlistCount, onJoin, loading }: WaitlistActionProps) {
  
  return (
    <div className="flex flex-col items-center">
      {/* Action Button */}
      <button
        onClick={onJoin}
        disabled={loading}
        className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-violet-600 to-violet-500 text-white py-4 px-6 md:px-8 rounded-xl font-bold hover:shadow-low-violet transition-all disabled:opacity-70 group"
      >
        {loading ? (
          <Loader2 className="animate-spin" size={20} />
        ) : (
          <>
            <span>Join Waitlist #{waitlistCount + 1}</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>
    </div>
  );
}
