const express = require("express");
const router = express.Router();
const {
  createNewUser,
  login,
  getRefreshToken,
} = require("../controllers/users");

// Create new user
router.put("/create-new-user", createNewUser);

// Login
router.post("/login", login);

// Refresh access_token
router.post("/refresh", getRefreshToken);

module.exports = router;
