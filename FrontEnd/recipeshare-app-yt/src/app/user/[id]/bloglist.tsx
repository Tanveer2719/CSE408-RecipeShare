// BlogList.tsx
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Blog {
  id: number;
  title: string;
  publication_date: string;
  image: string;
  last_modification_date: string;
  tags: string[];
  ratings: number;
  user: {
    id:number;
    name: string;
  };
}

const BlogList: React.FC<{ onClose: () => void;id:number }> = ({ onClose, id }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  
  const fetchBlogs = async () => {
    
      setIsLoading(true);
      try {
        const response = await fetch('https://recipeshare-tjm7.onrender.com/api/user/blog/get/id/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({"user_id":id})
        });

        const data = await response.json();
        console.log(data);

        if (!Array.isArray(data)) {
          console.error('Invalid response format: not an array');
          // Handle error appropriately
          return;
        }
        if (data.length === 0) {
          setIsEmpty(true);
        } else {
          setBlogs(data);
        }
        
        if(data.length === 0){
          setIsEmpty(true);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchBlogs();
    };
    fetchData();
  }, []);

  
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto">
      <div className="bg-white p-8 rounded-md max-w-screen-md w-full h-full overflow-y-auto">
        <button className="absolute top-2 right-2 text-white bg-red-500 hover:bg-red-600 w-10 h-10 rounded-md" 
        onClick={onClose}
        >
        Close
        </button>
        <h2 className="text-2xl font-bold mb-4">Blogs</h2>
        {isLoading && <h3 className="text-lg font-semibold cursor-pointer">Loading...</h3>}
        { blogs.length === 0 ? (<h3 className="text-lg font-semibold cursor-pointer">No blogs found</h3>):( 
          blogs.map((blog:Blog) => (
          <div key={blog.id} className="mb-4">
            <Link href={`/blog/${blog.id}`}>
              <h3 className="text-lg font-semibold cursor-pointer">{blog.title}</h3>
            </Link>
            <p className="text-sm text-gray-500">{`Published on ${new Date(
              blog.publication_date
            ).toLocaleDateString()}`}</p>
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
              </div>
            </Link>
          </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BlogList;