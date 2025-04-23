# Reppi - Track Your Reps

A modern web application for tracking your workout reps and progress towards your fitness goals.

## Features

- User authentication
- Goal creation and tracking
- Rep logging
- Progress tracking

## Technology Stack

- **Frontend**: Next.js 15, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite (development) / Supabase (production)
- **Authentication**: NextAuth.js

## Project Structure

This project uses a feature-based architecture with a high degree of separation of concerns:

```
src/
├── app/                    # Next.js App Router
│   ├── api/                # API routes
│   ├── dashboard/          # Dashboard page
│   ├── goals/              # Goals pages
│   ├── login/              # Login page
│   └── register/           # Registration page
├── features/               # Feature folders
│   ├── auth/               # Authentication feature
│   │   ├── api/            # Auth API utilities
│   │   └── components/     # Auth components (LoginForm, RegisterForm)
│   ├── common/             # Shared utilities
│   │   ├── types/          # Shared type definitions
│   │   └── utils/          # Shared utility functions
│   ├── dashboard/          # Dashboard feature
│   │   └── components/     # Dashboard components
│   ├── goals/              # Goals feature
│   │   ├── api/            # Goals API utilities
│   │   └── components/     # Goal-related components
│   └── repLogs/            # Rep Logs feature
│       ├── api/            # Rep Logs API utilities
│       └── components/     # Rep logging components
└── lib/                    # Shared libraries
    └── prisma.ts           # Prisma client
```

## Development

### Prerequisites

- Node.js 18+ and npm

### Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables by copying `.env.example` to `.env`

4. Run the development server:
   ```
   npm run dev
   ```

## Database

The application uses SQLite for development and can be configured to use PostgreSQL via Supabase for production.

### Prisma

We use Prisma as our ORM. The schema is defined in `prisma/schema.prisma`.

To update the database after schema changes:

```
npx prisma generate
npx prisma db push
```

## Deployment

For production deployment, it's recommended to use a PostgreSQL database like Supabase.

Update the `DATABASE_URL` in the `.env` file to point to your production database.

## License

MIT
