export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        primary: ["Poppins", "sans-serif"],
      },
      colors: {
        primary: {
          50: "#E3F1FA",
          500: "#14428B",
          900: "#0E2E63",
        },
        secondary: {
          500: "#EB5A4A",
        },
        grey: {
          50: "#FAFAFA",
          100: "#F5F5F5",
          200: "#E6E6E6",
          300: "#D7D7D7",
          400: "#BDBDBD",
          500: "#989898",
          600: "#757575",
          700: "#616161",
          800: "#484848",
          900: "#212121",
        },
        others: {
          warning: "#FFBD19",
          rejected: "#FF6262",
          inprogress: "AB47BC",
          approved: "#40B499",
        },
      },
      fontSize: {
        display: [
          "5.375rem",
          {
            lineHeight: "5.75rem",
            fontWeight: "400",
            letterSpacing: "0",
          },
        ],
        "body-lg": [
          "1rem",
          {
            lineHeight: "1.375rem",
            fontWeight: "400",
            letterSpacing: "0",
          },
        ],
        "body-md": [
          "0.875rem",
          {
            lineHeight: "1.25rem",
            fontWeight: "400",
            letterSpacing: "0",
          },
        ],
        "button-md": [
          "0.875rem",
          {
            lineHeight: "1.25rem",
            fontWeight: "600",
            letterSpacing: "0",
          },
        ],
        "button-sm": [
          "0.875rem",
          {
            lineHeight: "1.125rem",
            fontWeight: "600",
            letterSpacing: "0",
          },
        ],
        caption: [
          "0.75rem",
          {
            lineHeight: "1.25rem",
            fontWeight: "600",
            letterSpacing: "0.075rem",
          },
        ],
        tooltip: [
          "0.75rem",
          {
            lineHeight: "1rem",
            fontWeight: "600",
            letterSpacing: "0",
          },
        ],
      },
      boxShadow: {
        "3xl": "0px 2px 20px 4px rgba(0, 0, 0, 0.20)",
        light: "0px 2px 20px 4px rgba(0, 0, 0, 0.12)",
        dark: "0px 4px 16px 8px rgba(217, 217, 217, 0.28)",
      },
      animation: {
        loader: "loader 0.6s infinite alternate",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      keyframes: {
        loader: {
          to: {
            transform: "translate3d(0, -0.3rem, 0)",
          },
        },
      },
      transitionProperty: {
        height: "height",
      },
    },
    fontSize: {
      xs: "0.75rem",
      sm: "0.838rem",
      base: "1rem",
      lg: "1.063rem",
      xl: "1.25rem",
      "2xl": "1.563rem",
      "3xl": "1.953rem",
      "4xl": "2.441rem",
      "5xl": "3.052rem",
    },
  },
};
