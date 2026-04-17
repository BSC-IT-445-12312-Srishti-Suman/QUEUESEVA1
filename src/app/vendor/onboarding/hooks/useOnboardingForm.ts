import { useState } from 'react';

export interface OnboardingData {
  name: string;
  category: string;
  shopNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  slotDuration: number;
  maxCapacity: number;
}

export const useOnboardingForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingData>({
    name: '',
    category: '',
    shopNumber: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    slotDuration: 30,
    maxCapacity: 1,
  });

  const updateField = <K extends keyof OnboardingData>(field: K, value: OnboardingData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => Math.max(1, prev - 1));

  return {
    step,
    setStep,
    formData,
    updateField,
    nextStep,
    prevStep,
  };
};
