import React, { useState } from "react";
import { useRef } from "react";
import { CustomButton, Dropdown, Ingredients, Steps } from "..";
import { UpdateRecipeDataType, updateState,updateMsg,updatePercentage, updateLink } from "@/Types";
import {Uploadfiles} from "../Uploadfiles";
import Overlay from "./Overlay";


const TestForm: React.FC<{ updateRecipeData: UpdateRecipeDataType}> = ({updateRecipeData}) => {
  const fileInputRef = useRef(null);
  
  // states for the form
  const [difficulty, setDifficulty] = React.useState('easy');
  const [meal_type, setMealType] = React.useState('breakfast');
  const [newTag, setNewTag] = React.useState<string>(''); 
  const [tags, setTags] = React.useState<string[]>([]); // TODO - update to the correct type
  const [title, setTitle] = React.useState<string>('');
  const [msg, setMsg] = useState<string>('Uploading...');
  const [percentage, setPercentage] = useState<number>(0);


  // video
  const [selectedVideo, setSelectedVideo] = useState<File|null>(null);
  const [isUploadingVideo, setIsUploadingVideo] = useState<boolean>(false);
  const [videoSelected, setVideoSelection] = useState<boolean>(false);
  
  // image
  const [selectedImage, setSelectedImage] = useState<File|null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
  const [imageSelected, setImageSelection] = useState<boolean>(false);
  

  
  // functions to handle the form
  const handleDifficulty = (value:string) => {
    setDifficulty(value);
    updateRecipeData('difficulty_level', value);
    // console.log("difficulty value: " + value);
  };

  const handleMealType = (value:string) => {
    setMealType(value);
    updateRecipeData('meal_type', value);
    // console.log("meal type value: " + value);
  };

  const handleAddTag= () => {
    if (newTag.trim() !== '') {
      setTags([...tags, newTag]);
      updateRecipeData('tags', [...tags, newTag]);
      setNewTag('');
    }
  };

  const updateState:updateState =(value:boolean)=>{
    if(imageSelected)
      setIsUploadingImage(value);
    else
      setIsUploadingVideo(value);
  }

  const updatePercentage:updatePercentage =(value:number)=>{ 
    setPercentage(value); 
  }

  const updateMsg:updateMsg = (value:string)=>{
    setMsg(value);
  }

  const updateImageLink:updateLink = (value:string)=>{
    console.log('link: ' + value);
    updateRecipeData('image', value);
  }

  const updateVideoLink:updateLink = (value:string)=>{
    console.log('link: ' + value);
    updateRecipeData('video', value);
  }

  const handleImageUpload = async () => {
    
    console.log('inside Image upload')
    if(!selectedImage){
      alert('No file selected');
      return;
    }
    try {
      await Uploadfiles(selectedImage, 
                        updateState, 
                        updatePercentage, 
                        updateMsg,
                        updateImageLink,
                        () => {
                          setPercentage(0); // Reset progress after upload completion 
                      });
      
    } catch (error) {
      alert('Error uploading file');
    } finally {
      setPercentage(0); // Reset progress after upload completion or failure
    }
    
    

  }

  const handleVideoUpload = async() => {
    if (!selectedVideo){
      alert('No file selected');
      return;
    } 
    try {
      await Uploadfiles(selectedVideo, updateState, updatePercentage, updateMsg,updateVideoLink,
        ()=>{
          setPercentage(0); // Reset progress after upload completion
        });
    } catch (error) {
      alert('Error uploading file');
    } finally {
      setPercentage(0); // Reset progress after upload completion or failure
    }
        
  };


  const deleteTag= (index:number) =>  {
    const updatedTags = tags.filter((t, i) => i !== index);
    updateRecipeData('tags', updatedTags);
    setTags(updatedTags);
  }

  return (
    <div>
      {(isUploadingImage || isUploadingVideo) && <Overlay uploadProgress={percentage} msg={msg}/>}
      <div className="flex justify-center md:min-w-full md:max-w-full w-full mx-auto">
        <div className="sm:rounded-md p-6 border border-gray-300 bg-white">
          <form>
          
            <label className="block mb-6">
              <span className="text-gray-700 text-xl font-bold">Title</span>
              <input
                type="text"
                name="Title"
                className="text-center h-16 text-2xl font-bold bg-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 block w-full mt-1 border-gray-300 rounded-md shadow-sm"
                placeholder="My best-ever pea soup"
                onChange={(e) => {
                  setTitle(e.target.value);
                  updateRecipeData('title', e.target.value);
                }}
                required
              />
            </label>

            <label className="flex-1 block mb-6">
              <span className="text-gray-700 text-xl font-bold">Description</span>
              <textarea
                name="description"
                className="h-20 text-slate-800 bg-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 block w-full mt-1 border-gray-300 rounded-md shadow-sm text-center"
                placeholder={`Share us more about your recipe.Who inspired you to make this dish ? What makes it more special to you? Your favourite way to eat it ?`}
                onChange={(e) => {
                  updateRecipeData('description', e.target.value);
                }}
              />
            </label>

            <label className="flex-1 block mb-6">
              <div className="gap-9 text-gray-700 text-xl w-28 font-bold flex items-center">Difficulty  
                  {<Dropdown
                    styles="border bg-gray-200 h-10 rounded"
                    onClick={handleDifficulty}
                    options={['easy', 'medium', 'hard']}
                    isRequired={true} 
                  />} 
              </div>
            </label>

            <label className="flex-1 block mb-6">
              <div className="gap-5 text-gray-700 text-xl w-28 font-bold flex items-center">Meal_Type  
                  {<Dropdown
                    styles="border bg-gray-200 h-10 rounded"
                    onClick={handleMealType}
                    options={['breakfast', 'lunch', 'dinner']}
                    isRequired={true} 
                  />
                  } 
              </div>
            </label>

            {/* cooking time imput */}
            <label className="flex-1 block mb-6">
              <div className="gap-5 text-gray-700 text-xl font-bold flex items-center">Cook Time
                  <input
                  name="cooktime_minutes"
                  type="number"
                  className="h-12 text-center w-15 bg-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 block mt-1 border-gray-300 rounded-md shadow-sm"
                  placeholder="minutes"
                  onChange={(e) => {
                    updateRecipeData('cooking_time', parseInt(e.target.value));
                  }}
                  min={0}
                  />
              </div>
              </label>
            {/* servings imput */}
            <label className="flex-1 block mb-6">
              <div className="gap-9 text-gray-700 text-xl font-bold flex items-center">Servings
                  <input
                  name="Servings"
                  type="number"
                  className="h-12 text-center w-15 bg-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 block mt-1 border-gray-300 rounded-md shadow-sm"
                  placeholder="# of people"
                  onChange={(e) => {
                    updateRecipeData('servings', parseInt(e.target.value));
                  }}
                  min={1}
                  />
              </div>
              </label>

              {/* Add a gray colored break space in the form*/}
              <div className="w-full h-2 bg-gray-300"></div>
          
              {/* Add the ingredients section */}
              <div className="py-3 text-2xl font-bold text-opacity-100 text-black">Ingredients</div>

              {<Ingredients updateRecipeData={updateRecipeData}/>}

              <div className="py-4"></div>
              {/* Add a gray colored break space in the form*/}
              <div className="w-full h-2 bg-gray-300"></div>
          
              {/* Add the Steps section */}
              <div className="py-3 text-2xl font-bold text-opacity-100 text-black">Steps</div>

              {<Steps updateRecipeData={updateRecipeData}/>}

              <div className="py-4"></div>
              {/* Add a gray colored break space in the form*/}
              <div className="w-full h-2 bg-gray-300"></div>
              
              <div className="py-3 text-2xl font-bold text-opacity-100 text-black">Multimedia</div>
              {/* Image upload and preview in a separate row */}
              
              
        {/*********** Add the video select option ************/}     
              
              <div className="flex items-center  gap-x-16 py-3 text-opacity-100 font-semibold text-slate-900 underline"> Add Video
                <div className="">
                  {/* Add the video select option */}
                  <input
                      type="file"
                      accept="video/*"
                      ref={fileInputRef}
                      placeholder='select video'
                      onChange={(event) => {
                        const file = event.target.files && event.target.files[0];
                        if (file) {
                          setSelectedVideo(file);
                          setVideoSelection(true);
                          setImageSelection(false);
                        }else{
                          console.log('error in file selection');
                        }
                      }}
                  />

                  <CustomButton
                      type="button"
                      title="Upload Video"
                      varient="btn_light_green"
                      otherStyles="bg-green-500 text-white px-4 py-1"
                      onClick={handleVideoUpload}
                  />
                </div>
              </div>

          
          
          {/*********** Add the image select option ************/}    
              
              <div className="flex items-center  gap-x-16 py-3 text-opacity-100 font-semibold text-slate-900 underline"> Add Image
                <div>
                  <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      placeholder='select image'
                      onChange={(event) => {
                        const file = event.target.files && event.target.files[0];
                        if (file) {
                          setSelectedImage(file);
                          setImageSelection(true);
                          setVideoSelection(false);
                        }else{
                          console.log('error in file selection');
                        }
                      }}
                  />

                  <CustomButton
                      type="button"
                      title="Upload Image"
                      varient="btn_light_green"
                      otherStyles="bg-green-500 text-white px-4 py-1"
                      onClick={handleImageUpload}
                  />
                </div>
              </div>
              
        
        
        {/***********Add tags section***************/}

              <div className="py-5 text-2xl font-bold text-opacity-100 text-black">Tags </div>
              
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Enter tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="border p-2"
                />

                {/* Button to add new tag */}
                <CustomButton
                  type="button"
                  title="+"
                  varient="btn_light_orange"
                  otherStyles="px-4 py-2 rounded bg-gray-400 border-orange-400"
                  onClick={handleAddTag}
                />

                {/* Display the tags */}
                <div className="mt-4">
                  {tags.map((tag, index) => (
                    <div key={index} className="inline-flex items-center bg-gray-200 rounded-md p-2 m-1">
                      <span className="mr-2">{tag}</span>
                      <CustomButton
                        onClick={() => {deleteTag(index)}}
                        otherStyles="text-red-500"
                        type={'button'}
                        title='X'
                      />
                    </div>
                  ))}
                </div>
              </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default TestForm;