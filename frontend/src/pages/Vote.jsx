import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Vote.css";

export default function Vote() {
    const { id } = useParams();
    const [poll, setPoll] = useState(null);
    const [selectedOption, setSelectedOption] = useState("");
    const [voted, setVoted] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        async function fetchPoll() {
            try {
                const res = await axios.get(`https://polleasy-5.onrender.com/polls/getPollById/${id}`);
                setPoll(res.data);
            } catch (err) {
                console.error("Error fetching poll:", err);
            }
        }
        fetchPoll();
    }, [id]);

    async function handleVote() {
        console.log("Submit the vote");

        if (!selectedOption) {
            setMessage("⚠️ Please select an option!");
            return;
        }
        try {
            const token = localStorage.getItem("token");

            const voteRes = await axios.post(`https://polleasy-5.onrender.com/votes/vote/${id}`, {
                _id: selectedOption,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setVoted(true);
            setMessage(voteRes.data.msg);
            const res = await axios.get(`https://polleasy-5.onrender.com/polls/getPollById/${id}`);
            setPoll(res.data);
        } catch (err) {
            console.log("Error submitting vote:", err);
        }
    }

    if (!poll) {
        return <p>Loading poll...</p>;
    }
    
    const totalVotes = poll.options.reduce((acc, opt) => acc + opt.votes, 0);
    const colors = ["#40739e", "#44bd32", "#e67e22", "#8e44ad", "#e74c3c"];

    return (
        <div className="vote-page">
            <div className="vote-card">
                <h2>{poll.question}</h2>
                <p className="created-by">Created by {poll.createdBy}</p>

                <div className="options-list">
                    {poll.options.map((opt) => (
                        <label key={opt._id} className="option-item">
                            <input type="radio" name="pollOption" value={opt._id} checked={selectedOption === opt._id} onChange={(e) => setSelectedOption(e.target.value)} />
                            {opt.text}
                        </label>
                    ))}
                </div>

                <button className={`vote-btn ${voted ? "voted" : ""}`} onClick={handleVote} >Submit Vote</button>
                <p className="message">{message}</p>

                {voted && (
                    <div className="results">
                        {poll.options.map((opt, i) => {
                            const percent = totalVotes ? ((opt.votes / totalVotes) * 100).toFixed(0) : 0;
                            return (
                                <div key={opt._id} className="result-bar">
                                    <div className="bar">
                                        <div
                                            className="fill"
                                            style={{ width: `${percent}%`, background: colors[i % colors.length], }}>
                                            {opt.text} — {percent}%
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <p className="total-votes">Total votes: {totalVotes}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
