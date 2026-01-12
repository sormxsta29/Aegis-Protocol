import React, { useEffect, useState } from 'react';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import axios from 'axios';
import { API_URL } from '../config/constants';
import './AnalyticsDashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/stats`);
      setStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Use mock data if API is unavailable
      setStats({
        total_users: 1243,
        total_transactions: 5678,
        total_donations: 2500000,
        total_disasters: 23
      });
      setLoading(false);
    }
  };

  // Token Distribution Chart
  const tokenDistributionData = {
    labels: ['Food', 'Medical', 'Education', 'Shelter', 'Utilities'],
    datasets: [{
      label: 'Token Distribution',
      data: [35000, 28000, 15000, 42000, 20000],
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)'
      ],
      borderWidth: 2
    }]
  };

  // Transactions Over Time Chart
  const transactionsData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    datasets: [{
      label: 'Transactions',
      data: [450, 680, 820, 950, 1100, 1350],
      fill: true,
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.4
    }]
  };

  // Donations by Category Chart
  const donationsByCategoryData = {
    labels: ['Emergency Relief', 'Medical Aid', 'Food Security', 'Shelter', 'Education'],
    datasets: [{
      label: 'Donations (USD)',
      data: [450000, 380000, 520000, 620000, 280000],
      backgroundColor: [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)'
      ]
    }]
  };

  // Disaster Events by Type Chart
  const disasterTypesData = {
    labels: ['Earthquake', 'Flood', 'Hurricane', 'Wildfire', 'Other'],
    datasets: [{
      data: [8, 12, 5, 3, 2],
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF'
      ],
      hoverOffset: 4
    }]
  };

  // User Growth Chart
  const userGrowthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Total Users',
      data: [120, 245, 456, 678, 945, 1243],
      borderColor: 'rgb(153, 102, 255)',
      backgroundColor: 'rgba(153, 102, 255, 0.5)',
      tension: 0.4
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top'
      }
    }
  };

  if (loading) {
    return <div className="analytics-loading">Loading analytics...</div>;
  }

  return (
    <div className="analytics-dashboard">
      <div className="analytics-header">
        <h2>📊 Platform Analytics</h2>
        <button onClick={fetchStats} className="refresh-btn">
          🔄 Refresh
        </button>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">👥</div>
          <div className="metric-value">{stats?.total_users?.toLocaleString() || 0}</div>
          <div className="metric-label">Total Users</div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">💸</div>
          <div className="metric-value">{stats?.total_transactions?.toLocaleString() || 0}</div>
          <div className="metric-label">Total Transactions</div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">💰</div>
          <div className="metric-value">${(stats?.total_donations || 0).toLocaleString()}</div>
          <div className="metric-label">Total Donations</div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">🌪️</div>
          <div className="metric-value">{stats?.total_disasters || 0}</div>
          <div className="metric-label">Disasters Tracked</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        <div className="chart-container">
          <h3>Token Distribution</h3>
          <div className="chart">
            <Pie data={tokenDistributionData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-container">
          <h3>Transactions Over Time</h3>
          <div className="chart">
            <Line data={transactionsData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-container">
          <h3>Donations by Category</h3>
          <div className="chart">
            <Bar data={donationsByCategoryData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-container">
          <h3>Disaster Events by Type</h3>
          <div className="chart">
            <Doughnut data={disasterTypesData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-container full-width">
          <h3>User Growth</h3>
          <div className="chart">
            <Line data={userGrowthData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Real-time Activity Feed */}
      <div className="activity-feed">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          <div className="activity-item">
            <span className="activity-icon">🔄</span>
            <div className="activity-content">
              <div className="activity-title">Token Transfer</div>
              <div className="activity-details">500 Food tokens transferred to 0x1234...5678</div>
              <div className="activity-time">2 minutes ago</div>
            </div>
          </div>
          <div className="activity-item">
            <span className="activity-icon">💰</span>
            <div className="activity-content">
              <div className="activity-title">New Donation</div>
              <div className="activity-details">$10,000 donated to Emergency Relief Campaign</div>
              <div className="activity-time">15 minutes ago</div>
            </div>
          </div>
          <div className="activity-item">
            <span className="activity-icon">🌪️</span>
            <div className="activity-content">
              <div className="activity-title">Disaster Alert</div>
              <div className="activity-details">Earthquake detected in California (Magnitude 5.2)</div>
              <div className="activity-time">1 hour ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
