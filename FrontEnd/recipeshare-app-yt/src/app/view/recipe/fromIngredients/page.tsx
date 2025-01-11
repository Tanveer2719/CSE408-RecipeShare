"use client";
import CustomButton from '@/components/CustomButton';
import React, { useState,useEffect } from 'react'

interface RecipeFromPhotoProps {
    id:number,
    title: string,
    image:string,
    ingredients: string[],
    link:string,
    online:boolean
}

const Disclaimer = () => {
  return (
    <div className="disclaimer-container bg-yellow-200 px-4 mt-10 rounded-md text-center text-sm font-medium text-gray-700 shadow-md">
      <p className="text-indigo-600 font-bold text-lg mb-2">Important Information:</p>
      <p>This feature utilizes:</p>
      <ul className="flex justify-center space-x-2 mt-2">
        <li>
          <a
            href="https://spoonacular.com/food-api/docs/find-recipes-by-ingredients"
            className="inline-block px-2 py-1 text-center text-white rounded-md bg-indigo-600 hover:bg-indigo-700 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
          >
            Spoonacular API
          </a>
        </li>
      </ul>
      <p className="mt-4">Please refer to their respective terms of service for usage limitations and licensing information.</p>
    </div>
  );
};




const Page = () => {
    const [recipes, setRecipes] = useState<RecipeFromPhotoProps[]>([]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
          const urlParams = new URLSearchParams(window.location.search);
          const encodedRecipes = urlParams.get('recipes');
    
          if (encodedRecipes) {
            const parsedRecipes = JSON.parse(decodeURIComponent(encodedRecipes));
            setRecipes(parsedRecipes);            
          } else {
            // Handle missing recipes parameter
            console.log('No recipes found in URL parameter')
          }
        }
      }, []);

      return (
        <div>  
          <div
              className="fixed top-0 left-0 w-full h-screen z-[-1]"
          >
            <img
                className="object-cover w-full h-full"
                src="https://images.unsplash.com/photo-1557683316-973673baf926?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                alt="Background"
            />
          </div>
          
          <div className="container mx-auto px-4 mt-8 mb-20 bg-white rounded py-2">
            <ul className="recipe-list list-disc space-y-4">
              {recipes.map((recipe) => (
                <li key={recipe.title} className="recipe-item bg-gray-100 p-4 rounded-md hover:shadow-md hover:bg-gray-200">
                  <div className="flex items-center space-x-4">
                    <div className="recipe-image-container w-32 h-32 overflow-hidden rounded-md mb-4">
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="recipe-image w-full h-full object-cover"
                      />
                    </div>
                    <div className="recipe-info flex-grow mx-15 px-4">
                      <h2 className="recipe-title font-bold text-lg text-gray-800">
                        {recipe.title}
                      </h2>
                      <ul className="ingredient-list text-orange-700 list-disc space-y-1">
                        {recipe.ingredients.map((ingredient, index) => (
                          <li key={`${ingredient}-${index}`} className="ingredient-item">
                            {ingredient}
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
                        onClick={()=> {
                          const redirectUrl = `/recipe/${recipe.id}`;
                          // Redirect to the recipe details page
                          window.location.href=redirectUrl;
                        }
                      }
                      />
                    )
                } 
                </li>
              ))}
            </ul>
            <div className="py-4">
              <Disclaimer />
            </div>
          </div>
        </div>
    );
}

export default Page