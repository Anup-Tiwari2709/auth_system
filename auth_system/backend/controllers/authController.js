const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const { pool } = require("../config/database");
const {
  sendResetPasswordEmail,
  sendOTPEmail,
} = require("../utils/emailService");
const {
  validateSignup,
  validateLogin,
  validateResetPassword,
} = require("../validators/authValidator");

// Generate JWT token
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Signup controller
const signup = async (req, res) => {
  try {
    // Validate input
    const { error, value } = validateSignup(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { first_name, last_name, email, password } = value;

    // Check if user already exists
    const [existingUsers] = await pool.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const userUuid = uuidv4();
    const [result] = await pool.execute(
      "INSERT INTO users (uuid, first_name, last_name, email, password) VALUES (?, ?, ?, ?, ?)",
      [userUuid, first_name, last_name, email, hashedPassword]
    );

    // Generate JWT token
    const token = generateToken({
      id: result.insertId,
      uuid: userUuid,
      email: email,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          id: result.insertId,
          uuid: userUuid,
          first_name,
          last_name,
          email,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Login controller
const login = async (req, res) => {
  try {
    // Validate input
    const { error, value } = validateLogin(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { email, password } = value;

    // Find user
    const [users] = await pool.execute(
      "SELECT id, uuid, first_name, last_name, email, password FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = users[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      uuid: user.uuid,
      email: user.email,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user.id,
          uuid: user.uuid,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Forgot password controller - Send OTP
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Find user
    const [users] = await pool.execute(
      "SELECT id, first_name, email FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      // Don't reveal if email exists or not for security
      return res.status(200).json({
        success: true,
        message:
          "If an account with that email exists, we have sent an OTP to your email",
      });
    }

    const user = users[0];

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    // Delete any existing OTP for this user
    await pool.execute("DELETE FROM password_reset_tokens WHERE user_id = ?", [
      user.id,
    ]);

    // Save OTP (using token field to store OTP)
    await pool.execute(
      "INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)",
      [user.id, otp, expiresAt]
    );

    // Send OTP email
    await sendOTPEmail(user.email, user.first_name, otp);

    res.status(200).json({
      success: true,
      message: "OTP has been sent to your email. It will expire in 5 minutes.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Verify OTP controller
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    // Find valid OTP
    const [tokens] = await pool.execute(
      `SELECT prt.id, prt.user_id, prt.expires_at, u.email 
       FROM password_reset_tokens prt 
       JOIN users u ON prt.user_id = u.id 
       WHERE u.email = ? AND prt.token = ? AND prt.used = FALSE AND prt.expires_at > NOW()`,
      [email, otp]
    );

    if (tokens.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    res.status(200).json({
      success: true,
      message: "OTP verified successfully. You can now reset your password.",
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Reset password controller - with email, current password, and new password
const resetPassword = async (req, res) => {
  try {
    const { email, otp, currentPassword, newPassword, confirmNewPassword } =
      req.body;

    // Validate input
    if (
      !email ||
      !otp ||
      !currentPassword ||
      !newPassword ||
      !confirmNewPassword
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match",
      });
    }

    // Validate new password strength
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message:
          "New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character, and be at least 8 characters long",
      });
    }

    // Find user and verify current password
    const [users] = await pool.execute(
      "SELECT id, password FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = users[0];

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Find valid OTP
    const [tokens] = await pool.execute(
      `SELECT prt.id, prt.user_id, prt.expires_at 
       FROM password_reset_tokens prt 
       JOIN users u ON prt.user_id = u.id 
       WHERE u.email = ? AND prt.token = ? AND prt.used = FALSE AND prt.expires_at > NOW()`,
      [email, otp]
    );

    if (tokens.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    const resetTokenData = tokens[0];

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update user password
    await pool.execute(
      "UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [hashedPassword, user.id]
    );

    // Mark OTP as used
    await pool.execute(
      "UPDATE password_reset_tokens SET used = TRUE WHERE id = ?",
      [resetTokenData.id]
    );

    res.status(200).json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Remove the old verifyResetToken function and replace with verifyOTP
const verifyResetToken = verifyOTP;
module.exports = {
  signup,
  login,
  forgotPassword,
  resetPassword,
  verifyResetToken,
};
