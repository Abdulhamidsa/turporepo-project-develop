# ProFolio - Landing & Discovery App

The public-facing landing page and discovery platform for ProFolio, built with Next.js. This app showcases featured professionals and projects, allowing visitors to explore the platform before signing up.

## About

This is the marketing and discovery website for ProFolio. It serves as the entry point for new users and provides a way to browse featured content without requiring authentication. The app focuses on showcasing the best professionals and projects to attract new users.

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **next-themes** - Dark/light mode
- **Cloudinary** - Image optimization
- **Vercel Analytics** - Performance tracking

## Features

- Landing page with hero section
- Featured professionals showcase
- Featured projects gallery
- About page
- Professional discovery
- SEO optimized pages
- Responsive design
- Dark/light mode support
- Server-side rendering

## Project Structure

```
src/
├── app/           # Next.js App Router pages
│   ├── about/     # About page
│   ├── profile/   # Profile pages
│   ├── project/   # Project details
│   ├── users/     # User listings
│   └── layout.tsx # Root layout
├── components/    # Shared components
├── features/      # Feature modules
│   ├── auth/      # Authentication
│   ├── user/      # User profiles
│   └── projects/  # Project showcase
├── lib/           # API and utilities
└── types/         # Type definitions
```

## Key Pages

- `/` - Landing page with featured content
- `/about` - About ProFolio
- `/users` - Browse professionals
- `/projects` - Browse projects
- `/profile/[username]` - Public profiles
- `/project/[id]` - Project details

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm package manager

### Installation

1. Install dependencies:

```bash
pnpm install
```

2. Create `.env` file:

```bash
cp .env.example .env
```

3. Add your environment variables:

```
NEXT_PUBLIC_API_URL=your_api_url
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
```

### Development

Start the development server:

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

### Build

Create a production build:

```bash
pnpm build
```

### Start Production Server

Start the production server:

```bash
pnpm start
```

### Lint

Check code quality:

```bash
pnpm lint
```

## Features Overview

### Landing Page

- Hero section with compelling messaging
- Featured professionals carousel
- Featured projects showcase
- Call-to-action buttons

### Discovery

- Browse professionals by category
- Explore projects by technology
- Search and filter functionality
- Public profile viewing

### SEO & Performance

- Server-side rendering for better SEO
- Optimized images with Cloudinary
- Meta tags and Open Graph support
- Performance analytics

## Development Notes

This app uses:

- **App Router** - Next.js 13+ routing system
- **Server Components** - For better performance
- **Shared Packages** - From the monorepo
- **Static Generation** - For optimal performance

The app is designed to be the public face of ProFolio, focusing on showcasing the best content and converting visitors into users.

## Deployment

The app is configured for Vercel deployment with:

- Automatic deployments on push
- Environment variable configuration
- Performance monitoring
- Image optimization

## Contributing

1. Follow Next.js best practices
2. Use TypeScript for all components
3. Optimize for SEO and performance
4. Test on mobile devices

## License

This project is for educational purposes.
