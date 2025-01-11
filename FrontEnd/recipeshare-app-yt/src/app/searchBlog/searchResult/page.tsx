
'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import  CustomButton  from '../../../components/CustomButton';


interface BlogFromSearch {
    id: number;
    title: string;
    summary: string;
    content?: string;  // Assuming content is optional based on your JSON structure
    image: string;      // Optional image field
    publication_date: string;
    last_modification_date: string;
    tags: string[];
    ratings: number;
    user: {
        name: string;
        // Add other user-related fields based on your User model
    };
    online:boolean
}

const SearchResult = () => {
  const [blogs, setBlogs] = useState<BlogFromSearch[]>([]);
  

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const encodedBlogs = urlParams.get('blogs');
      console.log(encodedBlogs);

      if (encodedBlogs) {
        const parsedBlogs = JSON.parse(decodeURIComponent(encodedBlogs));
        console.log(parsedBlogs);
        setBlogs(parsedBlogs);
      } else {
        console.error('No blogs found in URL parameter');
      }
      console.log(blogs);
    }
  }, []);

  return (
    <div className="container mx-auto px-4 mt-8 mb-20 bg-white rounded py-2">
      <ul className="blog-list list-disc space-y-4">
        {blogs.length === 0 ? (
          <div className="flex justify-center items-center h-32">
            <p className="font-bold text-xl">No blogs found.</p>
          </div>
        ) : (
          blogs.map((blog) => (
            <li
              key={blog.title}
              className="blog-item bg-gray-100 p-4 rounded-md hover:shadow-md hover:bg-gray-200"
            >
              <div className="flex items-center space-x-4">
                <div className="blog-image-container w-32 h-32 overflow-hidden rounded-md mb-4">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="blog-image w-full h-full object-cover"
                  />
                </div>
                <div className="blog-info flex-grow mx-15 px-4">
                  <h2 className="blog-title font-bold text-lg text-gray-800">{blog.title}</h2>
                  <ul className="ingredient-list text-orange-700 list-disc space-y-1">
                    {blog.tags.map((tag, index) => (
                      <li key={`${tag}-${index}`} className="ingredient-item">
                       {`${tag}`}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              { (
                <CustomButton
                  type="button"
                  title="View blog"
                  otherStyles="px-4 py-2 text-base font-medium rounded-md"
                  onClick={() => {
                    const redirectUrl = `/blog/${blog.id}`;
                    // Redirect to the blog details page
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
