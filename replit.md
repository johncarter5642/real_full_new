# Real Estate Dashboard

## Overview

This is a real estate lead management dashboard that fetches and visualizes data from an n8n webhook endpoint. The application displays key performance indicators (KPIs), lead distribution charts, location analytics, recent leads, and upcoming appointments. It's built as a full-stack TypeScript application with a React frontend and Express backend.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Tooling**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast HMR (Hot Module Replacement)
- Wouter for lightweight client-side routing (alternative to React Router)
- TanStack Query (React Query) for data fetching, caching, and state management

**UI Component System**
- Shadcn/ui component library built on Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens
- Class Variance Authority (CVA) for managing component variants
- Chart.js for data visualization (lead distribution and location charts)

**Design Decisions**
- Component-based architecture with separation of concerns (components, hooks, pages, types)
- CSS variables for theming support (supports light/dark mode through Tailwind)
- Path aliases (@/, @shared/) for clean imports
- Responsive design patterns using mobile-first approach

### Backend Architecture

**Server Setup**
- Express.js server with TypeScript
- ESM (ES Modules) for modern JavaScript module system
- Vite middleware integration for development with HMR
- Static file serving for production builds

**Data Layer**
- In-memory storage implementation (MemStorage class) for user management
- Storage interface pattern for potential database migration
- Drizzle ORM configured for PostgreSQL (currently using schema but not actively used in dashboard)

**API Design**
- RESTful API structure with /api prefix convention
- JSON request/response format
- Request logging middleware for debugging
- Error handling with appropriate HTTP status codes

### Data Flow Architecture

**External Data Integration**
- Dashboard fetches data from n8n webhook endpoint: `https://jadu123456.app.n8n.cloud/webhook/d1311a58-2f18-4d00-af0d-bde782e52c28`
- Data structure includes three main arrays: qualifiedLeads, incomingLeads, appointmentdetails
- Client-side data transformation and KPI calculation
- React Query handles caching with infinite stale time (no automatic refetching)

**Data Processing Pipeline**
1. useDashboardData hook fetches raw webhook data
2. Data is processed and transformed into DashboardMetrics structure
3. Calculated metrics include: total leads, hot/warm/cold counts, average score, conversion rate, leads by location
4. Processed data is distributed to visualization components (charts, tables, metric cards)

### State Management

**Global State**
- React Query for server state management and caching
- Query key: ["/dashboard-data"]
- Manual refetch capability with invalidation support

**Local State**
- React hooks (useState, useEffect) for component-level state
- Custom hooks for reusable logic (useDashboardData, useIsMobile, useToast)
- No global state management library (Redux/Zustand) - keeping it simple

## External Dependencies

### Core Services

**n8n Webhook Integration**
- External webhook endpoint for real estate lead data
- No authentication required for data fetching
- Data format: JSON with qualified leads, incoming leads, and appointment details
- Real-time data updates through manual refresh mechanism

### Database & ORM

**Drizzle ORM with PostgreSQL**
- Configured for PostgreSQL database (dialect: "postgresql")
- Schema location: ./shared/schema.ts
- Migration output: ./migrations directory
- Database connection via DATABASE_URL environment variable
- Currently includes users table with UUID primary keys
- Note: Database setup is configured but not actively used for dashboard functionality

**Neon Database Serverless**
- @neondatabase/serverless driver for PostgreSQL connections
- Serverless-optimized database connectivity

### UI Component Libraries

**Radix UI Primitives**
- Comprehensive set of unstyled, accessible UI components
- Components used: Accordion, Alert Dialog, Avatar, Checkbox, Dialog, Dropdown Menu, Hover Card, Label, Menubar, Navigation Menu, Popover, Progress, Radio Group, Scroll Area, Select, Separator, Slider, Switch, Tabs, Toast, Toggle, Tooltip

**Styling & Theming**
- Tailwind CSS for utility-first styling
- PostCSS for CSS processing
- Custom CSS variables for design system tokens
- Inter and Roboto fonts from Google Fonts

### Data Visualization

**Chart.js**
- Canvas-based charting library for lead distribution (doughnut chart) and location analytics (bar chart)
- Registered with all available chart types through registerables

### Form Management

**React Hook Form Ecosystem**
- @hookform/resolvers for validation schema integration
- Zod for runtime type validation
- Drizzle-Zod for schema-to-Zod conversion

### Development Tools

**Replit Integration**
- @replit/vite-plugin-runtime-error-modal for error overlay
- @replit/vite-plugin-cartographer for code navigation
- @replit/vite-plugin-dev-banner for development indicators

**Build Tools**
- esbuild for server-side bundling
- tsx for TypeScript execution in development
- TypeScript with strict mode enabled

### Utilities

**Date & Time**
- date-fns for date formatting and manipulation (formatDistanceToNow, format functions)

**Styling Utilities**
- clsx and tailwind-merge for conditional class name composition
- class-variance-authority for component variant management

**Component Utilities**
- cmdk for command menu functionality
- react-day-picker for calendar/date picker components
- vaul for drawer components
- input-otp for OTP input fields
- embla-carousel-react for carousel functionality