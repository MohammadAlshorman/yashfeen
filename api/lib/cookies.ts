import type { CookieOptions } from "hono/utils/cookie";

function isLocalhost(headers: Headers): boolean {
  const host = headers.get("host") || "";
  return host.startsWith("localhost:") || host.startsWith("127.0.0.1:");
}

/**
 * Session cookie options.
 *
 * - HTTP-only, same-site Lax, path=/ — a portable, secure default that
 *   works on any host (no third-party / cross-site requirements).
 * - `secure` is enabled automatically whenever the request arrives over
 *   HTTPS (directly or behind a proxy that sets `x-forwarded-proto`,
 *   which Hostinger / cPanel Passenger setups do), and disabled on
 *   localhost so development keeps working over plain HTTP.
 */
export function getSessionCookieOptions(headers: Headers): CookieOptions {
  const localhost = isLocalhost(headers);
  const forwardedProto = headers.get("x-forwarded-proto") || "";
  const secure = localhost
    ? false
    : forwardedProto
      ? forwardedProto === "https"
      : true;

  return {
    httpOnly: true,
    path: "/",
    sameSite: "Lax",
    secure,
  };
}
