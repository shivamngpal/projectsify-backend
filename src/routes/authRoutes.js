const express = require("express");
const {signup,login,healthCheck} = require("../controllers/authController.js");
const protectRoute = require("../middleware/authMiddleware.js");

const router = express.Router();
router.post("/signup",signup);
router.post("/login",login);
router.get("/health",protectRoute,healthCheck);

module.exports =  router;