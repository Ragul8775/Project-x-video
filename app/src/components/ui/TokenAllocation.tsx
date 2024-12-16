import React from "react";
import { SiSolana } from "react-icons/si";
import { AllocationProgressBar } from "./AllocationProgressBar";
import { Agent, Allocation } from "@/utils/types";
import { getAllocationPercent } from "@/utils/helper";
const TokenAllocation = ({
  agent,
  allocations,
}: {
  agent: Agent;
  allocations: Allocation[];
}) => {
  const max = (agent?.data?.maxSupply?.toNumber() ?? 0) / 10 ** 6;
  const sold = (agent?.data?.soldSupply?.toNumber() ?? 0) / 10 ** 6;
  const price = (agent?.data?.price?.toNumber() ?? 0) / 10 ** 9;
  const progress = Math.round((sold / (max || 1)) * 100) + "%";

  return (
    <main>
      <section
        id="#token-allocation"
        className="bg-[#11141D] p-4 rounded-[10px]"
      >
        <div className="flex w-full items-center justify-between">
          <h1 className="font-lexend font-semibold text-xl text-[#CFD0D2] leading-5">
            Allocations
          </h1>
          <p className="font-inter text-gray-400 text-xs leading-3">
            {allocations.length} Holders
          </p>
        </div>

        <div className="flex w-full items-end justify-between mt-4">
          <div className="flex items-end gap-2 justify-start">
            <p className="hidden sm:block font-inter text-xs leading-5 text-[#94A3B8]">
              Graduate to Pump.fun when filled
            </p>
            <div className="flex items-center justify-start gap-1 font-chakra">
              {/* Current Amount with Icon */}
              <div className="flex  items-center gap-1">
                <h1 className="text-white  text-sm flex items-center">
                  {(sold * price).toFixed(2)}
                </h1>
                <SiSolana
                  size={12}
                  className="text-white inline-block align-middle"
                />
              </div>

              {/* Divider */}
              <span className="text-gray-400">/</span>

              {/* Total Amount with Icon */}
              <div className="flex items-center gap-1">
                <h1 className="text-white/80  text-sm">
                  {(max * price).toFixed(2)}
                </h1>
                <SiSolana size={12} className="text-white/80" />
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <h1 className="hidden sm:block font-inter text-base  text-[#94a3b8] leading-5]">
              Progress
            </h1>
            <p className="font-chakra text-[15px] font-semibold text-white">
              {progress}
            </p>
          </div>
        </div>
        <AllocationProgressBar current={sold} total={max} />
        <p className="block sm:hidden font-inter text-xs leading-5 text-[#94A3B8]">
          Graduate to Pump.fun when filled
        </p>
      </section>
      <section className="sm:hidden bg-[#D9D9D90D] text-[#94A3B8] flex items-center justify-center gap-1 py-1 px-2 text-xs rounded-[10px] mt-3">
        <h1>My Allocations</h1>
        <h1 className="agent_gradient">345,567</h1>
      </section>
      <section className="hidden py-6 sm:block">
        <h2 className="mb-4 text-xs text-gray-400 font-roboto">
          Holders Distribution
        </h2>

        {/* Holders List */}
        <div className="flex flex-col gap-2">
          {allocations.map((holder, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg bg-[#14151E] p-4 text-white"
              style={{
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              <span className="font-akshar text-sm text-[#C2C2C4] leading-5">
                {holder.user.toString()}
              </span>
              <span className="text-sm font-medium font-mono text-[#C2C2C4]">
                {getAllocationPercent(
                  agent?.data.maxSupply,
                  holder.tokenAmount
                )}
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default TokenAllocation;
