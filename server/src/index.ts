import express, { Request, Response } from "express";
import cors from "cors";
import { errorHandler, notFound } from "./util/errorHandler";
import projectRoutes from "./routes/projectRoutes";
import userRoutes from "./routes/userRoutes";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/v1", projectRoutes);
app.use("/api/v1", userRoutes);

app.use(notFound);
app.use(errorHandler);

const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  server.close(() => {
    process.exit(1);
  });
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  server.close(() => {
    process.exit(1);
  });
});

export default app;
