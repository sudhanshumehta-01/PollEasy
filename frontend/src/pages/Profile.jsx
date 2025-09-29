import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Profile.css";
import { MyContext } from "../provider/MyProvider";

export default function Profile() {
    const { user, token, isLoggedIn } = useContext(MyContext);
    const [myPolls, setMyPolls] = useState([]);
    const [recentVotes, setRecentVotes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn()) {
            navigate("/login");
            return;
        }

        const fetchPolls = async () => {
            try {
                const res = await axios.get("http://localhost:5000/polls/getPolls", {
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                });

                const polls = res.data;

                const created = polls.filter((poll) => poll.createdBy === user.email);

                const voted = polls.filter((poll) =>
                    poll.votedUsers.some((id) => id.toString() === user.id)
                );

                setMyPolls(created);
                setRecentVotes(voted);
            } catch (err) {
                console.error("Error fetching polls:", err);
            }
        };

        fetchPolls();
    }, [token, user, isLoggedIn, navigate]);

    const formatDate = (date) => new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    const totalVotes = (options) => options.reduce((sum, opt) => sum + opt.votes, 0);

    return (
        <div className="profile-container">

            <div className="profile-card">
                <div className="profile-header">
                    <h2>{user?.name}</h2>
                    <p>Email: {user?.email}</p>
                    <p>Member since: {user?.createdAt ? formatDate(user.createdAt) : "N/A"}</p>
                </div>
                <div>
                    <button onClick={() => navigate("/editProfile")}>Edit Profile</button>
                </div>
            </div>

            <div className="profile-section">
                <h3>My Polls</h3>
                {myPolls.length === 0 ? (
                    <p>No polls created yet.</p>
                ) : (
                    <table className="poll-table">
                        <thead>
                            <tr>
                                <th>Poll Question</th>
                                <th>Votes</th>
                                <th>Status</th>
                                <th>Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myPolls.map((poll) => (
                                <tr key={poll._id}>
                                    <td>{poll.question}</td>
                                    <td>{totalVotes(poll.options)}</td>
                                    <td>{poll.visibility || "N/A"}</td>
                                    <td>{formatDate(poll.createdAt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="profile-section">
                <h3>Recent Votes</h3>
                {recentVotes.length === 0 ? (
                    <p>No recent votes.</p>
                ) : (
                    <ul className="recent-votes-list">
                        {recentVotes.map(poll => (
                            <li key={poll._id}>{poll.question}</li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
