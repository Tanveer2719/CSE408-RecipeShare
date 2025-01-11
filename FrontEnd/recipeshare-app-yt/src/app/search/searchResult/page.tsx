
'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import  CustomButton  from '../../../components/CustomButton';


interface RecipeFromSearch {
    id:number,
    title: string,
    image:string,
    ingredients: {
      amount: number;
      unit: string;
      ingredient: string;
  
    }[];
    link:string,
    online:boolean
}

const SearchResult = () => {
  const [recipes, setRecipes] = useState<RecipeFromSearch[]>([]);
  

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const encodedRecipes = urlParams.get('recipes');
      console.log(encodedRecipes);

      if (encodedRecipes) {
        const parsedRecipes = JSON.parse(decodeURIComponent(encodedRecipes));
        console.log(parsedRecipes);
        setRecipes(parsedRecipes);
      } else {
        console.error('No recipes found in URL parameter');
      }
      console.log(recipes);
    }
  }, []);

  return (
    <div className="container mx-auto px-4 mt-8 mb-20 bg-white rounded py-2">
      <ul className="recipe-list list-disc space-y-4">
        {recipes.length === 0 ? (
          <div className="flex justify-center items-center h-32">
            <p className="font-bold text-xl">No recipes found.</p>
          </div>
        ) : (
          recipes.map((recipe) => (
            <li
              key={recipe.title}
              className="recipe-item bg-gray-100 p-4 rounded-md hover:shadow-md hover:bg-gray-200"
            >
              <div className="flex items-center space-x-4">
                <div className="recipe-image-container w-32 h-32 overflow-hidden rounded-md mb-4">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="recipe-image w-full h-full object-cover"
                  />
                </div>
                <div className="recipe-info flex-grow mx-15 px-4">
                  <h2 className="recipe-title font-bold text-lg text-gray-800">{recipe.title}</h2>
                  <ul className="ingredient-list text-orange-700 list-disc space-y-1">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={`${ingredient}-${index}`} className="ingredient-item">
                       {`${ingredient.amount} ${ingredient.unit} of ${ingredient.ingredient}`}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              {recipe.online ? (
                <a
                  href={recipe.link}
                  className="recipe-link inline-flex items-center px-4 py-2 text-base font-medium text-indigo-600 hover:bg-indigo-100 rounded-md focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  See recipe details
                </a>
              ) : (
                <CustomButton
                  type="button"
                  title="View Recipe"
                  otherStyles="px-4 py-2 text-base font-medium rounded-md"
                  onClick={() => {
                    const redirectUrl = `/recipe/${recipe.id}`;
                    // Redirect to the recipe details page
                    window.location.href = redirectUrl;
                  }}
                />
              )}
            </li>
          ))
        )}
      </ul>
      <div className="py-4"></div>
    </div>
  );
};

export default SearchResult;
