"use client";

import { useState, useEffect } from "react";

interface RatingProps {
  maxStars: number;
  reviewId: number;
  onAddRating: (rating: number, reviewId: number) => void;
}

const Rating: React.FC<RatingProps> = ({ maxStars, reviewId, onAddRating }) => {
  const [rating, setRating] = useState<number>(0);
  // index
  const [index, setIndex] = useState<number>(0);

  useEffect(() => {
    const storedRating = localStorage.getItem(`rating_${reviewId}`);
    if (storedRating) {
      setRating(parseInt(storedRating));
    }
  }, [reviewId]);

  const handleClick = (value: number) => {
    setRating(value);
    localStorage.setItem(`rating_${reviewId}`, value.toString());
    onAddRating(rating, reviewId);
  };

  const handleAddRating = () => {
    onAddRating(rating, reviewId);
  };

  return (
    <div>
      {[...Array(maxStars)].map((_, index) => (
        <span
          key={index}
          className={`cursor-pointer ${
            index < rating ? "text-yellow-500" : "text-gray-300"
          } text-[30px] tracking-widest`}
          onClick={() => handleClick(index + 1)}
        >
          ★
        </span>
      ))}
      <button
        onClick={handleAddRating}
        className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
      >
        Add Rating
      </button>
    </div>
  );
};

export default Rating;
