// Import Link from Next.js
"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";

interface Blog {
  id: number;
  title: string;
  publication_date: string;
  image: string;
  last_modification_date: string;
  summary: string;
  tags: string[];
  ratings: number;
  user: {
    name: string;
  };
}

interface Recipe {
  id: number;
  title: string;
  description: string;
  publication_date: string;
  image: string;
  last_modification_date: string;
  tags: string[];
  ratings: number;
  user: {
    name: string;
  };
}

const BlogList: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [activeTab, setActiveTab] = useState<string>("blogs"); // Default to 'blogs' tab
  const [rating, setRating] = useState<number[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(
          "https://recipeshare-tjm7.onrender.com/api/blog/get/all"
        );
        const data = await response.json();
        setBlogs(data);
        // a loop to get the ratings for each blog from local storage using id
        // and copy to the ratings field of the blog object
        for (let i = 0; i < data.length; i++) {
          let storedRating = localStorage.getItem(`rating_${data[i].id}`);
          if (storedRating) {
            setRating([...rating, parseInt(storedRating)]);
          }
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    const fetchRecipes = async () => {
      try {
        const response = await fetch(
          "https://recipeshare-tjm7.onrender.com/api/recipe/get/all"
        );
        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchBlogs();
    fetchRecipes();
  }, []);

  /*return (
    <div className="flex flex-col items-center p-8">
      <div className="flex space-x-4 mb-4">
        <button
          className={`text-lg font-semibold cursor-pointer focus:outline-none ${
            activeTab === 'blogs' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('blogs')}
        >
          Blogs
        </button>
        <button
          className={`text-lg font-semibold cursor-pointer focus:outline-none ${
            activeTab === 'recipes' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('recipes')}
        >
          Recipes
        </button>
      </div>

      {activeTab === 'blogs' && (
        <div className="flex flex-col items-center">
          {blogs.map((blog) => (
            <div key={blog.id} className="flex flex-col items-center cursor-pointer mb-4">
              <Link href={`/blog/${blog.id}`}>
                <div style={{ width: '350px', height: '350px'}}>
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    className="object-cover cursor-pointer"
                    layout="responsive"
                    height={100}
                    width={100}
                  />
                  <h3 className="text-lg font-semibold mt-2">{blog.title}</h3>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'recipes' && (
        <div className="flex flex-col items-center">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="flex flex-col items-center cursor-pointer mb-4">
              <Link href={`/recipe/${recipe.id}`}>
                <div style={{ width: '350px', height: '350px'}}>
                  <Image
                    src={recipe.image}
                    alt={recipe.title}
                    className="object-cover cursor-pointer"
                  layout="responsive"
                  height={100}
                  width={100}
                  />
                  <h3 className="text-lg font-semibold mt-2">{recipe.title}</h3>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );*/
  return (
    <div>
      <div className="flex justify-center">
        <button
          className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
          onClick={() => {
            // sort the blogs by rating that is stored in the local storage
            blogs.sort((a, b) => {
              let ratingA = localStorage.getItem(`rating_${a.id}`) || 0;
              let ratingB = localStorage.getItem(`rating_${b.id}`) || 0;
              return (
                parseInt(ratingB.toString()) - parseInt(ratingA.toString())
              );
            });
            setBlogs([...blogs]);
          }}
        >
          Sort by Rating
        </button>
      </div>
      <div className="flex flex-col items-center p-8">
        <div className="flex space-x-4 mb-4">
          <button
            className={`text-lg font-semibold cursor-pointer focus:outline-none ${
              activeTab === "blogs"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("blogs")}
          >
            Blogs
          </button>
          <button
            className={`text-lg font-semibold cursor-pointer focus:outline-none ${
              activeTab === "recipes"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("recipes")}
          >
            Recipes
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === "blogs" &&
            blogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-orange-100 rounded-lg overflow-hidden shadow-md hover:shadow-lg"
              >
                <Link href={`/blog/${blog.id}`}>
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold italic underline">
                      {blog.title}
                    </h3>
                  </div>
                  <div className="p-4">
                    <p className="text-lg ">
                      {blog.summary.length > 150
                        ? blog.summary.substring(0, 150) + "......"
                        : blog.summary}
                      {blog.summary.length > 150 && (
                        <Link href={`/blog/${blog.id}`}>
                          <span className="text-blue-500 hover:underline">
                            {" "}
                            Read More
                          </span>
                        </Link>
                      )}
                    </p>
                  </div>
                </Link>
              </div>
            ))}

          {activeTab === "recipes" &&
            recipes.map((recipe) => (
              <div
                key={recipe.id}
                className="bg-blue-50 rounded-lg overflow-hidden shadow-md hover:shadow-xl"
              >
                <Link href={`/recipe/${recipe.id}`}>
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={recipe.image}
                      alt={recipe.title}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold italic underline">
                      {recipe.title}
                    </h3>
                  </div>
                  <div className="p-4">
                    <p className="text-lg ">
                      {recipe.description.length > 150
                        ? recipe.description.substring(0, 150) + "......"
                        : recipe.description}
                      {recipe.description.length > 150 && (
                        <Link href={`/blog/${recipe.id}`}>
                          <span className="text-red-500 hover:underline">
                            {" "}
                            Read More
                          </span>
                        </Link>
                      )}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default BlogList;
