import { defineConfig } from 'drizzle-kit';
import { config as dotenvConfig } from 'dotenv';

// Load environment variables from .env.local so drizzle-kit can read DATABASE_URL
dotenvConfig({ path: '.env.local' });

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.ts', // Adjust this path if your schema file is located elsewhere (e.g., './db/schema.ts')
  out: './drizzle/migrations',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
