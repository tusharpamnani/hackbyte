import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from "framer-motion";

const LoadingIcon = () => {
  return (
    <div className="relative">
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="w-6 h-6"
        animate={{ rotate: 360 }}
        transition={{ 
          duration: 1, 
          repeat: Infinity, 
          ease: "linear"
        }}
      >
        {/* Outer circle */}
        <circle
          cx="12"
          cy="12"
          r="4"
          stroke="currentColor"
          strokeWidth="2"
          className="opacity-25"
          fill="none"
        />
        {/* Spinning arc */}
        <path
          d="M12 2C6.477 2 2 6.477 2 12"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      </motion.svg>
    </div>
  );
};

export default LoadingIcon;


const CheckFilled = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-6 h-6"
    >
      <path
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
        clipRule="evenodd"
      />
    </svg>
  );
};

type LoadingState = {
  text: string;
};

const LoaderCore = ({
  loadingStates,
  value = 0,
}: {
  loadingStates: LoadingState[];
  value?: number;
}) => {
  return (
    <div className="flex relative justify-start max-w-xl mx-auto flex-col mt-40">
      {loadingStates.map((loadingState, index) => {
        const distance = Math.abs(index - value);
        const opacity = Math.max(1 - distance * 0.2, 0);

        return (
          <motion.div
            key={index}
            className="text-left flex gap-2 mb-4"
            initial={{ opacity: 0, y: -(value * 40) }}
            animate={{ opacity: opacity, y: -(value * 40) }}
            transition={{ duration: 0.5 }}
          >
            <div>
              {index > value ? <LoadingIcon /> : <CheckFilled />}
            </div>
            <span className={`text-black dark:text-white ${value === index && 'text-black dark:text-lime-500 opacity-100'}`}>
              {loadingState.text}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
};

export const MultiStepLoader = ({
  loadingStates,
  loading,
  conditionalVariable,
  onComplete,
  onStep,
}: {
  loadingStates: LoadingState[];
  loading?: boolean;
  conditionalVariable: boolean;
  onComplete?: () => void;
  onStep?: (step: number) => void;
}) => {
  const [currentState, setCurrentState] = useState(0);
  const [shouldFadeOut, setShouldFadeOut] = useState(false);

  useEffect(() => {
    if (!loading) {
      setCurrentState(0);
      setShouldFadeOut(false);
      return;
    }

    let timeout: NodeJS.Timeout;

    if (currentState < 5) {
      timeout = setTimeout(() => {
        setCurrentState(prev => {
          const nextState = prev + 1;
          if (onStep) onStep(nextState);
          return nextState;
        });
      }, 3000);
    } else if (currentState === 5 && conditionalVariable) {
      timeout = setTimeout(() => {
        setCurrentState(prev => {
          const nextState = prev + 1;
          if (onStep) onStep(nextState);
          return nextState;
        });
      }, 100);
    } else if (currentState === 6) {
      timeout = setTimeout(() => {
        setShouldFadeOut(true);
        if (onComplete) {
          setTimeout(onComplete, 1000);
        }
      }, 1000);
    }

    return () => clearTimeout(timeout);
  }, [currentState, loading, conditionalVariable, onComplete, onStep]);

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldFadeOut ? 1 : 0.3 }}
          className="w-full h-full fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-2xl"
        >
          <div className="h-96 relative">
            <LoaderCore value={currentState} loadingStates={loadingStates} />
          </div>
          <div className="bg-gradient-to-t inset-x-0 z-20 bottom-0 bg-white dark:bg-black h-full absolute [mask-image:radial-gradient(900px_at_center,transparent_30%,white)]" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};