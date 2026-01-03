const express = require("express");
const connectDB = require("./config/db.js");
const dotenv = require("dotenv");
const authRouter = require("./routes/authRoutes.js");
const projectRouter = require("./routes/projectRoutes.js");
const cors = require("cors");
const app = express();

dotenv.config();

// this is IIFE -> Immediately Invoked Function Expression
(async()=>{
    await connectDB();
    app.use(express.json());
    app.use(cors());
    // /api/auth/signup or login
    app.use("/api/auth",authRouter);
    app.use("/api", projectRouter);
    
    app.listen(3000, ()=>{
        console.log("Server started");
    });
})();