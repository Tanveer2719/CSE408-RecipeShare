import React, { useEffect, useState } from 'react';


interface ApiRecipeResponse {
    id: number;
    title: string;
    image: string;      // Optional image field
    link: string;
    online: boolean;
}

const Disclaimer = () => {
    return (
      <div className="disclaimer-container bg-yellow-200 rounded-md text-center text-sm font-medium text-gray-700 shadow-md">
        <p className="text-indigo-600 font-bold text-2xl mt-2">Important Information:</p>
        <p className="text-xl">
            The Recipe Suggesstions for this calorie amount are currently unavailable. 
            So, a Third party API is used to generate the meal plan.
        </p>
      </div>
    );
  
};

const MealPlanner: React.FC <{onClose: () => void}> = ({onClose}) => {
    return (
        <div className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-75 flex items-center justify-center overflow-y-auto py-4">
          <div className="bg-black rounded-md w-1/3 shadow-md py-6 px-6">
            
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">Note:</h2>
              <button
                className="text-white hover:text-gray-200"
                onClick={onClose}
              >
                Close
              </button>
            </div>
            <div>
              <Disclaimer/>
            </div>
        </div>
        </div>
      );

}
export default MealPlanner;