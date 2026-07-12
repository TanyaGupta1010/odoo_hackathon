import express from "express";
import cors from "cors";
import "express-async-errors";

import router from "./routes";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (_, res) => {
  res.json({
    success: true,
    message: "AssetFlow Backend Running 🚀",
  });
});

app.use("/api", router);

app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);

  return res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;