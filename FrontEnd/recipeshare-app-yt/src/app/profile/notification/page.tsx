'use client';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DateTime } from 'next-auth/providers/kakao';
import { set } from 'firebase/database';

interface Notification {
    id: number;
    notification: string;
    date: DateTime;
    is_read: boolean;
    is_recipe: boolean;
    blog: string;
    recipe: string;
    user: {
        name: string;
    };
}

const NotificationList: React.FC<{ onClose: () => void; userName: string }> = ({ onClose, userName }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]); // Initialize with an empty array
    const [cookie, setCookie] = useState<string | undefined>('');
    const [isEmpty, setIsEmpty] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const fetchCookie = () => {
        const cookieValue = document.cookie.split('; ')
            .find((row) => row.startsWith('jwt='))?.split('=')[1];

        // Use the setCookie callback to ensure that the state is updated before using it
        setCookie((prevCookie) => {
            if (prevCookie !== cookieValue) {
                return cookieValue;
            }
            return prevCookie;
        });
    };


    const fetchNotifications = async () => {
        if (cookie) {
            setIsLoading(true);
            try {
                const response = await fetch('https://recipeshare-tjm7.onrender.com/api/user/notification/all/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ jwt: cookie }),
                });

                const data = await response.json();
                console.log(data);

                if (data.notifications && data.notifications.length > 0) {
                    setNotifications(data.notifications);
                } else {
                    setIsEmpty(true);
                }

                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching notifications:', error);
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            fetchCookie();
            console.log('cookie: ' + cookie);
            await fetchNotifications();
            console.log(notifications.length);
        };

        fetchData();
    }, [cookie]);

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto">
            <div className="bg-lime-100 p-8 rounded-md max-w-screen-md w-full h-full overflow-y-auto">
                <button className="absolute top-2 right-2 text-white bg-red-500 hover:bg-red-600 w-10 h-10 rounded-md"
                    onClick={() => {
                        window.location.href = '/profile';
                    }}
                >
                    Close
                </button>
                <h2 className="text-2xl font-bold mb-4">Notifications</h2>
                {isLoading && <h3 className="text-lg font-semibold cursor-pointer">Loading...</h3>}

                {notifications.length === 0 ? (
                    <h3 className="text-lg font-semibold cursor-pointer">No notifications found</h3>
                ) : (
                    notifications.map((notification, index) => (
                        <div key={notification.id} className="mb-4 px-10">
                            <div>
                                {notification.is_recipe ? (
                                    <Link href={`/recipe/${notification.recipe}`}>
                                        <h3 className="text-2xl text-blue-500 hover:underline">{`${index + 1}. ${notification.notification}`}</h3>
                                    </Link>
                                ) : (
                                    <Link href={`/blog/${notification.blog}`}>
                                        <h3 className="text-2xl text-blue-500 hover:underline">{`${index + 1}. ${notification.notification}`}</h3>
                                    </Link>
                                )}
                            </div>
                            <div className="text-lg text-gray-500">{`Published on ${new Date(
                                notification.date
                            ).toLocaleDateString()}`}</div>
                        </div>
                    ))
                )}

            </div>
        </div>
    );
};

export default NotificationList;
