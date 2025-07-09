# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the documentation website for elizaOS/eliza, built with Next.js 15.3.4 and Fumadocs, a modern documentation framework for Next.js. The site uses MDX for content authoring, allowing you to write documentation with React components.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server with turbo
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Post-install script (runs automatically)
npm run postinstall  # Generates Fumadocs MDX types
```

The development server runs on http://localhost:3000.

## Architecture

### Core Technologies
- **Next.js 15.3.4** with App Router
- **React 19.1.0**
- **TypeScript** with strict mode enabled
- **Fumadocs** for documentation generation
- **MDX** for content authoring
- **Tailwind CSS v4** for styling

### Directory Structure
- `/app` - Next.js App Router structure
  - `(home)/` - Landing page route group
  - `docs/` - Documentation layout with dynamic routing (`[[...slug]]`)
  - `api/search/` - Search API endpoint
- `/docs` - MDX content files (your documentation goes here)
- `/lib/source.ts` - Fumadocs content source configuration
- `/.source` - Auto-generated types from Fumadocs MDX (git-ignored)

### Key Configuration Files
- `source.config.ts` - Fumadocs MDX configuration (frontmatter schemas)
- `next.config.mjs` - Next.js configuration with MDX support
- `tsconfig.json` - TypeScript configuration with path aliases (@/*)
- `.eslintrc.json` - ESLint extending Next.js rules

## Adding Documentation

1. Create MDX files in the `/docs` directory
2. Use frontmatter for metadata (validated by schema in `source.config.ts`)
3. Files are automatically processed by Fumadocs and available at `/docs/[slug]`

Example MDX file structure:
```mdx
---
title: "Page Title"
description: "Page description"
---

# Content goes here

You can use React components and MDX features.
```

## TypeScript Path Aliases

- `@/*` - Maps to the project root
- `@/.source` - Maps to the generated Fumadocs source types

## Linting

The project uses ESLint with Next.js configuration. Run linting with:
```bash
npx eslint .
```

## Important Notes

- The project uses React 19.1.0 with the new App Router paradigm
- Fumadocs automatically generates types after install via `postinstall` script
- The `.source` directory is auto-generated and should not be edited
- Content organization and navigation can be configured through Fumadocs meta files