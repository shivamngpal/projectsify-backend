const express = require("express");
const signup = require("../contollers/authController.js");

const router = express.Router();
router.post("/api/signup",signup);

module.exports =  router;