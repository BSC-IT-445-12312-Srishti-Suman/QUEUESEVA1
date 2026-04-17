import { motion, AnimatePresence } from 'framer-motion';
import { Search, UserX, Phone, Clock, CheckCircle2, Play } from 'lucide-react';
import { EnhancedBooking } from '../hooks/useVendorDashboard';

interface QueueListProps {
  waitingList: EnhancedBooking[];
  currentlyServingId?: string;
  onStart: (id: string) => void;
  onNoShow: (booking: EnhancedBooking) => void;
  searchQuery: string;
  onSearchChange: (val: string) => void;
}

export default function QueueList({ 
  waitingList, 
  currentlyServingId,
  onStart, 
  onNoShow, 
  searchQuery, 
  onSearchChange 
}: QueueListProps) {
  return (
    <div className="glass-panel p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold">Waiting Queue</h2>
          <p className="text-sm text-foreground-muted">Manage upcoming customers</p>
        </div>
        
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={16} />
          <input 
            type="text" 
            placeholder="Search name, token..." 
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-medium"
          />
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {waitingList.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 text-center text-foreground-muted bg-foreground/5 rounded-2xl border border-foreground/5 border-dashed"
            >
              <div className="flex flex-col items-center gap-3">
                <CheckCircle2 size={32} className="text-foreground-muted/30" />
                <p className="font-medium">{searchQuery ? "No matches found" : "The waiting list is empty."}</p>
              </div>
            </motion.div>
          ) : (
            waitingList.map((booking, idx) => (
              <motion.div
                key={booking.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-2xl border border-border bg-card/40 hover:bg-card/80 hover:border-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/5 transition-all gap-4"
              >
                <div className="flex items-center space-x-5">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-foreground/5 to-foreground/10 flex items-center justify-center font-black text-2xl text-foreground/80 transition-all duration-500">
                      #{booking.tokenNumber}
                    </div>
                    {booking.isWaitlist && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 border-2 border-background rounded-full" title="Waitlisted" />
                    )}
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-lg">{booking.userName || 'Walk-in Customer'}</p>
                      {booking.isWaitlist && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-amber-500/10 text-amber-600 rounded-md border border-amber-500/20">Waitlist</span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                      {booking.slotData && (
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground-muted">
                          <Clock size={12} className="text-cyan-500" />
                          <span>{booking.slotData.date} | {booking.slotData.startTime}</span>
                        </div>
                      )}
                      
                      {booking.showContactToVendor && booking.userPhone && (
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground-muted">
                          <Phone size={12} className="text-violet-500" />
                          <span>{booking.userPhone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button 
                    onClick={() => onNoShow(booking)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-xs font-bold text-rose-500 hover:text-white bg-rose-500/5 hover:bg-rose-500 px-4 py-2.5 rounded-xl border border-rose-500/10 transition-all"
                  >
                    <UserX size={14} />
                    <span>No-Show</span>
                  </button>
                  
                  {!currentlyServingId && idx === 0 && (
                    <button 
                      onClick={() => onStart(booking.id!)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-700 px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-cyan-600/20"
                    >
                      <Play size={14} fill="currentColor" />
                      <span>Call Now</span>
                    </button>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
