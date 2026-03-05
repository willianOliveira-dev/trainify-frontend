import { createAuthClient } from "better-auth/react";
import { env } from "@/config/env";

const authClient = createAuthClient({
  baseURL: env.nextPublicApiUrl,
});

export { authClient };
