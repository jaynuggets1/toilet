import type { Config } from "tailwindcss"; //we import Config from tailwindcss so typescript knows what shape our config should be

const config: Config = {
  content: [
    //content tells tailwind which files to scan for class names so it only includes the css styles we actually use in our project
    "./app/**/*.{js,ts,jsx,tsx,mdx}",      //scan all files in app folder - this is where our main pages and components are at
    "./components/**/*.{js,ts,jsx,tsx,mdx}", //scan all files in components folder - extra components we might have
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",     //scan all files in pages folder - next.js pages folder if we use it
  ],
  theme: {
    //theme is where we customize colors fonts sizes and other style stuff
    extend: {}, //extend lets us add our own custom values on top of tailwinds default stuff without overriding everything
  },
  plugins: [], //plugins are optional extra features we can add to tailwind - we don't have any right now but we can add them here later if we need em
};
export default config; //we export the config so tailwind can actually use it when it builds our css