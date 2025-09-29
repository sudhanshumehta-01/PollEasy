const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    votes: {
        type: Number,
        default: 0
    },
    votedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }]
});

module.exports = optionSchema;
