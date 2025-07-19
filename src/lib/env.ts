import { z } from "zod";

const envSchema = z.object({
  // Clerk
  CLERK_SECRET_KEY: z.string().min(1),
  CLERK_WEBHOOK_SECRET: z.string().min(1),

  // Supabase
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

  // Gemini
  GEMINI_API_KEY: z.string().min(1).optional(),

  // App
  NODE_ENV: z.enum(["development", "staging", "production"]),
});

export const env = envSchema.parse(process.env);
