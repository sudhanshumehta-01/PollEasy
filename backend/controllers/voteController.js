const Poll = require("../models/poll");

exports.votePoll = async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.id);
        if (!poll){
            return res.json({ msg: "Poll not found" });
        }

        const userId = req.user?.id;
        
        if (!poll.votedUsers){
            poll.votedUsers = [];
        }

        if (poll.votedUsers.includes(userId)) {
            return res.json({ msg: "✅ Your vote has already been submitted!", alreadyVoted: true });
        }

        const option = poll.options.id(req.body._id);

        option.votes += 1;
        poll.votedUsers.push(userId);
        option.votedBy.push(userId);

        await poll.save();

        return res.json({ poll, msg: "✅ Your vote has been recorded!" });

    } catch (err) {
        console.error(err);
        return res.json({ msg: "Internal server error", err});
    }
};
