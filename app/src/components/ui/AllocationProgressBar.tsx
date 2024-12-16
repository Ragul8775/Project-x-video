import React from "react";

interface AllocationProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

export const AllocationProgressBar: React.FC<AllocationProgressBarProps> = ({
  current,
  total,
  className = "",
}) => {
  const percentage = Math.min(Math.round((current / total) * 100), 100);

  return (
    <div className={`w-full ${className} my-2 sm:mt-4`}>
      <div className="relative h-4 sm:h-8 w-full overflow-hidden rounded-full bg-gray-900">
        {/* The progress bar fill */}
        <div
          className="
          h-full 
          bg-gradient-to-r from-[#1fcdf0] to-[#19ef99]
          transition-all duration-500 ease-in-out
        "
          style={{ width: `${percentage}%` }}
        />

        <div
          className="absolute top-0 h-full flex items-center pointer-events-none"
          style={{
            left: `${percentage}%`,
            transform: "translateX(-140%)",
          }}
        >
          <p className="hidden sm:block text-xs font-medium text-white">
            {percentage}%
          </p>
        </div>
      </div>
    </div>
  );
};
