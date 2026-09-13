import React from "react";
import { Search } from "lucide-react";

const SearchInput: React.FC = () => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      // TODO: wire up search
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form className="relative w-full" role="search" onSubmit={handleSubmit}>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
        aria-hidden="true"
      />
      <input
        type="search"
        placeholder="Search coffee, snacks..."
        aria-label="Search"
        className="w-full min-w-0 rounded-full border border-gray-300 bg-gray-50 py-2 pl-9 pr-3 text-sm outline-none transition-colors focus:border-[#4A3428] focus:bg-white"
      />
    </form>
  );
};

export default SearchInput;