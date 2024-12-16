import AgentsList from "@/components/leaderboard/AgentsList";

export default function Home() {
  return (
    <div className="min-h-screen bg-transparent sm:bg-[#13111c]">
      <main className="pl-24 pr-8 pt-20 font-lexend sm:block hidden">
        <div className="max-w-[2000px]">
          <div className="flex justify-between items-center mb-6 px-8">
            <div>
              <h1 className="text-xl font-lexend text-white mt-20">
                Leaderboard
              </h1>
              <p className="text-gray-400 font-akshar text-xs">
                Real-time feed of tokens launched in the past 24h
              </p>
            </div>
          </div>

          <AgentsList />
        </div>
      </main>
      <div className="relative sm:hidden w-full h-full top-4">
        <div className="relative flex items-end h-[290px] w-full px-8 pt-14">
          <div
            className="absolute z-10 top-[100px] left-0 w-full h-[220px]"
            style={{
              background:
                "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.8) 100%)",
            }}
          ></div>
          {[
            { username: "Metakovan", totalPoints: 50.5 },
            { username: "Metabodivan", totalPoints: 30.3 },
            { username: "JaneDoe", totalPoints: 20.0 },
          ].map((user, index) => {
            const userOrder = index === 0 ? 1 : index === 1 ? 0 : 2;
            return (
              <div
                key={index}
                className={`relative flex justify-start  rounded-t-[30px] font-lexend text-white  ${
                  userOrder === 0
                    ? "bg-[#191C29] h-[100%] " // First place
                    : userOrder === 2
                    ? "h-[50%] bg-[#0D0F16]" // Third place
                    : "h-[70%] bg-[#0D0F16]" // Second place
                } w-full`}
              >
                {/* User Profile Image */}
                <img
                  className={`absolute left-1/2 z-20 top-[-50px] transform -translate-x-1/2`}
                  src={`/assets/profile${userOrder + 1}.png`}
                  alt="user profile"
                  width={80}
                  height={80}
                />
                {/* Rank Image */}
                {userOrder === 0 && (
                  <img
                    className="absolute z-20 top-[-85px] right-[40px]"
                    src="/assets/winnerBadge.png"
                    alt="user rank"
                    width={36}
                    height={36}
                  />
                )}
                {userOrder === 1 && (
                  <img
                    className="absolute z-20 top-[-85px] right-[40px]"
                    src="/assets/secondBadge.png"
                    alt="user rank"
                    width={36}
                    height={36}
                  />
                )}
                {userOrder === 2 && (
                  <img
                    className="absolute z-20 top-[-85px] right-[40px]"
                    src="/assets/thirdBadge.png"
                    alt="user rank"
                    width={36}
                    height={36}
                  />
                )}
                {/* Total Points */}
                <div className="z-20 w-full text-center font-bold text-[13px] font-robotoMono mt-12">
                  <div>{user.username}</div>
                  <div
                    className={`${
                      user.totalPoints < 0 ? "text-[#F1323E]" : "text-[#00C278]"
                    }`}
                  >
                    {user.totalPoints < 0 ? "" : "+"}
                    {user.totalPoints.toFixed(2)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="z-20 relative bg-[#11141D] rounded-t-xl px-2 w-full h-[59dvh] overflow-y-auto">
          <div className="pl-2 pr-6 flex items-center justify-between text-xs font-roboto font-medium mb-1 pt-4">
            <div className="flex w-3/5">
              <span className="text-white/50">Global Rank</span>
            </div>
            <span className="text-white/50 ml-3">PnL</span>
          </div>

          <div className="space-y-2 w-full pb-16 font-roboto">
            <div
              key="current-user"
              className=" bg-[#BEB6FF]/5 rounded-[15px] py-4 pl-3 sm:pl-6 pr-3 flex items-center justify-between gap-1 text-sm"
            >
              <div className="flex items-center space-x-3 w-3/5 font-akshar">
                <span className="hidden sm:block text-gray-500">
                  #1&nbsp;&nbsp;&nbsp;&nbsp;Alice
                </span>
                <span className="sm:hidden text-gray-500">
                  #1&nbsp;&nbsp;&nbsp;&nbsp;Alice
                </span>
              </div>
              <span className="font-roboto text-[#C2C2C4]">+50.50</span>
            </div>

            {[
              { rank: 2, username: "Bob", totalPoints: 30.3 },
              { rank: 3, username: "Charlie", totalPoints: 20.0 },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-[#BEB6FF]/5 rounded-[15px] py-4 pl-3 sm:pl-6 pr-3 flex items-center justify-between gap-1 text-sm"
              >
                <div className="flex items-center space-x-3 w-3/5 font-akshar">
                  <span className="hidden sm:block text-gray-500">
                    #{item.rank}&nbsp;&nbsp;&nbsp;&nbsp;{item.username}
                  </span>
                  <span className="sm:hidden text-gray-500">
                    #{item.rank}&nbsp;&nbsp;&nbsp;&nbsp;{item.username}
                  </span>
                </div>
                <span
                  className={`font-roboto ${
                    item.totalPoints < 0 ? "text-[#C2C2C4]" : "text-[#C2C2C4]"
                  }`}
                >
                  {item.totalPoints < 0 ? "" : "+"}
                  {item.totalPoints.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
