import type { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const isProd = process.env.NODE_ENV === "production";

export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "blob:"],
      fontSrc: ["'self'", "data:"],
      connectSrc: ["'self'"],
      frameAncestors: ["'self'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
});

export const globalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProd ? 600 : 5000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Try again later." },
});

export const writeRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProd ? 60 : 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many write requests. Try again later." },
});

export const downloadRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProd ? 30 : 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many download requests. Try again later." },
});

export function rejectUnknownContentType(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.method === "GET" || req.method === "HEAD" || req.method === "OPTIONS") {
    next();
    return;
  }

  const contentType = req.headers["content-type"];
  if (!contentType) {
    next();
    return;
  }

  const allowed =
    contentType.startsWith("application/json") ||
    contentType.startsWith("application/octet-stream");
  if (!allowed) {
    res.status(415).json({ error: "Unsupported content type." });
    return;
  }
  next();
}
