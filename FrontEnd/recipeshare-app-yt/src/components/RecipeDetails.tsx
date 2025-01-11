"use client";
import Image from "next/image";
import React, { useState } from "react";
import def from "./../../public/blog_bg.jpg";

const RecipeDisplay: React.FC<{ instructions: string[]; images: string[] }> = ({
  instructions,
  images,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNextStep = () => {
    if (currentStep < instructions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="relative flex justify-center bg-lime-100  hover:bg-lime-120 p-8 rounded-md">
      {/* <div className="w-1/2 p-4">
        <img
          src={image}
          alt={`Step ${currentStep + 1}`}
          className="w-full mb-4"
        />
      </div> */}

      <div className="w-1/2 p-4">
        {images[currentStep] ? (
          <img
            src={images[currentStep]}
            alt={`Step ${currentStep + 1}`}
            className="w-full mb-4 rounded-md"
          />
        ) : (
          <Image
          className="mb-4 py-2 rounded-md"
          src={def}
          alt="Logo"
          width={650}
          height={600}
          priority
        />
        )}
      </div>

      <div className="w-1/2 p-4 text-black font-serif">
        {instructions.map((step, index) => (
          <p
            key={index}
            className={`transition-all duration-300 ${currentStep === index
                ? "font-bold text-3xl bg-red-100 rounded-lg p-4 mb-4"
                : "font-medium text-sm text-lime-100"
              }`}
          >
            {step}
          </p>
        ))}
        <div className="absolute bottom-4 right-4 mb-2">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
            onClick={handlePreviousStep}
            disabled={currentStep === 0}
          >
            Previous
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleNextStep}
            disabled={currentStep === instructions.length - 1}
          >
            Next
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-gray-500 rounded-lg">
          <div
            className="h-full bg-blue-500 rounded-full"
            style={{
              width: `${((currentStep + 1) / instructions.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDisplay;
