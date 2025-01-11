import React, { useEffect, useState } from 'react';
import Overlay from './overlay';


interface ApiRecipeResponse {
    id: number;
    title: string;
    image: string;      // Optional image field
    link: string;
    online: boolean;
}

const Disclaimer = () => {
    return (
      <div className="disclaimer-container bg-yellow-200 px-4 mt-10 rounded-md text-center text-sm font-medium text-gray-700 shadow-md">
        <p className="text-indigo-600 font-bold text-lg mb-2">Important Information:</p>
        <p>This feature utilizes:</p>
        <ul className="flex justify-center space-x-2 mt-2">
          <li>
            <a
              href="https://spoonacular.com/food-api/docs#Generate-Meal-Plan"
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

const MealPlanner: React.FC <{onClose: () => void; calorieAmount: number }> = ({onClose, calorieAmount}) => {
    const [cookie, setCookie] = React.useState<string | undefined>('');
    const [recipes, setRecipeData] = useState<ApiRecipeResponse[]>([]);
    const [origin, setOrigin] = useState<string>('');
    const [view, setView] = useState<string>('');
    const [isLoading, setLoading] = useState<boolean>(true);
    const [totalCalories, setTotalCalories] = useState<number>(0);

    const getCookie = () => {
        const cookieValue = document.cookie
        .split('; ')
        .find((row) => row.startsWith('jwt='))?.split('=')[1];
        console.log(cookieValue);
        setCookie(cookieValue);
    };

    useEffect(() => {
        getCookie();

        const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://recipeshare-tjm7.onrender.com/api/findrecipe/calorie/', {
            method: 'POST',
            headers: {},
            body: JSON.stringify({ "targetCalories": calorieAmount}),
            });
            // const data: ApiRecipeResponse = await response.json();
            const data = await response.json();
            setOrigin(data[0].origin);
            setView(data[0].origin);
            setTotalCalories(data[0].calories);
            setRecipeData(data.slice(1));
            setLoading(false);
        } catch (error) {
            console.error('Error fetching recipe data:', error);
        }
        };
    fetchData();
  }, []); // The empty dependency array ensures that the effect runs once when the component mounts

    const handleRecipeClick = (recipe: ApiRecipeResponse) => {
        const redirectUrl = `/recipe/${recipe.id}`;
        window.open(redirectUrl, '_blank');
    }

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-75 flex items-center justify-center overflow-y-auto py-4">
          <div className="bg-gradient-to-b from-teal-500 to-cyan-500 rounded-md w-3/4 shadow-md py-6 px-6">
            
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">Proposed Recipe List</h2>
              <button
                className="text-white hover:text-gray-200"
                onClick={onClose}
              >
                Close
              </button>
            </div>

            {isLoading && (
                <div>
                    Loading
                </div>
            )}

            {view === 'online' &&(
                <Overlay
                onClose={() => setView('')}
                />
            )}

            <ul className="recipe-list list-disc space-y-4 ">
              {recipes.map((recipe) => (
                <li
                  key={recipe.title}
                  className="recipe-item hover:shadow-md hover:bg-gray-200 bg-gray-100 p-4 rounded-md"
                >
                  <div className="flex items-center space-x-4">
                    
                    <div className="recipe-image-container w-40 h-28 overflow-hidden rounded-md mb-4">
                      {/* check if the origin is database or online ?
                        if database then use the image from
                        else use custom image 
                      */}
                      <img
                        src={origin === "database" ? recipe.image : "recipe_image.jpg"}
                        alt={recipe.title}
                        className="recipe-image w-full h-full object-cover"
                      />
                    </div>

                    <div className="recipe-info flex-grow mx-20 px-6">
                      <h2 className="recipe-title font-bold text-lg text-gray-800">
                        {recipe.title}
                      </h2>
                    </div>

                  </div>
                  {recipe.online ? (
                    <a
                      href={recipe.link}
                      target="_blank"
                      rel="noopener noreferrer"  // This is recommended for security reasons
                      className="recipe-link inline-flex items-center px-4 py-2 text-base font-medium text-indigo-600 hover:bg-indigo-100 rounded-md focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      See recipe details
                    </a>
                  ) : (
                    <button
                      className="px-4 py-2 text-base font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={() => handleRecipeClick(recipe)}
                    >
                      View Recipe
                    </button>
                  )}
                </li>
              ))}
            </ul>

            <div className="flex justify-between items-center mt-4">
                <p className="text-lg font-bold text-white">Total Calories: {totalCalories}</p>
            </div>    

            {origin === "online" && (
                <div className="">
                    <Disclaimer />
                </div>
            )}
          </div>
        </div>
      );

}
export default MealPlanner;