const express = require("express");
const {createPoll, getPolls, getPollById} = require("../controllers/pollController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/createPoll", authMiddleware, createPoll);
router.get("/getPolls", getPolls);
router.get("/getPollById/:id", getPollById);

module.exports = router;
