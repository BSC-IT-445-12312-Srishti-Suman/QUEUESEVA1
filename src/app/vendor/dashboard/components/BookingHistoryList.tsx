'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Clock, CheckCircle2, XCircle, UserMinus, Calendar } from 'lucide-react';
import { BookingService } from '@/services/bookingService';
import { Booking, Shop, Slot } from '@/lib/firebase/db';
import { formatSlotDate, formatSlotTime } from '@/lib/utils/formatters';

type HistoryBooking = Booking & { shopData?: Shop; slotData?: Slot };

interface BookingHistoryListProps {
  shopId: string;
}

export default function BookingHistoryList({ shopId }: BookingHistoryListProps) {
  const [history, setHistory] = useState<HistoryBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Booking['status'] | 'all'>('all');

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const data = await BookingService.getVendorHistory(shopId);
        setHistory(data as HistoryBooking[]);
      } catch (error) {
        console.error("Failed to fetch history", error);
      } finally {
        setLoading(false);
      }
    };

    if (shopId) fetchHistory();
  }, [shopId]);

  const filteredHistory = history.filter(booking => {
    const matchesSearch = 
      (booking.userName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.tokenNumber.toString().includes(searchQuery);
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="glass-panel p-8 space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 bg-foreground/5 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'completed': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'cancelled': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      case 'no-show': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'serving': return 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20';
      default: return 'text-foreground-muted bg-foreground/5 border-foreground/10';
    }
  };

  const getStatusIcon = (status: Booking['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle2 size={14} />;
      case 'cancelled': return <XCircle size={14} />;
      case 'no-show': return <UserMinus size={14} />;
      default: return <Clock size={14} />;
    }
  };

  return (
    <div className="glass-panel p-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
        <div>
          <h2 className="text-2xl font-bold">Booking History</h2>
          <p className="text-sm text-foreground-muted">View and filter all past customer visits</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative flex-grow sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={16} />
            <input 
              type="text" 
              placeholder="Search name or token..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-medium"
            />
          </div>

          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as Booking['status'] | 'all')}
            className="px-4 py-2.5 text-sm bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-medium capitalize"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no-show">No-Show</option>
            <option value="serving">Serving</option>
            <option value="waiting">Waiting</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredHistory.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="py-12 text-center text-foreground-muted bg-foreground/5 rounded-2xl border border-foreground/5 border-dashed"
            >
              <p className="font-medium">No history found matching your filters.</p>
            </motion.div>
          ) : (
            filteredHistory.map((booking, idx) => (
              <motion.div
                key={booking.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-2xl border border-border bg-card/40 hover:bg-card/60 transition-all gap-4"
              >
                <div className="flex items-center space-x-5">
                  <div className="w-14 h-14 rounded-2xl bg-foreground/5 flex items-center justify-center font-black text-xl text-foreground/60 group-hover:text-cyan-500 transition-colors">
                    #{booking.tokenNumber}
                  </div>
                  
                  <div>
                    <p className="font-bold text-lg leading-tight mb-1">{booking.userName || 'Walk-in Customer'}</p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground-muted">
                        <Calendar size={12} className="text-cyan-500" />
                        <span>{formatSlotDate(booking.slotData?.date || '')}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground-muted">
                        <Clock size={12} className="text-violet-500" />
                        <span>{formatSlotTime(booking.slotData?.startTime || '')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold capitalize ${getStatusColor(booking.status)}`}>
                  {getStatusIcon(booking.status)}
                  {booking.status}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
