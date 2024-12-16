"use client";
import { getLaunches } from "@/utils/transactions";
import { Agent, AgentData } from "@/utils/types";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface GlobalContextProps {
  agents: Agent[];
  getTokenById: (id: number) => Agent | null;
  getAllAgents: () => void;
  setProcessing: (processing: boolean) => void;
}

const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [processing, setProcessing] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);

  const getAllAgents = async () => {
    try {
      const onchainData: AgentData[] = await getLaunches();
      console.log("launch", onchainData);
      const response = await fetch("/api/agents");
      if (!response.ok) {
        throw new Error("Failed to fetch agents");
      }
      const data: Agent[] = await response.json();
      data.forEach(
        (agent) =>
          (agent.data = onchainData.find((item) => item.id === agent.id)!)
      );
      console.log("Agents: ", data);
      setAgents(data);
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Error fetching agents"
      );
    }
  };

  useEffect(() => {
    if (processing) return;

    getAllAgents();
  }, [processing]);

  const getTokenById = (id: number): Agent | null => {
    console.log("chcking: ", agents);
    console.log(id);
    console.log(agents.find((agent) => agent.id === id));
    return agents.find((agent) => agent.id === id) ?? null;
  };
  return (
    <GlobalContext.Provider
      value={{ agents, getTokenById, getAllAgents, setProcessing }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = (): GlobalContextProps => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};
