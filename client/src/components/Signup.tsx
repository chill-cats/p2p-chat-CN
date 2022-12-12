import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";

type Inputs = {
    username: string;
    password: string;
    repeatPassword: string;
};

export const Signup = () => {
    const inputIDs = React.useId();

    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        console.log(data);
        setIsLoading(true);
        const resp = await fetch(`${process.env.VITE_API}/auth/register`, {
            method: "POST",
            body: JSON.stringify({
                username: data.username,
                password: data.password,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const respData = await resp.text();

        console.log(resp);
        if (respData === "OK") {
        }
        setIsLoading(false);
    };

    return (
        <div className="w-screen h-screen bg-chat_darkgreen grid place-content-center text-white">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col space-y-2"
            >
                <label htmlFor={inputIDs + "-username"}>Username:</label>
                <input
                    className="w-64 bg-chat_darkgreen rounded-md p-2 border border-chat_lightgreen text-white focus:outline-none"
                    placeholder="Username"
                    id={inputIDs + "-username"}
                    {...register("username", { required: true })}
                />

                <label htmlFor={inputIDs + "-password"}>Password:</label>
                <input
                    className="w-64 bg-chat_darkgreen rounded-md p-2 border border-chat_lightgreen text-white focus:outline-none"
                    placeholder="Password"
                    id={inputIDs + "-password"}
                    type="password"
                    {...register("password", { required: true })}
                />
                <label htmlFor={inputIDs + "-repeat_password"}>
                    Repeat Password:
                </label>
                <input
                    className="w-64 bg-chat_darkgreen rounded-md p-2 border border-chat_lightgreen text-white focus:outline-none"
                    placeholder="Password"
                    id={inputIDs + "-password"}
                    type="password"
                    {...register("repeatPassword", { required: true })}
                />
                <input
                    type="submit"
                    className="w-64 bg-chat_red rounded-md py-2 brightness-100 focus:brightness-90 hover:brightness-95 disabled:grayscale transition-all duration-100"
                    disabled={isLoading}
                />
            </form>
            <Link
                to="/login"
                className="text-right text-gray-400 hover:text-gray-100 underline"
            >
                Already have account?
            </Link>
        </div>
    );
};
