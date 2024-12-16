"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { AtSign } from "lucide-react";
import { GoHomeFill } from "react-icons/go";
import X from "/public/assets/socials/X.svg";
import Telegram from "/public/assets/socials/Telegram.svg";
import Leaderboard from "../../../public/assets/Leaderboard";
import User from "../../../public/assets/User";

export default function Sidebar() {
  const pathname = usePathname();
  const [activeIcon, setActiveIcon] = useState<string>("home");

  const getButtonClasses = (iconName: string) =>
    `mb-4 flex h-12 w-12 items-center justify-center rounded-lg transition-colors duration-200 border-2 ${
      activeIcon === iconName
        ? "bg-[#2A2856] border-[#665EE5] text-[#665EE5]"
        : "bg-[#191D29] border-[#ffffff] border-opacity-5 text-[#66718F]"
    }`;

  const getMobileButtonClasses = (iconName: string) =>
    `flex h-6 w-6 items-center justify-center  transition-colors duration-200 ${
      activeIcon === iconName ? "text-[#eaeaea]" : "text-[#66718F]"
    }`;

  useEffect(() => {
    if (pathname === "/") {
      setActiveIcon("home");
    } else if (pathname === "/profile") {
      setActiveIcon("profile");
    } else if (pathname === "/create") {
      setActiveIcon("create");
    }
  }, [pathname]);

  return (
    <div className="sm:hidden w-full bg-[#010101] sm:bg-[#0D0D12] sm:h-[calc(100vh-55px)] fixed bottom-0 flex flex-col border-r border-[#2F2F3A] py-4 sm:py-6">
      <div className="flex sm:hidden flex-row justify-around items-center w-full px-4">
        <Link
          href="/"
          className="flex flex-col items-center text-xs text-[#66718F] font-semibold"
        >
          <button className={getMobileButtonClasses("home")}>
            <GoHomeFill size={20} />
          </button>
        </Link>
        <Link
          href="/profile"
          className="flex flex-col items-center text-xs text-[#66718F] font-semibold"
        >
          <button className={getMobileButtonClasses("profile")}>
            <User />
          </button>
        </Link>
        <Link
          href="/create"
          className="flex flex-col items-center text-xs text-[#66718F] font-semibold"
        >
          <button className={getMobileButtonClasses("create")}>
            <Leaderboard />
          </button>
        </Link>
      </div>

      <div className="mt-auto hidden sm:flex flex-col items-center gap-4">
        <Link
          href="https://x.com/projectx_ai"
          className="w-12 h-12 flex items-center justify-center text-gray-400 bg-[#15151F] hover:bg-[#1B1B27] rounded-xl transition-all shadow-[0_0_0_1px_rgba(47,47,58,0.1)] hover:shadow-[0_0_0_1px_rgba(47,47,58,0.2)]"
        >
          <Image src={X} alt="X" width={20} height={20} />
        </Link>
        <Link
          href="#"
          className="w-12 h-12 flex items-center justify-center text-gray-400 bg-[#15151F] hover:bg-[#1B1B27] rounded-xl transition-all shadow-[0_0_0_1px_rgba(47,47,58,0.1)] hover:shadow-[0_0_0_1px_rgba(47,47,58,0.2)]"
        >
          {/* <Image src={X} alt="X" width={20} height={20} /> */}
          <AtSign size={20} />
        </Link>
        <Link
          href="#"
          className="w-12 h-12 flex items-center justify-center text-gray-400 bg-[#15151F] hover:bg-[#1B1B27] rounded-xl transition-all shadow-[0_0_0_1px_rgba(47,47,58,0.1)] hover:shadow-[0_0_0_1px_rgba(47,47,58,0.2)]"
        >
          <Image src={Telegram} alt="Telegram" width={20} height={20} />
        </Link>
      </div>
    </div>
  );
}
