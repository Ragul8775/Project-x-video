import React from "react";

type Option = {
  label: string;
  className?: string;
};

type TabSwitcherProps = {
  options: Option[];
  tab: string;
  setTab: (label: string) => void;
};

const TabSwitcher: React.FC<TabSwitcherProps> = ({ options, tab, setTab }) => {
  return (
    <div className="flex gap-2 border-2 border-white/5 rounded-[10px] max-w-[368px] sm:max-w-none sm:w-fit mx-auto mb-5 sm:mb-6 sm:mx-0 p-2">
      {options.map((option: Option, index: number) => (
        <button
          key={index}
          onClick={() => setTab(option.label)}
          className={`
            w-28 py-2 rounded-[10px] text-sm font-semibold font-inter 
            transition-all duration-300 ease-in-out flex-1 capitalize
            ${tab === option.label ? "bg-[#202329]" : "hover:text-gray-300"}
          `}
        >
          <span
            className={`
            ${option.className ? "agent_gradient" : ""}
            ${
              tab === option.label
                ? "text-white/90"
                : "text-white/50 hover:text-white/75 transition-all duration-300 ease-in-out"
            }
          `}
          >
            {option.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default TabSwitcher;
