import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        display: ["Bebas Neue", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
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
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        chai: {
          cream: "hsl(var(--chai-cream))",
          light: "hsl(var(--chai-light))",
          warm: "hsl(var(--chai-warm))",
          brown: "hsl(var(--chai-brown))",
          dark: "hsl(var(--chai-dark))",
          charcoal: "hsl(var(--chai-charcoal))",
          orange: "hsl(var(--chai-orange))",
          "orange-glow": "hsl(var(--chai-orange-glow))",
          rust: "hsl(var(--chai-rust))",
          gold: "hsl(var(--chai-gold))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
        "3xl": "calc(var(--radius) + 16px)",
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
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-left": {
          from: { opacity: "0", transform: "translateX(-20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          from: { backgroundPosition: "200% 0" },
          to: { backgroundPosition: "-200% 0" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-2deg)" },
          "50%": { transform: "rotate(2deg)" },
        },
        "steam-rise": {
          "0%": { height: "0", opacity: "0", transform: "translateY(0) scaleX(1)" },
          "15%": { opacity: "0.6" },
          "50%": { opacity: "0.3", transform: "translateY(-30px) scaleX(1.5)" },
          "100%": { height: "60px", opacity: "0", transform: "translateY(-60px) scaleX(2)" },
        },
        "scan-line": {
          "0%, 100%": { top: "10%" },
          "50%": { top: "90%" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px hsla(25, 90%, 50%, 0.3)" },
          "50%": { boxShadow: "0 0 40px hsla(25, 90%, 50%, 0.6)" },
        },
        ripple: {
          "0%": { transform: "scale(0)", opacity: "0.5" },
          "100%": { transform: "scale(4)", opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
        "slide-in-left": "slide-in-left 0.5s ease-out forwards",
        "slide-in-right": "slide-in-right 0.5s ease-out forwards",
        "scale-in": "scale-in 0.3s ease-out forwards",
        shimmer: "shimmer 3s ease-in-out infinite",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        wiggle: "wiggle 1s ease-in-out infinite",
        "steam-rise": "steam-rise 3s ease-out infinite",
        "scan-line": "scan-line 2s ease-in-out infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        ripple: "ripple 0.6s ease-out",
      },
      backgroundImage: {
        "gradient-chai": "linear-gradient(135deg, hsl(var(--chai-brown)) 0%, hsl(var(--chai-dark)) 100%)",
        "gradient-warm": "linear-gradient(180deg, hsl(var(--chai-cream)) 0%, hsl(var(--chai-light)) 100%)",
        "gradient-hero": "linear-gradient(180deg, hsl(var(--chai-dark)) 0%, hsl(var(--chai-brown)) 50%, hsl(25, 45%, 45%) 100%)",
        "gradient-orange": "linear-gradient(135deg, hsl(var(--chai-orange)) 0%, hsl(var(--chai-rust)) 100%)",
        "gradient-card": "linear-gradient(145deg, hsl(var(--card)) 0%, hsl(30, 20%, 88%) 100%)",
      },
      boxShadow: {
        soft: "0 4px 20px -4px hsla(20, 60%, 20%, 0.15)",
        card: "0 8px 30px -8px hsla(20, 60%, 20%, 0.2)",
        glow: "0 0 40px hsla(25, 90%, 50%, 0.3)",
        "glow-lg": "0 0 60px hsla(25, 90%, 50%, 0.4)",
        inset: "inset 0 2px 10px hsla(20, 60%, 20%, 0.1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
