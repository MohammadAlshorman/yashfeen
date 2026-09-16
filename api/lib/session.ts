import * as jose from "jose";
import { env } from "./env";

/**
 * Admin session tokens — HS256 JWTs signed with SESSION_SECRET.
 * The token only identifies the user (unionId + email); the role is
 * always re-read from the database on every request.
 */
export type SessionPayload = {
  unionId: string;
  email: string;
};

const JWT_ALG = "HS256";
const TOKEN_TTL = "7 days";

function secretKey(): Uint8Array {
  return new TextEncoder().encode(env.sessionSecret);
}

export async function signSessionToken(
  payload: SessionPayload,
): Promise<string> {
  return new jose.SignJWT({ ...payload })
    .setProtectedHeader({ alg: JWT_ALG })
    .setIssuedAt()
    .setExpirationTime(TOKEN_TTL)
    .sign(secretKey());
}

export async function verifySessionToken(
  token: string,
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jose.jwtVerify(token, secretKey(), {
      algorithms: [JWT_ALG],
    });
    const { unionId, email } = payload;
    if (typeof unionId !== "string" || typeof email !== "string") return null;
    return { unionId, email };
  } catch {
    return null;
  }
}
