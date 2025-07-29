# replit.md

## Overview

This is a full-stack React application called "EarnVerse" - a rewards platform where users can earn money through various activities like spinning wheels, completing tasks, missions, and referrals. The application uses a modern tech stack with React frontend, Express.js backend, and PostgreSQL database with Drizzle ORM.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: CSS custom properties for theming with dark/light mode support

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Authentication**: OpenID Connect (OIDC) with Replit authentication integration
- **Session Management**: Express sessions with PostgreSQL store
- **API Design**: RESTful endpoints with proper error handling middleware

### Database Architecture
- **Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM with type-safe schema definitions
- **Migrations**: Drizzle Kit for schema management
- **Connection**: Connection pooling with @neondatabase/serverless

## Key Components

### Authentication System
- Replit OIDC integration for user authentication
- Session-based authentication with PostgreSQL session storage
- Role-based access control (free vs pro users)
- Middleware for protecting routes and checking authentication status

### User Management
- User profiles with email, name, avatar
- Role system (free/pro) with feature restrictions
- Referral system with unique codes
- Streak tracking and activity monitoring

### Rewards System
- **Spin Wheel**: Daily spin rewards with configurable prizes
- **Tasks**: External task completion (app installs, surveys)
- **Missions**: Daily challenges with rewards
- **Referrals**: Earn rewards for referring new users

### Wallet System
- Balance tracking (available and pending)
- Earnings logging with transaction history
- Withdrawal system with multiple payment methods
- Lifetime earnings tracking

### UI Components
- Comprehensive shadcn/ui component library
- Custom components for spinning wheel, task cards, earnings displays
- Responsive design with mobile-first approach
- Dark/light theme support

## Data Flow

1. **User Authentication**: Users sign in via Replit OIDC, creating session-based authentication
2. **Dashboard**: Aggregated stats from multiple data sources (wallet, tasks, spins, missions)
3. **Reward Activities**: Users complete activities that trigger database updates and balance changes
4. **Real-time Updates**: TanStack Query manages cache invalidation and real-time data updates
5. **Withdrawal Processing**: Users can request withdrawals through various payment methods

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Headless UI components for accessibility
- **tailwindcss**: Utility-first CSS framework

### Authentication
- **openid-client**: OIDC authentication handling
- **passport**: Authentication middleware
- **express-session**: Session management

### Development Tools
- **vite**: Build tool and dev server
- **typescript**: Type safety
- **@replit/vite-plugin-runtime-error-modal**: Development error handling

## Deployment Strategy

### Build Process
- Frontend builds to `dist/public` via Vite
- Backend builds to `dist` via esbuild with external packages
- Single deployment artifact with both frontend and backend

### Environment Requirements
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Secret for session encryption
- `REPLIT_DOMAINS`: Allowed domains for OIDC
- `ISSUER_URL`: OIDC issuer URL (defaults to Replit)

### Production Configuration
- Express serves static files from `dist/public`
- Session storage uses PostgreSQL with configurable TTL
- Database migrations via `drizzle-kit push`
- Process management expects single Node.js process

### Development Setup
- Vite dev server with HMR for frontend development
- Express server with request logging middleware
- Database schema auto-sync during development
- Replit-specific development banner integration