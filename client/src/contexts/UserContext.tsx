import React from "react";

type UserContextProps = {
    token: string | null;
    setToken: (token: string) => void;
    clearToken: () => void;
};

export const UserContext = React.createContext<UserContextProps>({
    token: null,
    setToken: (tokenToSet: string) => {
        // token = tokenToSet;
    },
    clearToken: () => {
        // token = null;
    },
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = React.useState<string | null>(
        localStorage.getItem("user_token")
    );
    return (
        <UserContext.Provider
            value={{
                token,
                setToken: (tokenToSet: string) => {
                    setToken(tokenToSet);
                    localStorage.setItem("user_token", tokenToSet);
                },
                clearToken: () => {
                    setToken(null);
                    localStorage.removeItem("user_token");
                },
            }}
        >
            {children}
        </UserContext.Provider>
    );
};
