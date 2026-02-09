import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const MainLayout = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false); // New state for mobile
    const location = useLocation();

    // Close mobile sidebar on route change
    React.useEffect(() => {
        setMobileOpen(false);
    }, [location]);

    const isActive = (path) => location.pathname === path;

    return (
        <div className="dashboard-container">
            {/* Mobile Overlay */}
            <div
                className={`sidebar-overlay ${mobileOpen ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
            ></div>

            {/* Sidebar */}
            <aside
                className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}
                style={{
                    width: sidebarCollapsed ? '80px' : '260px',
                    // On mobile, width is handled by CSS (260px fixed), 
                    // on desktop inline style applies.
                    // We need to ensure inline style doesn't break mobile.
                    // The !important in CSS handles this, so we are good.
                }}
            >
                <div className="sidebar-header" style={{ justifyContent: sidebarCollapsed ? 'center' : 'flex-start', padding: '24px 24px' }}>
                    <div className="logo" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="ph ph-lightning" style={{ color: 'var(--accent-500)' }}></i>
                        {!sidebarCollapsed && <span>ServiceDash</span>}
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
                                {/* Badge optional */}
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

                <div className="sidebar-footer" style={{ padding: '24px', marginTop: 'auto' }}>
                    <div className="nav-item" style={{ color: '#EF4444' }}>
                        <i className="ph ph-sign-out nav-icon"></i>
                        {!sidebarCollapsed && <span>Log Out</span>}
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content" style={{ marginLeft: sidebarCollapsed ? '80px' : '260px' }}>
                {/* Topbar */}
                <header className="topbar">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        {/* Mobile Toggle Button */}
                        <button
                            className="btn btn-secondary mobile-only"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            style={{ display: 'none' }} // Hidden by default, shown via CSS media query if needed
                        >
                            <i className="ph ph-list" style={{ fontSize: '1.25rem' }}></i>
                        </button>

                        {/* Desktop Toggle Button */}
                        <button
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            className="btn btn-secondary desktop-only"
                            style={{ padding: '4px 8px' }}
                        >
                            <i className={`ph ${sidebarCollapsed ? 'ph-list' : 'ph-caret-left'}`}></i>
                        </button>

                        <div className="search-bar">
                            <i className="ph ph-magnifying-glass" style={{ color: 'var(--primary-500)', marginRight: '8px' }}></i>
                            <input type="text" className="input-field" placeholder="Search..." style={{ border: 'none', background: 'transparent', padding: 0 }} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                        <i className="ph ph-bell" style={{ fontSize: '1.5rem', color: 'var(--primary-500)', cursor: 'pointer' }}></i>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                            <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--primary-300)', borderRadius: '50%', overflow: 'hidden' }}>
                                <img src="https://ui-avatars.com/api/?name=Admin+User&background=random" alt="Admin" />
                            </div>
                            <span className="font-medium text-sm mobile-hidden">Admin User</span>
                        </div>
                    </div>
                </header>

                <div className="container" style={{ paddingTop: 'var(--space-6)', paddingBottom: 'var(--space-6)' }}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
