import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Custom fitness theme colors
        fitness: {
          primary: "hsl(142.1 70.6% 45.3%)",
          "primary-dark": "hsl(142.1 70.6% 40.3%)",
          "primary-light": "hsl(142.1 70.6% 50.3%)",
          secondary: "hsl(217.2 32.6% 17.5%)",
          "secondary-dark": "hsl(217.2 32.6% 15.5%)",
          "secondary-light": "hsl(217.2 32.6% 20.5%)",
          background: "hsl(222 84% 4.9%)",
          "background-light": "hsl(222 84% 6.9%)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-green": {
          "0%, 100%": {
            boxShadow: "0 0 0 0 rgba(34, 197, 94, 0.7)",
          },
          "50%": {
            boxShadow: "0 0 0 8px rgba(34, 197, 94, 0)",
          },
        },
        glow: {
          "0%, 100%": {
            boxShadow: "0 0 20px rgba(34, 197, 94, 0.3)",
          },
          "50%": {
            boxShadow: "0 0 30px rgba(34, 197, 94, 0.5)",
          },
        },
        "slide-up": {
          from: {
            transform: "translateY(10px)",
            opacity: "0",
          },
          to: {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-green": "pulse-green 2s infinite",
        glow: "glow 2s ease-in-out infinite",
        "slide-up": "slide-up 0.3s ease-out",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "fitness-gradient": "linear-gradient(135deg, hsl(142.1 70.6% 45.3%) 0%, hsl(142.1 70.6% 40.3%) 100%)",
        "card-gradient":
          "linear-gradient(135deg, hsl(217.2 32.6% 17.5%) 0%, hsl(217.2 32.6% 15.5%) 50%, hsl(217.2 32.6% 17.5%) 100%)",
      },
      boxShadow: {
        fitness: "0 8px 32px rgba(0, 0, 0, 0.3)",
        "fitness-button": "0 4px 16px rgba(34, 197, 94, 0.3)",
        "fitness-button-hover": "0 6px 20px rgba(34, 197, 94, 0.4)",
        "glow-green": "0 0 20px rgba(34, 197, 94, 0.3)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
