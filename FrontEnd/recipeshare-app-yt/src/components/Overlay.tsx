"use client";
import React from 'react'

type uploadProgress = {
    uploadProgress: number;
    msg: string;
};

const Overlay: React.FC<uploadProgress> = ({ uploadProgress,msg})=> {
      
  return (
    <div className="fixed inset-0 z-50 bg-black opacity-70">
        <div className="flex items-center justify-center h-screen">
        <div>
            <div className="text-white text-2xl">{msg}</div>
            <div className="text-white text-2xl px-20">{uploadProgress}%</div>
        </div>

        </div>
    </div>
)
  
}

export default Overlay;