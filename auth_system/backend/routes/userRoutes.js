const express = require("express")
const { getUserProfile, updateUserProfile } = require("../controllers/userController")
const { authenticateToken } = require("../middleware/authMiddleware")

const router = express.Router()

// Protected routes (require authentication)
router.use(authenticateToken)

router.get("/profile", getUserProfile)
router.put("/profile", updateUserProfile)

module.exports = router
