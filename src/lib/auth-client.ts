import { env } from '@/config/env';
import { createAuthClient } from 'better-auth/react';

const authClient = createAuthClient({
    baseURL: env.nextPublicApiUrl,
});

export { authClient };
