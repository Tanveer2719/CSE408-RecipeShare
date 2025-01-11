// Import Link from Next.js
'use client'
import Link from 'next/link';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';

interface RequestedRecipe {
  id: number;
  title: string;
  description: string;
  ingredients: string;
  date_requested: string;
  meal_type: string;
  user: {
    name: string;
  };
}

const RequestList: React.FC = () => {
  const [requests, setRequests] = useState<RequestedRecipe[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/request/get/all');
        const data = await response.json();
        setRequests(data);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchRequests();
  }, []);

 
  return (
    <div className="flex flex-col items-center p-8">
      <div className="flex space-x-4 mb-4">
        <button
          className={`text-lg font-semibold cursor-pointer focus:outline-none text-blue-500 border-b-2 border-blue-500`}
        >
          Requests
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map((request) => (
          <div key={request.id}  className="bg-blue-50 rounded-lg overflow-hidden shadow-md hover:shadow-xl">
            <div className="p-4">
              <h3 className="text-lg font-bold italic underline">{request.title}</h3>
            </div>
            <div className="p-4">
            <p className="text-lg ">Description: {request.description}</p>
            </div>
            <div className="p-4">
              <p className="text-lg ">Requested by: {request.user.name}</p>
              <p className="text-lg ">Ingredients: {request.ingredients}</p>
              <p className="text-lg ">Posted Date: {request.date_requested}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RequestList;
