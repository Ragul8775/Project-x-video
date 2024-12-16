import { Metadata } from "next";
import {
  Lexend,
  Akshar,
  Roboto,
  Inter,
  IBM_Plex_Mono,
  Chakra_Petch,
  Alata,
} from "next/font/google";
import "./globals.css";
import { Wallet } from "@/components/WalletProvider";
import { GlobalProvider } from "@/context/GlobalContext";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { Toaster } from "react-hot-toast";

const lexend = Lexend({ subsets: ["latin"], variable: "--font-lexend" });
const akshar = Akshar({ subsets: ["latin"], variable: "--font-akshar" });
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-roboto",
});
const chakra = Chakra_Petch({
  subsets: ["latin"],
  variable: "--font-chakra",
  weight: ["400", "700"],
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const ibm = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-ibm-mono",
  weight: ["400", "600", "700"],
});
const alata = Alata({
  subsets: ["latin"],
  variable: "--font-alata",
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Project X",
  description: "The Best AI Incubator & Launchpad: X Combinator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${lexend.variable} ${akshar.variable} ${roboto.variable} ${inter.variable} ${ibm.variable} ${chakra.variable} ${alata.variable}`}
    >
      <body className="bg-[#0C0D12]">
        <Toaster position="bottom-right" reverseOrder={false} />
        <GlobalProvider>
          <Wallet>
            <Navbar />
            <div className="min-h-screen px-6">{children}</div>
            <Sidebar />
          </Wallet>
        </GlobalProvider>
      </body>
    </html>
  );
}
