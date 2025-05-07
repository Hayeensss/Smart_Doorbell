# Smart Doorbell

## Overview

This project is a smart doorbell application designed to monitor and control your smart doorbell. It allows users to register devices, view device event history, and manage their preferences. User authentication is handled via Clerk.

## Tech Stack

- **Framework:** Next.js
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL (Supabase)
- **Authentication:** Clerk
- **ORM:** Drizzle ORM
- **UI Components:** shadcn/ui
- **Deployment:** Vercel

## Get Started

1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Set up environment variables:**
    See the "Environment Setup" section below.
3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Setup

1.  Create a `.env` file in the root of the project. You can copy `.env.example` if it exists, or create a new file.
2.  Add the necessary environment variables. Key variables include:

    ```env
    # Clerk Authentication
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
    CLERK_SECRET_KEY="your_clerk_secret_key"
    # NEXT_PUBLIC_CLERK_SIGN_IN_URL="/signin" (Defaults to /sign-in if not set)
    # NEXT_PUBLIC_CLERK_SIGN_UP_URL="/signup" (Defaults to /sign-up if not set)
    # NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard" (Optional: URL to redirect to after sign in)
    # NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/dashboard" (Optional: URL to redirect to after sign up)

    # Database (e.g., Supabase PostgreSQL)
    DATABASE_URL="your_postgresql_connection_string"

    # Add other environment variables as needed (e.g., for MQTT if used for doorbell communication)
    # MQTT_BROKER_URL="mqtt://your_broker_url"
    # MQTT_USERNAME="your_mqtt_username"
    # MQTT_PASSWORD="your_mqtt_password"
    ```

    **Note:** Never commit your `.env` file or any other file containing sensitive credentials to version control. Ensure it's listed in your `.gitignore` file (which it is by default for `.env*`).
    You can find your Clerk keys on the API Keys page in the Clerk Dashboard. For the `DATABASE_URL`, use the connection string provided by your PostgreSQL host (e.g., Supabase).

## App Structure

The project's directory structure is organized as follows:

```text
Smart_Doorbell/
├── app/                     # Main application code (App Router)
│   ├── (auth)/              # Group for authentication routes
│   │   ├── signin/          # Sign-in page route
│   │   └── signup/          # Sign-up page route
│   ├── actions/             # Server Actions
│   ├── analytics/           # Analytics related components/logic
│   ├── api/                 # API route handlers
│   │   └── events/          # Example API route for events
│   ├── dashboard/           # Dashboard page route and components
│   ├── history/             # History page route and components
│   ├── preferences/         # Preferences page route and components
│   ├── layout.tsx           # Root layout for the app
│   └── page.tsx             # Root page (e.g., landing page or main entry)
├── components/              # Shared React components
│   ├── analytics/           # Analytics specific components
│   ├── dashboard/           # Dashboard specific components
│   ├── history/             # History specific components
│   │   └── filter-sections/ # Components for filter sections in history
│   ├── preferences/         # Preferences specific components
│   └── ui/                  # General UI components (e.g., buttons, inputs from shadcn/ui)
├── db/                      # Database schema, migrations, connection (e.g., Drizzle ORM)
├── hooks/                   # Custom React hooks
├── lib/                     # Utility functions, helpers, libraries
├── public/                  # Static assets (images, fonts, etc.)
├── sql/                     # SQL migration files or scripts
├── .env                     # Environment variables (should be in .gitignore)
├── .gitignore               # Specifies intentionally untracked files that Git should ignore
├── components.json          # Configuration for shadcn/ui or similar
├── drizzle.config.js        # Configuration for Drizzle ORM
├── middleware.js            # Next.js middleware
├── next-env.d.ts            # TypeScript declarations for Next.js environment variables
├── next.config.mjs          # Next.js configuration file
├── package-lock.json        # Records exact versions of dependencies
├── package.json             # Project metadata and dependencies
├── postcss.config.mjs       # PostCSS configuration
├── README.md                # This file
├── tailwind.config.ts       # Tailwind CSS configuration
└── tsconfig.json            # TypeScript compiler options
```

## Pages

The main pages and their purposes are structured as follows:

```text
/
├── (auth)                 # Authentication-related routes
│   ├── /signin            # User sign-in page
│   └── /signup            # User sign-up page
├── /dashboard             # Main dashboard displaying [describe what the dashboard shows]
├── /history               # Shows a history of [describe what history is shown, e.g., doorbell events, recordings]
├── /preferences           # Allows users to configure their preferences for [describe what can be configured]
```
