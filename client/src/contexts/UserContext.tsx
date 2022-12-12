import React from "react";

type UserContextProps = {
    token: string | null;
    setToken: (token: string) => void;
    clearToken: () => void;
    setUsername: (newUsername: string) => void;
    username: string;
};

export const UserContext = React.createContext<UserContextProps>({
    token: null,
    setToken: (tokenToSet: string) => {
        // token = tokenToSet;
    },
    clearToken: () => {
        // token = null;
    },
    setUsername: (newUsername: string) => {},
    username: "",
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = React.useState<string | null>(
        localStorage.getItem("user_token")
    );
    const [username, setUsername] = React.useState<string>(
        localStorage.getItem("user_name") || ""
    );
    return (
        <UserContext.Provider
            value={{
                token,
                username,
                setToken: (tokenToSet: string) => {
                    setToken(tokenToSet);
                    localStorage.setItem("user_token", tokenToSet);
                },
                clearToken: () => {
                    setToken(null);
                    localStorage.removeItem("user_token");
                },
                setUsername: (newUsername: string) => {
                    setUsername(newUsername);
                    localStorage.setItem("user_name", newUsername);
                },
            }}
        >
            {children}
        </UserContext.Provider>
    );
};
