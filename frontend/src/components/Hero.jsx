import { Link } from "react-router-dom";
import "./Hero.css";

export default function Hero() {
    return (
        <div className="home-hero">
            <div className="home-header">
                <h1 className="home-title">Make Decisions Together</h1>
                <p className="home-subtitle">Create polls, share with friends, and see result in real time</p>
            </div>

            <div className="home-actions">
                <Link to="/browse">Get Started</Link>
            </div>
        </div>
    );
}
