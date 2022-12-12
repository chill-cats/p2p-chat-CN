import { UserContext } from "@/contexts/UserContext";
import React, { useContext, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";

type Inputs = {
    username: string;
    password: string;
};

export const Login = () => {
    const inputIDs = React.useId();

    const [isLoading, setIsLoading] = useState(false);
    const { token, setToken, setUsername } = useContext(UserContext);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<Inputs>({ defaultValues: { username: "", password: "" } });

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        const resp = await fetch(`${import.meta.env.VITE_API}/auth/login`, {
            method: "POST",
            body: JSON.stringify({
                username: data.username,
                password: data.password,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        }).then((data) => data.json());
        if (resp.status === "NOT OK") {
            if (resp.location === "username") {
                setError("username", { type: "custom", message: resp.error });
            } else if (resp.location === "password") {
                setError("password", { type: "custom", message: resp.error });
            }
            return;
        }

        setToken(resp.token);
        setUsername(resp.username);
    };
    return (
        <div className="w-screen h-screen bg-chat_darkgreen grid place-content-center text-white space-y-2">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col space-y-2 w-64"
            >
                <label htmlFor={inputIDs + "-username"} className="">
                    Username:
                </label>
                <input
                    className="w-64 bg-chat_darkgreen rounded-md p-2 border border-chat_lightgreen text-white focus:outline-none"
                    placeholder="Username"
                    id={inputIDs + "-username"}
                    {...register("username", { required: true })}
                />
                {errors.username ? (
                    <div className="text-red-500">
                        {errors.username.message}
                    </div>
                ) : null}
                <label htmlFor={inputIDs + "-password"}>Password:</label>
                <input
                    className="w-64 bg-chat_darkgreen rounded-md p-2 border border-chat_lightgreen text-white focus:outline-none"
                    placeholder="Password"
                    id={inputIDs + "-password"}
                    type="password"
                    {...register("password", { required: true })}
                />
                {errors.password ? (
                    <div className="text-red-500">
                        {errors.password.message}
                    </div>
                ) : null}
                <input
                    type="submit"
                    className="w-64 bg-chat_red rounded-md py-2 brightness-100 focus:brightness-90 hover:brightness-95 disabled:grayscale transition-all duration-100"
                    disabled={isLoading}
                />
            </form>
            <Link
                to="/signup"
                className="text-right text-gray-400 hover:text-gray-100 underline"
            >
                Create new account!
            </Link>
        </div>
    );
};
