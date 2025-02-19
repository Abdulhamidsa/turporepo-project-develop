import baseConfig from '@repo/ui/tailwind.config';
import type { Config } from 'tailwindcss';

export * from '@repo/ui/tailwind.config';

const config: Config = {
  ...baseConfig,
  theme: {
    ...baseConfig.theme,
    extend: {
      ...(baseConfig.theme?.extend || {}),
      animation: {
        ...(baseConfig.theme?.extend?.animation || {}),
        fadeIn: 'fadeIn 1s ease-out forwards',
        slideIn: 'slideIn 0.5s ease-out forwards',
        pulse: 'pulse 1s infinite',
      },
      keyframes: {
        ...(baseConfig.theme?.extend?.keyframes || {}),
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
  content: [
    ...(Array.isArray(baseConfig.content) ? baseConfig.content : []),
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
};

export default config;
