"use client"
import React, {useEffect,useState} from 'react';
import { RequestupDataType } from "@/Types";

const UploadRequestPage: React.FC<{ requestUpData: RequestupDataType }> = ({ requestUpData }) => {

    const [requestData, setRequestData] = React.useState<Record<string, any>>({
        title: "",
        meal_type: "",
        description: "",
        ingredients: "",
        jwt:"",
        user:"",
    });
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [ingredients, setIngredients] = useState<string>('');
    const [meal_type, setMealType] = useState<string>('');
    const [cookie, setCookie] = React.useState<string|undefined>('');

    const RequestupData: RequestupDataType = (key: string, value: any) => {
        setRequestData({ ...requestData, [key]: value });
        // console.log(recipeData);
    };


      /************Cookie Part***********/
  useEffect(() => {
    if(cookie === '')
      getCookie();
  }, []); // Optional dependency array
  
  const getCookie = () => {
    const cookieValue = document.cookie
      .split('; ')
      .find((row) => row.startsWith('jwt='))?.split('=')[1];
    
    RequestupData('jwt', cookieValue);
    setCookie(cookieValue);
  };

    const uploadRequestData = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(requestData);

        if (!cookie) {
          alert('Cookie not found. Please log in again.');
          return;
        }
      
        
        /************Add the cookie to the body ************** */
        RequestupData('jwt', cookie);
    
        try {
            const response = await fetch('http://127.0.0.1:8000/api/user/recipe/uploadrequest/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            });

            console.log(response);
            const data = await response.json();
            console.log('Request uploaded:', data);
        } catch (error) {
            console.error('Error uploading request:', error);
        }
    };

    return (
        <div className="bg-container">
            <div className="bg-image" style={{ backgroundImage: `url("/profile_bg.jpg")` }} />
            <div className="flex justify-center items-center px-8 pt-36 pb-8 mb-4 h-full">
                <div className="bg-blue-300 p-8 rounded-lg shadow-md ">
                    <h1 className="text-4xl font-bold mb-4">Upload Request</h1>
                    <form onSubmit={uploadRequestData} className="flex flex-wrap gap-8">
                        <div className="flex flex-col mb-4 w-1/3">
                            <label htmlFor="title" className="block text-sm font-semibold text-gray-700">
                                Title:
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => {setTitle(e.target.value);RequestupData("title", e.target.value);}}
                                className="w-full border rounded-md px-3 py-2 mt-1"
                                style={{ padding: '10px' }}
                                placeholder="Enter title..."
                            />
                        </div>
                        <div className="flex flex-col mb-4 w-1/3">
                            <label htmlFor="description" className="block text-sm font-semibold text-gray-700">
                                Description:
                            </label>
                            <input
                                type="text"
                                id="description"
                                value={description}
                                onChange={(e) => {setDescription(e.target.value);RequestupData("description", e.target.value);}}
                                className="w-full border rounded-md px-3 py-2 mt-1"
                                style={{ padding: '10px' }}
                                placeholder="Enter description..."
                            />
                        </div>
                        <div className="flex flex-col mb-4 w-1/3">
                            <label htmlFor="ingredients" className="block text-sm font-semibold text-gray-700">
                                Ingredients:
                            </label>
                            <input
                                type="text"
                                id="ingredients"
                                value={ingredients}
                                onChange={(e) => {setIngredients(e.target.value);RequestupData("ingredients", e.target.value);}}
                                className="w-full border rounded-md px-3 py-2 mt-1"
                                style={{ padding: '10px' }}
                                placeholder="Enter ingredients..."
                            />
                        </div>
                        <div className="flex flex-col mb-4 w-1/3">
                            <label htmlFor="meal_type" className="block text-sm font-semibold text-gray-700">
                                Meal Type:
                            </label>
                            <input
                                type="text"
                                id="meal_type"
                                value={meal_type}
                                onChange={(e) => {setMealType(e.target.value);RequestupData("meal_type", e.target.value);}}
                                className="w-full border rounded-md px-3 py-2 mt-1"
                                style={{ padding: '10px' }}
                                placeholder="Enter meal type..."
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-green-500 text-white rounded-md px-4 py-2 font-semibold tracking-wider hover:bg-blue-700 transition-colors duration-200 ease-in"
                        >
                            Upload Request
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UploadRequestPage;
