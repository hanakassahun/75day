# 75day

## Database setup

This project uses Neon + Drizzle ORM.

### Environment

Create a local `.env.local` with:

```dotenv
DATABASE_URL="postgresql://neondb_owner:npg_e0dZUq5gtFAu@ep-frosty-pond-aupk5rcy-pooler.c-10.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
```

### Migrations

Run:

```bash
pnpm migrate
```

### API routes

- `GET /api/reflections` returns all reflections
- `POST /api/reflections` inserts a new reflection

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
