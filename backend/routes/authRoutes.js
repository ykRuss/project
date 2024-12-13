const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,

  resetPassword,
  // renderResetPasswordPage,
} = require("../controllers/auth"); // Import functions from auth.js

// Login Route (POST)
router.post("/login", loginUser); // Use the loginUser function from auth.js

// Registration Route (POST)
router.post("/register", registerUser); // Use the registerUser function from auth.js

// Reset Password (POST)
router.post("/reset-password", resetPassword); // Use the resetPassword function from auth.js

module.exports = router;
