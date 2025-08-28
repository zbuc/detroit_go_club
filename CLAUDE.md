# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Commands

- `npm run dev` - Start Next.js development server (localhost:3000)
- `npm run studio` - Start Sanity Studio (localhost:3333)
- `npm run dev:all` - Run both Next.js and Sanity Studio concurrently
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with auto-fix
- `npm run type-check` - Run TypeScript type checking

### Deployment

- `npm run deploy` - Deploy to Fly.io using ephemeral builder pattern
- `npm run logs` - View Fly.io logs

### Type Checking in Git Hooks

The lint-staged configuration runs `next typegen && tsc-files --noEmit` to ensure Next.js types are generated before checking staged files. This prevents errors from stale `.next/types/**/*.ts` files.

## Architecture Overview

### Frontend Structure

- **Next.js 15** with App Router
- **TypeScript** throughout
- **Tailwind CSS** for styling
- **src/app/** - App Router pages and API routes
- **src/components/** - Reusable React components
- **src/lib/** - Utility functions and configuration
- **src/types/** - TypeScript type definitions

### Content Management

- **Sanity CMS** for content management
- **Sanity Studio** embedded at `/studio` route
- **sanity/schemas/** - Content type definitions (page, meetup, siteSettings)
- **sanity.config.ts** - Sanity Studio configuration
- **sanity/env.ts** - Environment-specific Sanity configuration

### Key Integrations

- Sanity client configured with stega encoding for visual editing overlays
- API routes for health checks, revalidation, and draft mode
- Embedded Sanity Studio with Presentation tool for visual editing
- Visual editing enabled with `VisualEditing` component and `SanityLive` for real-time updates

### Environment Configuration

Required environment variables:

- `NEXT_PUBLIC_SANITY_PROJECT_ID` - Sanity project ID
- `NEXT_PUBLIC_SANITY_DATASET` - Sanity dataset name
- `SANITY_API_TOKEN` - Sanity API token for write operations
- `SANITY_API_READ_TOKEN` - Sanity API read token for visual editing (server-side)
- `NEXT_PUBLIC_SANITY_API_READ_TOKEN` - Sanity API read token for visual editing (client-side)
- `NEXT_PUBLIC_SANITY_STUDIO_URL` - Sanity Studio URL for visual editing overlays

### Content Types

- **Page** - Static pages like rules
- **Meetup** - Event information with date, location, registration
- **Site Settings** - Global configuration (welcome message, contact info, Instagram handle)

### Visual Editing Features

The project includes full visual editing support with Sanity's Presentation tool:

- **Draft Mode**: Enable via `/api/draft-mode/enable` with proper token validation
- **Presentation Tool**: Visual editing interface in Sanity Studio with live preview at `/studio`
- **Content Overlays**: Clickable overlays on content when in draft mode for direct editing
- **Live Updates**: Real-time content synchronization using `SanityLive` component
- **Route Integration**: Homepage (`/`), calendar (`/calendar`), and pages route correctly in Presentation tool
- **Token Security**: Uses proper viewer token validation for secure draft mode access

**Setup Requirements:**

- `SANITY_API_READ_TOKEN` must be a valid Sanity API token starting with `sk`
- `NEXT_PUBLIC_SANITY_API_READ_TOKEN` for client-side visual editing
- `NEXT_PUBLIC_SANITY_STUDIO_URL` configured for overlay targeting

### Deployment Architecture

Uses Fly.io with ephemeral builder pattern for secure build-time secrets handling. The `Dockerfile.builder` creates a temporary machine that injects environment variables during build, then deploys the compiled app.

### GitHub Actions CI/CD

The project uses GitHub Actions for automated deployment:

**Workflow: `.github/workflows/fly.yaml`**

- **Triggers**: Only on pushes to `main` branch when application code changes
- **Smart Filtering**: Excludes documentation files (README.md, CLAUDE.md) to prevent unnecessary deploys
- **Two-stage Process**:
  1. **Lint & Type Check**: ESLint, TypeScript, and Prettier validation
  2. **Deploy**: Automated deployment to Fly.io using ephemeral builder

**Monitored Files**:

- `src/**` - Application source code
- `sanity/**` - CMS schemas and configuration
- Configuration files (package.json, next.config.js, tailwind.config.ts, etc.)
- Deployment files (Dockerfile\*, fly.toml)

**Environment**: Requires `FLY_API_TOKEN` secret configured in GitHub repository settings.

- all code proposed by Claude must pass both `npm run lint` and `npm run type-check`
