"use client";

const DEFAULT_MAX_AGE_SECONDS = 3600;
const DEFAULT_PRODUCTION_DOMAIN = ".webershub.com";

const getExplicitDomain = () =>
  process.env.NEXT_PUBLIC_AUTH_COOKIE_DOMAIN ||
  process.env.NEXT_PUBLIC_COOKIE_DOMAIN ||
  process.env.NEXT_PUBLIC_AUTH_DOMAIN ||
  (process.env.NODE_ENV === "production" ? DEFAULT_PRODUCTION_DOMAIN : undefined);

const inferDomainFromWindow = () => {
  if (typeof window === "undefined") {
    return undefined;
  }

  const hostname = window.location.hostname;

  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return undefined;
  }

  if (hostname.endsWith("webershub.com")) {
    return ".webershub.com";
  }

  return undefined;
};

const resolveCookieDomain = () => getExplicitDomain() || inferDomainFromWindow();

const isHttpsEnvironment = () => {
  if (typeof window === "undefined") {
    return true;
  }

  return window.location.protocol === "https:";
};

interface SetCookieOptions {
  maxAgeSeconds?: number;
}

export const setAuthCookie = (token: string, options: SetCookieOptions = {}) => {
  const maxAge = options.maxAgeSeconds ?? DEFAULT_MAX_AGE_SECONDS;
  const domain = resolveCookieDomain();
  const isCrossSite = Boolean(domain);
  const isHttps = isHttpsEnvironment();

  const parts = ["Path=/", `Max-Age=${maxAge}`];

  if (isCrossSite) {
    parts.push("SameSite=None");
    if (isHttps) {
      parts.push("Secure");
    }
  } else {
    // Local development can fall back to lax to avoid rejecting the cookie
    parts.push("SameSite=Lax");
    if (isHttps) {
      parts.push("Secure");
    }
  }

  if (domain) {
    parts.push(`Domain=${domain}`);
  }

  document.cookie = `token=${token}; ${parts.join("; ")}`;
};

export const clearAuthCookie = () => {
  const domain = resolveCookieDomain();
  const parts = ["Path=/", "Max-Age=0"]; // Max-Age=0 expires immediately

  if (domain) {
    parts.push(`Domain=${domain}`);
  }

  document.cookie = `token=; ${parts.join("; ")}`;
};
