"use client";
import { useState, useEffect } from "react";
import AgentCard from "@/components/agent/AgentCard";
import TabSwitcher from "@/components/ui/TabSwitcher";
import { useGlobalContext } from "@/context/GlobalContext";
import { SearchBar } from "@/components/ui/Search";

export default function Home() {
  const { agents } = useGlobalContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("new");
  const [searchQuery, setSearchQuery] = useState("");

  const option = [{ label: "new" }, { label: "graduated" }];

  if (error) return <div>Error: {error}</div>;
  if (agents === null) {
    return <div>Loading...</div>;
  }

  return (
    <main className="py-10">
      <div className="max-w-[1316px] sm:mx-auto">
        <div className="flex flex-col gap-4 justify-center items-center mb-7">
          <div className="flex flex-col items-center gap-3 font-lexend">
            <h1 className="text-2xl font-lexend text-white/80 font-semibold">
              All Agents
            </h1>
            <p className="text-[#A1A1A5]/75 text-sm font-lexend">
              All agents launched in the past 24 Hours
            </p>
          </div>
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>
        <TabSwitcher options={option} tab={tab} setTab={setTab} />
        <div className="grid grid-cols-1 min-[695px]:grid-cols-2 lg:grid-cols-3 min-[1350px]:grid-cols-4 gap-4 justify-items-center sm:w-max sm:mx-auto">
          {agents
            ?.slice()
            .reverse()
            .filter((agent) =>
              tab === "graduated" ? agent.data.deposited : !agent.data.deposited
            )
            .filter((agent) => {
              if (!searchQuery) return true;
              const search = searchQuery.toLowerCase();
              return (
                agent.name.toLowerCase().includes(search) ||
                agent.symbol.toLowerCase().includes(search)
              );
            })
            .map((agent, index) => (
              <AgentCard key={index} agent={agent} />
            ))}
        </div>
      </div>
    </main>
  );
}
