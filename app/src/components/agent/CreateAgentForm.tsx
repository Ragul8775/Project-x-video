"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { FiUpload } from "react-icons/fi";
import { useWallet } from "@solana/wallet-adapter-react";
import { useGlobalContext } from "@/context/GlobalContext";
import { createAgent } from "@/utils/helper";
import { CreateAgentArgs } from "@/utils/types";
import { toast } from "react-hot-toast";
import { useState } from "react";
import Loader from "../ui/Loader";
import { IoIosAdd } from "react-icons/io";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import { FaTwitter } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import AnimatedButton from "../ui/AnimatedButton";

type FormData = {
  tokenName: string;
  tokenTicker: string;
  description: string;
  personality: string;
  twitterUsername: string;
  twitterPassword: string;
  tokenImage: File | null;
};

const steps = [
  "Building AI...",
  "Linking Twitter...",
  "Setting up Agent...",
  "Analyzing Timeline...",
  "Aggregating Tweets...",
];

export default function Deploy() {
  const router = useRouter();
  const wallet = useWallet();
  const { getAllAgents } = useGlobalContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [followers, setFollowers] = useState<string[]>([]);

  const dummyFollowers = ["@frankdegods", "@SolJakey", "@suganarium"];

  const handleConnectTwitter = () => {
    setLoading(true); // Start loading
    setTimeout(() => {
      setLoading(false); // Stop loading
      setConnected(true); // Show connected state
      setFollowers(dummyFollowers); // Set dummy followers
    }, 3000); // Wait for 3 seconds
  };
  /*   const [wallets, setWallets] = useState<string[]>([]);
  const [channels, setChannels] = useState<string[]>([]);
  const [newWallet, setNewWallet] = useState("");
  const [newChannel, setNewChannel] = useState("");
  const [isAddingWallet, setIsAddingWallet] = useState(false);
  const [isAddingChannel, setIsAddingChannel] = useState(false);

  const addWallet = () => {
    if (newWallet) {
      setWallets([...wallets, newWallet]);
      setNewWallet("");
      setIsAddingWallet(false);
    }
  };

  const addChannel = () => {
    if (newChannel) {
      setChannels([...channels, newChannel]);
      setNewChannel("");
      setIsAddingChannel(false);
    }
  };

  const removeWallet = (index: number) => {
    setWallets(wallets.filter((_, i) => i !== index));
  };

  const removeChannel = (index: number) => {
    setChannels(channels.filter((_, i) => i !== index));
  }; */
  console.log("Loader", isLoading);
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
      tokenName: "",
      tokenTicker: "",
      description: "",
      personality: "",
      //TODO: Input from the form
      twitterUsername: "@metabro",
      twitterPassword: "",
      tokenImage: null,
    },
  });

  const watchImage = watch("tokenImage");

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    const {
      tokenName,
      tokenTicker,
      description,
      personality,
      twitterUsername,
      twitterPassword,
      tokenImage,
    } = data;

    if (!tokenImage) {
      toast.error("Token Image is required");
      setIsLoading(false);
      return;
    }

    const args: CreateAgentArgs = {
      tokenMetadata: {
        name: tokenName,
        symbol: tokenTicker,
        description,
        file: tokenImage,
      },
      personality,
      twitterUsername,
      twitterPassword,
    };

    try {
      const response = await toast.promise(createAgent(wallet, args), {
        loading: "Deploying agent...",
        success: <b>Agent deployed successfully!</b>,
        error: (err: any) => {
          console.error("Error deploying agent:", err);
          return (
            <b>Failed to deploy: {err?.message || "Unknown error occurred"}</b>
          );
        },
      });
      console.log("Agent deployed successfully:", response);

      setTimeout(() => {
        getAllAgents();
        reset();
        router.push("/profile?tab=created");
      }, steps.length * 2000);
    } catch (error) {
      console.log("Error deploying agent:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setValue("tokenImage", event.target.files[0], { shouldValidate: true });
    }
  };

  return (
    <form
      autoComplete="new-password"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 font-lexend"
    >
      <div className="relative">
        <label className="text-[13px] font-lexend font-medium mb-2 sm:block hidden">
          Token Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden "
          id="token-image"
        />
        <label
          htmlFor="token-image"
          className="w-[58px] h-[58px] mx-auto sm:mx-0 rounded-full bg-[#384364] border-2 border-dashed border-gray-500 flex items-center justify-center cursor-pointer hover:bg-[#2f2f2f] transition-colors relative overflow-hidden group mb-2"
        >
          {watchImage ? (
            <Image
              src={URL.createObjectURL(watchImage)}
              alt="Selected token"
              className="w-full h-full object-cover rounded-full"
              width={80}
              height={80}
            />
          ) : (
            <FiUpload className="text-gray-400 text-xl" />
          )}
          {watchImage && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <FiUpload className="text-gray-300 text-2xl" />
            </div>
          )}
        </label>
        <div className="flex flex-col items-center justify-center w-full font-lexend font-semibold text-xl gap-1 sm:hidden">
          <h1>Upload Image</h1>
          <p className="text-[13px] font-normal leading-4 text-center">
            Upload image of your AI- <br /> .png (max 950kb)
          </p>
        </div>
        {errors.tokenImage && (
          <p className="text-sm text-red-500 mt-2">Image is required</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[13px] font-lexend font-medium mb-2 block">
            Token Name
          </label>
          <input
            type="text"
            placeholder="Name of Token"
            autoComplete="new-password"
            autoCorrect="off"
            autoCapitalize="off"
            className={`w-full bg-[#94A3B8]/5 border ${
              errors.tokenName ? "border-red-500" : "border-gray-800"
            } rounded-[10px] px-4 h-14 text-gray-300 placeholder-[#94A3B8]/20 font-medium font-roboto focus:outline-none`}
            {...register("tokenName", { required: "Token Name is required" })}
          />
          {errors.tokenName && (
            <p className="text-sm text-red-500 mt-2">
              {errors.tokenName.message}
            </p>
          )}
        </div>
        <div>
          <label className="text-[13px] font-lexend font-medium mb-2 block">
            Token Ticker
          </label>
          <input
            type="text"
            placeholder="$TICKER"
            autoComplete="new-password"
            autoCorrect="off"
            autoCapitalize="off"
            className={`w-full bg-[#94A3B8]/5 border ${
              errors.tokenName ? "border-red-500" : "border-gray-800"
            } rounded-[10px] px-4 h-14 text-gray-300 placeholder-[#94A3B8]/20 font-medium font-roboto focus:outline-none`}
            {...register("tokenTicker", {
              required: "Token Ticker is required",
            })}
          />
          {errors.tokenTicker && (
            <p className="text-sm text-red-500 mt-2">
              {errors.tokenTicker.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="text-[13px] font-lexend font-medium mb-2 block">
          Agent Description
        </label>
        <textarea
          autoComplete="new-password"
          autoCorrect="off"
          autoCapitalize="off"
          placeholder="Add a description for your agent"
          className={`w-full bg-[#94A3B8]/5 border ${
            errors.tokenName ? "border-red-500" : "border-gray-800"
          } rounded-[10px] p-4 h-14 text-gray-300 placeholder-[#94A3B8]/20 font-medium font-roboto focus:outline-none min-h-[120px] resize-none`}
          {...register("description", {
            required: "Description is required",
            minLength: {
              value: 15,
              message: "At least 15 characters are required",
            },
          })}
        />
        {errors.description && (
          <p className="text-sm text-red-500 mt-2">
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <label className="text-[13px] font-lexend font-medium mb-2 block">
          Build Your Agent's Personality
        </label>
        <textarea
          autoComplete="new-password"
          autoCorrect="off"
          autoCapitalize="off"
          placeholder="Agent's personality"
          className={`w-full bg-[#94A3B8]/5 border ${
            errors.tokenName ? "border-red-500" : "border-gray-800"
          } rounded-[10px] p-4 h-14 text-gray-300 placeholder-[#94A3B8]/20 font-medium font-roboto focus:outline-none min-h-[120px] resize-none`}
          {...register("personality", {
            required: "Personality description is required",
            minLength: {
              value: 10,
              message: "At least 10 characters are required",
            },
          })}
        />
        {errors.personality && (
          <p className="text-sm text-red-500 mt-2">
            {errors.personality.message}
          </p>
        )}
      </div>
      <div className="">
        {/* <div className="mb-4">
          <label className="text-[13px] font-lexend font-medium mb-2 block">
            Twitter Username
          </label>
          <input
            type="text"
            autoComplete="new-password"
            autoCorrect="off"
            autoCapitalize="off"
            placeholder="Your Twitter username"
            className={`w-full bg-[#94A3B8]/5 border ${
              errors.twitterUsername ? "border-red-500" : "border-gray-800"
            } rounded-[10px] px-4 h-14 text-gray-300 placeholder-[#94A3B8]/20 font-medium font-roboto focus:outline-none`}
            {...register("twitterUsername", {
              required: "Twitter username is required",
              validate: {
                isNotUrl: (value) =>
                  !value.startsWith("http") ||
                  "Please provide only the username, not a URL.",
                isValidUsername: (value) =>
                  /^[a-zA-Z0-9_]{1,15}$/.test(value) ||
                  "Only letters, numbers, and underscores are allowed (max 15 characters).",
              },
            })}
          />
          {errors.twitterUsername && (
            <p className="text-sm text-red-500 mt-2">
              {errors.twitterUsername.message}
            </p>
          )}
        </div> */}

        {/* <div className="mb-4">
            <label className="text-sm mb-2 block">Twitter Password</label>
            <input
              type="password"
              autoComplete="new-password"
              autoCorrect="off"
              autoCapitalize="off"
              placeholder="Your Twitter password"
              className={`w-full bg-[#94A3B8]/5 border ${
                errors.tokenName ? "border-red-500" : "border-gray-800"
              } rounded-[10px] px-4 h-14 text-gray-300 placeholder-[#94A3B8]/20 font-medium font-roboto focus:outline-none`}
              {...register("twitterPassword", {
                required: "Twitter password is required",
              })}
            />
            {errors.twitterPassword && (
              <p className="text-sm text-red-500 mt-2">
                {errors.twitterPassword.message}
              </p>
            )}
          </div> */}
      </div>
      <div className="  text-white">
        <h2 className="mb-4 text-sm text-gray-300">Connect Twitter</h2>

        {/* Button or Connected State */}
        <div className="border border-dashed border-white/60 rounded-[10px] p-6 flex-col items-center justify-center">
          {!connected ? (
            <button
              onClick={handleConnectTwitter}
              className="flex items-center justify-center w-full py-3 bg-gradient-to-r from-[#1D9Bf0] to-[#0c8cf3] rounded-lg font-semibold text-lg transition-transform transform "
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="loader"></div> Loading...
                </div>
              ) : (
                <>
                  <span className="mr-2 font-inter font-bold text-xl">
                    <FaTwitter />
                  </span>{" "}
                  Connect Twitter
                </>
              )}
            </button>
          ) : (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col gap-4 "
              >
                <div className="flex items-center   rounded-lg mb-4 gap-2">
                  <span className="font-medium text-sm text-[#94A3B8]">
                    Twitter Connected
                  </span>
                  <FaCheckCircle className="text-[#0EC97F]" />
                </div>
                <div className="flex items-center justify-between w-full gap-2 mb-6">
                  <p className="bg-[#12141A] p-3 py-3.5 w-full rounded-[10px] font-chakra text-sm text-[#94A3B8]">
                    @metabro
                  </p>
                  <button
                    onClick={() => setConnected(false)}
                    className="bg-[#101117] px-4 py-3.5 rounded-[10px] transition text-[#94A3B8]"
                  >
                    <RiDeleteBin6Fill className="w-[22px] h-[22px]" />
                  </button>
                </div>

                <div className="font-lexend">
                  <p className="text-[#94A3B8] text-sm mb-2">
                    Followers •{" "}
                    <span className="text-[#737F91]">
                      {followers.length * 6}
                    </span>
                  </p>
                  <ul>
                    {followers.map((follower, index) => (
                      <motion.li
                        key={index}
                        className="p-4 bg-[#14151E] rounded-[15px] mb-2  text-xs"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 * index }}
                      >
                        <h1 className="blue_gradient">{follower}</h1>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <button
                  className="bg-[#D9D9D90D] font-lexend text-xs text-gray-400 py-2 px-4 rounded-lg  w-fit mx-auto -mt-4"
                  onClick={() => alert("Load More Followers")}
                >
                  Load More
                </button>
                <div className="bg-[#D9D9D90D] text-xs w-full py-1 rounded-full text-center">
                  <p className="blue_gradient">
                    Your agent’s calls depend on your Followers!
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        <style jsx>{`
          .loader {
            border: 2px solid #f3f3f3;
            border-top: 2px solid #3498db;
            border-radius: 50%;
            width: 16px;
            height: 16px;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>

      <div className="flex justify-between items-center p-6 border border-dashed rounded-[10px] border-white/60">
        <h1 className="text-[13px] font-lexend">Add Wallets</h1>
        <button className="bg-[#EFA411]/20 text-[#EFA411] p-[2px] rounded-[5px] px-2 text-[13px]">
          {" "}
          Coming Soon
        </button>
      </div>
      <div className="flex justify-between items-center p-6 border border-dashed rounded-[10px] border-white/60">
        <h1 className="text-[13px] font-lexend">Add Telegram</h1>
        <button className="bg-[#EFA411]/20 text-[#EFA411] p-[2px] rounded-[5px] px-2 text-[13px]">
          {" "}
          Coming Soon
        </button>
      </div>
      {/* Wallets */}
      {/*  <section className=" ">
        <h2 className="text-sm mb-4">Add wallets</h2>
        <div className="border border-dashed border-white rounded-[10px] p-4">
          <div className="space-y-2 mb-8">
            {wallets.map((wallet, index) => (
              <div
                key={index}
                className=" flex items-center justify-between gap-2 "
              >
                <div className="text-sm bg-[#101117] text-[#94A3B8] font-chakra  w-full p-3 rounded font-semibold leading-5 ">
                  {wallet}
                </div>
                <button
                  className="text-gray-500 hover:text-gray-400 bg-[#101117] rounded p-3 py-3"
                  onClick={() => removeWallet(index)}
                >
                  <RiDeleteBin6Fill className="w-[22px] h-[22px]" />
                </button>
              </div>
            ))}
            {isAddingWallet ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newWallet}
                  onChange={(e) => setNewWallet(e.target.value)}
                  className="flex-grow bg-[#1A1A1A] p-3 rounded text-white"
                  placeholder="Enter wallet address"
                />
                <button
                  onClick={addWallet}
                  className="bg-[#1A1A1A] p-3 rounded text-white hover:bg-[#252525]"
                >
                  <IoIosAdd className="w-[25px] h-[25px]" />
                </button>
              </div>
            ) : (
              <button
                className="w-full bg-[#1A1A1A] p-3 rounded text-left text-gray-500 hover:text-gray-400"
                onClick={() => setIsAddingWallet(true)}
              >
                add
              </button>
            )}
          </div>
          <p className="text-xs text-[#29A9EA] mt-2 bg-[#D9D9D90D] text-center rounded-full py-1">
            Your agents calls depend on the data from wallets!
          </p>
        </div>
      </section> */}
      {isLoading ? (
        <button type="submit" className="w-full mx-auto my-4">
          <AnimatedButton isLoading={isLoading} steps={steps} />
        </button>
      ) : (
        <button
          type="submit"
          className="w-full bg-[#192634] hover:bg-[#192634]/80 text-white h-14 text-xl rounded-[10px] font-medium transition-colors"
        >
          Deploy
        </button>
      )}
    </form>
  );
}
