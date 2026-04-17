import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, Phone, User, Clock, Loader2, AlertCircle } from 'lucide-react';
import { vendorService } from '@/services/vendorService';
import { Slot } from '@/lib/firebase/db';
import { formatDateLocal } from '@/lib/utils/slot-utils';

interface ManualBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  shopId: string;
  onSuccess: () => void;
}

export default function ManualBookingModal({ isOpen, onClose, shopId, onSuccess }: ManualBookingModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchSlots = async () => {
    if (!shopId) return;
    setLoading(true);
    try {
      const today = formatDateLocal(new Date());
      const availableSlots = await vendorService.getAvailableSlots(shopId, today);
      setSlots(availableSlots.sort((a,b) => a.startTime.localeCompare(b.startTime)));
      if (availableSlots.length > 0) {
        setSelectedSlotId(availableSlots[0].id!);
      }
    } catch (err) {
      console.error("Error fetching slots", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && shopId) {
      fetchSlots();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, shopId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !selectedSlotId) return;

    setSaving(true);
    try {
      await vendorService.addManualBooking(shopId, selectedSlotId, name, phone);
      setName('');
      setPhone('');
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error adding manual booking", err);
    } finally {
      setSaving(false);
    }
  };

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
          <form onSubmit={handleSubmit} className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-2 text-cyan-500">
                <div className="w-8 h-8 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                  <UserPlus size={18} />
                </div>
                <h3 className="font-bold text-lg">Add Walk-in Customer</h3>
              </div>
              <button type="button" onClick={onClose} className="p-2 hover:bg-foreground/5 rounded-full transition-colors text-foreground-muted">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-foreground-muted mb-2 block flex items-center gap-2">
                  <User size={12} className="text-cyan-500" />
                  Customer Name
                </label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full bg-input border border-border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-widest text-foreground-muted mb-2 block flex items-center gap-2">
                  <Phone size={12} className="text-cyan-500" />
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 9876543210"
                  className="w-full bg-input border border-border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all font-mono"
                />
              </div>

              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-black uppercase tracking-widest text-foreground-muted flex items-center gap-2">
                    <Clock size={12} className="text-cyan-500" />
                    Select Slot
                  </label>
                  <button 
                    type="button"
                    onClick={fetchSlots}
                    disabled={loading}
                    className="text-[10px] uppercase font-black tracking-widest text-cyan-500 hover:text-cyan-400 disabled:opacity-50 transition-colors flex items-center gap-1"
                  >
                    <Loader2 size={10} className={loading ? 'animate-spin' : ''} />
                    Refresh
                  </button>
                </div>
                {loading ? (
                  <div className="w-full bg-input border border-border rounded-xl p-3 flex items-center gap-3 shadow-inner">
                    <Loader2 className="animate-spin text-cyan-500" size={16} />
                    <span className="text-xs text-foreground-muted">Checking availability...</span>
                  </div>
                ) : (
                  <div className="relative group">
                    <select
                      required
                      value={selectedSlotId}
                      onChange={(e) => setSelectedSlotId(e.target.value)}
                      className="w-full bg-input border border-border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 appearance-none transition-all pr-10 cursor-pointer hover:border-cyan-500/30"
                    >
                      {slots.length === 0 ? (
                        <option value="" className="bg-card">No slots found for today</option>
                      ) : (
                        slots.map(slot => (
                          <option key={slot.id} value={slot.id} className="bg-card">
                            {slot.startTime} ({slot.currentBookings} booked)
                          </option>
                        ))
                      )}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-foreground-muted group-hover:text-cyan-500 transition-colors">
                      <Clock size={14} />
                    </div>
                  </div>
                )}
                {slots.length === 0 && !loading && (
                  <div className="mt-2 p-2 bg-rose-500/5 border border-rose-500/10 rounded-lg">
                    <p className="text-[10px] text-rose-400 font-medium flex items-center gap-1.5 uppercase tracking-wider">
                      <AlertCircle size={10} />
                      No slots generated for today&apos;s date yet.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl font-medium border border-foreground/10 hover:bg-foreground/5 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || !name || !selectedSlotId}
                className="flex-2 bg-gradient-to-r from-cyan-500 to-violet-500 text-white py-3 px-6 rounded-xl font-medium hover:shadow-lg hover:shadow-cyan-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 className="animate-spin" size={18} /> : <UserPlus size={18} />}
                Add to Queue
              </button>
            </div>
          </form>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
}
