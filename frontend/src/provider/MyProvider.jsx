import { createContext, useState } from "react";

export const MyContext = createContext();

export default function MyProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem("token") || null);
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    function login(userData, jwtToken) {
        setUser(userData);
        setToken(jwtToken);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", jwtToken);
    }

    function isLoggedIn() {
        return !!token;
    }

    function logout() {
        setUser(null);
        setToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    }

    const updateUser = (updatedUser) => {
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
    };

    return (
        <MyContext.Provider value={{ token, user, login, isLoggedIn, logout, setUser }}>
            {children}
        </MyContext.Provider>
    );
}
