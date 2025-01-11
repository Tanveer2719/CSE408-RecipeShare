// components/SearchButton.tsx
"use client"
import React, { useState } from "react";
import "animate.css";
import Link from "next/link";

export const SearchButton: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <Link href="/search">
      <button
        className={`w-[200px] bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg w-full transition duration-300 ease-in-out transform ${
          isHovered ? "animate__animated animate__pulse" : ""
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        Search your Recipe
      </button>
    </Link>
  );
};

export const SearchBlogButton: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <Link href="/searchBlog">
      <button
        className={`w-[200px] bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg w-full transition duration-300 ease-in-out transform ${
          isHovered ? "animate__animated animate__pulse" : ""
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        Search your Blog
      </button>
    </Link>
  );
};
