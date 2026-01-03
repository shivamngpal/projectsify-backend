const express = require("express");
const {signup,login,healthCheck} = require("../controllers/authController.js");
const protectRoute = require("../middleware/authMiddleware.js");

const authRouter = express.Router();
authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.get("/health", protectRoute, healthCheck);

module.exports = authRouter;