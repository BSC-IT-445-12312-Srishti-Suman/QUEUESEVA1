'use client';

import { Ticket } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function EmptyBookings() {
  const router = useRouter();

  return (
    <div className="text-center py-20 bg-foreground/5 rounded-3xl border border-foreground/5 border-dashed">
      <Ticket size={48} className="mx-auto mb-4 opacity-50 text-foreground-muted" />
      <p className="text-foreground-muted">You have no bookings yet.</p>
      <button 
        onClick={() => router.push('/customer/search')}
        className="mt-6 px-6 py-3 bg-cyan-500/10 text-cyan-500 font-medium rounded-xl hover:bg-cyan-500/20 transition-colors"
      >
        Find a Service
      </button>
    </div>
  );
}
