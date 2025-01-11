"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import Rating from "@/components/Ratings";
import { RatingsupDataType, CommentsupDataType } from "@/Types";

interface ApiBlogResponse {
    id: number;
    title: string;
    summary: string;
    content?: string; // Assuming content is optional based on your JSON structure
    image: string; // Optional image field
    publication_date: string;
    last_modification_date: string;
    tags: string[];
    ratings: number;
    user: {
        name: string;
        id:number;
        // Add other user-related fields based on your User model
    };
    steps: {
        // Assuming image is an array of strings based on your JSON structure
        order: number;
        step: string;
        image: string;
    }[];
    sections: {
        id: number;
        title: string;
        content: string;
        image: string[]; // Assuming image is an array of strings based on your JSON structure
        order: number;
    }[];
    comments: {
        id: number;
        text: string;
        date: string;
        user: {
            name: string;
            id:number;
            // Add other user-related fields based on your User model
        };
    }[];
}

const Blog: React.FC<{ ratingsUpData: RatingsupDataType, commentsUpData: CommentsupDataType }> = ({ ratingsUpData, commentsUpData }) => {
    const [blogData, setBlogData] = useState<ApiBlogResponse | null>(null);
    const [showComments, setShowComments] = useState(false); // Track whether to show comments
    const { id: blogId } = useParams(); // Destructure the id property
    console.log(blogId); // Output: '12'
    //const router = useRouter();
    //const { blogId } = router.query;
    const [rating, setRating] = useState<number>(0);

    const [cookie, setCookie] = React.useState<string | undefined>('');
    const [blog_id, setId] = useState<string>('');
    const [ratings, setRatings] = useState<string>('');
    const [text, setText] = useState<string>('');
    const [date, setDate] = useState<string>('');
    const [ratingsData, setRatingsData] = React.useState<Record<string, any>>({
        blog_id: "",
        jwt: cookie,
        ratings: "",
    });
    const [commentsData, setCommentsData] = React.useState<Record<string, any>>({
        blog_id: "",
        jwt: cookie,
        text: "",
        user: ""
    });


    const CommentsupData: CommentsupDataType = (key: string, value: any) => {

        setCommentsData(prevState => ({
            ...prevState,
            [key]: value
        }));
        // console.log(recipeData);
    };
    const RatingsupData: RatingsupDataType = (key: string, value: any) => {


        setRatingsData(prevState => ({
            ...prevState,
            [key]: value
        }));
        // console.log(recipeData);
    };

    const getCookie = () => {
        const cookieValue = document.cookie
            .split('; ')
            .find((row) => row.startsWith('jwt='))?.split('=')[1];
        console.log(cookieValue);

        RatingsupData('jwt', cookieValue);
        CommentsupData('jwt', cookieValue);
        console.log(ratingsData);
        setCookie(cookieValue);
    };

    useEffect(() => {
        getCookie();
        const fetchData = async () => {
            // fetch the rating from localstorage
            const storedRating = localStorage.getItem(`rating_${blogId}`);
            if (storedRating) {
                setRating(parseInt(storedRating));
            }

            /************Add the cookie to the body ************** */
            // RatingsupData('jwt', cookie);
            RatingsupData('blog_id', blogId);
            CommentsupData('blog_id', blogId);

            console.log(blogId);
            try {
                const response = await fetch(
                    "https://recipeshare-tjm7.onrender.com/api/blog/get/",
                    {
                        method: "POST",
                        headers: {
                            //Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhcjEzNzM3NUBnbWFpbC5jb20iLCJleHAiOjE3MDYzMjY4MTMsImlhdCI6MTcwNjMyMzIxM30.xLX9HeailgdxCvDqcRsUGvctctH6rDnWpPpiDmTLbUs',
                        },
                        body: JSON.stringify({ blog_id: blogId?.toString() || "" }),
                    }
                );
                const data: ApiBlogResponse = await response.json();
                console.log(data);
                setBlogData(data);
            } catch (error) {
                console.error("Error fetching blog data:", error);
            }
        };

        fetchData();
    }, []); // The empty dependency array ensures that the effect runs once when the component mounts

    const handleAddComment = async () => {


        if (!cookie) {
            alert('Cookie not found. Please log in again.');
            return;
        }
        console.log(commentsData);
        try {
            const response = await fetch('https://recipeshare-tjm7.onrender.com/api/blog/comment/add/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(commentsData),
            });
            const data = await response.json();
            console.log(data);

            // Update the blog data with the new comment

        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    if (!blogData) {
        return <div>Loading...</div>; // You might want to add a loading state
    }

    // Function to transform numerical ratings to stars
    // StarRating component
    const StarRating = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        // Add full stars
        for (let i = 0; i < fullStars; i++) {
            stars.push(<span key={i}>★</span>);
        }

        // Add half star if applicable
        if (hasHalfStar) {
            stars.push(<span key="half">½</span>);
        }

        return <div className="flex text-[30px] tracking-widest">{stars}</div>;
    };

    // Function to convert stars to numerical ratings
    const RatingToStars = (stars: string) => {
        const fullStars = stars.split("★").length - 1;
        const hasHalfStar = stars.includes("½");
        const rating = fullStars + (hasHalfStar ? 0.5 : 0);
        return rating;
    };

    const getRatingFromLocalStorage = (reviewId: number): number | null => {
        const storedRating = localStorage.getItem(`rating_${reviewId}`);
        if (storedRating) {
            return parseInt(storedRating);
        }
        return null;
    };

    const handleAddRating = (rating: number, reviewId: number) => {
        // get the current rating from local storage
        // const currentRating = getRatingFromLocalStorage(reviewId);
        setRating(rating);
        // console.log(`Adding rating ${rating} for review ID ${reviewId}`);
    };

    // Function to handle the click event of the "Show Comments" button
    const handleShowComments = () => {
        setShowComments(true); // Set showComments to true when button is clicked
    };
    const toggleComments = () => {
        setShowComments(!showComments);
    };

    const goToUser = (id: number) => () => {
        window.location.href = `/user/${id}`;
      }
    

    return (
        <div className="p-4 lg:px-20 xl:px-40">
            {/* IMAGE AND TITLE */}
            {blogData.image && (
                <div className="relative w-full h-1/3 md:h-1/2 lg:w-1/2">
                    <Image
                        src={blogData.image}
                        alt=""
                        className="object-cover"
                        layout="responsive"
                        height="200"
                        width="200"
                    />
                </div>
            )}
            <h1 className="text-3xl font-bold uppercase xl:text-5xl mt-4">
                {blogData.title}
            </h1>

            {/* USER INFO */}
            <div className="text-gray-500">
                <p>By {blogData.user.name}</p>
                <p>
                    Last modified on{" "}
                    {new Date(blogData.last_modification_date).toLocaleDateString()}
                </p>
            </div>
            <div className="mt-4 flex space-x-4">
                {/* Tags Box */}
                <div className="flex-1">
                    <p className="text-lg text-indigo-500 font-bold mb-2">Tags:</p>
                    <p className="text-lg text-red-500">{blogData.tags.join(", ")}</p>
                </div>
                {/* Ratings Box */}
                <div className="flex-1">
                    <p className="text-lg text-indigo-500 font-bold mb-2">Rating:</p>
                    {/* Use function to numerical to star */}
                    <p className="text-lg text-yellow-500">{StarRating(rating)}</p>
                    <p className="text-[30px] text-yellow-500">{rating}</p>
                </div>
            </div>
            {/* SUMMARY */}
            <div className="mt-8 bg-gray-100 p-4 rounded-md">
                <h2 className="text-2xl font-bold mb-2">Summary</h2>
                <p className="font-serif text-lg italic">{blogData.summary}</p>
            </div>

            {/* SECTIONS */}
            <div className="mt-8">
                {blogData.sections.map((section) => (
                    <div key={section.id} className="mb-6">
                        <h2 className="text-3xl font-bold text-blue-500 mb-2">
                            {section.title}
                        </h2>

                        {section.image && section.image.length > 0 && (
                            <div
                                style={{ position: "relative", width: "40%", height: "150px" }}
                            >
                                <Image
                                    src={section.image[0]} // Assuming section.image is the image URL
                                    alt={`Image for ${section.title}`}
                                    layout="fill"
                                />
                            </div>
                        )}
                        <p className="text-lg">{section.content}</p>
                    </div>
                ))}
            </div>
            {/* Add Comment Button */}
            <div className="mt-4">
                <button
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    onClick={toggleComments}
                >
                    {showComments ? "Close Comments" : "Show Comments"}
                </button>
            </div>
            {/* COMMENTS */}
            {showComments && (
                <div className="mt-8 bg-gray-100 p-4 rounded-md">
                    <h2 className="text-3xl font-bold text-blue-500 mb-2">Comments</h2>
                    <ul>
                        {blogData.comments.map((comment) => (
                            <li key={comment.id} className="text-lg mb-2">
                                <p>{comment.text}</p>
                                <p className="text-gray-500">
                                <button onClick={goToUser(comment.user.id)} className="text-blue-500 font-bold hover:underline">By {comment.user.name} </button>
                     {/* User {comment.user.name}*/} on {new Date(comment.date).toLocaleDateString()}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="flex justify- center mt-10">
                <Rating
                    maxStars={5}
                    reviewId={blogData.id}
                    onAddRating={handleAddRating}
                />
            </div>

            {/* ADD COMMENT FORM */}
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Add a Comment</h2>
                <textarea
                    className="w-full p-2 border rounded-md"
                    placeholder="Type your comment here..."
                    value={text}
                    onChange={(e) => { setText(e.target.value); CommentsupData("text", e.target.value); }}
                    style={{ backgroundColor: "lightblue" }}
                //onChange={(e) => setNewComment(e.target.value)}
                />
                {/* Add Rating Button */}
                {/* <div className="mt-2">
                    <p className="text-lg font-bold">Add Rating:</p>
                    <StarRating rating={RatingToStars(blogData.ratings)} />
                </div> */}

                <button
                    className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    onClick={handleAddComment}
                >
                    Add Comment
                </button>
            </div>
        </div>
    );
};


export default Blog;
