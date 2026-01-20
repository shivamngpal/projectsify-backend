const mongoose = require("mongoose");

// mongoose.connect() is async
// try/catch will NOT catch connection errors
// You are not exporting anything
// This file executes immediately on import (bad pattern)

// This was when i was using IIFE

async function connectDB(){
    try{
        const mongoConnection = process.env.MONGO_URL;
        await mongoose.connect(mongoConnection);
        console.log("mongoDB connected");
    }
    catch(e){
        console.log("Error Occurred : ",e.message);
        process.exit(1);
    }
}

module.exports = connectDB;