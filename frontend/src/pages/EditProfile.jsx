import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MyContext } from "../provider/MyProvider";
import "./EditProfile.css";

export default function EditProfile() {
    const { user, token, isLoggedIn, setUser } = useContext(MyContext);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn()) {
            navigate("/login");
            return;
        }

        if (user) {
            setName(user.name);
            setEmail(user.email);
        }
    }, [user, isLoggedIn, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put("https://polleasy-5.onrender.com/auth/updateProfile", {
                name,
                email,
                ...(password && { password })
            },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                setUser(res.data.updatedUser);
                setMessage("Profile updated successfully!");
                setTimeout(() => navigate("/profile"), 1000);
            }
        } catch (err) {
            console.error(err);
            setMessage(err.response?.data?.msg || "Error updating profile");
        }
    };

    return (
        <div className="edit-profile-container">
            <div className="edit-profile-card">
                {message && <p className="message">{message}</p>}
                <form onSubmit={handleSubmit} className="edit-profile-form">
                    <label>
                        Name:
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                    </label>
                    <label>
                        Email:
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </label>
                    <label>
                        Password: <small>(Leave blank to keep current)</small>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </label>
                    <button type="submit">Save Changes</button>
                    <button type="button" onClick={() => navigate("/profile")}>Cancel</button>
                </form>
            </div>
        </div>
    );
}
