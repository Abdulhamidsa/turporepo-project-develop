# ProFolio - Portfolio Platform

A modern portfolio platform built with React and Vite where professionals can showcase their work, connect with peers, and discover other talented individuals.

## About

This is the main frontend application for ProFolio, a professional networking and portfolio platform. Users can create profiles, share projects, write posts, and explore other professionals' work.

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **SWR** - Data fetching
- **Framer Motion** - Animations
- **React Hook Form** - Forms
- **Zod** - Validation

## Features

- User authentication (sign up/sign in)
- Profile management
- Project showcasing
- Social posts and feed
- Professional discovery
- Responsive design
- Dark/light mode

## Project Structure

```
src/
├── components/     # Shared components
├── features/       # Feature-based modules
│   ├── auth/       # Authentication
│   ├── user/       # User profiles
│   ├── projects/   # Project management
│   └── post/       # Social posts
├── pages/          # Route pages
├── hooks/          # Custom hooks
├── utils/          # Utility functions
└── layout/         # Layout components
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm package manager

### Installation

1. Install dependencies:

```bash
pnpm install
```

2. Create `.env.local` file:

```bash
cp .env.example .env.local
```

3. Add your environment variables:

```
VITE_BASE_URL=your_api_url
```

### Development

Start the development server:

```bash
pnpm dev
```

The app will be available at `http://localhost:5173`

### Build

Create a production build:

```bash
pnpm build
```

### Lint

Check code quality:

```bash
pnpm lint
```

## Key Pages

- `/auth` - Landing page with sign up/sign in
- `/feed` - Social feed
- `/professionals` - Discover professionals
- `/profile/:username` - User profiles
- `/projects` - Project showcase
- `/settings` - User settings

## Development Notes

This app is part of a monorepo and uses shared packages:

- `@repo/ui` - UI components
- `@repo/api` - API utilities
- `@repo/data` - Type definitions
- `@repo/zod` - Validation schemas

The app uses feature-based architecture where each feature has its own components, hooks, and utilities organized in dedicated folders.

## Contributing

1. Follow the existing code style
2. Use TypeScript for type safety
3. Write meaningful commit messages
4. Test your changes before submitting

## License

This project is for educational purposes.
