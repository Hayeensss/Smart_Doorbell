# Smart Doorbell System

A web application for viewing smart doorbell events and filtering their history. This is one of my web development projects, paired with a separate [notification worker](https://github.com/Hayeensss/SmartDoorbell_Notification).

## What I worked on

- Event history views and filters for date, time range and event type.
- Server-side queries that join device and event data in PostgreSQL.
- Shared React button tests using Vitest and Testing Library.

These are project contributions, not commercial software employment.

## How the history view works

The history page obtains the signed-in user, parses filter parameters, queries the database on the server and passes results to React components. Device ownership is included in the history query. The repository also contains an events API route; it is a separate path and is not presented here as a verified end-to-end API integration.

| Implementation | Source entry point |
| --- | --- |
| History page and filter parsing | [app/history/page.jsx](app/history/page.jsx), [lib/history-service.js](lib/history-service.js) |
| Server-side history data | [components/history/history-data.jsx](components/history/history-data.jsx) |
| Event queries | [db/db.js](db/db.js) |
| Filter components | [components/history/event-filters.jsx](components/history/event-filters.jsx) |
| Shared button tests | [tests/components/ui/Button.test.jsx](tests/components/ui/Button.test.jsx) |
| Notification delivery | [Companion worker repository](https://github.com/Hayeensss/SmartDoorbell_Notification) |

## Stack

Next.js, React, JavaScript, Tailwind CSS, PostgreSQL and Drizzle ORM, with Clerk authentication. Vitest and Testing Library are used for component tests. The repository also includes hardware-related experiments; those are outside the web contribution summary above.

## Run locally

Install the dependencies with `npm ci`. Provide your own development configuration for the PostgreSQL database and Clerk authentication, then run `npm run dev`. Other features may require their own service configuration; inspect the source for the feature you intend to run. Never commit credentials.

To run the shared button tests: `npm test -- --run tests/components/ui/Button.test.jsx`.

## Project status

Source is available for review. Live device operation, email delivery and the historic deployment are not presented as currently verified services. Component tests cover specific controls and do not establish full application correctness. No production scale or performance result is claimed.
