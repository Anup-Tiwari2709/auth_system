const { pool } = require("../config/database")

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id

    const [users] = await pool.execute(
      "SELECT id, uuid, first_name, last_name, email, is_verified, created_at FROM users WHERE id = ?",
      [userId],
    )

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    const user = users[0]

    res.status(200).json({
      success: true,
      message: "User profile retrieved successfully",
      data: {
        user: {
          id: user.id,
          uuid: user.uuid,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          is_verified: user.is_verified,
          created_at: user.created_at,
        },
      },
    })
  } catch (error) {
    console.error("Get user profile error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id
    const { first_name, last_name } = req.body

    if (!first_name || !last_name) {
      return res.status(400).json({
        success: false,
        message: "First name and last name are required",
      })
    }

    await pool.execute("UPDATE users SET first_name = ?, last_name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", [
      first_name,
      last_name,
      userId,
    ])

    // Get updated user data
    const [users] = await pool.execute(
      "SELECT id, uuid, first_name, last_name, email, is_verified FROM users WHERE id = ?",
      [userId],
    )

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user: users[0],
      },
    })
  } catch (error) {
    console.error("Update user profile error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

module.exports = {
  getUserProfile,
  updateUserProfile,
}
