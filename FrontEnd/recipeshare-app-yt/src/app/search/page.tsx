"use client"
import React, { useState } from 'react';
import { SearchupDataType } from "@/Types";

const SearchPage: React.FC<{ signUpData: SearchupDataType }> = ({ signUpData }) => {

    const [searchData, setSearchData] = React.useState<Record<string, any>>({
        name: "",
        mealType: "",
        cuisineType: "",
        ingredients: "",
        keywords: "",
    });
    const [name, setName] = useState<string>('');
    const [mealType, setMealType] = useState<string>('');
    const [cuisineType, setCuisineType] = useState<string>('');
    const [ingredients, setIngredients] = useState<string>('');
    const [keywords, setKeywords] = useState<string>('');
    const SearchupData: SearchupDataType = (key: string, value: any) => {
        setSearchData({ ...searchData, [key]: value });
        // console.log(recipeData);
    };

    const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        SearchupData("name", name);
        SearchupData("mealType", mealType);
        SearchupData("cuisineType", cuisineType);
        SearchupData("ingredients", ingredients);
        SearchupData("keywords", keywords);
        const request={
            query:name+','+mealType+','+cuisineType+','+ingredients+','+keywords,

        };

        // 
        try {
            const response = await fetch(' https://recipeshare-tjm7.onrender.com/api/recipe/search/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request),
            });

            console.log(searchData);
            console.log(response);
            const data = await response.json();
            console.log('Search results:', data);
            //window.location.href = `/search/searchResult?data=${encodeURIComponent(JSON.stringify(data))}`;
            const encodedRecipes = encodeURIComponent(JSON.stringify(data));
            const redirectUrl = `/search/searchResult?recipes=${encodedRecipes}`;
            window.location.href = redirectUrl;
            
        } catch (error) {
            console.error('Error searching:', error);
        }
    };

    return (
        <div className="bg-container">
            <div className="bg-image" style={{ backgroundImage: `url("/profile_bg.jpg")` }} />
            <div className="flex justify-center items-center px-8 pt-36 pb-8 mb-4 h-full">
                <div className="bg-blue-300 p-8 rounded-lg shadow-md ">
                    <h1 className="text-4xl font-bold mb-4">Search Recipes</h1>
                    <form onSubmit={handleSearch} className="flex flex-wrap gap-8">
                        <div className="flex flex-col mb-4 w-1/3">
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                                Name:
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => { setName(e.target.value); SearchupData("name", e.target.value); }}
                                className="w-full border rounded-md px-3 py-2 mt-1"
                                style={{ padding: '10px' }}
                                placeholder="e.g., Taco Egg Roll, Yorkshire Pudding  etc."
                            />
                        </div>
                        <div className="flex flex-col mb-4 w-1/3">
                            <label htmlFor="mealType" className="block text-sm font-semibold text-gray-700">
                                Meal Type:
                            </label>
                            <select
                                id="mealType"
                                value={mealType}
                                onChange={(e) => {setMealType(e.target.value);SearchupData("mealType", e.target.value);}}
                                className="w-full border rounded-md px-3 py-2 mt-1"
                                style={{ padding: '10px' }}
                            >
                                <option value="">Select meal type...</option>
                                <option value="breakfast">Breakfast</option>
                                <option value="lunch">Lunch</option>
                                <option value="dinner">Dinner</option>
                            </select>
                        </div>
                        <div className="flex flex-col mb-4 w-1/3">
                            <label htmlFor="cuisineType" className="block text-sm font-semibold text-gray-700">
                                Cuisine Type:
                            </label>
                            <input
                                type="text"
                                id="cuisineType"
                                value={cuisineType}
                                onChange={(e) => {setCuisineType(e.target.value);SearchupData("cuisineType", e.target.value);}}
                                className="w-full border rounded-md px-3 py-2 mt-1"
                                style={{ padding: '10px' }}
                                placeholder="e.g., chinese, indian, etc."
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
                                onChange={(e) => {setIngredients(e.target.value);SearchupData("ingredients", e.target.value);}}
                                className="w-full border rounded-md px-3 py-2 mt-1"
                                style={{ padding: '10px' }}
                                placeholder="e.g., beef, egg, corn syrup, oyster sauce etc."
                            />
                        </div>
                        <div className="flex flex-col mb-4 w-1/3">
                            <label htmlFor="keywords" className="block text-sm font-semibold text-gray-700">
                                Keywords:
                            </label>
                            <input
                                type="text"
                                id="keywords"
                                value={keywords}
                                onChange={(e) => {setKeywords(e.target.value);SearchupData("keywords", e.target.value);}}
                                className="w-full border rounded-md px-3 py-2 mt-1"
                                style={{ padding: '10px' }}
                                placeholder="e.g., pasta, chicken, etc."
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-green-500 text-white rounded-md px-4 py-2 font-semibold tracking-wider hover:bg-blue-700 transition-colors duration-200 ease-in"
                        >
                            Search
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
