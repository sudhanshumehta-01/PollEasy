import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./BrowsePolls.css";
import { MyContext } from "../provider/MyProvider";

export default function Browse() {
    const [polls, setPolls] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const pollsPerPage = 5;
    const navigate = useNavigate();
    const { token, user, isLoggedIn } = useContext(MyContext);

    useEffect(() => {
        async function fetchPolls() {
            try {
                const res = await axios.get("http://localhost:5000/polls/getPolls", {
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                });

                const fetchedPolls = res.data.filter((poll) => {

                    if (poll.visibility === "public") {
                        return true;
                    }
                    if (isLoggedIn() && poll.visibility === "private" && poll.createdBy === user.email ) {
                        return true;
                    }
                    return false;
                });

                setPolls(fetchedPolls);
            } catch (err) {
                console.error("Error fetching polls:", err);
            }
        }

        fetchPolls();
    }, [token, user, isLoggedIn]);

    const timeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        const intervals = [
            { label: "y", seconds: 31536000 },
            { label: "mo", seconds: 2592000 },
            { label: "d", seconds: 86400 },
            { label: "h", seconds: 3600 },
            { label: "m", seconds: 60 },
            { label: "s", seconds: 1 },
        ];
        for (let i of intervals) {
            const count = Math.floor(seconds / i.seconds);
            if (count > 0) return count + i.label + " ago";
        }
        return "just now";
    };

    const filteredPolls = polls
        .filter((poll) =>
            poll.question.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter((poll) => {
            const totalVotes = poll.options.reduce((acc, opt) => acc + opt.votes, 0);
            if (activeFilter === "Trending") return totalVotes >= 2;
            if (activeFilter === "Past 7 days") {
                const created = new Date(poll.createdAt);
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                return created >= sevenDaysAgo;
            }
            if (activeFilter === "Most Voted") {
                return totalVotes >= 5;
            }
            return true;
        });

    const indexOfLastPoll = currentPage * pollsPerPage;
    const indexOfFirstPoll = indexOfLastPoll - pollsPerPage;
    const currentPolls = filteredPolls.slice(indexOfFirstPoll, indexOfLastPoll);
    const totalPages = Math.ceil(filteredPolls.length / pollsPerPage);

    return (
        <div className="browse-container">
            <div className="browse-header">
                <div>
                    <h2>Browse Polls</h2>
                    <p>Discover public polls — vote, share, and see what's trending.</p>
                </div>
                <button className="create-btn" onClick={() => navigate("/createPolls")}>
                    Create New Poll
                </button>
            </div>

            <div className="search-section">
                <input type="text" placeholder="Search polls, keywords, creators" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                <button onClick={() => setSearchTerm(searchTerm)}>Search</button>
                <div className="filters">
                    <button onClick={() => setActiveFilter("")}>All</button>
                    <button onClick={() => setActiveFilter("Trending")}>Trending</button>
                    <button onClick={() => setActiveFilter("Past 7 days")}>Past 7 days</button>
                    <button onClick={() => setActiveFilter("Most Voted")}>Most Voted</button>
                </div>
            </div>

            <div className="polls-grid">
                {currentPolls.map((poll) => (
                    <div key={poll._id} className="poll-card">
                        <div className="poll-header">
                            <span className="creator">Created by {poll.createdBy}</span>
                            <span className="time">{timeAgo(poll.createdAt)}</span>
                        </div>
                        <h3>{poll.question}</h3>
                        <div className="poll-options">
                            {poll.options.map((opt) => opt.text).join(", ")}
                        </div>
                        <div className="actions">
                            <button onClick={() => navigate(`/vote/${poll._id}`)}>Vote</button>
                            <button onClick={() => navigate(`/vieResults/${poll._id}`)}>View Results</button>
                            <button onClick={() => (window.location.href = "mailto:sudhashumehtajale@gmail.com")}>
                                Share
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="pagination">
                <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                    Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                    <button key={num} onClick={() => setCurrentPage(num)} className={currentPage === num ? "active-page" : ""}>
                        {num}
                    </button>
                ))}
                <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>
        </div>
    );
}