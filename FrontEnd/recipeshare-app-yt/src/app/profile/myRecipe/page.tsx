'use client';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DateTime } from 'next-auth/providers/kakao';
import { set } from 'firebase/database';
import { CustomButton } from '@/index';

interface Recipe {
  id: number;
  title: string;
  last_edited: DateTime;
  image: string;
  tags: string[];
  ratings: number;
  user: {
    name: string;
  };
}

const RecipeList: React.FC<{ onClose: () => void ; userName: string}> = ({ onClose, userName }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]); // Initialize with an empty array
  const [cookie, setCookie] = useState<string | undefined>('');
  const [isEmpty, setIsEmpty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCookie = () => {
    const cookieValue = document.cookie.split('; ')
      .find((row) => row.startsWith('jwt='))?.split('=')[1];

    // Use the setCookie callback to ensure that the state is updated before using it
    setCookie((prevCookie) => {
      if (prevCookie !== cookieValue) {
        return cookieValue;
      }
      return prevCookie;
    });
  };


  const fetchRecipes =  async() => {
    if(cookie != ''){
      const dataBody = {
        'jwt': cookie
      }
      setIsLoading(true);
      try {
        const response = await fetch('https://recipeshare-tjm7.onrender.com/api/user/recipe/get/all/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataBody)
        });

        const data = await response.json();

        if (!Array.isArray(data)) {
          console.error('Invalid response format: not an array');
          // Handle error appropriately
          return;
        }
        if (data.length === 0) {
          setIsEmpty(true);
        } else {
          setRecipes(data);
        }
        
        if(data.length === 0){
          setIsEmpty(true);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      fetchCookie();
      console.log('cookie: '+ cookie);  
      await fetchRecipes();
      console.log(recipes.length);
    };

    fetchData();
  }, [cookie]);

  const handleOnEdit = async(id: number) => {
    setIsLoading(true); // Start loading

        const dataBody = {
            'recipe_id': id
        }
        console.log(dataBody);

        try {
            //
            const response = await fetch('https://recipeshare-tjm7.onrender.com/api/recipe/get/',{
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(dataBody)
            });
            const data = await response.json();
            console.log(typeof data);
            console.log(data);
            setIsLoading(false); // Stop loading after response

            // Encode the recipes as a JSON string in the URL parameter
            const encodedRecipes = encodeURIComponent(JSON.stringify(data));
            const redirectUrl = `/editrecipe/${id}?recipes=${encodedRecipes}`;
            window.location.href = redirectUrl;

        } catch (error) {
            console.error('Error fetching user details:', error);
            setIsLoading(false); // Stop loading on error
        }   
    }

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto">
     <div className="bg-white p-8 rounded-md max-w-screen-md w-full h-full overflow-y-auto">
        <button className="absolute top-2 right-2 text-white bg-red-500 hover:bg-red-600 w-10 h-10 rounded-md" 
        onClick={() => {
          window.location.href ='/profile';
        }}
        >
        Close
        </button>
        <h2 className="text-2xl font-bold mb-4">Recipes</h2>
        {isLoading && <h3 className="text-lg font-semibold cursor-pointer">Loading...</h3>}

      {recipes.length === 0 ? (<h3 className="text-lg font-semibold cursor-pointer">No recipes found</h3>
        ):(
          recipes.map((recipe) => (
            <div key={recipe.id} className="card mb-4 px-4 py-3 flex ">
              <div className="card-img-top">
                <Link href={`/recipe/${recipe.id}`}>
                  <Image
                    src={recipe.image}
                    alt={recipe.title}
                    className="cursor-pointer hover:opacity-75"
                    layout="fixed"
                    height="200"
                    width="200"
                  />
                </Link>
              </div>
              <div className="card-body">
                <Link href={`/recipe/${recipe.id}`}>
                  <h5 className="card-title ml-2 text-lg font-semibold cursor-pointer">{recipe.title}</h5>
                </Link>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <p className="card-text ml-2 text-gray-500">{`Published on ${new Date(recipe.last_edited).toLocaleDateString()}`}</p>
                  <CustomButton 
                    otherStyles="btn btn-sm btn-outline-danger text-red-500 hover:bg-red-200 w-20 h-10 rounded-full ml-2" 
                    onClick={() => {handleOnEdit(recipe.id)}}
                    title="Edit"
                    type="button"
                  />
                </div>
              </div>
          </div>
        ))
      )}
      </div>
    </div>
  );
};

export default RecipeList;
