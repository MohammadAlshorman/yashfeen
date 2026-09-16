export const Session = {
  cookieName: "yashfeen_sid",
  maxAgeMs: 7 * 24 * 60 * 60 * 1000, // 7 days
} as const;

export const ErrorMessages = {
  unauthenticated: "Authentication required",
  insufficientRole: "Insufficient permissions",
  invalidCredentials: "Invalid email or password",
} as const;

export const Paths = {
  login: "/login",
} as const;
