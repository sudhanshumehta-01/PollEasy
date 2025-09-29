const express = require("express");
const {votePoll} = require("../controllers/voteController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/vote/:id", authMiddleware, votePoll); 

module.exports = router;
