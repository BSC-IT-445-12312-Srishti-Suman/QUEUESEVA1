'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { createShop } from '@/lib/firebase/db';
import { Loader2 } from 'lucide-react';

import { StepIndicator } from './components/StepIndicator';
import { ShopDetailsStep } from './components/ShopDetailsStep';
import { AddressStep } from './components/AddressStep';
import { CapacityStep } from './components/CapacityStep';
import { useOnboardingForm } from './hooks/useOnboardingForm';

const STEP_TITLES = [
  'Basic Store Info',
  'Location Details',
  'Service Settings'
];

export default function VendorOnboarding() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const {
    step,
    formData,
    updateField,
    nextStep,
    prevStep
  } = useOnboardingForm();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/vendor/login');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await createShop({
        ownerId: user.uid,
        name: formData.name,
        category: formData.category,
        shopNumber: formData.shopNumber,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        slotDuration: formData.slotDuration,
        maxCapacity: formData.maxCapacity,
        avgCancellationRate: 0,
        ownerName: user.displayName || '',
        phoneNumber: user.phoneNumber || '',
      });
      router.push('/vendor/dashboard');
    } catch (error) {
      console.error('Error creating shop:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-cyan-500" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-cyan-500/5 relative overflow-hidden font-sans">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-violet-500/10 rounded-full blur-[100px]" />
      
      <div className="w-full max-w-xl relative z-10 bg-card p-6 md:p-10 overflow-visible shadow-2xl border border-border">
        <StepIndicator 
          currentStep={step} 
          totalSteps={3} 
          titles={STEP_TITLES} 
        />

        <AnimatePresence mode="wait">
          {step === 1 && (
            <ShopDetailsStep 
              key="step1"
              formData={formData} 
              updateField={updateField} 
              onNext={nextStep} 
            />
          )}

          {step === 2 && (
            <AddressStep 
              key="step2"
              formData={formData} 
              updateField={updateField} 
              onNext={nextStep} 
              onPrev={prevStep}
            />
          )}

          {step === 3 && (
            <CapacityStep 
              key="step3"
              formData={formData} 
              updateField={updateField} 
              onSubmit={handleSubmit} 
              onPrev={prevStep}
              loading={loading}
            />
          )}
        </AnimatePresence>

        {/* Support Text */}
        <p className="mt-8 text-center text-foreground-muted text-xs font-medium opacity-50">
          Need help? Contact support at <span className="text-cyan-500 cursor-pointer hover:underline">support@queueseva.com</span>
        </p>
      </div>
    </div>
  );
}
