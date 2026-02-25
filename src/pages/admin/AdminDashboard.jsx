import React, { useEffect, useState } from "react";
import api from "../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, chartRes] = await Promise.all([
          api.get("/admin/stats"),
          api.get("/admin/revenue"), // your revenue endpoint
        ]);

        setStats(statsRes.data);
        setChartData(chartRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load admin data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div style={{ padding: 20 }}>Loading admin dashboard...</div>;
  }

  if (error) {
    return <div style={{ padding: 20, color: "red" }}>{error}</div>;
  }

  return (
    <div className="admin-container">
      <h2 className="admin-title">Admin Dashboard</h2>

      {/* ===== STATS CARDS ===== */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{stats.totalUsers}</p>
        </div>

        <div className="stat-card">
          <h3>Total Investments</h3>
          <p>{stats.totalInvestments}</p>
        </div>

        <div className="stat-card">
          <h3>Total Invested</h3>
          <p>₹{stats.totalInvested}</p>
        </div>

        <div className="stat-card">
          <h3>Total Earnings Paid</h3>
          <p>₹{stats.totalEarnings}</p>
        </div>

        <div className="stat-card">
          <h3>Total Withdrawn</h3>
          <p>₹{stats.totalWithdrawn}</p>
        </div>

        <div className="stat-card">
          <h3>Pending Withdrawals</h3>
          <p>{stats.pendingWithdrawals}</p>
        </div>
      </div>

      {/* ===== REVENUE CHART ===== */}
      <div className="chart-container">
        <h3>Daily Investment Revenue</h3>

        {chartData.length === 0 ? (
          <p>No data available</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#1b5e20"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
