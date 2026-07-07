import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "surface-container-lowest": "#ffffff",
        "on-primary-fixed-variant": "#004395",
        "on-error": "#ffffff",
        "secondary-fixed": "#e9ddff",
        "surface-container": "#e7eefe",
        "surface-container-low": "#f0f3ff",
        "background": "#f9f9ff",
        "surface-tint": "#005ac2",
        "on-primary-fixed": "#001a42",
        "primary-container": "#2170e4",
        "on-background": "#151c27",
        "tertiary-container": "#00855b",
        "error": "#ba1a1a",
        "surface-bright": "#f9f9ff",
        "tertiary": "#006947",
        "inverse-surface": "#2a313d",
        "on-secondary-fixed-variant": "#5516be",
        "surface-dim": "#d3daea",
        "tertiary-fixed-dim": "#4edea3",
        "secondary-fixed-dim": "#d0bcff",
        "surface-container-high": "#e2e8f8",
        "on-secondary-container": "#fffbff",
        "secondary-container": "#8455ef",
        "surface-variant": "#dce2f3",
        "on-surface-variant": "#424754",
        "on-tertiary": "#ffffff",
        "on-secondary-fixed": "#23005c",
        "outline-variant": "#c2c6d6",
        "on-tertiary-container": "#f5fff6",
        "on-tertiary-fixed-variant": "#005236",
        "surface": "#f9f9ff",
        "on-primary": "#ffffff",
        "outline": "#727785",
        "inverse-on-surface": "#ebf1ff",
        "secondary": "#6b38d4",
        "error-container": "#ffdad6",
        "primary-fixed-dim": "#adc6ff",
        "on-secondary": "#ffffff",
        "inverse-primary": "#adc6ff",
        "primary": "#0058be",
        "on-error-container": "#93000a",
        "on-surface": "#151c27",
        "primary-fixed": "#d8e2ff",
        "on-tertiary-fixed": "#002113",
        "on-primary-container": "#fefcff",
        "tertiary-fixed": "#6ffbbe",
        "surface-container-highest": "#dce2f3"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "2xl": "1rem",
        "full": "9999px"
      },
      spacing: {
        "margin-desktop": "40px",
        "sidebar-width": "260px",
        "max-width": "1440px",
        "unit": "4px",
        "gutter": "24px",
        "margin-mobile": "16px"
      },
      fontFamily: {
        "body-lg": ["Inter", "sans-serif"],
        "label-sm": ["Inter", "sans-serif"],
        "title-md": ["Inter", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "headline-lg-mobile": ["Inter", "sans-serif"],
        "headline-lg": ["Inter", "sans-serif"],
        "display-lg": ["Inter", "sans-serif"]
      },
      fontSize: {
        "body-lg": ["16px", { "lineHeight": "24px", "fontWeight": "400" }],
        "label-sm": ["12px", { "lineHeight": "16px", "letterSpacing": "0.01em", "fontWeight": "500" }],
        "title-md": ["18px", { "lineHeight": "24px", "fontWeight": "600" }],
        "body-md": ["14px", { "lineHeight": "20px", "fontWeight": "400" }],
        "headline-lg-mobile": ["24px", { "lineHeight": "32px", "fontWeight": "600" }],
        "headline-lg": ["32px", { "lineHeight": "40px", "letterSpacing": "-0.01em", "fontWeight": "600" }],
        "display-lg": ["48px", { "lineHeight": "56px", "letterSpacing": "-0.02em", "fontWeight": "700" }]
      }
    },
  },
  plugins: [],
};

export default config;
