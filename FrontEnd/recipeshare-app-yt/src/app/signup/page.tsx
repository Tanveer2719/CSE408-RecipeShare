"use client";

import Image from "next/image";
import logo from "../../../public/logo.png";
import { FormEvent, useState, useRef } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { getStorage } from "firebase/storage";
import app from "../../firebase";
import firebase from "../../firebase";
import CustomButton from "../../components/CustomButton";
import { SignupDataType } from "@/Types";
import React from "react";
import LoadingOverlay from "@/components/LoadingOverlay";

const Signup: React.FC<{ signUpData: SignupDataType }> = ({ signUpData }) => {
  const [userData, setUserData] = React.useState<Record<string, any>>({
    username: "",
    password: "",
    email: "",
    image: "",
  });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [image, setImage] = useState<File | null>(null); // Add state for the image
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
  const SignupData: SignupDataType = (key: string, value: any) => {
    setUserData({ ...userData, [key]: value });
    // console.log(recipeData);
  };

  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploaded, setIsUploaded] = useState(false);

  const storage = firebase.storage;
  const fileInputRef = useRef(null);

  const handleImageUpload = async () => {
    const file = image;

    if (!file) {
      alert("No file selected");
      return;
    }
    setIsUploadingImage(true);

    const storageRef = ref(storage, `userImages/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        console.log(snapshot);
      },
      (error) => {
        console.log(error);
      },
      async () => {
        alert("Image Upload is complete");
        setIsUploaded(true);
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setImageUrl(downloadURL);
        console.log(downloadURL);
        SignupData("image", downloadURL);

        setIsUploadingImage(false);
      }
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
    console.log(username);
    console.log(password);
    SignupData("username", username);
    SignupData("password", password);
    SignupData("email", email);

    try {
      const response = await fetch(
        "https://recipeshare-tjm7.onrender.com/api/user/signup/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );
      console.log(userData);

      console.log(response);

      if (response.ok) {
        //const data = await response.json();
        const data = await response.json();
        console.log(data);
        if (data.jwt) {
          console.log("User signed up!");
          setUsername("");
          setPassword("");
          setEmail("");
          setError("");
        } else {
          window.location.href = "/login";
          //setError("Invalid response from server");
        }
      } else {
        setError("Invalid credentials");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Error signing up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gradient-to-r from-blue-300 to-purple-500 min-h-screen">
      <LoadingOverlay loading={loading} />
      <div className="bg-white shadow rounded-lg px-8 pt-6 pb-8 mb-4 flex flex-col w-full max-w-md">
        <Image
          src={logo}
          alt="Recipe Share Logo"
          width={80}
          height={80}
          className="mx-auto mb-6"
        />
        <h2 className="text-center text-2xl font-semibold mb-4">
          Sign up for RecipeShare
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="sr-only">
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                SignupData("username", e.target.value);
              }}
              className="rounded-md px-3 py-2 border border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50 w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                SignupData("password", e.target.value);
              }}
              className="rounded-md px-3 py-2 border border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50 w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                SignupData("email", e.target.value);
              }}
              className="rounded-md px-3 py-2 border border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50 w-full"
            />
          </div>
          {/* Add image upload field */}
          <div className="mb-4">
            <label htmlFor="image" className="sr-only">
              Profile Image
            </label>
            <input
              type="file"
              name="image"
              id="image"
              accept="image/*"
              ref={fileInputRef}
              placeholder="select image"
              onChange={(event) => {
                const file = event.target.files && event.target.files[0];
                if (file) {
                  setImage(file);
                  setPreviewUrl(URL.createObjectURL(file));
                }
              }}
              className="rounded-md px-3 py-2 border border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50 w-full"
            />
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="mt-2 max-w-full h-auto mb-6"
              />
            )}
            {isUploaded && (
              <div className="p-4 rounded-full text-white bg-yellow-700 text-center">
                Image Uploaded
              </div>
            )}
            {!isUploaded && (
              <CustomButton
                type="button"
                title={isUploadingImage ? "Uploading..." : "Upload Image"}
                varient="btn_light_green"
                otherStyles="bg-green-500 text-white px-4 py-1"
                onClick={() => handleImageUpload()}
              />
            )}
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-md px-4 py-2 font-semibold tracking-wider hover:bg-blue-700 transition-colors duration-200 ease-in"
          >
            Sign Up
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Signup;
