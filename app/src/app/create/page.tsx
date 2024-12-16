import CreateAgent from "@/components/agent/CreateAgentForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0C0D12] ">
      <main className=" font-lexend">
        <div className="max-w-7xl mx-auto">
          <div className="w-full max-w-2xl mx-auto py-10 text-gray-300 mb-12 sm:mb-0">
            <div className="text-center mb-12 space-y-3">
              <h1 className="text-2xl font-lexend text-white/80 font-semibold gray_gradient">
                Create Agent
              </h1>
              <p className="text-[#A1A1A5]/75 text-sm text-center font-lexend">
                Deploy AI agents to analyze market trends and provide real-time
                trading calls, helping you make smarter, faster
                trading decisions
              </p>
            </div>
            <CreateAgent />
          </div>
        </div>
      </main>
    </div>
  );
}
