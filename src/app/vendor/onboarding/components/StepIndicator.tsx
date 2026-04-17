'use client';

import { motion } from 'framer-motion';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  titles: string[];
}

export function StepIndicator({ currentStep, totalSteps, titles }: StepIndicatorProps) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-end mb-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            {titles[currentStep - 1]}
          </h1>
          <p className="text-sm text-foreground-muted mt-1 font-medium italic">
            Step {currentStep} of {totalSteps}
          </p>
        </div>
      </div>
      
      <div className="relative h-1.5 w-full bg-foreground/5 rounded-full overflow-hidden">
        <motion.div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-violet-500"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
          transition={{ duration: 0.6, ease: "circOut" }}
        />
      </div>
      
      <div className="flex justify-between mt-3 px-1">
        {[...Array(totalSteps)].map((_, i) => (
          <div 
            key={i} 
            className={`w-2 h-2 rounded-full transition-all duration-500 ${
              i + 1 <= currentStep ? 'bg-cyan-500 scale-110 shadow-[0_0_8px_rgba(34,211,238,0.5)]' : 'bg-foreground/10'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
