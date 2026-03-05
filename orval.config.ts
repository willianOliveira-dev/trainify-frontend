import "dotenv/config";
import { defineConfig } from "orval";

export default defineConfig({
  // rc: {
  //   output: {
  //     target: "src/lib/api/rc-generated/index.ts",
  //     client: "react-query",
  //     override: {
  //       mutator: {
  //         path: "./src/lib/api/axios-instance.ts",
  //         name: "customInstance",
  //       },
  //     },
  //   },
  //   input: {
  //     target: `${env.nextPublicApiUrl}/swagger.json`,
  //     filters: {
  //       mode: "exclude",
  //       tags: ["default"],
  //     },
  //   },
  // },
  fetch: {
    input: `${process.env.NEXT_PUBLIC_API_URL}/swagger.json`,
    output: {
      target: "./src/lib/api/fetch-generated/index.ts",
      client: "fetch",
      biome: true,
      override: {
        mutator: {
          path: "./src/lib/fetch.ts",
          name: "customFetch",
        },
      },
    },
  },
});
