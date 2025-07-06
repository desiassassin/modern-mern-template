// tailwind.config.js
const { heroui } = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
     content: ["./index.html", "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx}"],
     theme: {
          extend: {
               fontFamily: {
                    sans: ["Rubik"]
               },
               colors: {
                    current: "currentColor",
                    transparent: "transparent",
                    black: "#18181B",
                    white: "#FFFFFF",
                    // grey: "#1D2430",
                    grey: "#27272A"
               }
          }
     },
     darkMode: "class",
     plugins: [heroui()]
};
