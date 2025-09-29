const Poll = require("../models/poll");

exports.createPoll = async (req, res) => {
    try {
        const { question, options, visibility} = req.body;

        const formattedOptions = options.map((opt) => ({ text: opt }));

        const newPoll = new Poll({
            question,
            options: formattedOptions,
            createdBy: req.user.email,
            visibility
        });

        await newPoll.save();
        res.json({ msg: "Poll has created successfully" });
    } catch (err) {
        console.log(err);
    }
};


exports.getPolls = async (req, res) => {
    try {
        const polls = await Poll.find();
        res.json(polls);
    } catch (err) {
        console.log(err);
    }
};

exports.getPollById = async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.id);
        if (!poll) {
            return res.json({ msg: "Poll not found" });
        }
        res.json(poll);
    } catch (err) {
        console.log(err);
    }
};