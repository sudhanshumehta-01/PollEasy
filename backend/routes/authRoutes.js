const express = require("express");

const {registerUser, loginUser, forgotPassword, resetPassword, updateProfile} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/registerUser", registerUser);
router.post("/loginUser", loginUser);
router.put("/updateProfile", authMiddleware, updateProfile);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;