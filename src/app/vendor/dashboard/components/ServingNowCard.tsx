import { motion } from 'framer-motion';
import { ArrowRightCircle, Play, UserX, Clock, Phone } from 'lucide-react';
import { EnhancedBooking } from '../hooks/useVendorDashboard';

interface ServingNowCardProps {
  currentlyServing: EnhancedBooking | undefined;
  waitingList: EnhancedBooking[];
  onAdvance: (id: string) => void;
  onStart: (id: string) => void;
  onNoShow: (booking: EnhancedBooking) => void;
}

export default function ServingNowCard({ currentlyServing, waitingList, onAdvance, onStart, onNoShow }: ServingNowCardProps) {
  return (
    <div className="md:col-span-2 glass-panel p-8 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-violet-500/5 z-0"></div>
      <div className="absolute w-64 h-64 bg-cyan-500/20 rounded-full blur-[80px] -top-10 -right-10 pointer-events-none group-hover:bg-cyan-500/30 transition-all duration-700"></div>
      
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-xl font-semibold mb-1">Serving Now</h2>
            <p className="text-sm text-foreground-muted">Live queue controller</p>
          </div>
          <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-500 text-sm font-medium border border-cyan-500/20">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
            <span>Live Sync</span>
          </div>
        </div>

        {currentlyServing ? (
          <motion.div 
            key="serving-active"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-6"
          >
            {/* Huge Token Number - Only once here */}
            <div className="text-8xl md:text-9xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-cyan-500 to-violet-500 mb-2 drop-shadow-xl">
              #{currentlyServing.tokenNumber}
            </div>
            
            <div className="mb-8 text-center">
              <p className="text-2xl font-bold text-foreground">{currentlyServing.userName || 'Customer'}</p>
              <div className="flex items-center justify-center gap-4 mt-2">
                 {currentlyServing.slotData && (
                   <div className="flex items-center gap-1.5 text-foreground-muted text-sm">
                     <Clock size={14} />
                     <span>{currentlyServing.slotData.startTime}</span>
                   </div>
                 )}
                 {currentlyServing.showContactToVendor && currentlyServing.userPhone && (
                   <div className="flex items-center gap-1.5 text-cyan-500 text-sm font-medium">
                     <Phone size={14} />
                     <span>{currentlyServing.userPhone}</span>
                   </div>
                 )}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <button 
                onClick={() => onAdvance(currentlyServing.id!)}
                className="flex-3 flex items-center space-x-3 bg-cyan-600 text-white py-4 px-8 rounded-2xl font-semibold text-lg hover:bg-cyan-700 transition-all hover:-translate-y-1 justify-center group/btn shadow-xl shadow-cyan-600/20"
              >
                <span>Next Customer</span>
                <ArrowRightCircle className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
              
              <button 
                onClick={() => onNoShow(currentlyServing)}
                className="flex-1 flex items-center space-x-2 bg-rose-500/10 text-rose-500 border border-rose-500/20 py-4 px-6 rounded-2xl font-semibold hover:bg-rose-500 hover:text-white transition-all hover:-translate-y-1 justify-center group/noshow"
              >
                <UserX size={20} className="group-hover/noshow:scale-110 transition-transform" />
                <span className="sm:hidden lg:inline">No-Show</span>
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 flex-1">
            <div className="w-20 h-20 rounded-full bg-foreground/5 flex items-center justify-center mb-4">
              <Clock className="text-foreground-muted" size={32} />
            </div>
            <p className="text-foreground-muted text-lg text-center max-w-sm mb-6">
              No active ticket. Call the next person in line to begin service.
            </p>
            <button
              onClick={() => waitingList[0]?.id && onStart(waitingList[0].id)}
              disabled={waitingList.length === 0}
              className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-violet-500 text-white py-4 px-10 rounded-2xl font-bold text-lg hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1"
            >
              <Play size={20} fill="currentColor" />
              <span>Start Queue</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
