import Image from "next/image";

import { ProgressBar } from "@/components/ui/ProgressBar";
import { truncateAddress } from "@/utils/helper";
import { Agent, Allocation } from "@/utils/types";

interface AgentProps {
  agents: (Agent & { allocation?: Allocation })[];
  onAgentClick: (agentId: number) => void;
}

export default function AgentTab({ agents, onAgentClick }: AgentProps) {
  return (
    <div className="">
      {agents.length > 0 ? (
        <>
          <div className="hidden sm:grid grid-cols-12 items-center text-xs text-gray-400 mb-4 px-4">
            <div className="col-span-5 md:col-span-7"></div>
            <div className="col-span-3 md:col-span-2 text-left">
              My Allocation
            </div>
            <div className="col-span-4 md:col-span-3 text-left">Progress</div>
          </div>

          <div className="space-y-4">
            {agents.map((agent, index) => (
              <div
                key={index}
                onClick={() => onAgentClick(agent.id)}
                className="flex flex-col mx-auto sm:mx-0 bg-[#14151E] hover:bg-[#BEB6FF]/10 transition-all duration-300 ease-in-out rounded-lg sm:p-4 sm:grid grid-cols-12 items-center max-w-[368px] sm:max-w-full w-full"
              >
                {/* Agent Info */}
                <div className="col-span-5 md:col-span-7 flex flex-col sm:flex-row items-center sm:gap-4 pt-4 sm:pt-0">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <Image
                      src={agent.imageUrl}
                      alt={agent.name}
                      width={44}
                      height={44}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex gap-1.5 items-center font-akshar mt-2.5 mb-3 sm:my-0">
                      <h3 className="text-white/80 text-sm font-semibold">
                        {agent.name}
                      </h3>
                      <span className="text-[#7F7F7F] text-[13px]">
                        {agent.symbol}
                      </span>
                    </div>
                    <div className="hidden md:block text-[#94A3B8] font-bold font-ibmMono text-xs">
                      Created by {truncateAddress(agent.creatorWallet)}
                    </div>
                  </div>
                </div>

                {/* Allocation Amount */}
                <div className="w-full text-center col-span-3 md:col-span-2 sm:text-left text-[#94A3B8] font-bold font-ibmMono mb-4 sm:mb-0">
                  {agent.allocation
                    ? agent.allocation.tokenAmount.toNumber() / 10 ** 6
                    : "0"}{" "}
                  {agent.symbol}
                </div>
                {/* Progress Section */}
                <div className="w-full px-5 py-4 bg-[#BEB6FF]/5 col-span-4 md:col-span-3 sm:p-0 sm:bg-transparent">
                  {agent.allocation?.claimed ? (
                    <div className="text-white text-center bg-[#192634] rounded-md py-2 font-alata">
                      Claimed
                    </div>
                  ) : (
                    <div className="">
                      <ProgressBar
                        current={
                          (((agent.data?.soldSupply?.toNumber() ?? 0) /
                            10 ** 6) *
                            (agent.data?.price?.toNumber() ?? 0)) /
                          10 ** 9
                        }
                        total={
                          (((agent.data?.maxSupply?.toNumber() ?? 0) /
                            10 ** 6) *
                            (agent.data?.price?.toNumber() ?? 0)) /
                          10 ** 9
                        }
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center h-48">
          <p className="text-gray-400 text-lg">No agents found</p>
        </div>
      )}
    </div>
  );
}
