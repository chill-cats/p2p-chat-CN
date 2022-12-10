import React from "react";
import ReactDOM from "react-dom/client";
import "./samples/node-api";
import "styles/index.css";
import { ToastProvider } from "rc-toastr";
import "rc-toastr/dist/index.css"; // import the css file

import { Login } from "./components/Login";
import {
    createBrowserRouter,
    RouterProvider,
    Route,
    redirect,
} from "react-router-dom";
import { Signup } from "./components/Signup";
import { Chat } from "./components/Chat";
import { UserContext, UserProvider } from "./contexts/UserContext";

const App = () => {
    const [user, setUser] = React.useState(false);
    const { token } = React.useContext(UserContext);
    const router = createBrowserRouter([
        {
            path: "/login",
            element: <Login />,
            loader() {
                if (token) {
                    return redirect("/");
                }
                return null;
            },
        },
        {
            path: "/signup",
            element: <Signup />,
            loader() {
                if (token) {
                    return redirect("/");
                }
                return null;
            },
        },
        {
            path: "/",
            element: <Chat />,
            loader: () => {
                if (!token) {
                    return redirect("/login");
                }
                return null;
            },
        },
    ]);

    return <RouterProvider router={router} />;
};

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <UserProvider>
            <ToastProvider>
                <App />
            </ToastProvider>
        </UserProvider>
    </React.StrictMode>
);

postMessage({ payload: "removeLoading" }, "*");
