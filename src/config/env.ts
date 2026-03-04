import { z } from 'zod';

const envSchema = z.object({
    nextPublicApiUrl: z.string().url(),
});

const env = envSchema.parse({
    nextPublicApiUrl: process.env.NEXT_PUBLIC_API_URL,
});

export { env };
