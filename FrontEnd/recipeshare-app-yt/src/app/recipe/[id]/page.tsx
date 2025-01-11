"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import RecipeDisplay from "@/components/RecipeDetails";
import { RatingsupDataType, CommentsupDataType } from "@/Types";
import Rating from "@/components/Ratings";

interface ApiRecipeResponse {
  id: number;
  title: string;
  description: string;
  calories: string;
  meal_type:string;
  servings: string;
  cooking_time: string;
  ingredients: {
    amount: number;
    unit: string;
    ingredient: string;
  }[];
  image: string; // Optional image field
  publication_date: string;
  last_modification_date: string;
  tags: string[];
  ratings: number;
  user: {
    name: string;
    id:number;
    // Add other user-related fields based on your User model
  };
  steps: {
    // Assuming image is an array of strings based on your JSON structure
    order: number;
    step: string;
    image: string;
  }[];
  comments: {
    id: number;
    text: string;
    date: string;
    user: {
      id: number;
      name: string;
      // Add other user-related fields based on your User model
    };
  }[];
}
const Recipe: React.FC<{ ratingsUpData: RatingsupDataType, commentsUpData: CommentsupDataType }> = ({ ratingsUpData, commentsUpData }) => {
  const [recipeData, setRecipeData] = useState<ApiRecipeResponse | null>(null);
  const [showComments, setShowComments] = useState(false); // Track whether to show comments
  const { id: recipeId } = useParams(); // Destructure the id property
  console.log(recipeId); // Output: '12'
  const [cookie, setCookie] = React.useState<string | undefined>('');
  const [rating, setRating] = useState<number>(0);
  const [recipe_id, setId] = useState<string>('');
  const [ratings, setRatings] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [ratingsData, setRatingsData] = React.useState<Record<string, any>>({
    recipe_id: "",
    jwt: cookie,
    ratings: "",
  });
  const [commentsData, setCommentsData] = React.useState<Record<string, any>>({
    recipe_id: "",
    jwt: cookie,
    text: "",
    user: ""
  });

  const CommentsupData: CommentsupDataType = (key: string, value: any) => {

    setCommentsData(prevState => ({
      ...prevState,
      [key]: value
    }));
    // console.log(recipeData);
  };
  const RatingsupData: RatingsupDataType = (key: string, value: any) => {


    setRatingsData(prevState => ({
      ...prevState,
      [key]: value
    }));
    // console.log(recipeData);
  };

  const getCookie = () => {
    const cookieValue = document.cookie
      .split('; ')
      .find((row) => row.startsWith('jwt='))?.split('=')[1];
    console.log(cookieValue);

    RatingsupData('jwt', cookieValue);
    CommentsupData('jwt', cookieValue);
    console.log(ratingsData);
    setCookie(cookieValue);
  };

  useEffect(() => {
    getCookie();
    const fetchData = async () => {

      const storedRating = localStorage.getItem(`rating_${recipeId}`);
      if (storedRating) {
        setRating(parseInt(storedRating));
      }

      RatingsupData('recipe_id', recipeId);
      CommentsupData('recipe_id', recipeId);
      console.log(recipeId);
      try {
        const response = await fetch(
          "https://recipeshare-tjm7.onrender.com/api/recipe/get/",
          {
            method: "POST",
            headers: {
              //Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhcjEzNzM3NUBnbWFpbC5jb20iLCJleHAiOjE3MDYzMjY4MTMsImlhdCI6MTcwNjMyMzIxM30.xLX9HeailgdxCvDqcRsUGvctctH6rDnWpPpiDmTLbUs',
            },
            body: JSON.stringify({ recipe_id: recipeId?.toString() || "" }),
          }
        );
        const data: ApiRecipeResponse = await response.json();
        console.log(data);
        setRecipeData(data);
      } catch (error) {
        console.error("Error fetching recipe data:", error);
      }
    };

    fetchData();
  }, []); // The empty dependency array ensures that the effect runs once when the component mounts

  const addRating = async (event: React.FormEvent<HTMLFormElement>) => {

    if (!cookie) {
      alert('Cookie not found. Please log in again.');
      return;
    }

    event.preventDefault(); // Moved the event.preventDefault() call to the beginning
    console.log(ratingsData);

    try {
      const response = await fetch('https://recipeshare-tjm7.onrender.com/api/recipe/addrating/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ratingsData),
      });
      const data = await response.json();
      console.log(data);
      // Update the recipe data with the new average rating

    } catch (error) {
      console.error('Error adding rating:', error);
    }
  };

  const handleAddComment = async () => {


    if (!cookie) {
      alert('Cookie not found. Please log in again.');
      return;
    }
    console.log(commentsData);
    try {
      const response = await fetch('https://recipeshare-tjm7.onrender.com/api/recipe/comment/add/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentsData),
      });
      const data = await response.json();
      console.log(data);

      // Update the blog data with the new comment

    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };



  if (!recipeData) {
    return <div>Loading...</div>; // You might want to add a loading state
  }

  
  const StarRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i}>★</span>);
    }

    // Add half star if applicable
    if (hasHalfStar) {
      stars.push(<span key="half">½</span>);
    }

    return <div className="flex text-[30px] tracking-widest">{stars}</div>;
  };

  const goToUser = (id: number) => () => {
    window.location.href = `/user/${id}`;
  }


  const handleAddRating = (rating: number, reviewId: number) => {
    // get the current rating from local storage
    // const currentRating = getRatingFromLocalStorage(reviewId);
    setRating(rating);
    // console.log(`Adding rating ${rating} for review ID ${reviewId}`);
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };
  return (
    <div className="bg-container">
      <div
        className="bg-image"
        style={{ backgroundImage: `url("/recipe_bg.jpg")` }}
      ></div>
      <div className="p-4 lg:px-20 xl:px-40 rounded-md">
        {/* IMAGE AND TITLE */}
        {recipeData.image && (
          <div className="relative w-full h-1/3 md:h-1/2 lg:w-1/2 bg-white rounded-t-md">
            <Image
              src={recipeData.image}
              alt=""
              className="object-cover"
              layout="responsive"
              height="100"
              width="100"
            />
          </div>
        )}
        <div className="bg-lime-100 hover:bg-lime-400 flex justify-between items-center mt-4 rounded-md">
          <h1 className="text-3xl font-bold uppercase xl:text-5xl mt-1 mb-1 ml-4">
            {recipeData.title}
          </h1>
        </div>
        {/* USER INFO */}

        <div className="bg-lime-100 hover:bg-lime-400  mt-4 rounded-md">
          <button className="text-blue-500 font-bold hover:underline ml-4" onClick={goToUser(recipeData.user.id)}>By {recipeData.user.name}</button>
          <p className="ml-4 text-lg">
            Cooking Time {recipeData.cooking_time} minutes
          </p>
        </div>

        {/* TAGS */}
        <div className="bg-lime-100 hover:bg-lime-400 mt-4 rounded-md">
          <p className="text-lg text-indigo-500 font-bold mb-1 ml-4">Tags:</p>
          <p className="text-lg text-red-500 ml-4">
            {recipeData.tags.join(", ")}
          </p>
          <div className="flex items-center">
            <p className="text-lg text-indigo-500 font-bold mt-4 mb-1 ml-4 mr-2">Meal Type:</p>
            <p className="text-lg text-red-500 mt-3 ml-4">{recipeData.meal_type}</p>
            <p className="text-lg text-indigo-500 font-bold mt-4 mb-1 ml-4 mr-2">Calories:</p>
            <p className="text-lg text-red-500 mt-3 mr-4">{recipeData.calories}</p>
            <p className="text-lg text-indigo-500 font-bold mt-4 mb-1 ml-4 mr-2">Servings:</p>
            <p className="text-lg text-red-500 mt-3 ml-4">{recipeData.servings}</p>
          </div>
        </div>

        {/* Ratings Box */}
        <div className="bg-lime-100 hover:bg-lime-400 mt-4 rounded-md">
          <div className="flex items-center">
            <p className="text-lg text-indigo-500 font-bold mb-2 mx-3.5">Rating:</p>
            <p className="text-lg text-yellow-500 mx-3.5">{StarRating(rating)}</p>
            <p className="text-[30px] text-yellow-500">{rating}</p>
          </div>
          {/* Add a form to submit a rating */}
          {/* <form onSubmit={addRating} className="flex-1 flex items-center">

            <input
              type="text"
              id="ratings"
              value={ratings}
              onChange={(e) => { setRatings(e.target.value); RatingsupData("ratings", e.target.value); }}
              className="w-half border rounded-md px-3 py-2 mt-1"
              style={{ padding: '10px' }}
              placeholder="Enter rating(1-5)..."
            />
            <button type="submit"><p className="text-lg text-red-700 font-bold mb-2">Submit</p></button>
          </form> */}
        </div>

        {/* SUMMARY */}
        <div className="mt-8 p-4 rounded-md bg-lime-100 hover:bg-lime-400">
          <h2 className="text-2xl font-bold mb-2">Description</h2>
          <p className="font-serif text-lg italic">{recipeData.description}</p>
        </div>

        {/* INGREDIENTS */}
        <div className="bg-lime-100 hover:bg-lime-400 mt-8 rounded-md">
          <h2 className="text-2xl font-bold mb-2 mt-2 ml-4">Ingredients</h2>
          <ul className="list-disc pl-4 mb-2 mt-2 ml-4">
            {recipeData.ingredients.map((ingredientGroup, index) => (
              <li key={index}>
                {`${ingredientGroup.amount} ${ingredientGroup.unit} of ${ingredientGroup.ingredient}`}
              </li>
            ))}
          </ul>
        </div>

        {/* INSTRUCTIONS */}

        <div className="text-[50px] text-center text-white">Instructions</div>

        <RecipeDisplay
          instructions={recipeData.steps.map((step) => step.step)}
          images={recipeData.steps.map((step) => step.image)}
        />

        {/* Add Comment Button */}
        <div className="mt-4">
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            onClick={toggleComments}
          >
            {showComments ? "Close Comments" : "Show Comments"}
          </button>
        </div>
        {/* COMMENTS */}
        {showComments && (
          <div className="mt-8 bg-gray-100 p-4 rounded-md">
            <h2 className="text-3xl font-bold text-blue-500 mb-2">Comments</h2>
            <ul>
              {recipeData.comments.map((comment) => (
                <li key={comment.id} className="text-lg mb-2">
                  <p>{comment.text}</p>
                  <p className="text-gray-500">
                    <button onClick={goToUser(comment.user.id)} className="text-blue-500 font-bold hover:underline">By {comment.user.name} </button>
                     {/* User {comment.user.name}*/} on {new Date(comment.date).toLocaleDateString()} 
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* Add Rating */}
        <div className="flex justify- center mt-10">
          <Rating
            maxStars={5}
            reviewId={recipeData.id}
            onAddRating={handleAddRating}
          />
        </div>

        {/* ADD COMMENT FORM */}
        <div className="bg-lime-100 hover:bg-lime-400  mt-8 rounded-md">
          <h2 className="text-2xl font-bold mb-4 ml-4">Add a Comment</h2>
        </div>
        <div className="mt-2">
          <textarea
            className="w-full p-6 border rounded-md "
            placeholder="Type your comment here..."
            value={text}
            onChange={(e) => { setText(e.target.value); CommentsupData("text", e.target.value); }}
            style={{ backgroundColor: "white" }}
          />
          <button
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            onClick={handleAddComment}
          >
            Add Comment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Recipe;
