import { useState, useContext } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MyContext } from "../provider/MyProvider";
import "./Login.css";

export default function Login() {
    const [user, setUser] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");

    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useContext(MyContext);

    async function handleClick() {
        // console.log("submit page.")
        try {
            const res = await axios.post("http://localhost:5000/auth/loginUser", {
                email: user.email,
                password: user.password,
            });

            if (res.data.user && res.data.token) {
                login(res.data.user, res.data.token);
                // navigate("/");
                const redirectPath = location.state?.from || "/";
                navigate(redirectPath, { replace: true });
            }

            setMessage(res.data.msg);

        } catch (err) {
            console.error("Login error:", err);
            setMessage(err.response?.data?.msg || "Something went wrong. Please try again.");
        }
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Login</h2>
                <div className="login-form">
                    <input type="email" name="email" placeholder="Email" value={user.email} onChange={handleChange} required />
                    <input type="password" name="password" placeholder="Password" value={user.password} onChange={handleChange} required />
                    <button type="submit" className="login-btn" onClick={handleClick}>Login</button>
                </div>

                {message && <p className="msg">{message}</p>}
                <div className="login-links">
                    <Link to="/forgot-password" className="forget-link">Forget Password?</Link>
                    <Link to="/register" className="register-link">Sign Up</Link>
                </div>
            </div>
        </div >
    );
}
