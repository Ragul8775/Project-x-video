"use client";
import { useEffect, useState } from "react";

type AnimatedButtonProps = {
  isLoading: boolean;
  steps: string[];
};

export default function AnimatedButton({
  isLoading,
  steps,
}: AnimatedButtonProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setCurrentStep((prevStep) => (prevStep + 1) % steps.length);
      }, 2000);
      return () => clearInterval(interval);
    } else {
      setCurrentStep(0); // Reset to the first step when loading stops
    }
  }, [isLoading, steps]);

  return (
    <div className="flex flex-col h-full justify-end">
      <div className="relative w-full group">
        <button
          type="submit"
          className="relative w-full py-4 rounded-md font-semibold text-lg text-white 
                   overflow-hidden bg-gradient-to-r from-purple-500 via-cyan-500 to-yellow-500 
                   bg-size-200 bg-pos-0 animate-gradient-move"
        >
          <div className="relative z-10 flex items-center justify-center gap-4">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader />
                <p className="text-sm min-w-[170px] text-center">
                  {steps[currentStep]}
                </p>
              </div>
            ) : (
              <span className="text-lg">Deploy</span>
            )}
          </div>

          {/* Gradient Overlay Shapes */}
          <div
            className="absolute w-16 h-16 rounded-full bg-purple-500/70 blur-lg 
                        group-hover:-translate-x-8 group-hover:-translate-y-8 
                        transition-transform duration-700 ease-in-out 
                        animate-shape-1 group-hover:animate-none"
          ></div>
          <div
            className="absolute w-16 h-16 rounded-full bg-cyan-500/70 blur-lg 
                        group-hover:translate-x-8 group-hover:translate-y-8 
                        transition-transform duration-700 ease-in-out 
                        animate-shape-2 group-hover:animate-none"
          ></div>
          <div
            className="absolute w-16 h-16 rounded-full bg-yellow-500/70 blur-lg 
                        group-hover:-translate-x-8 group-hover:translate-y-8 
                        transition-transform duration-700 ease-in-out 
                        animate-shape-3 group-hover:animate-none"
          ></div>
          <div
            className="absolute w-16 h-16 rounded-full bg-blue-500/70 blur-lg 
                        group-hover:translate-x-8 group-hover:-translate-y-8 
                        transition-transform duration-700 ease-in-out 
                        animate-shape-4 group-hover:animate-none"
          ></div>
        </button>
      </div>
    </div>
  );
}
const Loader = () => (
  <div className="h-6 w-6 border-4 border-t-purple-400 rounded-full animate-spin"></div>
);
