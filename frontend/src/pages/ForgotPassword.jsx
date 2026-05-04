import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Login.css";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    async function handleReset() {
        try {
            const res = await axios.post("https://polleasy-5.onrender.com/auth/forgot-password", {
                email,
            });
            setMessage(res.data.msg || "Check your Gmail for the reset link.");
        } catch (err) {
            console.error("Forgot password error:", err);
            setMessage(err.response?.data?.msg || "Something went wrong. Try again.");
        }
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Reset Password</h2>
                <p>Enter your email and we’ll send you a link to reset your password.</p>

                <div className="login-form">
                    <input type="email" name="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <button type="submit" className="login-btn" onClick={handleReset}>
                        Send Reset Link
                    </button>
                </div>

                {message && <p className="msg">{message}</p>}

                <div className="login-links">
                    <Link to="/login" className="register-link">Back to Login</Link>
                </div>
            </div>
        </div>
    );
}
