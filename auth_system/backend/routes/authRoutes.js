const express = require("express");
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  verifyResetToken,
} = require("../controllers/authController");

const router = express.Router();

// Auth routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyResetToken);
router.post("/reset-password", resetPassword);
router.get("/verify-reset-token/:token", verifyResetToken);

module.exports = router;
