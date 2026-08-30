import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import componentsRouter from "./routes/components";
import catalogRouter from "./routes/catalog";
import libraryRouter from "./routes/library";
import playgroundRouter from "./routes/playground";
import previewRouter from "./routes/preview";
import stripeRouter from "./routes/stripe";
import webhooksRouter from "./routes/webhooks";
import registryRouter from "./routes/registry";
import artifactsRouter from "./routes/artifacts";
import {
  globalRateLimit,
  rejectUnknownContentType,
  securityHeaders,
  writeRateLimit,
} from "./middleware/security";
import { attachUserIfPresent } from "./middleware/auth";
import { getPrisma } from "./prisma";
import { getAllowedFrontendOrigins, isAllowedFrontendOrigin } from "./lib/frontend-origins";
import { ensureStorageLayout } from "./lib/artifact-storage";

dotenv.config();

const app = express();

app.set("trust proxy", 1);
app.disable("x-powered-by");

app.use(securityHeaders);
app.use(globalRateLimit);

const allowedFrontendOrigins = getAllowedFrontendOrigins();
app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedFrontendOrigin(origin)) return callback(null, true);
      callback(new Error(`CORS blocked for origin: ${origin ?? "unknown"}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Complib-Admin-Key",
      "Cookie",
    ],
  }),
);

// Webhooks need the raw body (before express.json()).
app.use("/api/webhooks", webhooksRouter);

app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));
app.use(rejectUnknownContentType);
app.use(attachUserIfPresent);

app.get("/api/health", async (_req, res) => {
  let db: "ok" | "error" = "ok";
  try {
    const prisma = getPrisma();
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    db = "error";
  }

  res.status(db === "ok" ? 200 : 503).json({
    status: db === "ok" ? "ok" : "degraded",
    db,
    componentsStorage: "artifact-store",
    catalogStorage: db === "ok" ? "postgresql" : "unavailable",
    sourceStorage: "filesystem",
    registryStorage: db === "ok" ? "postgresql" : "unavailable",
  });
});

app.use("/api/components", writeRateLimit, componentsRouter);
app.use("/api/catalog", catalogRouter);
app.use("/api/registry", registryRouter);
app.use("/api/artifacts", artifactsRouter);
app.use("/api/library", libraryRouter);
app.use("/api/playground", playgroundRouter);
app.use("/api/preview", previewRouter);
app.use("/api/stripe", stripeRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use(
  (
    err: unknown,
    _req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    if (err instanceof SyntaxError && "body" in err) {
      res.status(400).json({ error: "Invalid JSON body" });
      return;
    }
    if (process.env.NODE_ENV !== "production") {
      console.error(err);
    }
    if (res.headersSent) {
      next(err);
      return;
    }
    res.status(500).json({ error: "Internal server error" });
  },
);

const PORT = Number(process.env.PORT) || 5000;

void ensureStorageLayout().catch((err) => {
  console.warn("[storage] Failed to initialize artifact layout:", err);
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
