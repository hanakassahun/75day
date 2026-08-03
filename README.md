# 75day

## Database setup

This project uses Neon + Drizzle ORM.

### Environment

Create a local `.env.local` with:

```dotenv
DATABASE_URL="postgresql://user:password@host/db?sslmode=require&channel_binding=require"
```

### Migrations

Run:

```bash
pnpm migrate
```

### Authentication

This project now supports simple session-based auth using App Router route handlers in `app/api/auth/route.ts`.

- `POST /api/auth?action=signup` — register a new user with `email` and `password`
- `POST /api/auth?action=login` — authenticate and set a session cookie
- `POST /api/auth?action=logout` — clear auth cookie
- `GET /api/auth` — returns the current authenticated user

### API routes

These use Next.js App Router route handlers in `app/api/reflections/route.ts`.

- `GET /api/reflections` — returns the current user's reflections
- `POST /api/reflections` — inserts a new reflection for the authenticated user

The reflection body now supports challenge task state data:

```json
{
  "content": "Completed my challenge tasks today.",
  "day": 1,
  "mood": 8,
  "rating": 5,
  "photo_url": "https://example.com/photo.jpg",
  "tasks": [
    { "task_id": "fitness-workout", "completed": true, "notes": "Strong session" },
    { "task_id": "nutrition-diet", "completed": true }
  ]
}
```

Example POST body:

```json
{
  "content": "Today I completed my challenge task.",
  "day": 1,
  "mood": 8,
  "rating": 5
}
```

### Querying from code

Use the helper at `src/db/index.ts`:

```ts
import { getAllReflections, createReflection } from '@/src/db';
```
