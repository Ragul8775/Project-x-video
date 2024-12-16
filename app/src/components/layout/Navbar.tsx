"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { SiSolana } from "react-icons/si";
import Image from "next/image";
import WalletConnectionButton from "@/components/WalletConnectButton";
import { useWallet } from "@solana/wallet-adapter-react";
import { connection, fetchSolBalance, truncateAddress } from "@/utils/helper";

export default function Navbar() {
  const { publicKey, connected, disconnect } = useWallet();
  const [balance, setBalance] = useState("0");
  const [showWalletModal, setShowWalletModal] = useState(false);

  useEffect(() => {
    if (!publicKey) return;

    fetchSolBalance(connection, publicKey).then((b) =>
      setBalance(b.toFixed(2))
    );
  }, [publicKey]);

  return (
    <nav className="bg-[#0C0D12]/85 h-16 flex items-center justify-between gap-4 sticky top-0 z-10 sm:border border-b-2 border-white/5 px-7 ">
      <Link href="/" className="text-white font-lexend text-lg">
        <Image
          width={150}
          height={29}
          alt="logo"
          src="/assets/logo.png"
          className="hidden sm:block"
        />
        <Image
          width={23}
          height={23}
          alt="logo-sm"
          src="/assets/logo-sm.png"
          className="block sm:hidden "
        />
      </Link>

      <div className="flex items-center gap-4 text-lexend text-xs text-medium">
        <button className="text-white/50 hover:text-white/75 hidden md:block">
          How it works?
        </button>
        <button className="text-white/50 bg-[#D9D9D9]/5 hover:text-white/75 rounded-full hidden sm:block md:hidden px-[13px] py-2">
          ?
        </button>
        <div className="px-4 py-2 rounded-xl bg-[#D9D9D9]/5 hover:bg-[#D9D9D9] hover:bg-opacity-[8%] text-center hidden sm:flex sm:items-center w-[8rem]">
          <Link href="/create" className="agent_gradient w-full">
            Create Agents
          </Link>
        </div>
        <div className="px-6 py-2 rounded-xl bg-[#D9D9D9]/5 hover:bg-[#D9D9D9] hover:bg-opacity-[8%] text-center hidden sm:flex sm:items-center w-[8rem]">
          <Link href="/profile" className="text-white/50 w-full">
            My Profile
          </Link>
        </div>

        {connected ? (
          <div
            className="relative bg-[#192634] text-white flex items-center text-sm rounded-[10px]"
            onClick={() => setShowWalletModal(!showWalletModal)}
            // onMouseEnter={() => setShowWalletModal(true)}
          >
            <div className="bg-white/5 px-3 py-2 rounded-l-[10px]">
              <Image
                width={15}
                height={15}
                src="/assets/wallet.png"
                alt="wallet"
              />
            </div>
            <div className="flex items-center justify-center gap-1.5 px-2">
              <SiSolana width={14} height={11} className="text-[#cccccc]" />
              <span className="font-medium font-chakra">{balance}</span>
            </div>
            {showWalletModal && (
              <div className="absolute top-14 right-0 bg-[#D9D9D9]/5 flex flex-col items-center gap-2 rounded-[10px] w-[140px] p-1.5">
                <div className="bg-[#D9D9D9]/10 rounded-md w-full px-2 py-1">
                  <div className="text-white/50 text-[10px]">
                    Wallet Address
                  </div>
                  <div>{truncateAddress(publicKey?.toBase58() ?? "")}</div>
                </div>
                <button
                  className="text-white/50 hover:text-white/75 font-medium bg-[#D9D9D9]/10 rounded-md w-full px-2 py-1"
                  onClick={disconnect}
                >
                  Disconnect
                </button>
              </div>
            )}
          </div>
        ) : (
          <WalletConnectionButton />
        )}
      </div>
    </nav>
  );
}
