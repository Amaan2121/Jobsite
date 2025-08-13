# Overview

KareerAI is an AI-powered job platform specifically designed for the Pakistani job market. The platform aims to revolutionize recruitment by connecting the right talent with the right opportunities through advanced AI tools. It provides comprehensive job listings, company profiles, and a suite of AI-powered features including resume analysis, cover letter generation, and intelligent job matching.

The application is built as a full-stack web application with a React frontend and Express backend, featuring modern UI components, real-time job search capabilities, and AI-driven candidate assistance tools.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development practices
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Framework**: Shadcn/ui component library built on Radix UI primitives with Tailwind CSS for styling
- **Build Tool**: Vite for fast development and optimized production builds
- **Form Handling**: React Hook Form with Zod validation for type-safe form management

## Backend Architecture
- **Runtime**: Node.js with Express.js framework for RESTful API development
- **Language**: TypeScript with ES modules for modern JavaScript features
- **Database ORM**: Drizzle ORM for type-safe database operations with PostgreSQL
- **Authentication**: JWT-based authentication with bcrypt for password hashing
- **File Upload**: Multer middleware for handling resume and document uploads
- **API Structure**: RESTful endpoints organized by feature domains (auth, jobs, companies, applications)

## Database Design
- **Primary Database**: PostgreSQL with Neon serverless configuration
- **Schema Management**: Drizzle Kit for database migrations and schema synchronization
- **Key Entities**: Users (job seekers/employers), Companies, Jobs, Job Applications, Resume Analyses, Saved Jobs
- **Data Types**: Utilizes PostgreSQL-specific features like enums, JSONB for flexible data storage, and UUID primary keys

## AI Integration
- **AI Service Provider**: OpenAI GPT-4o for advanced language processing capabilities
- **Core AI Features**:
  - Resume analysis and ATS scoring
  - Automated cover letter generation
  - Job-candidate matching algorithms
  - Keyword optimization suggestions
- **AI Service Architecture**: Centralized AI services module handling all machine learning operations

## Authentication & Authorization
- **Authentication Method**: JWT tokens stored in localStorage with Bearer token authorization
- **Session Management**: Stateless authentication with token-based user sessions
- **Role-Based Access**: User roles including job_seeker, employer, and admin with appropriate permissions
- **Security**: Password hashing with bcrypt and secure token generation

## File Storage
- **Upload Handling**: Local file system storage for resumes and documents with configurable size limits
- **Supported Formats**: PDF, DOC, and DOCX files for resume uploads
- **File Processing**: Server-side file validation and type checking for security

## Development Environment
- **Hot Reloading**: Vite dev server with HMR for rapid development
- **Code Quality**: TypeScript strict mode for compile-time error checking
- **Build Process**: Separate build processes for client (Vite) and server (esbuild) with optimized production output
- **Path Aliases**: Configured import aliases for clean code organization (@/ for client, @shared/ for shared types)

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling and automatic scaling
- **Database Driver**: @neondatabase/serverless for optimized serverless database connections

## AI Services
- **OpenAI API**: GPT-4o model for natural language processing, resume analysis, and content generation (Needs to be updated to GPT 5 Mini)
- **AI Capabilities**: Text analysis, content generation, job matching algorithms, and ATS optimization

## UI Component Library
- **Radix UI**: Comprehensive set of accessible, unstyled UI primitives for building design systems
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development with custom design tokens
- **Shadcn/ui**: Pre-built component library combining Radix UI with Tailwind CSS styling

## Development Tools
- **TypeScript**: Static type checking for both client and server code
- **Vite**: Next-generation build tool with fast HMR and optimized bundling
- **ESBuild**: Fast JavaScript bundler for server-side production builds
- **React Query**: Data fetching and caching library for seamless API integration

## Authentication & Security
- **JSON Web Tokens**: Stateless authentication token standard
- **Bcrypt**: Password hashing library for secure credential storage
- **Multer**: File upload middleware with security validations

## Deployment & Runtime
- **Node.js**: JavaScript runtime environment for server execution
- **Express.js**: Web application framework for API development
- **WebSocket Support**: Real-time communication capabilities for enhanced user experience
