import * as cookie from "cookie";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Session, ErrorMessages } from "@contracts/constants";
import { getSessionCookieOptions } from "./lib/cookies";
import { signSessionToken } from "./lib/session";
import { env } from "./lib/env";
import { upsertUser } from "./queries/users";
import { createRouter, publicQuery, authedQuery } from "./middleware";

function sessionCookie(name: string, value: string, headers: Headers, maxAge: number) {
  const opts = getSessionCookieOptions(headers);
  return cookie.serialize(name, value, {
    httpOnly: opts.httpOnly,
    path: opts.path,
    sameSite: (opts.sameSite?.toLowerCase() ?? "lax") as "lax" | "none",
    secure: opts.secure,
    maxAge,
  });
}

export const authRouter = createRouter({
  /**
   * Portable admin login — validates credentials against the
   * ADMIN_EMAIL / ADMIN_PASSWORD environment variables, upserts the
   * admin user (role=admin) and sets a secure HTTP-only session cookie.
   */
  login: publicQuery
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(1),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const email = input.email.trim().toLowerCase();
      const expectedEmail = env.adminEmail.trim().toLowerCase();
      const valid =
        !!expectedEmail &&
        email === expectedEmail &&
        input.password === env.adminPassword;

      if (!valid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: ErrorMessages.invalidCredentials,
        });
      }

      const unionId = `local:${email}`;
      await upsertUser({
        unionId,
        email,
        name: "Administrator",
        role: "admin",
        lastSignInAt: new Date(),
      });

      const token = await signSessionToken({ unionId, email });
      ctx.resHeaders.append(
        "set-cookie",
        sessionCookie(Session.cookieName, token, ctx.req.headers, Session.maxAgeMs / 1000),
      );
      return { success: true };
    }),

  me: authedQuery.query((opts) => opts.ctx.user),

  logout: authedQuery.mutation(async ({ ctx }) => {
    ctx.resHeaders.append(
      "set-cookie",
      sessionCookie(Session.cookieName, "", ctx.req.headers, 0),
    );
    return { success: true };
  }),
});
