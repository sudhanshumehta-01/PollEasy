import { Link, useNavigate } from "react-router-dom";
import "./NavBar.css";
import { useContext, useRef, useState } from "react";
import { MyContext } from "../provider/MyProvider";

export default function NavBar() {
    const { user, logout, isLoggedIn } = useContext(MyContext);
    const [dropdown, setDropdown] = useState(false);
    const navigate = useNavigate();
    const menuRef = useRef(null);

    function handleLogout() {
        console.log("logoutt");
        logout();
        navigate("/");
        setDropdown(false);
    }

    function handleBlur(e) {
        if (!menuRef.current.contains(e.relatedTarget)) {
            setDropdown(false);
        }
    }

    return (
        <nav className="navbar">
            <h2>PollEasy</h2>

            <div className="nav-links">
                <Link to="/">Home</Link>
                <Link to="/createPolls">Create Polls</Link>
                <Link to="/browse">Browse</Link>
                {isLoggedIn() && user?.role === "admin" && (
                    <Link to="/admin">Admin</Link>
                )}

                {!isLoggedIn() ? (
                    <Link to="/login">Login/Register</Link>
                ) : (
                    <div className="profile-menu" ref={menuRef} tabIndex={0} onBlur={handleBlur}>
                        <button className="profile-btn" onClick={() => setDropdown(true)} >
                            {user?.name || "User"}
                        </button>

                        {dropdown && (
                            <div className="dropdown">
                                <Link to="/profile">Profile</Link>
                                <button onClick={handleLogout}>Logout</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}
