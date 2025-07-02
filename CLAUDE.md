# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a p5.js starter kit generator built with Astro. It creates downloadable ZIP packages containing p5.js projects with the latest versions of:
- p5.js core library
- p5.sound.js addon
- @ff6347/p5-easing library

The application generates two types of packages:
- **Full kit**: Includes development files (.editorconfig, .vscode settings)
- **Minimal kit**: Contains only essential files (to avoid Windows Defender issues)

## Development Commands

```bash
# Start development server
npm run dev

# Build and deploy (includes type checking)
npm run build

# Preview production build
npm run preview

# Type checking only
npx astro check
```

## Architecture

### Core Application Structure
- **Astro SSR**: Server-side rendered with Netlify adapter
- **API Route**: `/src/pages/api/package.ts` - Main ZIP generation endpoint
- **Frontend**: Single page application at `/src/pages/index.astro`

### Key Components
- **Package Generation**: Fetches npm packages via registry API, extracts tarballs using `tar` library
- **ZIP Creation**: Uses `jszip` to bundle files into downloadable archives
- **Template Files**: Generates boilerplate HTML, JS, and config files

### API Endpoint Logic
The `/api/package` endpoint:
1. Fetches latest versions of p5 modules from npm registry
2. Downloads and extracts tarball contents
3. Generates starter project files (HTML, JS, configs)
4. Creates ZIP archive with optional minimal mode (`?minimal=true`)

## Code Style

- Uses tabs for indentation (configured in prettier)
- TypeScript with strict Astro configuration
- Single quotes disabled in prettier config
- Special YAML formatting (spaces instead of tabs)

## Dependencies

### Runtime
- `astro`: Core framework
- `jszip`: ZIP file generation
- `tar`: Tarball extraction
- `@astrojs/netlify`: Deployment adapter

### Package Handling
The application dynamically fetches these packages:
- `p5`: Main p5.js library
- `@ff6347/p5-easing`: Easing functions addon

## Deployment

Configured for Netlify with server-side rendering. The `astro.config.mjs` sets output mode to "server" with Netlify adapter.