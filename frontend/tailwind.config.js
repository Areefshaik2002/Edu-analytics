/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#3525cd",
        "primary-container": "#4f46e5",
        "on-primary": "#ffffff",
        "on-primary-container": "#dad7ff",
        "secondary": "#006591",
        "secondary-container": "#39b8fd",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#004666",
        "background": "#f8f9ff",
        "on-background": "#0b1c30",
        "surface": "#f8f9ff",
        "surface-bright": "#f8f9ff",
        "surface-dim": "#cbdbf5",
        "surface-container": "#e5eeff",
        "surface-container-low": "#eff4ff",
        "surface-container-lowest": "#ffffff",
        "surface-container-high": "#dce9ff",
        "surface-container-highest": "#d3e4fe",
        "on-surface": "#0b1c30",
        "on-surface-variant": "#464555",
        "outline": "#777587",
        "outline-variant": "#c7c4d8",
        "error": "#ba1a1a",
        "error-container": "#ffdad6",
        "on-error": "#ffffff",
        "on-error-container": "#93000a",
        "tertiary": "#7e3000",
        "tertiary-container": "#a44100",
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#ffd2be"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      spacing: {
        "stack-xs": "0.25rem",
        "stack-sm": "0.5rem",
        "stack-md": "1rem",
        "stack-lg": "1.5rem",
        "sidebar-width": "240px",
        "container-max": "1440px",
        "margin-page": "2rem",
        "gutter": "1.5rem"
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"]
      }
    },
  },
  plugins: [],
}
