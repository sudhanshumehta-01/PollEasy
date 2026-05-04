import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import "./Result.css";

export default function Result() {
    const { id } = useParams();
    const [poll, setPoll] = useState(null);

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

    if (!poll) return <p>Loading results...</p>;

    const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);

    const COLORS = ["#4285F4", "#34A853", "#FBBC05", "#EA4335", "#9C27B0"];

    return (
        <div className="result-container">
            <h2 className="poll-question">Poll Results: {poll.question}</h2>

            <div className="bar-results">
                {poll.options.map((opt, index) => {
                    const percent = totalVotes ? ((opt.votes / totalVotes) * 100).toFixed(0) : 0;
                    return (
                        <div key={index} className="bar-row">
                            <div className="bar-bg">
                                <div className="bar-fill" style={{ width: `${percent}%`, backgroundColor: COLORS[index % COLORS.length] }}>
                                    {opt.text} — {percent}%
                                </div>
                            </div>
                        </div>
                    );
                })}
                <p className="total-votes">Total votes: {totalVotes}</p>
            </div>

            <h3 className="distribution">Vote Distribution</h3>

            <div className="pie-results">
                <PieChart width={400} height={270}>
                    <Pie data={poll.options.map(opt => ({ name: opt.text, value: opt.votes }))} cx={200} cy={150} outerRadius={100}>
                        {poll.options.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
                <div className="option-color-card">
                    {poll.options.map((opt, index) => {
                        const percent = totalVotes ? ((opt.votes / totalVotes) * 100).toFixed(0) : 0;
                        return (
                            <div key={index} className="item">
                                <div className="option-color" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                <span>{opt.text}({percent}%)</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
