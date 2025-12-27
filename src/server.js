const express = require("express");
const connectDB = require("./config/db.js");
const dotenv = require("dotenv");
const router = require("./routes/authRoutes.js");
const cors = require("cors");
const app = express();

dotenv.config();

// this is IIFE -> Immediately Invoked Function Expression
(async()=>{
    await connectDB();
    app.use(express.json());
    app.use(cors());
    app.use(router);
    
    app.listen(3000, ()=>{
        console.log("Server started");
    });
})();