const mongoose = require("mongoose");

try{
    mongoose.connect(process.env.MONGO_URL);
    console.log("mongoDB connected");
}
catch(e){
    console.log("Error Occurred : ",e);
}