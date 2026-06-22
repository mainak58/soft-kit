/** @type {import('tailwindcss').Config} */
export default {
  // class-based dark mode — toggled by adding/removing `dark` on <html>
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
    // scan the actual component source so their utility classes are generated
    "../src/components/**/*.{ts,tsx}",
  ],
  theme: { extend: {} },
  plugins: [],
};
