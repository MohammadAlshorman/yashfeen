import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import type { HttpBindings } from "@hono/node-server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { sql } from "drizzle-orm";
import { appRouter } from "./router";
import { createContext } from "./context";
import { env } from "./lib/env";

const app = new Hono<{ Bindings: HttpBindings }>();

app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));

/**
 * Liveness/readiness probe for hosting dashboards and uptime monitors.
 * Reports `db: true` only when a real round-trip to MySQL succeeds.
 */
app.get("/api/health", async (c) => {
  let db = false;
  try {
    const { getDb } = await import("./queries/connection");
    await getDb().execute(sql`SELECT 1`);
    db = true;
  } catch {
    db = false;
  }
  return c.json({
    ok: true,
    db,
    env: env.isProduction ? "production" : "development",
    time: new Date().toISOString(),
  });
});

app.use("/api/trpc/*", async (c) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext,
  });
});
app.all("/api/*", (c) => c.json({ error: "Not Found" }, 404));

export default app;

if (env.isProduction) {
  const { serve } = await import("@hono/node-server");
  const { serveStaticFiles } = await import("./lib/vite");
  serveStaticFiles(app);

  const port = parseInt(process.env.PORT || "3000", 10);
  serve({ fetch: app.fetch, port, hostname: "0.0.0.0" }, (info) => {
    console.log(`Yashfeen server listening on 0.0.0.0:${info.port}`);
  });
}
