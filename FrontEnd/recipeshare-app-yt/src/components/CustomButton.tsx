"use client";
import React from 'react';

type CustomButtonProps = {
    type: "button" | "submit" ;
    title: string;
    icon?: string;
    otherStyles?: string;
    onClick?: () => void;
    varient?: 'btn_dark_green' | 'btn_light_green' | 'btn_light_blue' | 'btn_dark_red' | 
               'btn_light_red' | 'btn_dark_yellow' | 'btn_light_yellow' | 'btn_dark_orange' | 'btn_light_orange' ;
}

const CustomButton = ({ type, title, icon, varient, onClick, otherStyles}:CustomButtonProps) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };
  return (
    <button
      className={`flexCenter gap-3 border ${otherStyles}`}
      type = {type}
      onClick={handleClick}
    >
      <label className='bold-20 whitespace-nowrap'>{title}</label>
    </button>
  );
};

export default CustomButton;
