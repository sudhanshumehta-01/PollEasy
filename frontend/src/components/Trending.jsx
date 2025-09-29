import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./Trending.css";
import { useNavigate } from "react-router-dom";

export default function Trending() {
    const [trendingPolls, setTrendingPolls] = useState([]);
    const navigate = useNavigate();
    const scrollRef = useRef(null);

    useEffect(() => {
        async function fetchTrendingPolls() {
            try {
                const res = await axios.get("http://localhost:5000/polls/getPolls");
                const trending = res.data.filter(poll => {
                    const totalVotes = poll.options.reduce((acc, opt) => acc + opt.votes, 0);
                    return totalVotes >= 1;
                });
                setTrendingPolls(trending);
            } catch (err) {
                console.error("Error fetching trending polls:", err);
            }
        }
        fetchTrendingPolls();
    }, []);

    const scroll = (direction) => {
        const { current } = scrollRef;
        if (current) {
            const scrollAmount = 300;
            current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    return (
        <div className="home-trending">
            <h2>Trending Polls</h2>
            <div className="trending-wrapper">
                <button className="scroll-btn left" onClick={() => scroll("left")}>
                    &#8249;
                </button>

                <div className="trending-list" ref={scrollRef}>
                    {trendingPolls.length > 0 ? (
                        trendingPolls.map((poll) => (
                            <div key={poll._id} className="trending-item" onClick={() => navigate(`/vote/${poll._id}`)}>
                                <h3>{poll.question}</h3>
                                <p>{poll.options.map(opt => opt.text).join(", ")}</p>
                            </div>
                        ))
                    ) : (
                        <p>No trending polls right now.</p>
                    )}
                </div>

                <button className="scroll-btn right" onClick={() => scroll("right")}>
                    &#8250;
                </button>
            </div>
        </div>
    );
}
