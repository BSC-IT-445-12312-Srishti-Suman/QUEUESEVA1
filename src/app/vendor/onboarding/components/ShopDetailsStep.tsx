import { useState } from 'react';
import { Store, Hash, Tag, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FormDropdown } from './FormDropdown';
import { CATEGORIES } from '../constants';
import { checkShopNumberUnique } from '@/lib/firebase/db';

import { OnboardingData } from '../hooks/useOnboardingForm';

interface ShopDetailsStepProps {
  formData: OnboardingData;
  updateField: <K extends keyof OnboardingData>(field: K, value: OnboardingData[K]) => void;
  onNext: () => void;
}

export function ShopDetailsStep({ formData, updateField, onNext }: ShopDetailsStepProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isComplete = formData.name && formData.category && formData.shopNumber;

  const handleNext = async () => {
    if (!isComplete) return;
    
    setLoading(true);
    setError(null);
    try {
      const isUnique = await checkShopNumberUnique(formData.shopNumber);
      if (isUnique) {
        onNext();
      } else {
        setError('This Shop Number is already registered. Please use a unique identifier.');
      }
    } catch (err) {
      console.error('Error validating shop number:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <div className="space-y-1.5">
        <label className="block text-xs font-bold uppercase tracking-wider text-foreground/60 ml-1">Store Name</label>
        <div className="relative group">
          <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted group-focus-within:text-cyan-500 transition-colors" size={20} />
          <input
            type="text"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-input text-foreground focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all text-base placeholder:text-foreground-muted/50"
            placeholder="e.g. Apollo Hospital Clinic"
            autoFocus
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-bold uppercase tracking-wider text-foreground/60 ml-1">Shop No. / identifier</label>
        <div className="relative group">
          <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted group-focus-within:text-cyan-500 transition-colors" size={20} />
          <input
            type="text"
            value={formData.shopNumber}
            onChange={(e) => {
              updateField('shopNumber', e.target.value);
              if (error) setError(null);
            }}
            className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all text-base placeholder:text-foreground-muted/50 bg-input ${
              error ? 'border-red-500 ring-2 ring-red-500/20' : 'border-border focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none'
            }`}
            placeholder="e.g. 24 or Ground Floor"
          />
        </div>
        <AnimatePresence>
          {error && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-xs text-red-500 font-medium flex items-center gap-1.5 ml-1"
            >
              <AlertCircle size={12} />
              {error}
            </motion.p>
          )}
        </AnimatePresence>
        {!error && <p className="text-xs text-foreground-muted font-medium ml-1">Helps customers distinguish between shops with similar names.</p>}
      </div>

      <FormDropdown
        label="Shop Category"
        options={CATEGORIES}
        value={formData.category}
        onChange={(val) => updateField('category', val)}
        icon={<Tag size={20} />}
        placeholder="Select your business type"
      />

      <div className="pt-4 flex justify-end">
        <button
          disabled={!isComplete || loading}
          onClick={handleNext}
          className="flex items-center space-x-2 bg-cyan-600 text-white py-3.5 px-8 rounded-xl font-bold hover:bg-cyan-700 transition-all disabled:opacity-50 disabled:grayscale group shadow-lg min-w-[140px] justify-center"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <>
              <span>Continue</span>
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
