// Import necessary modules from Next.js and React
'use client'
import Link from 'next/link'; // Import Link from Next.js for navigation
import BlogList from './bloglist';
import RecipeList from './myRecipe/page';
import React, { useState, useEffect } from 'react';
import CustomButton from '@/components/CustomButton';

interface ButtonLinkProps {
  href: string;
  children: React.ReactNode;
  username?: string
}

const ButtonLink: React.FC<ButtonLinkProps> = ({ href, children, username }) => (
  <Link href={{ pathname: href, query: { username } }}>
    <h3 className="text-white bg-green-500 hover:bg-blue-700 py-2 px-4 rounded-md transition duration-300">{children} </h3>
  </Link>
);

interface UserDetail {
  id: number;
  name: string;
  email: string;
  image: string | null;
  date_joined: string;
  last_login: string;
  is_admin: boolean;
}

const ProfilePage = () => {

  const [cookie, setCookie] = React.useState<string | undefined>('');
  const [userDetails, setUserDetails] = useState<UserDetail | null>(null);
  const [showRecipes, setShowRecipes] = useState(false);
  const [showBlogs, setShowBlogs] = useState(false);
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

  const fetchUserDetails = async () => {
    if(cookie != ''){
      const dataBody = {
        'jwt': cookie
      }
      console.log(dataBody)
      try {
        //https://recipeshare-tjm7.onrender.com/api/user/details/
        const response = await fetch('https://recipeshare-tjm7.onrender.com/api/user/details/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataBody)
        });
        const data = await response.json();
        setUserDetails(data.user_details);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchCookie();
      fetchUserDetails();
    };

    fetchData();
  }, [cookie]);


  const handleOpenBlogs = () => {
    setShowBlogs(true);
  };

  const handleCloseBlogs = () => {
    setShowBlogs(false);
  };

  const handleOpenRecipes = async() => {
    
    window.location.href = '/profile/myRecipe';
  };

  const handleCloseRecipes = () => {
    setShowRecipes(false);
  };

  // Handle logout action
  const handleLogout = async () => {
    try {
      const response = await fetch('https://recipeshare-tjm7.onrender.com/api/user/logout/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jwt: cookie })
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data.message); // Log the logout message
        document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'; // Remove jwt cookie
        //router.push('/login'); // Redirect to login page
        window.location.href = '/login'
      } else {
        console.error('Error logging out:', response.statusText);
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };


  return (
    <div className="bg-container">
      <div className="bg-image" style={{ backgroundImage: `url("/profile_bg.jpg")`}} > </div>
    <div className="p-4 lg:px-20 xl:px-40 h-screen flex flex-col items-center mt-28">
      {userDetails && (
        <div className="bg-blue-200 p-8 rounded-lg shadow-md max-w-2xl w-full mb-8">
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
          {/* Your Recipe's*/}
          <button onClick={handleOpenRecipes} className="bg-purple-500 text-white px-10 py-2 rounded-md mt-4 mr-4">
            Your Recipes
          </button>
          {/* View Blogs button */}
          <button onClick={handleOpenBlogs} className="bg-purple-500 text-white px-10 py-2 rounded-md mt-4 mr-4">
            Your Blogs
          </button>
          {/* Logout button */}
          <button onClick={handleLogout} className="bg-red-500 text-white px-10 py-2 rounded-md mt-4">
            Logout
          </button>

        </div>
      )}

      {showRecipes && <RecipeList onClose={handleCloseRecipes} userName={userDetails?.name || ''} />}
      {showBlogs && <BlogList onClose={handleCloseBlogs} />}

      {/* Second box with tabs */}
      <div className="bg-blue-200 p-4 rounded-lg shadow-md max-w-2xl w-full mb-8">
        <h2 className="text-xl font-bold mb-4">Tabs</h2>
        <div className="flex space-x-4">
          <ButtonLink href="/profile/notification">Notifications</ButtonLink>
          <ButtonLink href="/">Edit Profile</ButtonLink>
          {userDetails ? (
            <ButtonLink href="/UploadRecipe" username={userDetails.name || ''}>
              Upload Recipes
            </ButtonLink>
          ) : (
            <p>Loading...</p>
          )}
          <ButtonLink href="/UploadBlog">Upload Blog</ButtonLink>
        </div>
      </div>

      {userDetails && userDetails.is_admin &&
        <CustomButton
          title="Go to Admin Page"
          type="button"
          otherStyles="bg-orange-500 text-white px-4 py-2 rounded-md mt-4"
          onClick={() => {
            window.location.href = '/admin';
          }}
        />
      }
    </div>
    </div>
  );
};

// Export the ProfilePage component
export default ProfilePage;
