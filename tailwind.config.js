/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F8F7F4",
        ink: "#0A0C16",
        blue: {
          DEFAULT: "#3D5CFF",
          light: "#96B0FF",
          dark: "#223ACD",
        },
        line: {
          dark: "rgba(10, 12, 22, 0.9)",
          light: "rgba(255, 255, 255, 0.18)",
          DEFAULT: "rgba(10, 12, 22, 0.15)",
        },
        // Backwards compatibility tokens
        surface: "#151A33",
        light: "#F0EEF7",
        "text-dark": "#0B0F1E",
        accent: {
          DEFAULT: "#3D5CFF",
          bright: "#617DFF",
        },
        ice: "#BFD4FF",
        success: "#22C55E",
        warning: "#F59E0B",
      },
      fontFamily: {
        sans: ['Onest', 'sans-serif'],
        display: ['Onest', 'sans-serif'],
        serif: ['Lora', 'serif'],
      },
      backgroundImage: {
        'leopard': "url('/leopard-pattern.png')",
      },
    },
  },
  plugins: [],
}
