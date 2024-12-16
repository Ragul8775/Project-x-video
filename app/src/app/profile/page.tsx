"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useGlobalContext } from "@/context/GlobalContext";
import { getAllocations } from "@/utils/transactions";
import TabSwitcher from "@/components/ui/TabSwitcher";
import AgentTab from "@/components/agent/AgentTab";
import { SearchBar } from "@/components/ui/Search";
import { Agent, Allocation } from "@/utils/types";

export default function Home() {
  const router = useRouter();
  const tabParam =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("tab")
      : null;
  const { publicKey } = useWallet();
  const { agents } = useGlobalContext();
  const [agentsWithAllocations, setAgentsWithAllocations] = useState<
    (Agent & { allocation?: Allocation })[]
  >([]);
  const [tab, setTab] = useState(
    tabParam === "created" ? "created" : "participated"
  );
  const [searchQuery, setSearchQuery] = useState("");

  const option = [
    { label: "participated" },
    { label: "created", className: "agent_gradient" },
  ];

  useEffect(() => {
    const fetchAllocations = async () => {
      if (!publicKey) return;

      try {
        const userAllocations = await getAllocations(undefined, publicKey);

        const data = agents.map((agent) => ({
          ...agent,
          allocation: userAllocations.find((alloc) => alloc.id === agent.id),
        }));

        setAgentsWithAllocations(data);
      } catch (error) {
        console.error("Error fetching allocations:", error);
      }
    };

    fetchAllocations();
  }, [publicKey, agents]);

  const filteredAgents = useMemo(() => {
    return agentsWithAllocations.filter((agent) => {
      const tabFilter =
        tab === "created"
          ? agent.creatorWallet === publicKey?.toString()
          : agent.allocation !== undefined;

      const searchFilter = searchQuery
        ? agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          agent.symbol.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      return tabFilter && searchFilter;
    });
  }, [agentsWithAllocations, tab, publicKey, searchQuery]);

  const handleAgentClick = (agentId: number) => {
    router.push(`/agent/${agentId}`);
  };

  return (
    <main className="my-10 sm:mt-0">
      <div className="max-w-7xl sm:mx-auto ">
        <div className="flex flex-col gap-4 justify-center items-center mb-7">
          <div className="flex flex-col items-center gap-3 font-lexend sm:mt-8 mx-4">
            <h1 className="text-2xl font-lexend text-white/80 font-semibold">
              My Profile
            </h1>
            <p className="text-[#A1A1A5]/75 text-sm text-center font-lexend">
              Explore all the AI agents you've created and participated in.
            </p>
          </div>
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>

        <div className="space-y-4 mb-3 sm:mb-6">
          <div className="block sm:hidden bg-[#D9D9D90D] rounded-[10px] text-center mx-auto text-xs font-lexend max-w-[368px] w-full py-2">
            <h1 className="agent_gradient">
              Claim starts only after token Graduation!
            </h1>
          </div>
          <TabSwitcher options={option} tab={tab} setTab={setTab} />
        </div>
        <AgentTab agents={filteredAgents} onAgentClick={handleAgentClick} />
      </div>
    </main>
  );
}
