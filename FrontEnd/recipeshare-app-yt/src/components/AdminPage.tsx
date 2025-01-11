"use client";
import React, { useEffect } from 'react'
import { CustomButton } from '..';

const AdminPage = () => {

    interface Recipe {
        id: number;
        title: string;
        description: string;
        image: string;
        // Define other recipe properties based on your data structure
    }

    interface Blog {
        id: number;
        title: string;
        image: string;
        summary:string;
        // Define other recipe properties based on your data structure
    }

    interface User{
        id:number;
        name:string;
        image:string;
        email:string;
    }

    const [recipes, setRecipes] = React.useState<Recipe[]>([]);
    const [blogs, setBlogs] = React.useState<Blog[]>([]);
    const [users, setUsers] = React.useState<User[]>([]);

    const[selectedTable, setSelectedTable] = React.useState('')
    const [isLoading, setIsLoading] = React.useState(false);
    const [cookie, setCookie] = React.useState<string|undefined>('');

    useEffect(() => {
        const cookieValue = document.cookie.split('; ')
        .find((row) => row.startsWith('jwt='))?.split('=')[1];

        setCookie(cookieValue);
    }, []);

    const handleDeleteRecipe = async (recipeId: number) => {
        try {
          const response = await fetch('https://recipeshare-tjm7.onrender.com/api/recipe/delete/', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ jwt:cookie, recipe_id: recipeId }),
          });
      
          console.log(response);
      
          // Update the recipes state to remove the deleted recipe
          setRecipes(recipes.filter((recipe) => recipe.id !== recipeId));
      
          console.log(`Recipe with ID ${recipeId} deleted successfully.`);
        } catch (error) {
          console.error('Error deleting recipe:', error);
          // Handle error appropriately (e.g., display an error message to the user)
        }
    };

    const handleDeleteBlog = async (blogId: number) => {
        try {
            const response = await fetch('https://recipeshare-tjm7.onrender.com/api/blog/delete/', {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ 'jwt':cookie , 'blog_id': blogId}),
            });
        
            console.log(response);
        
            // Update the recipes state to remove the deleted recipe
            setBlogs(blogs.filter((blog) => blog.id !== blogId));
        
            console.log(`Blog with ID ${blogId} deleted successfully.`);
          } catch (error) {
            console.error('Error deleting blog:', error);
            // Handle error appropriately (e.g., display an error message to the user)
          }
    }
    
    const handleDeleteUser = async (userId: number) => {
        try {
            const response = await fetch('https://recipeshare-tjm7.onrender.com/api/user/delete/', {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({'jwt':cookie, 'user_id': userId }),
            });
        
            console.log(response);
        
            // Update the recipes state to remove the deleted recipe
            setUsers(users.filter((user) => user.id !== userId));
        
            console.log(`User with ID ${userId} deleted successfully.`);
          } catch (error) {
            console.error('Error deleting blog:', error);
            // Handle error appropriately (e.g., display an error message to the user)
          }
    }

    const handleRecipeDivClick = (recipeId: number) => {
        console.log(`Recipe with ID ${recipeId} clicked`);
        const redirectUrl = `/recipe/${recipeId}`;
        // Redirect to the recipe details page
        window.location.href=redirectUrl;

    }

    const handleBlogViewClick = (blogId: number) => {
        console.log(`Blog with ID ${blogId} clicked`);
        const redirectUrl = `/blog/${blogId}`;
        // Redirect to the recipe details page
        window.location.href= redirectUrl;
    }

    const handleUserViewClick =(userId:number) =>{
        console.log(`Blog with ID ${userId} clicked`);
        const redirectUrl = `user/${userId}`;
        // Redirect to the recipe details page
        window.location.href= redirectUrl;
    }

    const handleRecipeClick = async() => {
        setSelectedTable('recipes');
        setIsLoading(true);
        const response = await fetch('https://recipeshare-tjm7.onrender.com/api/recipe/get/all/',{
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
        });
        const data = await response.json();
        setIsLoading(false);
        console.log(typeof data);
        console.log(data);
        setRecipes(data);
    }
    
    const handleUserClicked = async() => {
        setSelectedTable('users');
        setIsLoading(true);
        const response = await fetch('https://recipeshare-tjm7.onrender.com/api/user/get/all/',{
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
        });
        const data = await response.json();
        setIsLoading(false);
        console.log(typeof data);
        console.log(data);
        setUsers(data);
    }

    const handleBlogsClick = async() => {
        setSelectedTable('blogs');
        setIsLoading(true);
        const response = await fetch('https://recipeshare-tjm7.onrender.com/api/blog/get/all/',{
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
        });
        const data = await response.json();
        setIsLoading(false);
        console.log(typeof data);
        console.log(data);
        setBlogs(data);
    }
    
    return (
        <div>
            <div className="fixed top-0 left-0 w-full h-screen z-[-1]">
            <img
                className="object-cover w-full h-full"
                src="https://images.unsplash.com/photo-1557683316-973673baf926?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                alt="Background"
            />
            </div>

            <div className="container mx-auto px-4">
                <div className="flex justify-center items-center gap-4 mb-4 py-2">
                    <h1 className="text-3xl font-bold text-slate-50 mr-4">Welcome to Admin Page</h1>
                </div>
                <div>
                    <div className="flex justify-center py-3 gap-4 mb-4">
                        <button
                            className={`bg-black text-white py-2 px-4 rounded-md focus:outline-none ${
                            selectedTable === 'recipes' ? 'bg-green-700' : ''
                            }`}
                            onClick={handleRecipeClick}
                        >
                            Recipes
                        </button>
                        <button
                            className={`bg-black text-white py-2 px-4 rounded-md focus:outline-none ${
                            selectedTable === 'blogs' ? 'bg-green-700' : ''
                            }`}
                            onClick={handleBlogsClick}
                        >
                            Blogs
                        </button>
                        <button
                            className={`bg-black text-white py-2 px-4 rounded-md focus:outline-none ${
                            selectedTable === 'users' ? 'bg-green-700' : ''
                            }`}
                            onClick={handleUserClicked}
                        >
                            Users
                        </button>
                    </div>
                </div>

            {isLoading && (
                <div className="loading-overlay mt-3 flex justify-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}

            
            {selectedTable == 'recipes' && 
                <ul className="recipe-list list-disc space-y-4">
                {recipes.map((recipe, index) => (
                <li key={`${recipe.title}-${index}`} className="recipe-item bg-gray-100 p-4 rounded-md hover:shadow-md hover:bg-gray-200">
                    <div className="flex items-center space-x-4 ">
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
                            <p className="recipe-description text-gray-600">
                                {recipe.description}
                            </p>
                            
                        </div>
                        <CustomButton
                            type='button'
                            title='View'
                            onClick={() => handleRecipeDivClick(recipe.id)}
                            otherStyles="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"  
                        />
                        <button
                            className="delete-button bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-400"
                            onClick={() => handleDeleteRecipe(recipe.id)}
                        >
                            Delete
                        </button>
                    </div>
                </li>
                ))}
                </ul> 
            }
        {
            selectedTable == 'blogs' && 
            <ul className="recipe-list list-disc space-y-4">
                {blogs.map((blog, index) => (
                <li key={`${blog.title}-${index}`} className="recipe-item bg-gray-100 p-4 rounded-md hover:shadow-md hover:bg-gray-200">
                    <div className="flex items-center space-x-4 ">
                        <div className="recipe-image-container w-32 h-32 overflow-hidden rounded-md mb-4">
                            <img
                            src={blog.image}
                            alt={blog.title}
                            className="recipe-image w-full h-full object-cover"
                            />
                        </div>
                        <div className="recipe-info flex-grow mx-15 px-4">
                            <h2 className="recipe-title font-bold text-lg text-gray-800">
                            {blog.title}
                            </h2>
                            <p className="recipe-description text-gray-600">
                                {blog.summary}
                            </p>
                            
                        </div>
                        <CustomButton
                            type='button'
                            title='View'
                            onClick={() => handleBlogViewClick(blog.id)}
                            otherStyles="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"  
                        />
                        <button
                            className="delete-button bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-400"
                            onClick={() => handleDeleteBlog(blog.id)}
                        >
                            Delete
                        </button>
                    </div>
                </li>
                ))}
            </ul> 
        }

        {
            selectedTable == 'users' && 
            <ul className="recipe-list list-disc space-y-4">
                {users.map((user, index) => (
                <li key={`${user.name}-${index}`} className="recipe-item bg-gray-100 p-4 rounded-md hover:shadow-md hover:bg-gray-200">
                    <div className="flex items-center space-x-4 ">
                        <div className="recipe-image-container w-32 h-32 overflow-hidden rounded-md mb-4">
                            <img
                            src={user.image}
                            alt={user.name}
                            className="recipe-image w-full h-full object-cover"
                            />
                        </div>
                        <div className="recipe-info flex-grow mx-15 px-4">
                            <h2 className="recipe-title font-bold text-lg text-gray-800">
                            {user.name}
                            </h2>
                            <p className="recipe-description text-gray-600">
                                {user.email}
                            </p>
                            
                        </div>
                        <CustomButton
                            type='button'
                            title='View'
                            onClick={() => handleUserViewClick(user.id)}
                            otherStyles="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"  
                        />
                        <button
                            className="delete-button bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-400"
                            onClick={() => handleDeleteUser(user.id)}
                        >
                            Delete
                        </button>
                    </div>
                </li>
                ))}
            </ul> 
        }
        </div>
            
        </div>
    )
}

export default AdminPage