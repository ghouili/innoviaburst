import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
import typography from "@tailwindcss/typography";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1280px",
      },
    },
    screens: {
      xs: "400px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
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
        "destructive-strong": "hsl(var(--destructive-strong))",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        // Text-safe darkened cyan for cyan TEXT/links (AA on the light bg);
        // `--accent` stays bright for icons/borders/decorative.
        "accent-strong": "hsl(var(--accent-strong))",
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        cyan: {
          DEFAULT: "hsl(var(--cyan))",
          light: "hsl(var(--cyan-light))",
          dark: "hsl(var(--cyan-dark))",
        },
        "deep-blue": {
          DEFAULT: "hsl(var(--deep-blue))",
          dark: "hsl(var(--deep-blue-dark))",
        },
        orange: {
          DEFAULT: "hsl(var(--orange))",
          light: "hsl(var(--orange-light))",
          dark: "hsl(var(--orange-dark))",
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
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        // Aliased to 2xl: Tailwind default 3xl (1.5rem) would otherwise render
        // SMALLER than 2xl and identical to xl.
        "3xl": "var(--radius-2xl)",
        full: "var(--radius-full)",
      },
      // NOTE: the app's stacking ladder is deliberately NOT tokenised here.
      //
      //   80  sticky CTA bars      120  modals / sheets / drawers
      //   90  navbar               130  popover / select / dropdown / tooltip
      //  100  cookie consent       150  toasts        200  skip link
      //
      // It is written as arbitrary values (z-[90], z-[120], ...) at each call
      // site instead. Two reasons, both learned the hard way:
      //
      //  1. A named key only exists once Tailwind has re-read THIS file. A dev
      //     server that was already running when the key was added emits no
      //     rule, so the class resolves to `z-index: auto` with no error and
      //     the navbar silently falls behind the hero. Arbitrary values are
      //     generated from the class string, so they cannot vanish that way.
      //  2. tailwind-merge does not recognise custom z-index names:
      //     twMerge("z-modal","z-50") keeps BOTH classes, while
      //     twMerge("z-[120]","z-50") correctly resolves to "z-50".
      //     cn(variants(), className) in DialogContent/SheetContent relies on
      //     that dedupe working.
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [tailwindcssAnimate, typography],
} satisfies Config;
