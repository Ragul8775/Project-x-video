interface AgentListItemProps {
  marketCap: number;
  pnl: number;
}

export default function AgentListItem({ marketCap, pnl }: AgentListItemProps) {
  return (
    <div className="flex items-center bg-[#13121C] rounded-lg px-6 py-4 hover:bg-[#1A1925] transition-colors">
      <div className="flex items-center gap-3 flex-1">
        <div className="w-8 h-8 rounded-full bg-[#2B2937] flex items-center justify-center">
          <span className="text-[#7E7B94] text-lg font-medium">B</span>
        </div>
        <div>
          <div className="text-white text-sm font-medium font-akshar">$SPECTRE</div>
          <div className="text-[#7E7B94] text-xs">Spectre</div>
        </div>
      </div>
      <div className="w-48 text-right text-white font-akshar text-sm">
        $
        {marketCap.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </div>
      <div className="w-32 text-right text-emerald-400 font-mono text-sm">
        +$
        {pnl.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </div>
    </div>
  );
}
