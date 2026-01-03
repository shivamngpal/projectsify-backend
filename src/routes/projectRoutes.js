const express = require("express");
const createProject = require("../controllers/projectController.js");
const protectRoute = require("../middleware/authMiddleware.js");

const projectRouter = express.Router();

projectRouter.post("/projects", protectRoute, createProject);

module.exports = projectRouter;