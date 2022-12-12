/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {},
    },
    plugins: [],
    theme: {
        extend: {
            colors: {
                chat_darkgreen: "#264653",
                chat_lightgreen: "#2A9D8F",
                chat_yellow: "#E9C46A",
                chat_orange: "#F4A261",
                chat_red: "#E76F51",
            },
            fontFamily: {
                cursive: ["Dancing Script"],
            },
        },
    },
};
