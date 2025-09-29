const mongoose = require("mongoose");
const optionSchema = require("../models/option");

const pollSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    options: [optionSchema],
    votedUsers: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "user",
        default: []
    }],
    createdBy: {
        type: String, 
        required: true
    },
    visibility: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Poll", pollSchema);
