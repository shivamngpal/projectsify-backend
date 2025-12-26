const express = require("express");
const connectDB = require("./config/db.js");
const dotenv = require("dotenv");
const router = require("./routes/authRoutes.js");
const app = express();

dotenv.config();
connectDB();
app.use(express.json());
app.use(router);

app.listen(3000, ()=>{
    console.log("Server started");
});