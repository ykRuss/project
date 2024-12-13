const Goal = require("../models/goal");
const { validationResult } = require("express-validator");

// Add a new goal
const addGoal = async (req, res) => {
  const errors = validationResult(req);
  const formData = req.body;

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
      formData,
    });
  }

  try {
    const { title, description, deadline } = req.body;
    const newGoal = await Goal.create({
      title,
      description,
      deadline,
      user: req.user.id, // The authenticated user who created the goal
    });
    // Send response with the new goal data
    res.status(201).json(newGoal);
  } catch (err) {
    console.error("Error adding goal:", err);
    res.status(500).json({ message: "Error adding goal" });
  }
};

// Fetch goals for the authenticated user
const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.id }); // Fetch user's goals
    res.json(goals); // Return goals in JSON format
  } catch (err) {
    console.error("Error fetching goals:", err);
    res.status(500).json({ message: "Error fetching goals" });
  }
};

// Share a goal with another user
const shareGoal = async (req, res) => {
  try {
    const { goalId } = req.params; // Get goalId from URL params
    const { friendId } = req.body; // Get friendId from request body

    // Validate if friendId is provided
    if (!friendId) {
      return res.status(400).json({ message: "Friend ID is required" });
    }

    const goal = await Goal.findById(goalId); // Find the goal by goalId

    // Check if goal exists and if the user is the owner
    if (!goal || goal.user.toString() !== req.user.id) {
      return res
        .status(404)
        .json({ message: "Goal not found or not authorized" });
    }

    // Add friend's ID to the sharedWith array if not already present
    if (!goal.sharedWith.includes(friendId)) {
      goal.sharedWith.push(friendId);
    }

    // Save the updated goal
    await goal.save();

    // Return the updated goal after sharing
    res.json({ message: "Goal shared successfully", goal });
  } catch (err) {
    console.error("Error sharing goal:", err);
    res.status(500).json({ message: "Error sharing goal" });
  }
};

// Fetch shared goals for the authenticated user
const getSharedGoals = async (req, res) => {
  try {
    const sharedGoals = await Goal.find({
      sharedWith: req.user.id, // Check if the user is in the sharedWith array
    });

    if (sharedGoals.length === 0) {
      return res.json({ message: "No shared goals found", sharedGoals: [] });
    }

    res.json(sharedGoals); // Return shared goals in JSON format
  } catch (err) {
    console.error("Error fetching shared goals:", err);
    res.status(500).json({ message: "Error fetching shared goals" });
  }
};

const deleteGoal = async (req, res) => {
  try {
    const { goalId } = req.params;

    const goal = await Goal.findById(goalId);

    if (!goal || goal.user.toString() !== req.user.id) {
      return res
        .status(404)
        .json({ message: "Goal not found or unauthorized" });
    }

    await Goal.findByIdAndDelete(goalId);
    res.status(200).json({ message: "Goal successfully deleted" });
  } catch (err) {
    console.error("Error deleting goal:", err);
    res.status(500).json({ message: "Error deleting goal", error: err });
  }
};

const getGoalById = async (req, res) => {
  try {
    const { goalId } = req.params; // Get the goalId from the request parameters
    const goal = await Goal.findById(goalId); // Assuming you are using Mongoose for MongoDB

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    res.json(goal); // Return the goal data
  } catch (error) {
    console.error("Error fetching goal:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addGoal,
  getGoals,
  shareGoal,
  getSharedGoals,
  deleteGoal,
  getGoalById,
};
