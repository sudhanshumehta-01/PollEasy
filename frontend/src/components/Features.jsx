import "./Features.css";

export default function Features() {
    return (
        <div className="home-features">
            <h2>Features</h2>
            <div className="features-grid">
                <div className="feature-Fast">
                    <h3>⚡Fast</h3>
                    <p>Create and join polls instantly without delay.</p>
                </div>

                <div className="feature-Secure">
                    <h3>🔒 Secure</h3>
                    <p>Your votes and data are protected with encryption.</p>
                </div>

                <div className="feature-Analytics">
                    <h3>📊 Analytics</h3>
                    <p>Track results in real-time with insightful charts.</p>
                </div>

                <div className="feature-Shareable">
                    <h3>🌍 Shareable</h3>
                    <p>Easily share polls with anyone, anywhere.</p>
                </div>
            </div>
        </div>
    );
}
