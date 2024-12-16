"use client";
import { truncateAddress } from "@/utils/helper";
import { ProgressBar } from "../ui/ProgressBar";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Agent } from "@/utils/types";

export default function TokenCard({ agent }: { agent: Agent }) {
  const route = useRouter();

  const max = (agent?.data?.maxSupply?.toNumber() ?? 0) / 10 ** 6;
  const sold = (agent?.data?.soldSupply?.toNumber() ?? 0) / 10 ** 6;
  const price = (agent?.data?.price?.toNumber() ?? 0) / 10 ** 9;

  return (
    <div
      className="bg-[#14151E] group hover:bg-[#1E1E29] cursor-pointer rounded-lg pb-0 transition-all duration-300 ease-in-out flex flex-col min-h-[140px] max-w-[368px] w-full sm:w-[314px]"
      onClick={() => route.push(`/agent/${agent.id}`)}
    >
      <div className="flex items-center gap-3 px-5 pt-4 mb-6">
        <div
          className={`w-[44px] h-[44px] rounded-full object-cover overflow-hidden`}
        >
          <Image src={agent.imageUrl} alt={agent.name} width={44} height={44} />
        </div>
        <div>
          <div className="flex items-center gap-1.5 font-akshar">
            <h3 className="text-white/80 text-sm leading-none">{agent.name}</h3>
            <p className="text-[#7F7F7F] text-[13px] text-center leading-none">
              ${agent.symbol}
            </p>
          </div>
          <p className="text-[#94A3B8] text-xs mt-0.5 font-bold font-ibmMono">
            Created by {truncateAddress(agent.creatorWallet)}
          </p>
        </div>
      </div>
      <div className="relative">
        <p className="text-white/40 font-roboto text-xs leading-relaxed mb-4 px-5 line-clamp-2 min-h-[2.5rem]">
          {agent.description}
        </p>
        <div className="hidden absolute left-4 top-full mt-2 w-64 p-2 text-white text-xs rounded shadow-md z-50">
          {agent.description}
        </div>
      </div>
      {/* TODO: Show marketcap for graduated agents */}
      <div className=" text-xs text-[#94A3B8] bg-[#BEB6FF]/5 group-hover:bg-[#BEB6FF]/10 transition-all duration-300 ease-in-out size-full py-4 px-3 rounded-b-lg flex justify-center">
        <ProgressBar current={sold * price} total={max * price} />
      </div>
    </div>
  );
}
