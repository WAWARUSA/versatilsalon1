'use client';

import { motion } from 'framer-motion';

interface StepSelectorProps {
  currentStep: number;
  totalSteps: number;
  steps: { number: number; title: string }[];
}

export default function StepSelector({ currentStep, totalSteps, steps }: StepSelectorProps) {
  return (
    <div className="mb-8 sm:mb-12">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-400">
            Paso {currentStep} de {totalSteps}
          </span>
          <span className="text-sm font-medium text-[#c9a857]">
            {Math.round((currentStep / totalSteps) * 100)}%
          </span>
        </div>
        <div className="w-full h-2 bg-[#151414] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-[#c9a857] to-[#d4af37] rounded-full"
          />
        </div>
      </div>

      {/* Step Indicators */}
      <div className="hidden md:flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = step.number === currentStep;
          const isCompleted = step.number < currentStep;
          const isUpcoming = step.number > currentStep;

          return (
            <div key={step.number} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex flex-col items-center flex-1">
                <motion.div
                  initial={false}
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    backgroundColor: isActive
                      ? '#c9a857'
                      : isCompleted
                      ? '#c9a857'
                      : '#151414',
                    borderColor: isActive || isCompleted ? '#c9a857' : '#333',
                  }}
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center
                    border-2 transition-all duration-300
                    ${isActive ? 'ring-4 ring-[#c9a857]/30' : ''}
                  `}
                >
                  {isCompleted ? (
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 text-[#1c1b1b]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </motion.svg>
                  ) : (
                    <span
                      className={`font-bold ${
                        isActive ? 'text-[#1c1b1b]' : 'text-gray-400'
                      }`}
                    >
                      {step.number}
                    </span>
                  )}
                </motion.div>
                <span
                  className={`mt-2 text-xs font-medium text-center max-w-[100px] ${
                    isActive ? 'text-[#c9a857]' : isCompleted ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  {step.title}
                </span>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 -mt-6">
                  <div
                    className={`h-full transition-colors duration-300 ${
                      isCompleted ? 'bg-[#c9a857]' : 'bg-[#151414]'
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile Step Indicator */}
      <div className="md:hidden text-center">
        <div className="inline-flex items-center justify-center space-x-2 mb-2">
          {steps.map((step) => {
            const isActive = step.number === currentStep;
            const isCompleted = step.number < currentStep;

            return (
              <div
                key={step.number}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'w-8 bg-[#c9a857]'
                    : isCompleted
                    ? 'bg-[#c9a857]'
                    : 'bg-[#151414]'
                }`}
              />
            );
          })}
        </div>
        <p className="text-sm text-gray-400">
          {steps.find((s) => s.number === currentStep)?.title}
        </p>
      </div>
    </div>
  );
}

