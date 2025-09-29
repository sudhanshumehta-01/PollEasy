const Poll = require("../models/poll");
const User = require("../models/user");

exports.getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();

        const totalPolls = await Poll.countDocuments();

        const polls = await Poll.find();
        let totalVotes = 0;
        polls.forEach(poll => {
            poll.options.forEach(opt => {
                totalVotes += opt.votes;
            });
        });

        const pollParticipation = polls
            .map(poll => ({
                poll: poll.question,
                votes: poll.options.reduce((sum, opt) => sum + opt.votes, 0),
            }))
            .sort((a, b) => b.votes - a.votes)
            .slice(0, 5);

        const voteDistribution = [];
        polls.forEach(poll => {
            poll.options.forEach(opt => {
                let existing = voteDistribution.find(v => v.name === opt.text);
                if (existing) {
                    existing.value += opt.votes;
                } else {
                    voteDistribution.push({ name: opt.text, value: opt.votes });
                }
            });
        });

        res.json({
            totalUsers,
            totalPolls,
            totalVotes,
            pollParticipation,
            voteDistribution,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};
