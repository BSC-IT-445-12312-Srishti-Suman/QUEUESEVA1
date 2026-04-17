import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, MessageSquare } from 'lucide-react';

interface NoShowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  customerName: string;
  tokenNumber: number;
}

export default function NoShowModal({ isOpen, onClose, onConfirm, customerName, tokenNumber }: NoShowModalProps) {
  const [reason, setReason] = useState('');

  const predefinedReasons = [
    'Customer did not arrive',
    'Unable to reach phone',
    'Late by more than 15 mins',
    'Customer cancelled via call'
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-xl"
          />
        
        <motion.div
           initial={{ opacity: 0, scale: 0.9, y: 20 }}
           animate={{ opacity: 1, scale: 1, y: 0 }}
           exit={{ opacity: 0, scale: 0.9, y: 20 }}
           className="relative w-full max-w-md bg-card border border-border shadow-2xl rounded-2xl overflow-hidden"
         >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-2 text-rose-500">
                <AlertCircle size={20} />
                <h3 className="font-bold text-lg">Mark as No-Show</h3>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-foreground/5 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <p className="text-foreground-muted mb-6">
              Are you sure you want to mark <span className="text-foreground font-semibold">#{tokenNumber} - {customerName}</span> as no-show? This will remove them from the active queue.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground-muted mb-2 block">Quick Reasons</label>
                <div className="flex flex-wrap gap-2">
                  {predefinedReasons.map(r => (
                    <button
                      key={r}
                      onClick={() => setReason(r)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                        reason === r 
                          ? 'bg-rose-500/10 border-rose-500/50 text-rose-500' 
                          : 'bg-foreground/5 border-transparent text-foreground-muted hover:border-foreground/20'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground-muted mb-2 block flex items-center gap-2">
                  <MessageSquare size={14} />
                  Comment (Optional)
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Additional details..."
                  className="w-full bg-input border border-border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30 min-h-[80px]"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl font-medium border border-foreground/10 hover:bg-foreground/5 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => onConfirm(reason || 'No-show')}
                className="flex-2 bg-rose-500 text-white py-3 px-6 rounded-xl font-medium hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20"
              >
                Confirm No-Show
              </button>
            </div>
          </div>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
}
