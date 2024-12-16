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
import { time } from "console";
import Loader from "../ui/Loader";

type FormData = {
  tokenName: string;
  tokenTicker: string;
  description: string;
  personality: string;
  twitterUsername: string;
  twitterPassword: string;
  tokenImage: File | null;
};

export default function Deploy() {
  const router = useRouter();
  const wallet = useWallet();
  const { getAllAgents } = useGlobalContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
      twitterUsername: "",
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
        error: (err) => <b>Failed to deploy: {err.message || err}</b>,
      });

      console.log("Agent deployed successfully:", response);
      getAllAgents();
      reset();
      router.push("/profile?tab=created");
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
    <div className="w-full max-w-2xl mx-auto px-6 py-12 text-gray-300 mb-12 sm:mb-0">
      <div className="text-center mb-12 hidden sm:block">
        <h1 className="text-[2.25rem] font-medium mb-4 gray_gradient">
          Create Agent
        </h1>
        <p className="text-[#C4C4C4]/50 font-roboto ">
          Deploy AI agents to analyze market trends and provide real-time
          trading calls, <br />
          helping you make smarter, faster trading decisions
        </p>
      </div>

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
        <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-4 items-center justify-between w-full">
          <div className="mb-4">
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
          </div>

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

        <button
          type="submit"
          className="w-full bg-[#192634] hover:bg-[#192634]/80 text-white h-14 text-xl rounded-[10px] font-medium transition-colors"
        >
          {isLoading ? <Loader className="h-6 w-6" /> : "Deploy"}
        </button>
      </form>
    </div>
  );
}
