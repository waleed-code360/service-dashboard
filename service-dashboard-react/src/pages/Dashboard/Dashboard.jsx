import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { api } from '../../services/api';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await api.getDashboardStats();
                setStats(data);
            } catch (error) {
                console.error("Failed to load dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return <div style={{ padding: 'var(--space-6)', textAlign: 'center' }}>Loading Dashboard...</div>;
    }

    const safeStats = stats || {
        revenue: Array(12).fill(0),
        total_revenue_amount: "$0",
        active_orders: 0,
        new_customers: 0,
        pending_reviews: 0
    };

    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Revenue',
                data: safeStats.revenue,
                borderColor: '#10B981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 3,
                pointHoverRadius: 6,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#1E293B',
                padding: 12,
                titleFont: { family: 'Inter', size: 13 },
                bodyFont: { family: 'Inter', size: 13 },
                cornerRadius: 4,
                displayColors: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: '#F1F5F9', borderDash: [2, 2] },
                ticks: { color: '#64748B', font: { family: 'Inter', size: 11 } },
                border: { display: false },
            },
            x: {
                grid: { display: false },
                ticks: { color: '#64748B', font: { family: 'Inter', size: 11 } },
                border: { display: false },
            },
        },
    };

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
                <h1 className="font-bold text-primary" style={{ fontSize: '1.5rem' }}>Dashboard Overview</h1>
                <button className="btn btn-primary">
                    <i className="ph ph-plus" style={{ marginRight: '8px' }}></i> New Order
                </button>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
                {/* Highlighted Primary Stat */}
                <div className="card stat-card" style={{ backgroundColor: 'var(--primary-900)', color: 'white', border: 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-2)' }}>
                        <div>
                            <p style={{ color: 'var(--primary-300)', fontSize: '0.875rem', fontWeight: 500 }}>Total Revenue</p>
                            <h3 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginTop: 'var(--space-1)', color: 'white' }}>{safeStats.total_revenue_amount}</h3>
                        </div>
                        <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '12px', color: '#10B981' }}>
                            <i className="ph ph-currency-dollar" style={{ fontSize: '1.5rem' }}></i>
                        </div>
                    </div>
                    <p className="text-xs" style={{ color: 'var(--primary-300)' }}>
                        <span style={{ color: '#10B981', fontWeight: 600, backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>+12.5%</span> from last month
                    </p>
                </div>

                <div className="card stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-2)' }}>
                        <div>
                            <p className="text-secondary text-sm font-medium">Active Orders Today</p>
                            <h3 className="font-bold text-primary" style={{ fontSize: '1.5rem', marginTop: 'var(--space-1)' }}>{safeStats.active_orders}</h3>
                        </div>
                        <div style={{ backgroundColor: '#EFF6FF', padding: '10px', borderRadius: '12px', color: '#2563EB' }}>
                            <i className="ph ph-shopping-cart" style={{ fontSize: '1.5rem' }}></i>
                        </div>
                    </div>
                    <p className="text-xs text-secondary"><span style={{ color: '#059669', fontWeight: 600 }}>+5</span> new today</p>
                </div>

                <div className="card stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-2)' }}>
                        <div>
                            <p className="text-secondary text-sm font-medium">Total Customers</p>
                            <h3 className="font-bold text-primary" style={{ fontSize: '1.5rem', marginTop: 'var(--space-1)' }}>{safeStats.new_customers}</h3>
                        </div>
                        <div style={{ backgroundColor: '#EEF2FF', padding: '10px', borderRadius: '12px', color: '#4F46E5' }}>
                            <i className="ph ph-users" style={{ fontSize: '1.5rem' }}></i>
                        </div>
                    </div>
                    <p className="text-xs text-secondary"><span style={{ color: '#059669', fontWeight: 600 }}>+2.4%</span> from last month</p>
                </div>

                <div className="card stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-2)' }}>
                        <div>
                            <p className="text-secondary text-sm font-medium">Attention Required</p>
                            <h3 className="font-bold text-primary" style={{ fontSize: '1.5rem', marginTop: 'var(--space-1)' }}>{safeStats.pending_reviews}</h3>
                        </div>
                        <div style={{ backgroundColor: '#FFFBEB', padding: '10px', borderRadius: '12px', color: '#D97706' }}>
                            <i className="ph ph-warning-circle" style={{ fontSize: '1.5rem' }}></i>
                        </div>
                    </div>
                    <p className="text-xs text-secondary">Pending reviews/issues</p>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="content-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-6)' }}>
                {/* Revenue Chart */}
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                        <h3 className="font-bold text-primary">Revenue Analytics</h3>
                        <select className="input-field" style={{ width: 'auto', padding: '4px 8px', fontSize: '0.875rem' }}>
                            <option>This Year</option>
                            <option>Last Year</option>
                        </select>
                    </div>
                    <div style={{ height: '300px' }}>
                        <Line data={chartData} options={chartOptions} />
                    </div>
                </div>

                {/* Recent Orders - Static for now */}
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                        <h3 className="font-bold text-primary">Recent Orders</h3>
                        <a href="#" className="text-sm text-accent hover:underline">View All</a>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', paddingBottom: 'var(--space-3)', borderBottom: '1px solid var(--primary-100)' }}>
                            <div style={{ width: '40px', height: '40px', backgroundColor: '#E0E7FF', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4338CA' }}>
                                <i className="ph ph-paint-brush"></i>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div className="font-medium text-primary text-sm">Website Redesign</div>
                                <div className="text-xs text-secondary">TechCorp Inc.</div>
                            </div>
                            <span className="status-badge" style={{ backgroundColor: '#DBEAFE', color: '#1E40AF', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem' }}>In Progress</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', paddingBottom: 'var(--space-3)', borderBottom: '1px solid var(--primary-100)' }}>
                            <div style={{ width: '40px', height: '40px', backgroundColor: '#ECFDF5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
                                <i className="ph ph-magnifying-glass"></i>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div className="font-medium text-primary text-sm">SEO Audit</div>
                                <div className="text-xs text-secondary">GrowthMarketing</div>
                            </div>
                            <span className="status-badge" style={{ backgroundColor: '#FEF3C7', color: '#D97706', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem' }}>Pending</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                            <div style={{ width: '40px', height: '40px', backgroundColor: '#FEE2E2', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B91C1C' }}>
                                <i className="ph ph-code"></i>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div className="font-medium text-primary text-sm">Server Migration</div>
                                <div className="text-xs text-secondary">RetailGiant</div>
                            </div>
                            <span className="status-badge" style={{ backgroundColor: '#D1FAE5', color: '#059669', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem' }}>Done</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
