import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Dark theme backgrounds
                navy: {
                    50: '#e6e8f0',
                    100: '#c0c5d9',
                    200: '#969fbf',
                    300: '#6c79a5',
                    400: '#4d5c92',
                    500: '#2e3f7f',
                    600: '#293977',
                    700: '#23316c',
                    800: '#1d2962',
                    900: '#0a0e27', // Primary background
                },
                charcoal: {
                    50: '#e8e9ec',
                    100: '#c5c7cf',
                    200: '#9ea2af',
                    300: '#777c8f',
                    400: '#5a6077',
                    500: '#3d445f',
                    600: '#373e57',
                    700: '#2f354d',
                    800: '#272d43',
                    900: '#1a1d2e', // Secondary background
                },
                // Neon accents
                electric: {
                    DEFAULT: '#0ea5e9', // Electric blue
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    200: '#bae6fd',
                    300: '#7dd3fc',
                    400: '#38bdf8',
                    500: '#0ea5e9',
                    600: '#0284c7',
                    700: '#0369a1',
                    800: '#075985',
                    900: '#0c4a6e',
                },
                violet: {
                    DEFAULT: '#8b5cf6',
                    50: '#faf5ff',
                    100: '#f3e8ff',
                    200: '#e9d5ff',
                    300: '#d8b4fe',
                    400: '#c084fc',
                    500: '#a855f7',
                    600: '#9333ea',
                    700: '#7e22ce',
                    800: '#6b21a8',
                    900: '#581c87',
                },
                neon: {
                    cyan: '#06b6d4',
                    blue: '#0ea5e9',
                    violet: '#8b5cf6',
                    red: '#ef4444',
                },
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
                heading: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
            },
            backdropBlur: {
                xs: '2px',
            },
            animation: {
                'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'slide-in': 'slide-in 0.3s ease-out',
                'fade-in': 'fade-in 0.2s ease-out',
                'stagger-in': 'stagger-in 0.4s ease-out',
            },
            keyframes: {
                'pulse-glow': {
                    '0%, 100%': {
                        opacity: '1',
                        boxShadow: '0 0 20px rgba(14, 165, 233, 0.5)',
                    },
                    '50%': {
                        opacity: '0.8',
                        boxShadow: '0 0 40px rgba(14, 165, 233, 0.8)',
                    },
                },
                'slide-in': {
                    '0%': {
                        transform: 'translateX(-10px)',
                        opacity: '0',
                    },
                    '100%': {
                        transform: 'translateX(0)',
                        opacity: '1',
                    },
                },
                'fade-in': {
                    '0%': {
                        opacity: '0',
                    },
                    '100%': {
                        opacity: '1',
                    },
                },
                'stagger-in': {
                    '0%': {
                        transform: 'translateY(10px)',
                        opacity: '0',
                    },
                    '100%': {
                        transform: 'translateY(0)',
                        opacity: '1',
                    },
                },
            },
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                'glow-sm': '0 0 10px rgba(14, 165, 233, 0.3)',
                'glow-md': '0 0 20px rgba(14, 165, 233, 0.4)',
                'glow-lg': '0 0 30px rgba(14, 165, 233, 0.5)',
            },
        },
    },
    plugins: [],
};

export default config;
