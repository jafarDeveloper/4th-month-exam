/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["*.html"],
    theme: {
      extend: {
        container: {
          center: true,
          padding: "1.3rem",
          screens: {
            default: " 1280px",
          },
        },
      },
    },
    plugins: [],
  };
  