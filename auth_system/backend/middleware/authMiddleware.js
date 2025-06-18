const jwt = require("jsonwebtoken")
const { pool } = require("../config/database")

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1] // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token is required",
      })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Check if user still exists
    const [users] = await pool.execute("SELECT id, uuid, email FROM users WHERE id = ?", [decoded.id])

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid token - user not found",
      })
    }

    // Attach user to request
    req.user = {
      id: decoded.id,
      uuid: decoded.uuid,
      email: decoded.email,
    }

    next()
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      })
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired",
      })
    }

    console.error("Auth middleware error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

module.exports = {
  authenticateToken,
}
