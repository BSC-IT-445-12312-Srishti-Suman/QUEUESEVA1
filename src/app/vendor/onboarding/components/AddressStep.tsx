'use client';

import { useState, useEffect, useCallback } from 'react';
import { Building, Globe, Mail, MapPin, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { FormDropdown } from './FormDropdown';
import { INDIAN_STATES } from '../constants';
import { OnboardingData } from '../hooks/useOnboardingForm';

interface AddressStepProps {
  formData: OnboardingData;
  updateField: <K extends keyof OnboardingData>(field: K, value: OnboardingData[K]) => void;
  onNext: () => void;
  onPrev: () => void;
}

import { LocationService } from '@/lib/services/location-service';

export function AddressStep({ formData, updateField, onNext, onPrev }: AddressStepProps) {
  const [cities, setCities] = useState<string[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);

  const fetchCities = useCallback(async (state: string) => {
    if (!state) {
      setCities([]);
      return;
    }
    setLoadingCities(true);
    try {
      const cityList = await LocationService.fetchCitiesByState(state);
      setCities(cityList);
    } catch (error) {
      console.error('Error fetching cities in AddressStep:', error);
      setCities([]);
    } finally {
      setLoadingCities(false);
    }
  }, []);

  useEffect(() => {
    if (formData.state) {
      fetchCities(formData.state);
    }
  }, [formData.state, fetchCities]);

  const handleStateChange = (state: string) => {
    updateField('state', state);
    updateField('city', ''); // Reset city when state changes
  };

  const isComplete = formData.address && formData.city && formData.state && formData.zipCode;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <div className="space-y-1.5">
        <label className="block text-xs font-bold uppercase tracking-wider text-foreground/60 ml-1">Full Address</label>
        <div className="relative group">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted group-focus-within:text-cyan-500 transition-colors" size={20} />
          <input
            type="text"
            value={formData.address}
            onChange={(e) => updateField('address', e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-foreground/10 bg-black/40 text-foreground focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all text-base placeholder:text-foreground-muted/50"
            placeholder="No. 12, Main Street, Area"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormDropdown
          label="State"
          options={INDIAN_STATES}
          value={formData.state}
          onChange={handleStateChange}
          icon={<Globe size={18} />}
          placeholder="Select State"
        />

        <FormDropdown
          label="City"
          options={cities}
          value={formData.city}
          onChange={(city) => updateField('city', city)}
          icon={<Building size={18} />}
          placeholder={formData.state ? "Select City" : "Select State first"}
          disabled={!formData.state}
          loading={loadingCities}
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-bold uppercase tracking-wider text-foreground/60 ml-1">ZIP / PIN Code</label>
        <div className="relative group">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted group-focus-within:text-cyan-500 transition-colors" size={20} />
          <input
            type="text"
            value={formData.zipCode}
            onChange={(e) => updateField('zipCode', e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-foreground/10 bg-black/40 text-foreground focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all text-base placeholder:text-foreground-muted/50"
            placeholder="400001"
            maxLength={6}
          />
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
          disabled={!isComplete}
          onClick={onNext}
          className="flex items-center space-x-2 bg-foreground text-background py-3.5 px-8 rounded-xl font-bold hover:bg-foreground/90 transition-all disabled:opacity-50 disabled:grayscale group shadow-lg"
        >
          <span>Continue</span>
          <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
        </button>
      </div>
    </motion.div>
  );
}
