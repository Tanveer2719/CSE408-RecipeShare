"use client";
import React, {useEffect, useRef, useState} from 'react';

import { useParams } from "next/navigation";
import { Uploadfiles } from "@/Uploadfiles";
import Overlay from "@/components/Overlay";
import { updateState, updatePercentage, updateMsg, updateLink } from '@/Types';
import { CustomButton,Dropdown } from "@/index";


const UploadRecipe = () => {
  // for sending the data to the backend
  const [recipeData, setRecipeData] = React.useState<Record<string, any>>({
    id:Number,
    title: "",
    cooking_time:Number,
    difficulty_level:"easy",
    description: "",
    image:"",
    video:"",
    meal_type:"breakfast",
    ingredients: [],
    steps: [],
    tags: [],
    jwt:"",
    servings: Number,
    user:""
  });

  
  type UpdateRecipeDataType = (key: string, value: any) => void;
  

  // for storing the cookie
  const [cookie, setCookie] = React.useState<string|undefined>('');
  const [imageSrc, setImageSrc] = React.useState<string>("https://firebasestorage.googleapis.com/v0/b/recipeshare-410617.appspot.com/o/image.jpeg?alt=media&token=d7dd590a-5cab-44ec-ba37-9cfd37820074");
  
  const updateRecipeData:UpdateRecipeDataType = (key: string, value: any) => {
    setRecipeData({ ...recipeData, [key]: value });
    // console.log(recipeData);
  };

  /************Cookie Part***********/
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

  const fetchRecipeDetails = async () => {
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const encodedRecipes = urlParams.get('recipes');

        if (encodedRecipes) {
          const parsedRecipes = JSON.parse(decodeURIComponent(encodedRecipes));
    
          setRecipeData((prevRecipeData) => ({
            ...prevRecipeData,
            id: parsedRecipes.id,
            title: parsedRecipes.title,
            description: parsedRecipes.description,
            meal_type: parsedRecipes.meal_type,
            servings: parsedRecipes.servings,
            cooking_time: parsedRecipes.cooking_time,
            ingredients: parsedRecipes.ingredients,
            image: parsedRecipes.image,
            video: parsedRecipes.video,
            tags: parsedRecipes.tags,
            steps: parsedRecipes.steps,
          }));
          console.log(recipeData);
        } else {
          // Handle missing recipes parameter
          console.log('No recipes found in URL parameter');
        }
      }
  }

  useEffect(() => {
    const fetchData = async () => {
      await fetchCookie();
      updateRecipeData('jwt', cookie);
      fetchRecipeDetails();
    };

    fetchData();
  }, [cookie]);

  const fileInputRef = useRef(null);
  
  // states for the form
  const [difficulty, setDifficulty] = React.useState<string>(recipeData.difficulty_level);
  const [meal_type, setMealType] = React.useState(recipeData.meal_type);
  const [newTag, setNewTag] = React.useState<string>(''); 
  const [tags, setTags] = React.useState<string[]>(recipeData.tags); // TODO - update to the correct type
  const [title, setTitle] = React.useState<string>(recipeData.title);
  const [description, setDescription] = useState<string>(recipeData.description);
  const [cooking_time, setCookingTime] = useState<number>(recipeData.cooking_time);
  const [servings, setServings] = useState<number>(recipeData.servings);
  const [video, setVideo] = useState<string>(recipeData.video);
  const [image, setImage] = useState<string>(recipeData.image); 

  //ingredients
  const [ingredients, setIngredients] = useState<Ingredient[]>(recipeData.ingredients);
  const [steps, setSteps] = useState<Step[]>(recipeData.steps);

  const [downloadURL, setDownloadURL] = useState<string>('');


  
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
      const updatedTags = [...recipeData.tags, newTag];
      setTags(updatedTags);

      // Update recipeData state
      setRecipeData({ ...recipeData, tags: updatedTags });

      // Clear input
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
    if(value != ''){
      console.log('link: ' + value);
      setRecipeData({...recipeData,'image': value})
    }
  }

  const updateVideoLink:updateLink = (value:string)=>{
    if(value != ''){
      console.log('link: ' + value);
      setRecipeData({...recipeData,'video': value})
    }
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
    // setRecipeData({ ...recipeData,'tags': [...tags, newTag] });

    setRecipeData({...recipeData,'tags': updatedTags});
    setTags(updatedTags);
  }

  
  // activated when publish button clicked
  const handlePublish = async () => {
    console.log(recipeData);

    if (!cookie) {
      alert('Cookie not found. Please log in again.');
      return;
    }
  
    
    /************Add the cookie to the body ************** */
    setRecipeData({...recipeData,'jwt': cookie});

    try {
        const response = await fetch('https://recipeshare-tjm7.onrender.com/api/user/recipe/update/', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(recipeData)
        });

        const data = await response.json();
        console.log('Response Data:', data);
      
      // alert if response is unsuccessful
      if(data.status == 401){
        alert('Upload Unsuccessful');
      }
      else if(data.error){
        alert('Upload Unsuccessful');
      }
      else{
        alert('Upload Successful');
        window.location.href = '/profile';
        console.log(data)
      }
    }catch (error) {
      console.log('error: ', error);
    }
  }

  /****************Ingredients******************* */
  type Ingredient = {
    amount: number|string;
    unit: string;
    ingredient: string;
  };

  // adding a new ingredient to the ingredients array
  //create a new array with the existing ingredients and adds a new ingredient object
  const addIngredient = () => {
    // Create a new ingredient object
    const newIngredient = { ingredient: '', amount: '', unit: 'gm' };
  
    // Update local ingredients state
    setIngredients((prevIngredients) => [...prevIngredients, newIngredient]);
  
    // Update recipeData state
    setRecipeData((prevRecipeData) => ({ ...prevRecipeData, ingredients: [...prevRecipeData.ingredients, newIngredient] }));
  };
  
  

  const handleChange = (index: number, field: string, value: string) => {
    // Update local ingredients state
    const updatedIngredients = [...recipeData.ingredients];
    updatedIngredients[index][field as keyof typeof updatedIngredients[0]] = value;
    setIngredients(updatedIngredients);
  
    // Update recipeData state
    setRecipeData((prevRecipeData) => ({ ...prevRecipeData, ingredients: updatedIngredients }));
  };
  

  const deleteIngredient = (index: number) => {
    // Update local ingredients state
    const updatedIngredients = [...recipeData.ingredients];
    updatedIngredients.splice(index, 1);
    setIngredients(updatedIngredients);
  
    // Update recipeData state
    setRecipeData((prevRecipeData) => ({ ...prevRecipeData, ingredients: updatedIngredients }));
  };
  

  /***************STEPS*************** */
  type Step = {
    order: number;
    step: string;
    image: string | null; // Change from string | null to string
  };

  const updateLink:updateLink = (value:string)=>{
    setDownloadURL(value);
  }

  const addStep = () => {
    const newStep = { order: recipeData.steps.length + 1, step: '', image: '' };
  
    // Update local steps state
    setSteps((prevSteps) => [...prevSteps, newStep]);
  
    // Update recipeData state
    setRecipeData((prevRecipeData) => ({ ...prevRecipeData, steps: [...prevRecipeData.steps, newStep] }));
  };

  const handleStepChange = (index: number, field: string, value: string) => {
    // Update local steps state
    const updatedSteps = recipeData.steps.map((step:Step, i:number) => (i === index ? { ...step, [field]: value } : step));
    setSteps(updatedSteps);
  
    // Update recipeData state
    setRecipeData((prevRecipeData) => ({ ...prevRecipeData, steps: updatedSteps }));
    // console.log(recipeData.steps);
  };
  
  const deleteStep = (index: number) => {
    
    if (index >= 0 && index < recipeData.steps.length) {
      // Update local steps state
      const updatedSteps = [...recipeData.steps];
      updatedSteps.splice(index, 1);
      setSteps(updatedSteps);
  
      // Update recipeData state
      setRecipeData((prevRecipeData) => ({ ...prevRecipeData, steps: updatedSteps }));
    }
  };
  
  const handleStepImageUpload = async (index: number) => {

    if (!selectedImage){
      alert('No file selected');
      return;
    } 
    try {
      await Uploadfiles(selectedImage, updateState, updatePercentage, updateMsg, updateLink,
        ()=>{
          const updatedSteps = [...recipeData.steps];
          updatedSteps[index].image = downloadURL;
          setSteps(updatedSteps);
          setRecipeData((prevRecipeData) => ({ ...prevRecipeData, steps: updatedSteps }));        });
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setPercentage(0); // Reset progress after upload completion or failure
    }
  };


  return (
    <div className="bg-container">
      <div className="bg-image" style={{ backgroundImage: `url("/mealPlanBg.jpg")`}}></div>
      
      {/* New div for the photo */}
      <div className="flex flex-col items-center py-1">
        <img
          id="recipe_photo"
          src={imageSrc}
          alt="Recipe Photo"
          className="w-24 h-24 object-cover"
          style={{maxHeight: '500px', maxWidth: '500px'}}
        />
      </div>
      <div className="flex justify-center py-2">
        <h1 className="text-3xl font-bold">Upload Recipe</h1>
      </div>
      <div className='text-stone-700 font-bold flex justify-center'>
          Show others your finished dish
      </div>

      

      {/* New div for the form */}
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
                value={recipeData.title}
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
                value={recipeData.description}
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
                  value={recipeData.cooking_time}
                  className="h-12 text-center w-15 bg-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 block mt-1 border-gray-300 rounded-md shadow-sm"
                  placeholder="minutes"
                  onChange={(e) => {
                    const newCookingTime = parseInt(e.target.value);

                    // Update local state
                    setRecipeData((prevRecipeData) => ({
                        ...prevRecipeData,
                        cooking_time: newCookingTime,
                    }));
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
                  value={recipeData.servings}
                  className="h-12 text-center w-15 bg-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 block mt-1 border-gray-300 rounded-md shadow-sm"
                  placeholder="# of people"
                  onChange={(e) => {
                    setRecipeData({...recipeData,servings: parseInt(e.target.value)});
                  }}
                  min={1}
                  />
              </div>
              </label>

              {/* Add a gray colored break space in the form*/}
              <div className="w-full h-2 bg-gray-300"></div>
          
              {/* Add the ingredients section */}
              <div className="py-3 text-2xl font-bold text-opacity-100 text-black">Ingredients</div>

              <div>
                {recipeData.ingredients && recipeData.ingredients.map((ingredient:Ingredient, index:number) => (
                <div key={index} className="mb-4 list-decimal"> {/* Replaced flex with list-disc */}
                  <li className="flex items-center gap-4"> {/* Added list item and flex for alignment */}
                    <input
                      type="text"
                      value={ingredient.ingredient}
                      onChange={(e) => handleChange(index, 'ingredient', e.target.value)}
                      className="border p-2 bg-gray-200 text-lg font-medium rounded"
                      placeholder='Ingredient Name'
                    />
        
                    <input
                      type="text"
                      value={ingredient.amount}
                      onChange={(e) => handleChange(index, 'amount', e.target.value)}
                      className="border p-2 bg-gray-200 rounded"
                      placeholder='Amount'
                    />
        
                    <select
                      value={ingredient.unit}
                      onChange={(e) => handleChange(index, 'unit', e.target.value)}
                      className="border bg-gray-200 h-10 rounded"
                    >
                      <option value="gm">gm</option>
                      <option value="kg">kg</option>
                      <option value="cup">cup</option>
                      <option value="tea-spoon">tea-spoon</option>
                      <option value="table-spoon">table-spoon</option>
                      <option value="pieces">pieces</option>
                    </select>
                    
                    {/* Replace the standard button with CustomButton */}
                    <CustomButton
                      type="button"
                      title="Delete"
                      varient="btn_dark_red"
                      otherStyles="bg-red-500 text-white px-2 py-1 rounded h-10"
                      onClick={() => deleteIngredient(index)}
                      // Add any other props as needed
                    />
                  </li>
                </div>
                ))}
                <div className="flex justify-center">
                  <CustomButton
                    type="button"
                    title="Add Ingredient"
                    onClick={addIngredient}
                    otherStyles="bg-blue-500 text-white px-4 py-2 rounded-full"
                  />
                </div>
              </div>

              <div className="py-4"></div>
              {/* Add a gray colored break space in the form*/}
              <div className="w-full h-2 bg-gray-300"></div>
          
              {/* Add the Steps section */}
              <div className="py-3 text-2xl font-bold text-opacity-100 text-black">Steps</div>

              <div>
                {isUploadingImage && <Overlay uploadProgress={percentage} msg={msg}   />}

                <div className="container mx-auto">
                  <ol className="list-disc space-y-4">
                    {recipeData.steps && recipeData.steps.map((step:Step, index:number) => (
                      <li key={index} className="flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                          <input
                            type="number"
                            value={step.order}
                            onChange={(e) => handleChange(index, 'order', e.target.value)}
                            className="w-20 h-10 border p-2 bg-gray-200 text-lg font-medium rounded"
                            placeholder="Step #"
                            min={index + 1}
                            required
                          />
                          <textarea
                            value={step.step}
                            onChange={(e) => handleStepChange(index, 'step', e.target.value)}
                            className="w-full h-30 border p-2 bg-gray-200 rounded resize text-center"
                            placeholder="Step description"
                            required
                          />
                          <CustomButton
                            type="button"
                            title="Delete"
                            varient="btn_dark_red"
                            otherStyles="bg-red-500 text-white px-2 py-1 rounded h-10"
                            onClick={() => deleteStep(index)}
                          />
                        </div>

                        {/* Image upload and preview in a separate row */}
                        <div className="flex justify-center">
                          {/* Add the image select option */}
                          <input
                              type="file"
                              accept="image/*"
                              ref={fileInputRef}
                              placeholder='select image'
                              onChange={(event) => {
                                const file = event.target.files && event.target.files[0];
                                if (file) {
                                  setSelectedImage(file);
                                }else{
                                  alert('error in file selection');
                                }
                              }}
                          />

                          <CustomButton
                              type="button"
                              title="Upload Image"
                              varient="btn_light_green"
                              otherStyles="bg-green-500 text-white px-4 py-1"
                              onClick={() => handleStepImageUpload(index)}
                          />
                        </div>
                          {/* Add the image preview */}
                          {step.image && (
                            <div className="flex justify-center">
                              <img
                                src={step.image}
                                alt="Step Image"
                                className="w-24 h-24 object-cover"
                              />
                            </div>
                          )}

                      </li>
                    ))}
                  </ol>
                  <div className="flex justify-center mt-4">
                    <CustomButton
                      type="button"
                      title="Add Step"
                      varient="btn_light_green"
                      otherStyles="bg-blue-500 text-white px-4 py-2 rounded-full"
                      onClick={() => addStep()}
                    />
                  </div>
                </div>
              </div>

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
                      // value={recipeData.video}
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
                      // value={recipeData.image}
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
                  { recipeData.tags &&  recipeData.tags.map((tag:string, index:number) => (
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

      
      <div className="button py-10 flex justify-center">
          <CustomButton 
              type="button"
              title="Publish Your Recipe" 
              varient='btn_light_orange' 
              otherStyles='bg-orange-400 border-orange-500 px-4 py-2 rounded-full'
              onClick={handlePublish}
              />
      </div>
    </div>
  );
}

export default UploadRecipe;

