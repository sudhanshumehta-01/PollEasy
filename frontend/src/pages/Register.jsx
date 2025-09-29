import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";

export default function Register() {
    const [user, setUser] = useState({ name: "", email: "", password: "", confirmPassword: "" });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    async function handleClick() {
        if (user.name === "") {
            setMessage("Name is required");
            return;
        }

        if (user.email === "") {
            setMessage("Email is required");
            return;
        }

        if (user.password !== user.confirmPassword) {
            setMessage("Passwords do not match");
            return;
        }

        try {
            const res = await axios.post("http://localhost:5000/auth/registerUser", {
                name: user.name,
                email: user.email,
                password: user.password,
            });

            setMessage(res.data.msg);
            setUser({ name: "", email: "", password: "", confirmPassword: "" });
            navigate("/login");
        } catch (err) {
            setMessage(err.response?.data?.msg || "Something went wrong");
        }
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    }

    return (
        <div className="register-container">
            <div className="register-card">
                <h2>Sign Up</h2>
                <div className="register-form">
                    <input type="text" name="name" placeholder="Full Name" value={user.name} onChange={handleChange} required />
                    <input type="email" name="email" placeholder="Email" value={user.email} onChange={handleChange} required />
                    <input type="password" name="password" placeholder="Password" value={user.password} onChange={handleChange} required />
                    <input type="password" name="confirmPassword" placeholder="Confirm Password" value={user.confirmPassword} onChange={handleChange} required />
                    <button type="submit" className="register-btn" onClick={handleClick}>Register</button>
                </div>
                {message && <p className="msg">{message}</p>}
                <div className="register-links">
                    <Link to="/login" className="auth-link">Already have an account? Login</Link>
                </div>
            </div>
        </div>
    );
}
