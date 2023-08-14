// import dotenv from 'dotenv';
import express from "express";
import cors from "cors";
const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://admin.mykhoj.org",
      "https://admin.mykhoj.org",
    ],
  })
);
app.use(express.urlencoded({ extended: false }));
const routes = await import("./routes/allRoutes.mjs");
// Mount routes
app.use("/", routes.default);

export default app;