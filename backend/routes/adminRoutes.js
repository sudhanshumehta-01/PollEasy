const express = require("express");
const router = express.Router();
const { getAdminStats } = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.get("/getAdminStats", authMiddleware, adminMiddleware, getAdminStats);

module.exports = router;
