/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#f2f2f2",
        primary: "#362C5F", // header and buttons
        "primary-light": "#A8A4B8",
        secondary: "#29243F", // text
        outline: "#7E7E7E", // outline
      },
    },
  },
  plugins: [],
};
