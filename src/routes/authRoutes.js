const express = require("express");
const signup = require("../controllers/authController.js");

const router = express.Router();
router.post("/api/signup",signup);

module.exports =  router;