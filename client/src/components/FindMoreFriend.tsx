import React, { useCallback, useContext, useState } from "react";
import { debounce, method } from "lodash";
import { UserContext } from "@/contexts/UserContext";
import { useToast } from "rc-toastr";
import { Link } from "react-router-dom";
export const FindMoreFriend = () => {
    const { toast } = useToast();
    const { token } = useContext(UserContext);
    const [usernameToSearchFor, setUsernameToSearchFor] = useState("");
    const [foundUser, setFoundUser] = useState<{ username: string }>();
    const fetchFriend = async (username: string) => {
        const resp = await fetch(`${import.meta.env.VITE_API}/friend/search`, {
            method: "POST",
            headers: {
                Authorization: token!,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username: username }),
        });
        if (resp.status !== 200) {
            return;
        }
        const data = await resp.json();
        if (data.data.user_count === 0) {
            setFoundUser(undefined);
        } else {
            setFoundUser({ username: data.data.users[0]["Username"] });
        }
    };
    const debouncedFetchUser = useCallback(
        debounce((username) => fetchFriend(username), 1000),
        []
    );

    const addFriendHandler = async (username: string) => {
        const resp = await fetch(`${import.meta.env.VITE_API}/friend/add`, {
            method: "POST",
            headers: {
                Authorization: token!,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username: username }),
        });
        const data = await resp.json();
        if (resp.status !== 200) {
            toast.warning(data.error);
            return;
        }
    };
    return (
        <div className="bg-chat_darkgreen w-screen h-screen grid place-content-center space-y-2">
            <Link to="/" className="absolute top-4 left-4">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="currentColor"
                    className="text-white"
                >
                    <path d="M21 11H6.414l5.293-5.293-1.414-1.414L2.586 12l7.707 7.707 1.414-1.414L6.414 13H21z" />
                </svg>
            </Link>
            <h1 className="font-cursive text-center text-white text-4xl mb-8">
                Search friend
            </h1>
            <input
                className="bg-chat_lightgreen text-white p-4 rounded-md w-96 placeholder:text-gray-300"
                value={usernameToSearchFor}
                onChange={(e) => {
                    setFoundUser(undefined);
                    setUsernameToSearchFor(e.target.value);
                    debouncedFetchUser(e.target.value);
                }}
                placeholder={"Search username..."}
            ></input>
            {foundUser === undefined ? (
                <div>
                    <div className="flex flex-row border-2 border-gray-600 rounded-md p-4 bg-chat_lightgreen">
                        <div className="flex-1 text-white">
                            No user found, try again!
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <div className="flex flex-row border-2 border-gray-600 rounded-md p-4 bg-chat_lightgreen">
                        <div className="flex-1 text-white">
                            {foundUser.username}
                        </div>
                        <button
                            onClick={() => addFriendHandler(foundUser.username)}
                            className="text-white"
                        >
                            Add friend
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
