import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import authRoutes from "./routes/auth/auth.routes.js";
import leaveRoutes from "./routes/leave.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const allowedOrigins = new Set([
  env.clientUrl,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
]);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Dayflow API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/leave", leaveRoutes);

app.use(errorHandler);

export default app;
