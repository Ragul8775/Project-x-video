"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { AllocationProgressBar } from "@/components/ui/AllocationProgressBar";
import { useGlobalContext } from "@/context/GlobalContext";
import TradingViewWidget from "@/components/ui/TradingChart";
import TokenAllocation from "@/components/ui/TokenAllocation";
import {
  buy,
  getAllocations,
  getLaunchAddress,
  sell,
} from "@/utils/transactions";
import { Agent, Allocation, BuyArgs, SellArgs } from "@/utils/types";
import { getAllocationPercent, truncateAddress } from "@/utils/helper";
import { useWallet } from "@solana/wallet-adapter-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { BN } from "bn.js";
import { OnChainData, fetchOnChainData } from "services/onchaindata";

type FormData = {
  amount: number;
};

export default function Home() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      amount: 0,
    },
  });
  const { getTokenById, agents, setProcessing } = useGlobalContext();
  const wallet = useWallet();
  const [loading, setLoading] = useState<boolean>(true);
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const userAllocation = allocations.find(
    (a) => a.user.toString() === wallet.publicKey?.toString()
  );
  const [agent, setAgent] = useState<Agent | null>(null);
  const [onchain, setOnchain] = useState<OnChainData>();
  const [error, setError] = useState("");
  const tabs = ["Buy", "Sell"];
  const [activeTab, setActiveTab] = useState<string>("Buy");
  const params = useParams<{ id: string }>();

  useEffect(() => {
    if (!params?.id) return;

    setAgent(getTokenById(parseInt(params.id)));
  }, [agents]);

  useEffect(() => {
    const fetchAllocations = async () => {
      console.log("Fetching alloc", agent?.id);
      if (!agent?.id) return;

      const holders = await getAllocations(agent.id);
      console.log("Holders: ", holders);
      setAllocations(holders);
    };
    fetchAllocations();
  }, [agent]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(agent?.creatorWallet ?? "");
  };

  const onSubmit = async (data: FormData) => {
    const { amount } = data;
    console.log(":Amount:", amount);

    if (!agent || !amount) {
      toast.error("invalid params!");
      return;
    }

    const tokenAmount =
      (amount * 10 ** 6) / (agent.data.price.toNumber() / 10 ** 9);

    setProcessing(true);

    let response;
    try {
      if (activeTab === "Buy") {
        const args: BuyArgs = {
          id: agent.id,
          tokenAmount: new BN(tokenAmount),
          price: agent.data.price,
        };
        response = await toast.promise(buy(wallet, args), {
          loading: "Placing buy order...",
          success: <b>Buy successful!</b>,
          error: (err) => <b>Failed to place order: {err.message || err}</b>,
        });
      } else {
        const args: SellArgs = {
          id: agent.id,
          tokenAmount: new BN(tokenAmount),
        };
        response = await toast.promise(sell(wallet, args), {
          loading: "Placing sell order...",
          success: <b>Sell successfull!</b>,
          error: (err) => <b>Failed to sell order: {err.message || err}</b>,
        });
      }

      console.log("Agent deployed successfully:", response);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      reset();
    } catch (error) {
      console.error("Error placing order:", error);
    } finally {
      setProcessing(false);
    }
  };

  if (error) return <div>Error: {error}</div>;
  if (agents === null) {
    return <div>Loading...</div>;
  }

  if (!agent) {
    return <div>Agent not found</div>;
  }

  return (
    <main className="max-w-7xl bg-[#0C0D12]  mx-auto relative sm:top-14 p-6 sm:p-0 mb-24 sm:mb-0">
      {/* Header */}
      <section className="flex items-center justify-between gap-4 sm:py-4 text-white border-b-0 sm:border-b-2 border-white/5">
        <div className="flex items-center justify-start gap-4">
          {/* Logo */}
          <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#6B5ED2]/70">
            <Image
              src={agent.imageUrl}
              width={52}
              height={52}
              alt="Profile"
              className="object-cover rounded-full h-full w-full"
            />
          </div>

          {/* Token Info */}
          <div className="flex flex-col ">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 font-akshar">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white/90 text-base">
                  ${agent.symbol}
                </span>
                <span className="text-[#7F7F7F] text-[13px]">{agent.name}</span>
              </div>

              {/* Address with Copy Button */}
              <div className="flex  items-center gap-2">
                <div
                  className="flex cursor-pointer items-center gap-1 rounded-full bg-[#1a1a1a] px-3 py-1 text-xs font-lexend"
                  onClick={copyToClipboard}
                >
                  <span className="text-gray-400">
                    {truncateAddress(agent.creatorWallet)}
                  </span>
                  <Image
                    src="/assets/openLink.png"
                    width={12}
                    height={12}
                    alt="Open Link"
                  />
                </div>

                {/* Social Icons */}
                <div className="flex gap-2">
                  <div
                    onClick={() => {
                      window.open(
                        `https://x.com/${agent.agentTwitter}`,
                        "_blank"
                      );
                    }}
                    className="cursor-pointer rounded bg-white bg-opacity-[2.5%] py-2 px-3 items-center"
                  >
                    <Image
                      src="/assets/twitter.png"
                      width={12}
                      height={12}
                      alt="Open Link"
                    />
                  </div>

                  {/* Telegram Icon */}
                  {/* <div className="cursor-pointer rounded bg-white bg-opacity-[2.5%] p-1 px-3 items-center flex">
                    <Image
                      src="/assets/telegram.png"
                      width={13}
                      height={12}
                      alt="Open Link"
                    />
                  </div> */}
                </div>
              </div>
            </div>

            {/* Description */}

            <div className="relative group mt-1">
              <p className="text-[#a1a1a5] font-akshar leading-5 truncate font-normal">
                {agent.description.length > 60
                  ? `${agent.description.substring(0, 60)}...`
                  : agent.description}
              </p>
              <div className="hidden group-hover:block absolute left-0 top-full mt-2 w-72 p-2 bg-[#14151E] text-white text-xs rounded shadow-md z-50">
                {agent.description}
              </div>
            </div>
          </div>
        </div>
        <div className="hidden sm:flex  gap-3 items-center justify-between w-1/5">
          <div className="flex flex-col items-end">
            <h3 className="font-lexend text-xs text-[#94A3B8]">Holders</h3>
            <p className="font-mono text-xl font-medium text-[#CFD0D2]">
              {allocations.length}
            </p>
          </div>

          {/* Allocation */}
          <div className="flex flex-col items-end ">
            <h3 className="font-lexend text-xs text-[#94A3B8]">Allocation</h3>
            <p className="font-mono text-xl font-medium text-right text-[#CFD0D2]">
              {userAllocation
                ? getAllocationPercent(
                    agent?.data?.maxSupply,
                    userAllocation.tokenAmount
                  )
                : "0%"}
            </p>
          </div>

          {/* My Tokens */}
          <div className="flex flex-col items-end ">
            <h3 className="font-lexend text-xs text-[#94A3B8] ">My Tokens</h3>
            <p className="font-mono text-xl font-medium text-right blue_gradient">
              {userAllocation
                ? (userAllocation.tokenAmount.toNumber() / 10 ** 6).toFixed(2)
                : 0}
            </p>
          </div>
        </div>
      </section>
      {/* Dynoamic Content */}
      <section className="grid grid-cols-1 grid-rows-3 sm:grid-rows-1 sm:grid-cols-3 w-full  gap-4 my-6 ">
        <div className="w-full h-full row-span-1 sm:col-span-2 rounded-2xl">
          {agent?.data.completed ? (
            <div className=" h-60 sm:h-[620px] bg-[#11141D] p-4">
              <TradingViewWidget token={getLaunchAddress(2).toString()} />
            </div>
          ) : (
            <TokenAllocation agent={agent} allocations={allocations} />
          )}
        </div>
        {agent?.data.completed ? (
          <div className="w-full text-white px-4 row-span-2 sm:col-span-1 sm:row-span-1 rounded-2xl items-center">
            <div className="flex-col space-y-2 bg-[#14151E] p-2 rounded-xl text-white">
              <p>Trade in pump.fun</p>
              <div
                className="flex cursor-pointer items-center justify-between rounded-full bg-[#1a1a1a] px-3 py-1 text-gray-400 text-xs font-lexend"
                onClick={() => {
                  window.open(
                    `https://pump.fun/coin/${getLaunchAddress(
                      agent.id
                    ).toString()}pump`,
                    "_blank"
                  );
                }}
              >
                <span className="text-gray-400 w-[90%] overflow-hidden truncate">{`https://pump.fun/coin/${getLaunchAddress(
                  agent.id
                ).toString()}pump`}</span>
                <Image
                  src="/assets/openLink.png"
                  width={12}
                  height={12}
                  alt="Open Link"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full text-white px-4 row-span-2 sm:col-span-1 sm:row-span-1 rounded-2xl items-center">
            <div className="flex bg-[#14151E] p-2 rounded-xl">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 rounded-xl text-sm capitalize relative py-3 text-white ${
                    activeTab === tab ? " bg-[#0EC97F]" : ""
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex-col items-center gap-1 w-full"
            >
              <div className="rounded-xl flex-col items-center mt-4 gap-1 w-full p-5 bg-[#11141D]">
                <div className="flex w-full justify-between">
                  <span className="text-[#94A3B8] font-roboto text-sm">
                    {activeTab === "Buy" ? "You Spend" : "You Sell"}
                  </span>
                  <span className="bg-[#D9D9D90D] text-[#FFFFFF80] text-xs font-inter px-2 py-1 rounded-[10px]">
                    $SOL
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="0.00"
                  className={`w-full border ${
                    errors.amount ? "border-red-500" : "border-transparent"
                  } rounded-md font-chakra leading-3 text-[2.5rem] bg-transparent font-semibold text-[#CECED2] placeholder-gray-600 focus:outline-none`}
                  {...register("amount", {
                    required: "Amount is required",
                  })}
                />
                {errors.amount && (
                  <p className="text-xs text-red-500 mt-2">
                    {errors.amount.message}
                  </p>
                )}
              </div>
              <div className="rounded-xl flex-col items-center mt-4 gap-1 w-full p-5 bg-[#11141D]">
                <div className="flex w-full justify-between">
                  <span className="text-[#94A3B8] font-roboto text-sm">
                    {activeTab === "Buy" ? "You Get" : "You Get"}
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="0.00"
                  className={`w-full border ${
                    errors.amount ? "border-red-500" : "border-transparent"
                  } rounded-md font-chakra leading-3 text-[2.5rem] bg-transparent font-semibold text-[#CECED2] placeholder-gray-600 focus:outline-none`}
                  {...register("amount", {
                    required: "Amount is required",
                  })}
                />
                {errors.amount && (
                  <p className="text-xs text-red-500 mt-2">
                    {errors.amount.message}
                  </p>
                )}
              </div>
              <div className="border border-white/5 text-white mt-4 p-4 rounded-xl w-full max-w-md">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 font-roboto text-sm font-normal">
                      Rate
                    </span>
                    <span className="text-white font-roboto text-sm font-medium">
                      1 SOL = 0.0004271 Tokens
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 font-roboto text-sm font-normal">
                      Minimum Received
                    </span>
                    <span className="text-white font-roboto text-sm font-medium">
                      32456 Tokens
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 font-roboto text-sm font-normal">
                      Price Impact
                    </span>
                    <span className="text-white font-roboto text-sm font-medium">{`<0.001%`}</span>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="w-full mt-4 bg-[#192634] hover:bg-[#192634]/80 text-white h-14 text-lg rounded-xl transition-colors"
              >
                Place Order
              </button>
            </form>
          </div>
        )}
      </section>
    </main>
  );
}
