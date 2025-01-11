// Import necessary modules from Next.js and React
'use client'
import Link from 'next/link'; // Import Link from Next.js for navigation
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import BlogList from './bloglist';
import RecipeList from './recipes';


interface UserDetail {
  id: number;
  name: string;
  email: string;
  image: string | null;
  date_joined: string;
  last_login: string;
}

// Create the ProfilePage component
const ProfilePage = () => {

  const [userDetails, setUserDetails] = useState<UserDetail | null>(null);
  const {id: userId } = useParams(); // Destructure the id property

  const fetchUserDetails = async () => {
    const dataBody = {
      'user_id': userId
    }
    console.log(dataBody);
    try {
      const response = await fetch('https://recipeshare-tjm7.onrender.com/api/user/detailsFromId/',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataBody)
      });
      const data = await response.json();
      console.log(data);
      setUserDetails(data);  
      
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };
  
  
  useEffect(() => {
    fetchUserDetails(); 
  }, []);
  
  console.log('userDetails:' + userDetails);

  const [showBlogs, setShowBlogs] = useState(false);
  const [showRecipe, setShowRecipe] = useState(false);

  const handleOpenBlogs = () => {
    setShowBlogs(true);
  };

  const handleOpenRecipes = () => {
    setShowRecipe(true);
  }

  const handleCloseRecipes = () => {
    setShowRecipe(false);
  }

  const handleCloseBlogs = () => {
    setShowBlogs(false);
  };
  
  return (
    <div className="bg-container">
      <div
        className="bg-image"
        style={{ backgroundImage: `url("/recipe_bg.jpg")` }}
      ></div>
        {userDetails && (
          <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl w-full mb-8 mt-40 ml-64">
            <h1 className="text-3xl font-bold uppercase mb-4">Profile</h1>
            <div className="flex items-center mb-6">
              <div className="rounded-full overflow-hidden h-24 w-24 bg-gray-300">
                {userDetails.image ? (
                  <img src={userDetails.image} alt="Profile" className="object-cover w-full h-full" />
                ) : (
                  <span className="text-gray-500 text-3xl flex items-center justify-center h-full w-full">
                    No Image
                  </span>
                )}
              </div>
              <div className="ml-6">
                <p className="text-xl font-semibold">{userDetails.name}</p>
                <p className="text-gray-600">{userDetails.email}</p>
              </div>
            </div>
            <div className="mb-4">
              <p className="mb-2">
                <span className="font-semibold">Date Joined:</span> {new Date(userDetails.date_joined).toLocaleString()}
              </p>
              <p>
                <span className="font-semibold">Last Login:</span> {new Date(userDetails.last_login).toLocaleString()}
              </p>
            </div>

            {showBlogs && <BlogList onClose={handleCloseBlogs} id={userDetails.id} />}
            {showRecipe && <RecipeList onClose={handleCloseRecipes} id={userDetails.id} />}
            
            <div className="flex justify-center gap-5">
            <button onClick={handleOpenBlogs} className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4">
              View Blogs
            </button>
            <button onClick={handleOpenRecipes} className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4">
              View Recipes
            </button>
            </div>
          </div>
        )}        
    </div>
  );
};

// Export the ProfilePage component
export default ProfilePage;
