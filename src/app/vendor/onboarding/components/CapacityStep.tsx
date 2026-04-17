'use client';

import { Clock, Users, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { SLOT_DURATIONS } from '../constants';

import { OnboardingData } from '../hooks/useOnboardingForm';

interface CapacityStepProps {
  formData: OnboardingData;
  updateField: <K extends keyof OnboardingData>(field: K, value: OnboardingData[K]) => void;
  onSubmit: () => void;
  onPrev: () => void;
  loading: boolean;
}

export function CapacityStep({ formData, updateField, onSubmit, onPrev, loading }: CapacityStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="space-y-4">
        <label className="flex items-center space-x-2 text-sm font-semibold text-foreground/80 uppercase tracking-wider">
          <Clock size={16} className="text-violet-500" />
          <span>Average Service Duration</span>
        </label>
        <div className="grid grid-cols-3 gap-3">
          {SLOT_DURATIONS.map(dur => (
            <button
              key={dur}
              type="button"
              onClick={() => updateField('slotDuration', dur)}
              className={`py-3 rounded-xl border text-center transition-all relative overflow-hidden ${
                formData.slotDuration === dur 
                  ? 'border-violet-500 bg-violet-500/10 text-violet-600 shadow-[0_0_20px_rgba(167,139,250,0.2)] scale-105 z-10' 
                  : 'border-border bg-card hover:bg-foreground/5 text-foreground/60'
              }`}
            >
              <span className="text-lg font-black">{dur}</span>
              <span className="text-[9px] block font-bold uppercase tracking-widest mt-0">Mins</span>
              {formData.slotDuration === dur && (
                <motion.div 
                  layoutId="active-dur"
                  className="absolute inset-0 border-2 border-violet-500/50 rounded-xl pointer-events-none"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3 p-5 rounded-2xl bg-foreground/5 border border-foreground/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-10">
          <Users size={60} />
        </div>
        
        <label className="flex items-center space-x-2 text-sm font-semibold text-foreground/80 uppercase tracking-wider">
          <Users size={16} className="text-cyan-500" />
          <span>Concurrent Capacity</span>
        </label>
        
        <p className="text-sm text-foreground-muted leading-relaxed max-w-[80%]">
          How many customers can your shop handle simultaneously in a <span className="text-foreground font-bold">{formData.slotDuration} min</span> window?
        </p>
        
        <div className="flex items-center justify-between py-2">
          <button 
            type="button"
            onClick={() => updateField('maxCapacity', Math.max(1, formData.maxCapacity - 1))}
            className="w-12 h-12 rounded-2xl border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-all text-xl font-black shadow-sm"
          >
            -
          </button>
          
          <div className="relative">
            <motion.div
              key={formData.maxCapacity}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-7xl font-black text-center text-transparent bg-clip-text bg-gradient-to-b from-cyan-400 to-indigo-600 tracking-tighter"
            >
              {formData.maxCapacity}
            </motion.div>
            <div className="text-[10px] text-center font-bold uppercase tracking-[0.2em] text-foreground-muted mt-[-10px]">
              Customers
            </div>
          </div>

          <button 
            type="button"
            onClick={() => updateField('maxCapacity', formData.maxCapacity + 1)}
            className="w-12 h-12 rounded-2xl border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-all text-xl font-black shadow-sm"
          >
            +
          </button>
        </div>
      </div>

      <div className="pt-4 flex justify-between items-center">
        <button
          onClick={onPrev}
          className="flex items-center space-x-2 text-foreground-muted hover:text-foreground font-semibold transition-colors group"
        >
          <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={18} />
          <span>Back</span>
        </button>
        
        <button
          onClick={onSubmit}
          disabled={loading}
          className="flex items-center space-x-3 bg-gradient-to-r from-cyan-500 via-indigo-500 to-violet-600 text-white py-3.5 px-8 rounded-xl font-black hover:shadow-[0_20px_40px_rgba(34,211,238,0.3)] transition-all disabled:opacity-70 active:scale-95 group overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <span>Launch Store</span>
              <Sparkles className="group-hover:rotate-12 transition-transform" size={18} />
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
