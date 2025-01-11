"use client";
import { useState } from "react";
import "animate.css";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className="relative w-full max-w-md mb-[30px]">
      <input
        type="text"
        placeholder=""
        value={searchTerm}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`py-2 px-4 w-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300 ${
          isFocused ? "animate__animated animate__pulse" : ""
        }`}
      />
    </div>
  );
};

export default Search;
