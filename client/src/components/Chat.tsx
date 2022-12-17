import { UserContext } from "@/contexts/UserContext";
import React, { useCallback, useEffect } from "react";
import net from "node:net";
import { useToast } from "rc-toastr";
import { buildMessage, ChatMessage, parseMessage } from "@/lib/chat_protocol";
import { Map, List, update } from "immutable";
import { ipcRenderer } from "electron";
import { ChatSidebar } from "./ChatSidebar";

export const Chat = () => {
    const { toast } = useToast();

    const [friends, setFriends] = React.useState<
        {
            username: string;
            ip: string | null;
            port: string | null;
            is_active: number | boolean;
            last_update: Date | null;
        }[]
    >([]);

    const [messageToSend, setMessageToSend] = React.useState("");

    const [isFetchingFriend, setIsFetchingFriend] = React.useState(true);

    const [conversations, setConversations] = React.useState(
        Map<string, List<ChatMessage>>()
    );

    const [activeConversationUsername, setActiveConversationUsername] =
        React.useState<string | null>(null);

    const { token, username, setToken, setUsername, clearToken } =
        React.useContext(UserContext);

    useEffect(() => {
        setMessageToSend("");
    }, [activeConversationUsername]);

    useEffect(() => {
        async function fetchFriends() {
            const resp = await fetch(`${import.meta.env.VITE_API}/friend/my`, {
                method: "GET",
                headers: {
                    Authorization: token!,
                },
            });
            const data = await resp.json();
            setFriends(
                data.friends.map((f: any) => ({
                    ...f,
                    last_update:
                        f.last_update !== null ? new Date(f.last_update) : null,
                }))
            );
            setIsFetchingFriend(false);
        }

        fetchFriends();
    }, []);

    useEffect(() => {
        if (isFetchingFriend) {
            return;
        }
        const server = net.createServer((con) => {
            con.on("data", (data) => onDataHandler(data, friends));
        });
        if (friends.length !== 0) {
            server.listen(2510, ipAddress, () => {
                toast.success("Ready to recieve message!");
            });
        } else {
            toast.warning(
                "You dont have friend, connect with friend to send file and message"
            );
        }

        return () => {
            server.close();
        };
    }, [isFetchingFriend]);

    const onDataHandler = (data: Buffer, friendList: typeof friends) => {
        const message = parseMessage(data, Date.now());
        const friend = friends.find((f) => {
            return message.author === f.username;
        });

        if (friend === undefined) {
            return;
        }
        setConversations((currentConversation) => {
            if (currentConversation.get(message.author) === undefined) {
                console.log("Undefined");
                return currentConversation.set(message.author, List([message]));
            }
            console.log("Undefined");
            return currentConversation.update(message.author, (c) =>
                c!.push(message)
            );
        });
    };

    const sendMessage = () => {
        if (messageToSend === "") {
            return;
        }
        const friendIP = friends.find((friend) => {
            return friend.username === activeConversationUsername;
        })!.ip;
        if (friendIP === null) {
            toast.error(
                "Cannot send message because your friend does not online"
            );
        }

        const con = net.createConnection({
            host: friends.find((friend) => {
                return friend.username === activeConversationUsername;
            })!.ip!,
            port: 2510,
        });
        con.on("connect", () => {
            const message = buildMessage("text", username, messageToSend);
            con.write(message);
            con.end();

            setConversations((currentConversation) => {
                if (
                    currentConversation.get(activeConversationUsername!) ===
                    undefined
                ) {
                    return currentConversation.set(
                        activeConversationUsername!,
                        List([
                            new ChatMessage(
                                "text",
                                username,
                                Date.now(),
                                Buffer.from(messageToSend, "utf-8")
                            ),
                        ])
                    );
                }
                return currentConversation.update(
                    activeConversationUsername!,
                    (c) =>
                        c!.push(
                            new ChatMessage(
                                "text",
                                username,
                                Date.now(),
                                Buffer.from(messageToSend, "utf-8")
                            )
                        )
                );
            });
        });
        con.on("error", (e) => {
            toast.error("Cannot send message to client. Client may be offline");
            con.end();
        });
        setMessageToSend("");
    };

    useEffect(() => {
        const ping = async () => {
            await fetch(`${import.meta.env.VITE_API}/session/ping`, {
                method: "POST",
                headers: {
                    Authorization: token!,
                },
            });
        };
        const pingInterval = setInterval(() => {
            ping();
        }, 5000);

        return () => {
            clearInterval(pingInterval);
        };
    }, []);

    const [ipAddress, setIPAddress] = React.useState("");
    const [port, setPort] = React.useState("2510");

    const updateConnectionInfo = async (ip_address: string, port: string) => {
        await fetch(
            `${import.meta.env.VITE_API}/session/update_connection_info`,
            {
                method: "POST",
                headers: {
                    Authorization: token!,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ip_address: ipAddress, port: port }),
            }
        );
    };

    const submitIPHandler = useCallback(() => {
        updateConnectionInfo(ipAddress, port);
    }, [ipAddress, port]);
    return (
        <div className="w-screen h-screen bg-chat_darkgreen flex flex-row ">
            <ChatSidebar
                friends={friends}
                setActiveConversationUsername={setActiveConversationUsername}
                isFetchingFriend={isFetchingFriend}
                username={username}
                activeConversationUsername={activeConversationUsername}
                ipAddress={ipAddress}
                port={port}
                setIpAddress={setIPAddress}
                setPort={setPort}
                submitIPHandler={submitIPHandler}
                logoutHandler={async () => {
                    fetch(`${import.meta.env.VITE_API}/session/end`, {
                        method: "POST",
                        headers: {
                            Authorization: token!,
                        },
                    });
                    clearToken();
                    setUsername("");
                }}
            />
            {activeConversationUsername === null ? (
                <div className="text-gray-400 flex-1 text-center m-auto">
                    <div>No active conversation</div>
                    <div>Click on your friend to start chatting</div>
                </div>
            ) : (
                <div className="flex flex-col flex-1">
                    <div className="text-white font-semibold text-xl p-4 shadow-lg">
                        Chatting with {activeConversationUsername}
                    </div>
                    <div className="flex-1 min-h-0 overflow-y-auto flex flex-col space-y-2 p-4">
                        {conversations
                            .get(activeConversationUsername)
                            ?.map((message) => {
                                if (
                                    message.author ===
                                    activeConversationUsername
                                ) {
                                    return (
                                        <div className="bg-slate-500 rounded-md text-left w-fit max-w-xs p-2 text-white">
                                            {message.content}
                                        </div>
                                    );
                                }
                                return (
                                    <div className="bg-chat_yellow rounded-md text-left w-fit max-w-xs p-2 text-white self-end">
                                        {message.content}
                                    </div>
                                );
                            })}
                    </div>
                    <div className="flex flex-row bg-gray-700">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                            className="text-white m-2"
                            fill="currentColor"
                            stroke="currentColor"
                            onClick={() => {
                                console.log("Send file");
                                ipcRenderer.send("open-file-selector");
                            }}
                        >
                            <path d="M14.828 7.757l-5.656 5.657a1 1 0 1 0 1.414 1.414l5.657-5.656A3 3 0 1 0 12 4.929l-5.657 5.657a5 5 0 1 0 7.071 7.07L19.071 12l1.414 1.414-5.657 5.657a7 7 0 1 1-9.9-9.9l5.658-5.656a5 5 0 0 1 7.07 7.07L12 16.244A3 3 0 1 1 7.757 12l5.657-5.657 1.414 1.414z" />
                        </svg>
                        <input
                            className="flex-1 bg-inherit p-1 text-white focus:outline-none"
                            value={messageToSend}
                            onChange={(e) => setMessageToSend(e.target.value)}
                            onKeyUp={(e) => {
                                if (e.key !== "Enter") {
                                    return;
                                }
                                sendMessage();
                                e.preventDefault();
                            }}
                        ></input>
                        <div
                            onClick={() => {
                                sendMessage();
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                width="24"
                                height="24"
                                className="text-white m-2"
                                fill="currentColor"
                                stroke="currentColor"
                            >
                                <path d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z" />
                            </svg>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
