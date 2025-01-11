"use client";

import React from "react";
import Image from "next/image";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Image1 from "./../../public/slider/image1.jpg";
import Image2 from "./../../public/slider/image2.jpg";
import Image3 from "./../../public/slider/image3.jpg";
import Image4 from "./../../public/slider/image4.jpg";
import Image5 from "./../../public/slider/image5.jpg";

const images = [Image1, Image2, Image3, Image4, Image5];

const ImageSlider: React.FC = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    adaptiveHeight: true,
    centerMode: true,
    centerPadding: "20%",
  };

  return (
    <div className="slick-container">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index} className="slick-slide">
            <Image src={image} alt={`Slide ${index}`} className="slick-image" />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ImageSlider;
