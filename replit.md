# StudyFlow - Student Study Management Application

## Overview

StudyFlow is a comprehensive student study management application built with React.js and modern web technologies. The application helps students organize their academic tasks, manage study sessions, track progress, and analyze their learning patterns through a beautiful dashboard. No AI features - just clean, effective study planning tools.

## User Preferences

- Preferred communication style: Simple, everyday language
- Technology: React.js (JavaScript) instead of TypeScript
- No AI features: Remove AI study planner functionality
- Design: Fresh, modern redesign requested

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system and CSS variables
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state management
- **Form Handling**: React Hook Form with Zod schema validation

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with structured error handling
- **Development**: Hot module replacement via Vite integration

### Data Storage Solutions
- **Database**: PostgreSQL (configured for Neon Database serverless)
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Validation**: Shared Zod schemas between client and server

## Key Components

### 1. Dashboard System
- **Quick Stats**: Real-time overview of daily tasks, study hours, completion rates, and streaks
- **Today's Schedule**: Dynamic study session management
- **AI Study Planner**: Intelligent study session generation based on task difficulty and available time
- **Quick Add Task**: Streamlined task creation with form validation
- **Upcoming Deadlines**: Priority-based deadline tracking with visual indicators
- **Progress Overview**: Weekly progress tracking across multiple metrics
- **Recent Activity**: Timeline of user actions and achievements

### 2. Task Management
- **CRUD Operations**: Complete task lifecycle management
- **Priority System**: Three-tier priority system (low, medium, high)
- **Status Tracking**: Multi-state workflow (pending, in-progress, completed)
- **Subject Association**: Task categorization by academic subjects
- **Time Estimation**: Planned vs actual time tracking
- **Due Date Management**: Calendar integration with deadline alerts

### 3. Study Session Management
- **Session Planning**: Structured study session creation and scheduling
- **Time Tracking**: Duration monitoring and productivity analysis
- **Task Integration**: Direct linking between sessions and specific tasks
- **Status Management**: Session completion tracking

### 4. Analytics System
- **Progress Charts**: Visual representation of completion rates and trends
- **Subject Breakdown**: Performance analysis by academic subject
- **Time Analytics**: Study hour distribution and efficiency metrics
- **Achievement Tracking**: Streak monitoring and milestone recognition

### 5. User Interface Components
- **Responsive Design**: Mobile-first approach with dedicated mobile navigation
- **Component Library**: Comprehensive UI component system using shadcn/ui
- **Theme System**: CSS variable-based theming with light/dark mode support
- **Navigation**: Dual navigation system (desktop sidebar + mobile bottom navigation)

## Data Flow

### Client-Server Communication
1. **API Layer**: Centralized API client with consistent error handling
2. **Query Management**: TanStack React Query handles caching, synchronization, and optimistic updates
3. **Form Submission**: React Hook Form with Zod validation before API calls
4. **Real-time Updates**: Query invalidation ensures UI consistency after mutations

### Database Operations
1. **Schema Definition**: Shared TypeScript types generated from Drizzle schema
2. **Type Safety**: End-to-end type safety from database to UI components
3. **Query Optimization**: Structured queries with proper joins and indexing
4. **Data Validation**: Server-side validation using shared Zod schemas

## External Dependencies

### UI and Styling
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Consistent icon system
- **Class Variance Authority**: Component variant management

### Development Tools
- **TypeScript**: Type safety across the entire stack
- **Vite**: Fast development server and build tool
- **ESBuild**: Production bundling for server code
- **PostCSS**: CSS processing and optimization

### Database and Validation
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle ORM**: Type-safe database toolkit
- **Zod**: Schema validation library

### Utilities
- **Date-fns**: Date manipulation and formatting
- **Nanoid**: Unique ID generation
- **CLSX/TWMerge**: CSS class management

## Deployment Strategy

### Development Environment
- **Dev Server**: Vite development server with HMR
- **API Development**: Express server with TypeScript compilation via tsx
- **Database**: Local development with migration support

### Production Build
- **Frontend**: Static assets built and optimized via Vite
- **Backend**: Server code bundled with ESBuild for Node.js deployment
- **Database**: Automated migrations via Drizzle Kit
- **Environment**: Configured for Replit deployment with custom error handling

### Build Process
1. Frontend assets compiled to `dist/public`
2. Server code bundled to `dist/index.js`
3. Database schema pushed via `db:push` command
4. Production server serves static assets and API endpoints

The application follows modern best practices with a focus on type safety, developer experience, and scalable architecture suitable for student productivity management.