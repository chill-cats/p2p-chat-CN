import React from "react";
import dateFormat from "dateformat";
import { Link } from "react-router-dom";

export const ChatSidebar = ({
    username,
    isFetchingFriend,
    friends,
    activeConversationUsername,
    setActiveConversationUsername,
    ipAddress,
    port,
    setIpAddress,
    setPort,
    submitIPHandler,
    logoutHandler,
}: {
    username: any;
    isFetchingFriend: any;
    friends: any;
    activeConversationUsername: any;
    setActiveConversationUsername: any;
    ipAddress: string;
    port: string;
    setIpAddress: any;
    setPort: any;
    submitIPHandler: () => void;
    logoutHandler: () => void;
}) => {
    return (
        <div className="bg-chat_lightgreen rounded-tr-xl w-64 flex flex-col">
            <div className="text-white font-light p-4 pb-0 text-lg space-y-2">
                Hello {username}
                <div className="flex space-x-2 w-full min-w-0">
                    <span>IP:</span>
                    <input
                        className="flex-1 min-w-0 bg-chat_orange p-1 rounded-sm"
                        value={ipAddress}
                        onChange={(e) => setIpAddress(e.target.value)}
                    ></input>
                </div>
                <div className="flex flex-row space-x-2 w-full items-center">
                    <span>Port:</span>
                    <input
                        className="flex-1 min-w-0 bg-chat_orange p-1 rounded-sm"
                        value={port}
                        onChange={(e) => setPort(e.target.value)}
                    ></input>
                </div>
                <button
                    className="w-full bg-chat_yellow rounded-sm"
                    onClick={submitIPHandler}
                >
                    Update
                </button>
            </div>
            <div className="flex-1 overflow-auto min-h-0 bg-chat_lightgreen">
                {isFetchingFriend ? (
                    <div className="w-full h-full text-gray-200 grid place-content-center">
                        Loading friends...
                    </div>
                ) : (
                    <>
                        {friends.map((friend: any) => (
                            <div
                                className={`${
                                    activeConversationUsername ===
                                    friend.username
                                        ? "bg-chat_red"
                                        : "bg-chat_yellow"
                                } px-4 py-2 flex flex-row m-2 rounded-md space-x-4 cursor-pointer transition-all shadow-md`}
                                key={friend.username}
                                onClick={() =>
                                    setActiveConversationUsername(
                                        friend.username
                                    )
                                }
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="font-bold">
                                        {friend.username}
                                    </div>
                                    <div className="text-ellipsis whitespace-nowrap overflow-hidden">
                                        <span className="font-bold">IP:</span>{" "}
                                        {friend.ip ?? "NA"}
                                    </div>
                                    <div>
                                        <span className="font-bold">Port:</span>{" "}
                                        {friend.port ?? "NA"}
                                    </div>
                                    <div className="">
                                        <div className="font-bold">
                                            Last online:
                                        </div>{" "}
                                        {friend.last_update === null
                                            ? "NA"
                                            : dateFormat(
                                                  friend.last_update,
                                                  "HH:MM:ss dd/mm/yyyy"
                                              )}
                                    </div>
                                </div>
                                {friend.last_update === null ||
                                Math.abs(
                                    Date.now() - friend.last_update!.getTime()
                                ) >
                                    60000 * 10 ? (
                                    <div className="m-auto text-gray-400">
                                        ●
                                    </div>
                                ) : friend.is_active === 0 ? (
                                    <div className="m-auto text-red-500">●</div>
                                ) : (
                                    <div className="m-auto text-green-500">
                                        ●
                                    </div>
                                )}
                            </div>
                        ))}
                    </>
                )}
            </div>
            <div className="p-2 space-y-1">
                <Link
                    to="/search_friend"
                    className="w-full text-center block border-2 border-white text-white rounded-md p-2 hover:bg-chat_orange transition-all"
                >
                    Find more friends
                </Link>
                <button
                    className="w-full text-center block border-2 border-chat_orange hover:border-red-500 text-chat_orange hover:text-white rounded-md p-2 hover:bg-red-500 transition-all"
                    onClick={logoutHandler}
                >
                    Logout
                </button>
            </div>
        </div>
    );
};
