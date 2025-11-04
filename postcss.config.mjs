const config = {
  plugins: ["@tailwindcss/postcss"],
  theme: {
    extend: {
      colors: {
        'custom-text': 'rgba(235, 223, 214, 1)',
        accent: "#D98C2B", // use the orange from your design
      },
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
        script: ["Dancing Script", "cursive"], // or your chosen script font
      },
    },
  },
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
};

export default config;
