"use client";
import React, { useEffect, useState } from 'react';

import { TestForm_Blog } from '@/index';
import CustomButton from '@/components/CustomButton';


const UploadBlog = () => {
  // for sending the data to the backend
  const [blogData, setBlogData] = React.useState<Record<string, any>>({
    title: "",
    publication_date: "",
    last_modification_date: "",
    summary: "",
    image: "",
    user: "",
    ratings: "",
    instructions: [[""]],
    tags: [""],
    sections: [],
    jwt: ""
  });
  type UpdateBlogDataType = (key: string, value: any) => void;

  // for storing the cookie
  const [cookie, setCookie] = React.useState<string | undefined>('');
  const [imageSrc, setImageSrc] = React.useState<string>("https://firebasestorage.googleapis.com/v0/b/blogshare-410617.appspot.com/o/image.jpeg?alt=media&token=d7dd590a-5cab-44ec-ba37-9cfd37820074");

  const updateBlogData: UpdateBlogDataType = (key: string, value: any) => {
    setBlogData({ ...blogData, [key]: value });
    // console.log(blogData);
  };

  /************Cookie Part***********/
  useEffect(() => {
    getCookie();
  }, []); // Optional dependency array

  const getCookie = () => {
    const cookieValue = document.cookie
      .split('; ')
      .find((row) => row.startsWith('jwt='))?.split('=')[1];

    updateBlogData('jwt', cookieValue);
    setCookie(cookieValue);
  };

  // activated when publish button clicked
  const handlePublish = async () => {
    console.log(blogData);

    if (!cookie) {
      alert('Cookie not found. Please log in again.');
      return;
    }


    /************Add the cookie to the body ************** */
    updateBlogData('jwt', cookie);

    try {
      const response = await fetch('https://recipeshare-tjm7.onrender.com/api/blog/upload/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blogData)
      });

      const data = await response.json();
      console.log('Response Data:', data);

      // alert if response is unsuccessful
      if (data.status == 401) {
        alert('Upload Unsuccessful');
      }
      else if (data.error) {
        alert('Upload Unsuccessful');
      }
      else {
        alert('Upload Successful');
        window.location.href = '/profile';
        console.log(data)
      }
    } catch (error) {
      console.log('error: ', error);
    }
  }


  return (
    <div className="bg-container"> 
    <div className="bg-image" style={{ backgroundImage: `url("/mealPlanBg.jpg")`}}></div>
    
      {/* New div for the photo */}
      <div className="flex flex-col items-center py-10 ">
        <img
          id="blog_photo"
          src={imageSrc}
          alt="Blog Photo"
          className="w-24 h-24 object-cover"
          style={{ maxHeight: '500px', maxWidth: '500px' }}
        />

        <div className='text-stone-700 font-bold py-2'>
          Show others your blog
        </div>
        {/* <input type="file" accept="image/*" ref={inputRef} style={{ display: 'none' }} /> */}
      </div>

      {/* New div for the form */}
      <div className="">
        <TestForm_Blog updateBlogData={updateBlogData} />
      </div>


      <div className="button py-10 flex justify-center">
        <CustomButton
          type="button"
          title="Publish"
          varient='btn_light_orange'
          otherStyles='bg-orange-400 border-orange-500 px-4 py-2 rounded-full'
          onClick={handlePublish}
        />
      </div>

    </div>
  );
}

export default UploadBlog;

