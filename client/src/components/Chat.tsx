import { UserContext } from "@/contexts/UserContext";
import React, { useEffect } from "react";
import net from "node:net";
import { useToast } from "rc-toastr";
import { ChatMessage, parseMessage } from "@/lib/chat_protocol";

export const Chat = () => {
    const { toast } = useToast();

    const [friends, setFriends] = React.useState<
        {
            username: string;
            ip: string | null;
            port: string | null;
            is_active: number | boolean;
        }[]
    >([]);

    const [conversations, setConversations] = React.useState(
        new Map<string, { author: string; message: ChatMessage }[]>()
    );

    const [activeConversationUsername, setActiveConversationUsername] =
        React.useState<string | null>(null);

    const { token } = React.useContext(UserContext);

    useEffect(() => {
        async function fetchFriends() {
            const resp = await fetch(`${import.meta.env.VITE_API}/friend/my`, {
                method: "GET",
                headers: {
                    Authorization: token!,
                },
            });
            const data = await resp.json();

            setFriends(data.friends);
        }
        fetchFriends();
    }, []);

    const onDataHandler = (data: Buffer) => {
        const message = parseMessage(data, Date.now());
        const conversationOfMessage = conversations.get(message.author);
        const friend = friends.find((f) => {
            return message.author === f.username;
        });

        if (friend === undefined) {
            return;
        }

        if (conversationOfMessage === undefined) {
            setConversations((conv) => {
                conv.set(message.author, [{ author: message.author, message }]);
                return conv;
            });
        } else {
            setConversations((currentConvs) => {
                const authorConv = currentConvs.get(message.author);
                authorConv?.push({ author: message.author, message });
                return currentConvs;
            });
        }
    };

    useEffect(() => {
        const server = net.createServer((con) => {
            con.on("data", (data) => onDataHandler(data));
        });

        server.listen(2510, () => {
            toast.success("Ready to recieve message!");
        });

        return () => {
            server.close();
        };
    }, [friends]);

    console.log(conversations);
    console.log(friends);
    return (
        <div className="w-screen h-screen bg-chat_darkgreen flex flex-row ">
            <div className="bg-chat_lightgreen rounded-tr-xl rounded-br-xl">
                {friends.map((friend) => (
                    <div
                        className={`${
                            activeConversationUsername === friend.username
                                ? "bg-chat_red"
                                : "bg-chat_yellow"
                        } px-4 py-2 flex flex-row m-2 rounded-md space-x-4 w-64 cursor-pointer transition-all shadow-md`}
                        key={friend.username}
                        onClick={() =>
                            setActiveConversationUsername(friend.username)
                        }
                    >
                        <div className="flex-1 min-w-0">
                            <div className="font-bold">{friend.username}</div>
                            <div className="text-ellipsis whitespace-nowrap overflow-hidden">
                                <span className="font-bold">IP:</span>{" "}
                                {friend.ip ?? "NA"}
                            </div>
                            <div>
                                <span className="font-bold">Port:</span>{" "}
                                {friend.port ?? "NA"}
                            </div>
                        </div>
                        {friend.is_active === null ? (
                            <div className="m-auto text-gray-400">●</div>
                        ) : friend.is_active === 0 ? (
                            <div className="m-auto text-red-500">●</div>
                        ) : (
                            <div className="m-auto text-green-500">●</div>
                        )}
                    </div>
                ))}
            </div>
            {activeConversationUsername === null ? (
                <div className="text-gray-400 flex-1 text-center m-auto">
                    <div>No active conversation</div>
                    <div>Click on your friend to start chatting</div>
                </div>
            ) : (
                <>
                    <div>Chatting with {activeConversationUsername}</div>
                    <div>
                        {JSON.stringify(Array.from(conversations.entries()))}
                    </div>
                </>
            )}
        </div>
    );
};
