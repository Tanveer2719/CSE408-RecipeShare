// components/UploadButton.tsx
"use client";

import React, { useState } from "react";
import "animate.css";
import Link from "next/link";

const UploadButton: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <Link href="/UploadRecipe">
      <button
        className={`w-[200px] bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg w-full transition duration-300 ease-in-out transform ${
          isHovered ? "animate__animated animate__pulse" : ""
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        Share your Recipe
      </button>
    </Link>
  );
};

export default UploadButton;
