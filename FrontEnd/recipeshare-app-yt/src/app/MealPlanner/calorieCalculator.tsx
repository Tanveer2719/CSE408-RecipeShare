import { CustomButton } from '@/index';
import React, { useState } from 'react';

const NutritionCalculator: React.FC<{ 
    onClose: () => void 
    onSetCalorie:(calorie:number)=>void} > = ({ onClose, onSetCalorie}) => {

    const [age, setAge] = useState(30);
    const [gender, setGender] = useState('male');
    const [weight, setWeight] = useState(70);
    const [height, setHeight] = useState(170);
    const [activity, setActivity] = useState('level_1');
    
    const [isLoading, setIsLoading] = useState(false);
    const [calculatedCalorie, setCalculatedCalorie] = useState(0);  
    const [goal, setGoal] = useState('maintain weight'); 
    const [isFound, setIsFound] = useState(false);

    const handleActivityChange= (level: string) =>{
        setActivity(level);
        console.log(level);
    }

    const handleCalculateCalorie = async() => {
        const dataBody = {
            'age': age,
            'gender':gender,
            'weight':weight,
            'height':height,
            'activitylevel':activity,
            'goal':goal
        };

        try {
            setIsLoading(true);
            setIsFound(false);
            const response = await fetch('https://recipeshare-tjm7.onrender.com/api/findcalorie/',{
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(dataBody)
            });
            const data = await response.json();
            // console.log(data.calorie);
            setIsLoading(false); // Stop loading after response
            setIsFound(true);
            setCalculatedCalorie(data.calorie);

        } catch (error) {
            console.error('Error fetching user details:', error);
            setIsLoading(false); // Stop loading on error
        }  

        
    }

    const handleClose = () => {
        onClose();
        onSetCalorie(calculatedCalorie);
    }
  
    return (
        <div className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-75 flex items-center justify-center overflow-y-auto p-4">
            <div className="bg-gradient-to-b from-teal-500 to-cyan-500 p-8 rounded-md max-w-md shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white">Nutrition Calculator</h2>
                    <button className="text-white hover:text-gray-200" onClick={handleClose}>
                    Close
                    </button>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex justify-between">
                    <label className="text-base text-white w-24" htmlFor="age">
                        Age (Years):
                    </label>
                    <input
                        type="number"
                        id="age"
                        name="age"
                        className="w-32 h-10 px-3  text-red-400 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                        placeholder="years"
                        value={age}
                        onChange={(e) => setAge(parseInt(e.target.value))}
                        min={1}
                        max={80}
                    />
                    </div>

                    <div className="flex justify-between">
                    <label className="text-base text-white w-24" htmlFor="gender">
                        Gender:
                    </label>
                    <select
                        id="gender"
                        name="gender"
                        value={gender}
                        className="w-32 h-10 px-3  text-red-400 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                        onChange={(e) => setGender(e.target.value)}
                    >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                    </div>

                    <div className="flex justify-between">
                    <label className="text-base text-white w-24" htmlFor="weight">
                        Weight (kg):
                    </label>
                    <input
                        type="number"
                        id="weight"
                        name="weight"
                        className="w-32 h-10 px-3  text-red-400 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                        placeholder="kg"
                        value={weight}
                        onChange={(e) => setWeight(parseInt(e.target.value))}
                        min={40}
                        max={160}
                    />
                    </div>

                    <div className="flex justify-between">
                    <label className="text-base text-white w-24" htmlFor="height">
                        Height (cm):
                    </label>
                    <input
                        type="number"
                        id="height"
                        name="height"
                        className="w-32 h-10 px-3 text-red-400 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                        placeholder="cm"
                        value={height}
                        onChange={(e) => setHeight(parseInt(e.target.value))}
                        min={130}
                        max={230}
                    />
                    </div>
                
                    <div className="flex justify-between">
                        <label className="text-base text-white w-24" htmlFor="activity">
                            Activity Level:
                        </label>
                        <select
                        id="activity"
                        name="activity"
                        value={activity}
                        className="w-48 h-10 px-3 text-red-400 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                            onChange={(e) => handleActivityChange(e.target.value)}
                            >
                            <option value="level_1">Sedentary: little or no exercise</option>
                            <option value="level_2">Exercise 1-3 times/week</option>
                            <option value="level_3">Exercise 4-5 times/week</option>
                            <option value="level_4">Daily exercise or intense exercise 3-4 times/week</option>
                            <option value="level_5">Intense exercise 6-7 times/week</option>
                            <option value="level_6">Very intense exercise daily, or physical job</option>
                        </select>
                    </div>

                    <div className="flex justify-between">
                        <label className="text-base text-white w-24" htmlFor="goal">
                           Weight Goal:
                        </label>
                        <select
                        id="goal"
                        name="goal"
                        value={goal}
                        className="w-48 h-10 px-3 text-red-400 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                            onChange={(e) => setGoal(e.target.value)}
                            >
                            <option value="Extreme weight gain">Extreme weight gain (1 kg)</option>
                            <option value="Extreme weight loss">Extreme weight loss (1 kg)</option>
                            <option value="Mild weight gain">Mild weight gain (0.25 kg)</option>
                            <option value="Mild weight loss">Mild weight loss (0.25 kg)</option>
                            <option value="Weight gain">Weight gain (0.5 kg)</option>
                            <option value="Weight loss">Weight loss (0.5 kg)</option>
                            <option value="maintain weight">Maintain Weight</option>
                        </select>
                    </div>
                </div>

                <CustomButton
                    type="button"
                    title="Calculate"
                    otherStyles="w-full mt-4 bg-white text-indigo-500 font-bold py-2 px-4 rounded border border-gray-300 hover:bg-indigo-100 hover:text-indigo-700 transition duration-150 ease-in-out hover:opacity-110 hover:shadow-md"
                    onClick={() => {
                        {handleCalculateCalorie()}
                    }}
                />

                {isLoading && (
                    <div className="loading-overlay mt-3">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                )}

                {isFound && (
                    <div className="loading-overlay mt-3">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Calorie Required : {calculatedCalorie}</span>
                        </div>
                    </div>
                )}

            </div>
        </div>
      );
      
};

export default NutritionCalculator;
