"use client";
import { Uploadfiles } from '@/Uploadfiles';
import React, { useState } from 'react'
import { updateState, updatePercentage, updateMsg, updateLink } from '@/Types';
import Overlay from './Overlay';
import { CustomButton } from '..';

const RecipeFromPhoto = () => {

    const [selectedImage, setSelectedImage] = useState<File|null>(null);
    const [percentage, setPercentage] = useState<number>(0);
    const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
    const [msg, setMsg] = useState<string>('Uploading...');
    const [link, setLink] = useState<string>('');
    const [isImageUploaded, setIsImageUploaded] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(false);

    const [images, setImages] = useState<string[]>([]);

    const updateState:updateState =(value:boolean)=>{
        setIsUploadingImage(value);
    }

    const updateMsg:updateMsg = (value:string)=>{
        setMsg(value);
    }

    const updatePercentage:updatePercentage =(value:number)=>{ 
        setPercentage(value); 
    }

    const updateLink:updateLink = (value:string)=>{
        setLink(value);
        setIsImageUploaded(true);
        setImages([...images, value]);
    }

    const handleFileUpload = () => {
        (document.querySelector('input[type="file"]')as HTMLInputElement).click();
    };
    const imageUpload = async (selectedImage:File) => {
        
        if(!selectedImage){
            alert('no file selected');
            return;
        }

        try {
            await Uploadfiles(selectedImage,updateState, updatePercentage, updateMsg, updateLink,
                ()=>{
                    console.log('callback executed');
                });
        } catch (error) {
            console.error('Error uploading file:', error);
        } finally {
            setPercentage(0); // Reset progress after upload completion or failure
        }
    }

    const handleGetRecipe = async () => {
        
        if(link === ''){
            alert('upload image first');
            return;
        }
        setIsLoading(true); // Start loading

        const dataBody = {
            'url': images
          }
        console.log(dataBody);

        try {
            //
            const response = await fetch('https://recipeshare-tjm7.onrender.com/api/photoinfo/',{
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
            const redirectUrl = `/view/recipe/fromPhoto?recipes=${encodedRecipes}`;
            window.location.href = redirectUrl;

        } catch (error) {
            console.error('Error fetching user details:', error);
            setIsLoading(false); // Stop loading on error
        }        

    }

  return (
    <div className="bg-container">
        {isUploadingImage && <Overlay uploadProgress={percentage} msg={msg}/>}
        <div className="bg-image" style={{ backgroundImage: `url("/recipe_from_photo.jpg")`}}></div>
            
        <div className="w-1/2 h-auto ml-36 mt-28 mb-28 flex items-center flex-col bg-slate-300 rounded-xl flex-grow-1">
            
            <div className="font-extrabold text-2xl mt-4">
                GET RECIPE FROM PHOTO
            </div> 
            
            <div className="font-extralight mt-4">
                Upload a photo of a recipe and we will find it for you!
            </div>

            {/* input image here */}
            <div className="mt-4 inline-flex items-center rounded-md border border-gray-300 px-4 py-2 mb-5 bg-gray-100 hover:bg-gray-200 text-gray-500 focus:outline-none cursor-pointer" onClick={handleFileUpload}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-4 w-4 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6H20M4 12H20M4 18H20M9 4L15 4M9 10L11 10M9 16L11 16" />
                </svg>
                    Upload a photo
                <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden"
                    onChange={(event) => {
                        const file = event.target.files && event.target.files[0];
                        if (file) {
                          setSelectedImage(file);
                          imageUpload(file);
                          setIsImageUploaded(false);
                        }else{
                          alert('error in file selection');
                        }
                        
                      }} 
                />
            </div>

            { isImageUploaded && (
                // for each image in the images array, display two buttons
                // one named as view and the other named as remove
                // on view clicked, open the image in a new tab
                // on delete clicked, remove the image from the images array
                <div className="mt-1">
                    {images.map((image, index) => (
                        <div key={index} className="flex w-1/2 mt-1">                            
                                <CustomButton
                                    type='button'
                                    title='View'
                                    onClick={() => window.open(image, '_blank')}
                                    otherStyles="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                                />
                                <CustomButton
                                    type='button'
                                    title='Remove'
                                    onClick={() => {
                                        const newImages = images.filter((img, i) => i !== index);
                                        setImages(newImages);
                                        if(newImages.length === 0){
                                            setIsImageUploaded(false);
                                        }
                                    }}
                                    otherStyles="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                />
                        </div>
                    ))}
                </div>
            )}
                
            { isImageUploaded && (
                <div className="mt-8 mb-4">
                    <CustomButton
                        type='button'
                        title='Get Recipe'
                        onClick={handleGetRecipe}
                        otherStyles="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    />
                </div>
            )}

            {isLoading && (
                <div className="loading-overlay mt-3">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}

        </div>
        
    </div>
  )
}

export default RecipeFromPhoto