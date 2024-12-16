import AgentListItem from "./AgentsListItem";

const agents = [
  { marketCap: 2456655, pnl: 345.23 },
  { marketCap: 546567, pnl: 345.23 },
  { marketCap: 45768, pnl: 345.23 },
  { marketCap: 0.01, pnl: 345.23 },
  { marketCap: 0.01, pnl: 345.23 },
  { marketCap: 0.01, pnl: 345.23 },
  { marketCap: 0.01, pnl: 345.23 },
  { marketCap: 0.01, pnl: 345.23 },
  { marketCap: 0.01, pnl: 345.23 },
  { marketCap: 0.01, pnl: 345.23 },
];

export default function AgentList() {
  return (
    <div className="px-8 py-4 bg-[#0D0C12]">
      <div className="flex items-center text-xs text-[#7E7B94] mb-4 px-6">
        <div className="flex-1">In Pool</div>
        <div className="w-48 text-right">Market Cap</div>
        <div className="w-32 text-right">PnL</div>
      </div>

      <div className="space-y-1">
        {agents.map((agent, index) => (
          <AgentListItem
            key={index}
            marketCap={agent.marketCap}
            pnl={agent.pnl}
          />
        ))}
      </div>
    </div>
  );
}
