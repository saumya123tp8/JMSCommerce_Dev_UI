import React, { useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SearchInput: React.FC = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const search = value.trim();

    if (!search) {
      navigate("/search");
      setValue("");
      return;
    }

    // A new search starts with clean filters.
    navigate(`/search?search=${encodeURIComponent(search)}`);

    // Clear the header search box after submitting.
    setValue("");
  };

  return (
    <form
      className="relative w-full min-w-0"
      role="search"
      onSubmit={handleSubmit}
    >
      {/* Search decoration */}
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
        aria-hidden="true"
      />

      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search coffee, snacks..."
        aria-label="Search products"
        className="w-full min-w-0 rounded-full border border-gray-300 bg-gray-50 py-2 pl-9 pr-11 text-sm outline-none transition-colors focus:border-[#4A3428] focus:bg-white"
      />

      {/* Mobile search button */}
      <button
        type="submit"
        aria-label="Search products"
        className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[#4A3428] transition-colors hover:bg-[#F3ECE5] md:hidden"
      >
        <Search className="h-4 w-4" aria-hidden="true" />
      </button>
    </form>
  );
};

export default SearchInput;