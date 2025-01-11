'use client';
import { CustomButton } from '@/index';
import React from 'react'
import Calculator from './calorieCalculator';
import MealPlan from './mealplan';
import { set } from 'firebase/database';
import { useState } from "react";

const Page = () => {
    const [calorie, setCalorie] = React.useState(0);
    const [showCalculator, setCalculator] = React.useState(false);
    const [showMealPlan, setMealPlan] = React.useState(false);

    return (
        <div className="relative">
            <div className="fixed top-0 left-0 w-full h-screen z-[-1]">
                <img
                    className="object-cover w-full h-full"
                    src="mealPlanBg.jpg"
                    alt="background"
                />
            </div>

            <div className="flex items-center h-full z-2 ml-52">
                <div className="mt-6">
                    <h1 className="text-5xl font-bold text-black">Put your diet on autopilot</h1>
                    <p className="text-xl mt-2 text-black">Create personalized meal plans based on your food preferences.</p>
                    <p className="text-xl text-black">Reach your diet and nutritional goals with our calorie calculator</p>
                    <p className="text-xl text-black font-bold"> Create your meal plan right here in seconds.</p>
                </div>
            </div>

            <div className="mt-3 flex items-center flex-col ml-52 bg-slate-400 h-64 w-1/3 rounded-md">
                <input
                    name="Daily calorie intake"
                    type="number"
                    className="h-12 w-15 ml-4 mt-5 justify-center items-center text-center bg-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 block border-gray-300 rounded-md shadow-sm"
                    value={calorie !== 0 ? calorie.toString() : ""}
                    placeholder="Calorie Amount"
                    onChange={(e) => {
                        setCalorie(parseInt(e.target.value));
                    }}
                    min={0}
                />
                <CustomButton
                    type="button"
                    title="Not Sure?"
                    otherStyles="h-12 w-30 ml-4 mt-5 bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => {
                        setCalculator(true);
                    }}
                />

                {showCalculator && (
                    <Calculator
                        onClose={() => setCalculator(false)}
                        onSetCalorie={(calorie) => {
                            setCalorie(calorie);
                            console.log(calorie);
                        }}
                    />
                )}

                {calorie !== 0 && (
                    <div className="mt-4 ml-5">
                        <CustomButton
                            type="button"
                            title="Create Plan"
                            otherStyles="h-12 w-30 bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => {
                                setMealPlan(true);
                            }}
                        />
                    </div>
                )}

                {showMealPlan && (
                    <MealPlan
                        onClose={() => setMealPlan(false)}
                        calorieAmount={calorie}
                    />
                )}
            </div>
        </div>

    );
};



export default Page