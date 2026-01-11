const express = require("express");
const connectDB = require("./config/db.js");
const dotenv = require("dotenv");
dotenv.config();
const authRouter = require("./routes/authRoutes.js");
const projectRouter = require("./routes/projectRoutes.js");
const cors = require("cors");
const app = express();

const allowedOrigins = (process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

// this is IIFE -> Immediately Invoked Function Expression
(async () => {
  await connectDB();
  app.use(express.json());
  app.use(
    cors({
      origin: allowedOrigins.length ? allowedOrigins : true,
      credentials: true,
    })
  );
  // /api/auth/signup or login
  app.use("/api/auth", authRouter);
  app.use("/api", projectRouter);

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log("Server started");
  });
})();
