import { Search, X } from "lucide-react";

type SearchBarProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

export const SearchBar = ({ searchQuery, setSearchQuery }: SearchBarProps) => {
  return (
    <div className="relative max-w-[384px] sm:max-w-md w-full mx-auto">
      <div className="relative">
        <input
          className="w-full bg-[#94A3B8]/5 placeholder:text-[#94A3B8]/50 text-white backdrop-blur-xl rounded-full pl-8 pr-10 h-12 focus:outline-none font-inter text-[13px]"
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery ? (
          <X
            className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 h-5 w-5 cursor-pointer hover:text-white/40"
            onClick={() => setSearchQuery("")}
          />
        ) : (
          <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 h-5 w-5" />
        )}
      </div>
    </div>
  );
};
