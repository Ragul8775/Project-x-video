import React from "react";
import { SiSolana } from "react-icons/si";

type ProgressBarProps = {
  current: number;
  total: number;
};

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percentage = (current / total) * 100;

  return (
    <div className=" w-full font-chakra">
      <div className="flex justify-between items-center  text-sm font-semibold">
        <div className="flex items-center justify-start gap-1 mb-1">
          <div className="flex  items-center gap-1">
            <h1 className="text-white  text-sm flex items-center">
              {current.toFixed(2)}
            </h1>
            <SiSolana
              size={12}
              className="text-white inline-block align-middle"
            />
          </div>
          <span className="text-gray-400 ">/</span>
          <div className="flex items-center gap-1">
            <h1 className="text-white/80 text-sm">{total.toFixed(2)}</h1>
            <SiSolana size={12} className="text-white/80" />
          </div>
        </div>
        <div className="text-gray-400">{percentage.toFixed(2)}%</div>
      </div>
      <div className="relative w-full h-3 bg-[#282E3D] rounded-full overflow-hidden">
        <div
          className="absolute h-full bg-[#0EC97F] transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
