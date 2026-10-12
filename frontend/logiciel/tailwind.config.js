/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Identidad visual LOGICIEL (logotipo oficial)
      colors: {
        brand: {
          navy: "#0C2340",          // primario: navbar, footer, títulos
          "navy-light": "#163A63",  // superficies elevadas sobre navy
          "navy-dark": "#081A30",
          teal: "#119DA4",          // acento: botones, badges, iconos
          "teal-dark": "#0D7F85",   // hover de botones teal
          "teal-light": "#E6F6F7",  // fondos suaves de badges
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
        brand: ["Outfit", "Inter", "system-ui", "sans-serif"], // solo el nombre del logotipo
      },
      animation: {
        "loading-bar": "loading 1.2s ease-in-out infinite",
        fade: "fade 1.5s ease-in-out infinite",
      },
      keyframes: {
        loading: {
          "0%": { transform: "translateX(-100%)" },
          "50%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(100%)" },
        },
        fade: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
