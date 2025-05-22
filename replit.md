# AceStream Links Extractor

## Overview

This project is a web application for scraping and processing AceStream links from web sources. It features a React frontend and an Express backend, with Drizzle ORM for database management. The application allows users to scrape AceStream data from a specific URL, view the extracted data, and download it in SXPF format.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern full-stack architecture:

1. **Frontend**: React application with TypeScript, built using Vite.
   - Uses Shadcn UI components for consistent design
   - Implements React Query for data fetching
   - Tailwind CSS for styling

2. **Backend**: Express.js server with TypeScript.
   - RESTful API endpoints for scraping and processing data
   - Integration with Drizzle ORM for database operations

3. **Database**: PostgreSQL compatible database using Drizzle ORM for schema management and queries.
   - Simple schema focusing on AceStream links storage

4. **Build/Development**: Vite for frontend, esbuild for backend compilation.

## Key Components

### Frontend Components

1. **Home Page** (`client/src/pages/Home.tsx`): Main interface for user interaction, containing:
   - Scrape trigger UI
   - Status display
   - Results view
   - Download options

2. **Status Indicator** (`client/src/components/StatusIndicator.tsx`): Displays current operation status (idle, loading, success, error).

3. **Results Display** (`client/src/components/ResultsDisplay.tsx`): Shows extracted AceStream links in a tabular format.

4. **Download Section** (`client/src/components/DownloadSection.tsx`): Provides SXPF file download functionality.

5. **UI Components**: Comprehensive set of Shadcn UI components in the `client/src/components/ui` directory.

### Backend Components

1. **API Routes** (`server/routes.ts`): Contains endpoints for:
   - `/api/scrape`: Scrapes AceStream links from specified URL
   - `/api/generate-sxpf`: Generates SXPF format from extracted links

2. **Database Schema** (`shared/schema.ts`): Defines:
   - AceStream links table structure
   - Zod validation schemas for data integrity

3. **Storage Interface** (`server/storage.ts`): Provides data access abstraction.

## Data Flow

1. **Scraping Process**:
   - User initiates scraping via the frontend interface
   - Frontend sends a POST request to `/api/scrape` with the target URL
   - Backend fetches HTML from the URL and extracts AceStream link data
   - Extracted data is returned to the frontend for display

2. **SXPF Generation**:
   - After successful scraping, frontend requests SXPF generation
   - Backend formats AceStream links into SXPF format
   - Frontend receives SXPF content for download

3. **Data Persistence**:
   - AceStream links are stored in the database via Drizzle ORM
   - Schema enforces data structure and constraints

## External Dependencies

### Frontend Dependencies
- React and React DOM
- React Query for API data fetching
- Wouter for lightweight routing
- Radix UI components (via Shadcn UI)
- Tailwind CSS for styling
- Lucide React for icons
- Zod for validation

### Backend Dependencies
- Express.js for API server
- Axios for HTTP requests
- Drizzle ORM for database operations
- Zod for validation schemas

### Development Dependencies
- TypeScript for type safety
- Vite for frontend development and building
- esbuild for backend compilation

## Deployment Strategy

The application is configured for deployment on Replit with:

1. **Build Process**:
   - Frontend: Vite builds static assets to `dist/public`
   - Backend: esbuild compiles server to `dist/index.js`

2. **Runtime Configuration**:
   - Deployed as an autoscaled service
   - Entry point is the Express server
   - Environment variables for database connections

3. **Database**:
   - Expects a PostgreSQL database
   - Connection via `DATABASE_URL` environment variable
   - Drizzle manages schema and migrations

4. **Port Configuration**:
   - Server runs on port 5000
   - Mapped to external port 80 for public access

The `.replit` file already includes the necessary configuration for both development and production environments, with appropriate commands for building and running the application.