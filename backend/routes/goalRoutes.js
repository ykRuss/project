const express = require("express");
const router = express.Router();
const authMiddleware = require("../authMiddleware");
const { check } = require("express-validator");

// Import controllers
const {
  getGoals,
  deleteGoal,
  addGoal,
  shareGoal,
  getSharedGoals,
  getGoalById,
} = require("../controllers/goal");

// Middleware for validating form parameters
const validateGoal = [
  check("title", "Title is required").notEmpty(),
  check("description", "Description is required").notEmpty(),
  check("deadline", "Deadline is required").notEmpty(),
];

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Routes
router.get("/", getGoals); // Fetch goals for authenticated user
router.post("/add", validateGoal, addGoal); // Add a new goal
router.post("/share/:goalId", shareGoal); // Share a goal
router.get("/shared", getSharedGoals); // Fetch shared goals
router.delete("/delete/:goalId", deleteGoal);
router.get("/:goalId", getGoalById); // Fetch a goal by its ID

module.exports = router;
