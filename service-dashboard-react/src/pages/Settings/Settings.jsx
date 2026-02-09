import React from 'react';

const Settings = () => {
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 className="font-bold text-primary" style={{ fontSize: '1.5rem', marginBottom: 'var(--space-6)' }}>Settings</h1>

            <div style={{ display: 'flex', gap: 'var(--space-6)', alignItems: 'flex-start' }}>
                {/* Visual Sidebar for Settings */}
                <div className="card" style={{ width: '240px', padding: 'var(--space-2)' }}>
                    <div className="nav-item active" style={{ backgroundColor: 'var(--primary-50)', color: 'var(--primary-900)', fontWeight: 600 }}>
                        <i className="ph ph-user nav-icon"></i> Profile
                    </div>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                    {/* Profile Section */}
                    <div className="card">
                        <div style={{ borderBottom: '1px solid var(--primary-100)', paddingBottom: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                            <h3 className="font-bold text-primary" style={{ fontSize: '1.1rem' }}>Profile Information</h3>
                            <p className="text-sm text-secondary">Update your photo and personal details.</p>
                        </div>

                        <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
                            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#E2E8F0', overflow: 'hidden' }}>
                                <img src="https://ui-avatars.com/api/?name=Admin+User&background=random&size=128" alt="Profile" />
                            </div>
                            <button className="btn btn-secondary text-sm">Change Photo</button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                            <div className="input-group">
                                <label className="input-label">First Name</label>
                                <input type="text" className="input-field" defaultValue="Admin" />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Last Name</label>
                                <input type="text" className="input-field" defaultValue="User" />
                            </div>
                            <div className="input-group" style={{ gridColumn: 'span 2' }}>
                                <label className="input-label">Email Address</label>
                                <input type="email" className="input-field" defaultValue="admin@example.com" />
                            </div>
                        </div>
                        <div style={{ textAlign: 'right', marginTop: 'var(--space-4)' }}>
                            <button className="btn btn-primary">Save Profile</button>
                        </div>
                    </div>

                    {/* Password Section */}
                    <div className="card">
                        <div style={{ borderBottom: '1px solid var(--primary-100)', paddingBottom: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                            <h3 className="font-bold text-primary" style={{ fontSize: '1.1rem' }}>Security</h3>
                            <p className="text-sm text-secondary">Manage your password.</p>
                        </div>
                        <div className="input-group">
                            <label className="input-label">Current Password</label>
                            <input type="password" className="input-field" />
                        </div>
                        <div className="input-group">
                            <label className="input-label">New Password</label>
                            <input type="password" className="input-field" />
                        </div>
                        <div style={{ textAlign: 'right', marginTop: 'var(--space-4)' }}>
                            <button className="btn btn-secondary">Update Password</button>
                        </div>
                    </div>

                    {/* Preferences Section */}
                    <div className="card">
                        <div style={{ borderBottom: '1px solid var(--primary-100)', paddingBottom: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                            <h3 className="font-bold text-primary" style={{ fontSize: '1.1rem' }}>Preferences</h3>
                            <p className="text-sm text-secondary">Manage your notifications.</p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <input type="checkbox" id="n1" defaultChecked style={{ width: '16px', height: '16px' }} />
                                <div>
                                    <label htmlFor="n1" className="font-medium text-primary" style={{ display: 'block' }}>Email Notifications</label>
                                    <p className="text-xs text-secondary">Receive emails about new orders.</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <input type="checkbox" id="n2" style={{ width: '16px', height: '16px' }} />
                                <div>
                                    <label htmlFor="n2" className="font-medium text-primary" style={{ display: 'block' }}>Marketing Emails</label>
                                    <p className="text-xs text-secondary">Receive offers and updates.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
