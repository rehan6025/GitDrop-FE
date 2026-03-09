# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev          # Start development server (Vite)
npm run build        # Build for production (TypeScript check + Vite build)
npm run lint         # Run ESLint
npm run storybook    # Start Storybook on port 6006
```

## Project Overview

GitDrop frontend - a deployment platform for GitHub repositories. Users can deploy React or static sites from their GitHub repos.

## Architecture

**Tech Stack:** React 19 + TypeScript + Vite (rolldown-vite) + Tailwind CSS v4 + shadcn/ui + React Router

**Path Alias:** `@/` maps to `src/`

**Directory Structure:**
- `src/pages/` - Route page components (Dashboard, Deploy, Project)
- `src/components/` - Reusable components
- `src/components/ui/` - shadcn/ui components
- `src/layouts/` - Layout wrappers (MainLayout wraps pages with Navbar)
- `src/api/api.ts` - Centralized API client for GitHub auth and deployment endpoints
- `src/lib/utils.ts` - Utilities (cn function for class merging)

**Routing:** React Router with MainLayout wrapper. Routes defined in `App.tsx`.

**API:** The `api` object in `src/api/api.ts` handles:
- GitHub OAuth login (`api.auth.loginWithGitHub()`)
- Auth check (`api.auth.checkAuth()`)
- Repository fetching (`api.github.getRepositories()`, `api.github.getBranches()`)
- Deployment creation (`api.deployments.create()`)

API base URL configured via `VITE_API_URL` env var (defaults to `http://localhost:3000`).

**Styling:**
- Tailwind CSS v4 with shadcn/ui theming (CSS variables in `index.css`)
- Custom font: `font-dogica` (DogicaPixel) for terminal/monospace styling
- Dark theme default (background: black, accent: emerald)

## Notes

- Uses rolldown-vite as Vite replacement (faster builds)
- Storybook configured with Vitest + Playwright for component testing
- Components use terminal-style UI with emerald accent colors for deployment flow