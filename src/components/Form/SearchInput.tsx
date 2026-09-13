import React from "react";

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
    <form className="flex w-full items-center gap-2" role="search" onSubmit={handleSubmit}>
      <input
        type="search"
        placeholder="Search"
        aria-label="Search"
        className="w-full min-w-0 rounded-md border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-black"
      />
      <button
        type="submit"
        className="shrink-0 rounded-md p-1.5 text-lg lg:hidden"
        aria-label="Submit search"
      >
        🔍
      </button>
    </form>
  );
};

export default SearchInput;