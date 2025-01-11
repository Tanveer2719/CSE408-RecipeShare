import Image from 'next/image';
import Link from 'next/link';
import mealplan from "../../../public/meal_plan.png";
import recipeimage from "../../../public/recipe_image.jpg";
import recipeingredients from "../../../public/recipe_ingredients.jpg";

const ExplorePage = () => {
  return (
    <div className="bg-container">
      <div className="bg-image" style={{ backgroundImage: `url("/background.jpg")`}}></div>
      <div className="flex justify-center mt-20">
        <div className="flex flex-col items-center border border-gray-200 rounded-lg p-8 m-4 h-96 w-2/5 hover:bg-gray-100 hover:shadow-md transition duration-300 bg-blue-100">
          <Link href="/get/recipe/fromPhoto">
            
              <div className="w-80 h-60 mb-4 relative">
                <Image src={recipeimage} alt="Recipe from Photo" layout="fill" objectFit="cover" />
              </div>
            
          </Link>
          <Link href="/get/recipe/fromPhoto">
            <span className="text-xl font-semibold text-blue-600 hover:underline mb-4">Recipe from Photo</span>
          </Link>
          <p className="text-lg text-center text-gray-700">
            Upload a photo of a dish and discover recipes similar to it using image recognition technology.
          </p>
        </div>
      </div>  
      
      <div className="flex justify-center py-5"> 
        <div className="flex flex-col items-center border border-gray-200 rounded-lg p-8 m-4 h-96 w-2/5 hover:bg-gray-100 hover:shadow-md transition duration-300 bg-blue-100">
          <Link href="/get/recipe/fromIngredients">
            
              <div className="w-80 h-60 mb-4 relative">
                <Image src={recipeingredients} alt="Recipe from Ingredients" layout="fill" objectFit="cover" />
              </div>
            
          </Link>
          <Link href="/get/recipe/fromIngredients">
            <span className="text-xl font-semibold text-blue-600 hover:underline mb-4">Recipe from Ingredients</span>
          </Link>
          <p className="text-lg text-center text-gray-700">
            Enter the ingredients you have, and well suggest recipes you can make with them.
          </p>
        </div>
      </div>  
      
      <div className="flex justify-center py-5">
        <div className="flex flex-col items-center border border-gray-200 rounded-lg p-8 m-4 h-96 w-2/5 hover:bg-gray-100 hover:shadow-md transition duration-300 bg-blue-100">
          <Link href="/MealPlanner">
            
              <div className="w-80 h-60 mb-4 relative">
                <Image src={mealplan} alt="Meal Planner" layout="fill" objectFit="cover" />
              </div>
            
          </Link>
          <Link href="/MealPlanner">
            <span className="text-xl font-semibold text-blue-600 hover:underline mb-4">Meal Planner</span>
          </Link>
          <p className="text-lg text-center text-gray-700">
            Plan your meals based on your calorie intake and dietary preferences, customized to your weight, height, and more.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
