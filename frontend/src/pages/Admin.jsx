import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import "./Admin.css";
import { MyContext } from "../provider/MyProvider";
import { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Admin() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalPolls: 0,
        totalVotes: 0,
        pollParticipation: [],
        voteDistribution: []
    });
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isLoggedIn } = useContext(MyContext);

    useEffect(() => {
        if (!isLoggedIn() || !user || user.role !== "admin") {
            navigate("/login", { state: { from: location.pathname } });
            return;
        }
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await axios.get("http://localhost:5000/admin/getAdminStats", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log("Admin stats fetched:", res.data);
                setStats(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        if (user && user.role === "admin") {
            fetchStats();
        }
    }, [user, isLoggedIn, navigate, location]);

    const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

    return (
        <div className="admin-container">
            <h2 className="admin-title">Admin Dashboard</h2>

            <div className="admin-stats">
                <div className="stat-card">
                    <h4>Total Users</h4>
                    <p>{stats.totalUsers}</p>
                </div>
                <div className="stat-card">
                    <h4>Total Polls</h4>
                    <p>{stats.totalPolls}</p>
                </div>
                <div className="stat-card">
                    <h4>Total Votes</h4>
                    <p>{stats.totalVotes}</p>
                </div>
            </div>

            <div className="charts">
                <div className="chart-box">
                    <h3 className="bar-chart-box-header">Poll Participation (Top 5)</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={stats.pollParticipation} barCategoryGap="25%">
                            <XAxis dataKey="poll" tick={false} />
                            <YAxis tick={false} />
                            <Tooltip />
                            <Bar dataKey="votes" radius={[8, 8, 0, 0]}>
                                {stats.pollParticipation.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-box">
                    <h3 className="pie-chart-box-header">Vote Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={stats.voteDistribution} dataKey="value">
                                {stats.voteDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
