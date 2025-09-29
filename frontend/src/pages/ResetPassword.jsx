import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ResetPassword.css";

export default function ResetPassword() {
    const { token } = useParams();
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");

    async function handleReset() {
        try {
            const res = await axios.post(`http://localhost:5000/auth/reset-password/${token}`, {
                newPassword
            });
            setMessage(res.data.msg);
        } catch (err) {
            console.error("Reset password error:", err);
            setMessage(err.response?.data?.msg || "Something went wrong.");
        }
    }

    return (
        <div className="reset-container">
            <div className="reset-card">
                <h2>Reset Password</h2>
                <input type="password" placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/>
                <button onClick={handleReset}>Reset Password</button>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
}
