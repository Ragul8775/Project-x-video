import React from "react";
import Loader from "./Loader";

export default function AnimatedButton({ isLoading }: { isLoading: boolean }) {
  return (
    <div className="flex flex-col h-full justify-end">
      <div className="relative w-full group">
        <button
          type="submit"
          className="relative w-full py-4 rounded-md font-semibold text-lg text-white 
                     overflow-hidden bg-gradient-to-r from-purple-500 via-cyan-500 to-yellow-500 
                     bg-size-200 bg-pos-0 animate-gradient-move"
        >
          <span className="relative z-10 flex items-center justify-center">
            {isLoading ? <Loader /> : "Deploy"}
          </span>

          {/* Gradient Overlay Shapes with Enhanced Movement */}
          <div
            className="absolute w-16 h-16 rounded-full bg-purple-500/70 blur-lg 
                          group-hover:-translate-x-8 group-hover:-translate-y-8 
                          transition-transform duration-700 ease-in-out 
                          animate-shape-1 group-hover:animate-none"
          ></div>
          <div
            className="absolute w-16 h-16 rounded-full bg-cyan-500/70 blur-lg 
                          group-hover:translate-x-8 group-hover:translate-y-8 
                          transition-transform duration-700 ease-in-out 
                          animate-shape-2 group-hover:animate-none"
          ></div>
          <div
            className="absolute w-16 h-16 rounded-full bg-yellow-500/70 blur-lg 
                          group-hover:-translate-x-8 group-hover:translate-y-8 
                          transition-transform duration-700 ease-in-out 
                          animate-shape-3 group-hover:animate-none"
          ></div>
          <div
            className="absolute w-16 h-16 rounded-full bg-blue-500/70 blur-lg 
                          group-hover:translate-x-8 group-hover:-translate-y-8 
                          transition-transform duration-700 ease-in-out 
                          animate-shape-4 group-hover:animate-none"
          ></div>
        </button>
      </div>
    </div>
  );
}
