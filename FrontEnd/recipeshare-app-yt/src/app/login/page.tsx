"use client";
import React from "react";
import CustomButton from "@/components/CustomButton";
import { useState } from "react";
import Image from "next/image";
import logo from "../../../public/logo.png";

import LoadingOverlay from "@/components/LoadingOverlay";

const DemoLogin = () => {
  const [username, setUsername] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  // handle login
  const handleLogin = async () => {
    setLoading(true);
    console.log("username: ", username);
    console.log("password", password);
    const credentials = {
      username: username,
      password: password,
    };
    try {
      setIsLoading(true);
      const response = await fetch(
        "https://recipeshare-tjm7.onrender.com/api/user/login/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        }
      );

      const data = await response.json();
      console.log(data);
      setIsLoading(false);

      if (data.jwt) {
        const cookie = data.jwt; // Extract the cookie from the response
        document.cookie = `jwt=${cookie}`; // Set the cookie in the browser
        console.log(document.cookie);
        alert("Login Successful");
        window.location.href = "/profile";
      }
      // alert if response is unsuccessful
      else {
        alert("Login Unsuccessful");
        console.log(data);
      }
    } catch (error) {
      console.log("error: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center bg-gradient-to-r from-blue-300 to-purple-500 h-screen py-48">
      <LoadingOverlay loading={loading} />
      <div className="bg-white shadow rounded-lg flex px-4 flex-col w-2/5 h-64">
        <Image
          src={logo}
          alt="Recipe Share Logo"
          width={80}
          height={80}
          className="mx-auto mb-6"
        />
        <h2 className="text-center text-2xl font-semibold mb-4">
          Log in to RecipeShare
        </h2>
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
            onChange={(e) => setUsername(e.target.value)}
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
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-md px-3 py-2 border border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50 w-full"
          />
        </div>
        <CustomButton
          type="submit"
          otherStyles="bg-blue-500 text-white rounded-md px-4 py-2 font-semibold tracking-wider hover:bg-blue-700 transition-colors duration-200 ease-in"
          onClick={handleLogin}
          title="Log In"
        />

        <div className="mt-4 text-center">
          <p className="text-sm text-black">
            Dont have an account?{" "}
            <a href="/signup" className="text-blue-800 hover:underline">
              Sign up
            </a>
          </p>
        </div>
        {isLoading && (
          <div className="loading-overlay mt-3">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default DemoLogin;
