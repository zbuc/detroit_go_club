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
- **sanity/schemas/** - Content type definitions (page, meetup, siteSettings, sgf, gridLayout, dualPanel)
- **sanity.config.ts** - Sanity Studio configuration
- **sanity/env.ts** - Environment-specific Sanity configuration

### Go Game Integration

- **BesoGo Library** - Interactive Go board rendering and SGF playback
- **SGF Support** - Smart Game Format for Go game records
- **SGFViewer** - Frontend component for displaying Go games with controls
- **SGFEditor** - Sanity Studio component for editing SGF content (Visual + Text modes)
- **DualPanelDisplay** - Side-by-side Go board and content layout

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

- **Page** - Static pages like rules, with support for homepage-specific fields
- **Meetup** - Event information with date, location, registration
- **Site Settings** - Global configuration (logo, Instagram handle)
- **SGF** - Go game records with interactive board display and controls
- **Grid Layout** - Flexible multi-column layouts for content organization
- **Dual Panel** - Side-by-side Go board and rich text content for game analysis

### Content Styling

The site uses custom PortableText components for consistent content rendering:

**File**: `src/components/PortableTextComponents.tsx`

- **Bullet Lists**: Styled with `list-disc list-inside space-y-2 my-4`
- **Numbered Lists**: Styled with `list-decimal list-inside space-y-2 my-4`
- **List Items**: Consistent `text-gray-700` styling
- **Paragraphs**: Proper spacing with `text-gray-700 mb-4`

**Usage**: All PortableText components throughout the site use `components={portableTextComponents}` to ensure consistent styling. This includes:

- Homepage content (`src/app/page.tsx`)
- Rules page content (`src/app/rules/page.tsx`)
- SGF game displays (`sgf` type)
- Grid layouts (`gridLayout` type)
- Dual panel content (`dualPanel` type)
- Any other pages using PortableText

**Implementation**: Custom components override default PortableText rendering to apply Tailwind CSS classes directly, ensuring proper styling regardless of CMS content structure.

### Go Game Components

**SGF Integration:**

- **SGFViewer** (`src/components/SGFViewer.tsx`): Frontend Go board component with BesoGo integration
- **SGFEditor** (`sanity/components/SGFEditor.tsx`): Sanity Studio editor with Visual/Text modes
- **DualPanelDisplay** (`src/components/DualPanelDisplay.tsx`): Frontend-only dual panel layout
- **DualPanelEditor** (`src/components/DualPanelEditor.tsx`): Sanity UI-based editor (Studio only)
- **BesoGo Library**: Loaded from CDN with SVG stone rendering and stone image fallbacks

**Key Features:**

- Interactive Go board with move navigation
- SGF format validation and editing
- Side-by-side game analysis layouts
- Support for multiple board sizes (9x9, 13x13, 19x19)
- Coordinate display and game controls
- Stone rendering optimized for web display

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

- Do not use defineLive outside of React Server Components
- In priority order try to search for library calls in Sanity CMS, Tailwind CSS, NextJS, React, and then other libraries
- Use pure CSS solutions as much as possible
- Favor adding classNames to tags in tsx files to editing the CSS file
- The `any` type should not be used in Typescript. Use correct types otherwise linting will fail.

## Component Architecture Guidelines

### Frontend vs Studio Component Separation

**Critical**: Maintain strict separation between frontend and Studio components to avoid Sanity UI theme context errors:

**Frontend Components** (use in `src/components/`):

- **Standard HTML/CSS** with Tailwind classes
- **No Sanity UI imports** (`@sanity/ui`)
- **DualPanelDisplay**: Frontend-safe dual panel layout
- **SGFViewer**: Pure frontend Go board component
- **PortableTextComponents**: Standard React components

**Studio Components** (use in `sanity/components/`):

- **Sanity UI components** (`Button`, `Card`, `Flex`, etc.)
- **Theme context available** within Sanity Studio
- **SGFEditor**: Studio-only SGF editing interface
- **DualPanelPreview**: Studio preview component
- **DualPanelEditor**: Studio-only editor (not for frontend)

**Error Prevention**:

- Never import Sanity UI components in frontend pages
- Use `DualPanelDisplay` for frontend, `DualPanelEditor` for Studio only
- Check component imports when debugging theme context errors
- Keep BesoGo integration separate for Studio vs frontend use

### BesoGo Integration Notes

- **CDN Loading**: BesoGo loads dynamically from `cdn.jsdelivr.net`
- **Stone Rendering**: Uses SVG stones with image fallbacks
- **Theme Override**: `window.besogo.realStone = window.besogo.svgStone` for consistent display
- **SGF Validation**: Automatic format validation in schemas with proper error messages
- **Browser Compatibility**: Tested with modern browsers, requires JavaScript enabled

## Performance & SSR/CSR Optimization

### Progressive Enhancement Strategy

This project implements a sophisticated SSR/CSR pattern for optimal performance and SEO while maintaining rich interactivity:

**Server-Side Rendering (SSR) Foundation:**

- Complete HTML content rendered server-side for instant loading and SEO
- Complete content rendered with navigation and semantic HTML
- Works perfectly without JavaScript (progressive enhancement)
- Proper meta tags, structured data, and accessibility features

**Client-Side Rendering (CSR) Enhancements:**

- Interactive features layer on top of SSR foundation
- Dynamic animations and responsive behaviors
- Real-time content updates via SanityLive
- BesoGo Go board interactivity for SGF content

### Font Loading Optimization

Critical font strategy to prevent layout shifts and FOUT:

````typescript
// layout.tsx - Font configuration
const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal'],
  variable: '--font-outfit',
  display: 'block',        // Prevents font swap flash
  preload: true,           // Preload critical fonts
  adjustFontFallback: true // Auto-adjust fallback metrics
})

Key Strategies:
- Blocking Display: Uses display: 'block' to prevent font swap flash
- CSS Variables: Custom properties with explicit Safari fallbacks
- Preconnect Headers: DNS prefetch and preconnect to font CDNs
- Fallback Fonts: Explicit fallback fonts for CSS variable compatibility

Basic Image Optimization

Simple Sanity image optimization for minimal image usage:

```typescript
// Basic image URL generation
const builder = imageUrlBuilder(client)
const imageUrl = builder.image(image).url()
````

For sites with minimal image usage:

- Use Sanity's auto-optimization (format, quality)
- No complex lazy loading patterns needed
- Basic responsive images via Sanity transforms

Hydration-Safe Component Patterns

Components designed to prevent hydration mismatches:

// ClientInitializer.tsx - Post-hydration setup
export default function ClientInitializer() {
useEffect(() => {
setTimeout(() => {
document.documentElement.classList.add('js-enabled')
}, 0)
}, [])
return null
}

// ConditionalStyles.tsx - Consistent SSR/CSR rendering
export function ConditionalStyles() {
const [isHydrated, setIsHydrated] = useState(false)

    // Always render the same content during SSR and initial hydration
    if (!isHydrated) {
      return <style dangerouslySetInnerHTML={{ __html: criticalCSS }} />
    }

    // Post-hydration: Enhanced styles
    return <style dangerouslySetInnerHTML={{ __html: enhancedCSS }} />

}

Key Patterns:

- Consistent Initial Render: Same content during SSR and initial hydration
- Post-Hydration Enhancement: Progressive feature activation after hydration
- CSS Class Gating: .js-enabled class for JavaScript-dependent styles
- State Initialization: Proper useState initialization to match server state

Progressive Enhancement for Interactive Content

SSR → CSR enhancement pattern for Go board and interactive features:

```typescript
// SGF content with progressive enhancement
export default function SGFContent({ sgf, description }) {
  return (
    <>
      {/* SSR Foundation - Text description always renders */}
      <div className="js-fallback">
        <p>Game Record: {sgf.title}</p>
        <div>{description}</div>
      </div>

      {/* CSR Enhancement - Interactive Go board */}
      <SGFViewer sgf={sgf} />
    </>
  )
}
```

Enhancement Strategy:

- SSR Foundation: Essential content renders without JavaScript
- CSR Enhancement: BesoGo boards and interactivity added progressively
- Graceful Fallback: Go content remains accessible if JavaScript fails

Mobile Detection for Touch Interactions

Simple mobile detection for Go board touch handling:

```typescript
// Inline mobile detection (no separate utility needed)
const isMobile =
  typeof window !== 'undefined' && (window.innerWidth < 768 || 'ontouchstart' in window)
```

Mobile Considerations:

- Touch-friendly Go board interactions
- Responsive layouts for mobile screens
- No complex image optimization needed

Critical CSS Strategy

Optimized CSS delivery for fast First Contentful Paint:

- Inline Critical CSS: Above-the-fold styles inlined via ConditionalStyles
- Font Variable Fallbacks: Explicit fallback fonts for Safari compatibility
- Layout Containment: Prevent reflow during font loading
- Transition Strategy: Fade-in animations to hide hydration shifts

Implementation Checklist

- Configure fonts with display: 'block' and proper fallbacks
- Implement ClientInitializer for post-hydration setup
- Create ConditionalStyles component for SSR/CSR consistency
- Create SSR → CSR enhancement pattern for Go boards and interactive content
- Add .js-enabled/.js-fallback classes for progressive enhancement
- Ensure BesoGo integration works with SSR/CSR patterns
- Configure proper DNS prefetch/preconnect headers
