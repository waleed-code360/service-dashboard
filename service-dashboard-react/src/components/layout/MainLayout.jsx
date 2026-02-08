import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const MainLayout = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside
                className="sidebar"
                style={{ width: sidebarCollapsed ? '80px' : '260px' }}
            >
                <div className="sidebar-header" style={{ justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}>
                    <div className="logo">
                        {sidebarCollapsed ? <span>SD</span> : <>Service<span>Dash</span></>}
                    </div>
                </div>

                <nav className="nav-list">
                    <Link to="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}>
                        <i className="ph ph-squares-four nav-icon"></i>
                        {!sidebarCollapsed && <span>Dashboard</span>}
                    </Link>
                    <Link to="/customers" className={`nav-item ${isActive('/customers') ? 'active' : ''}`}>
                        <i className="ph ph-users nav-icon"></i>
                        {!sidebarCollapsed && <span>Customers</span>}
                    </Link>
                    <Link to="/operations" className={`nav-item ${isActive('/operations') ? 'active' : ''}`}>
                        <i className="ph ph-clipboard-text nav-icon"></i>
                        {!sidebarCollapsed && (
                            <>
                                <span>Orders</span>
                                <span style={{ marginLeft: 'auto', background: 'var(--accent-500)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem', color: 'white' }}>3</span>
                            </>
                        )}
                    </Link>
                    <Link to="/chat" className={`nav-item ${isActive('/chat') ? 'active' : ''}`}>
                        <i className="ph ph-chat-circle-dots nav-icon"></i>
                        {!sidebarCollapsed && <span>Team Chat</span>}
                    </Link>
                    <Link to="/settings" className={`nav-item ${isActive('/settings') ? 'active' : ''}`}>
                        <i className="ph ph-gear nav-icon"></i>
                        {!sidebarCollapsed && <span>Settings</span>}
                    </Link>
                </nav>

                <div className="sidebar-footer">
                    <div className="nav-item" style={{ color: 'var(--danger-500)' }}>
                        <i className="ph ph-sign-out nav-icon"></i>
                        {!sidebarCollapsed && <span>Log Out</span>}
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content" style={{ marginLeft: sidebarCollapsed ? '80px' : '260px' }}>
                {/* Topbar */}
                <header className="topbar">
                    <div className="search-bar">
                        <i className="ph ph-magnifying-glass" style={{ color: 'var(--primary-500)' }}></i>
                        <input type="text" className="search-input" placeholder="Search..." />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                        <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="btn btn-secondary" style={{ padding: '4px 8px', marginRight: '16px' }}>
                            <i className={`ph ${sidebarCollapsed ? 'ph-list' : 'ph-caret-left'}`}></i>
                        </button>
                        <i className="ph ph-bell" style={{ fontSize: '1.5rem', color: 'var(--primary-500)', cursor: 'pointer' }}></i>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                            <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--primary-300)', borderRadius: '50%' }}></div>
                            <span className="font-medium text-sm">Admin User</span>
                        </div>
                    </div>
                </header>

                <div className="container" style={{ paddingTop: 'var(--space-6)' }}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
