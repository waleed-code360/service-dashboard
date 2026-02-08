import React from 'react';

const Settings = () => {
    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h1 className="font-bold text-primary" style={{ fontSize: '1.5rem', marginBottom: 'var(--space-6)' }}>Settings</h1>

            <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
                <h3 className="font-medium text-primary" style={{ marginBottom: 'var(--space-2)' }}>Profile Settings</h3>
                <p className="text-sm text-secondary" style={{ marginBottom: 'var(--space-4)' }}>Update your personal information.</p>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <input type="text" className="input-field" placeholder="Full Name" defaultValue="Admin User" />
                    <input type="email" className="input-field" placeholder="Email" defaultValue="admin@example.com" />
                </div>
            </div>

            <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
                <h3 className="font-medium text-primary" style={{ marginBottom: 'var(--space-2)' }}>Notifications</h3>
                <p className="text-sm text-secondary" style={{ marginBottom: 'var(--space-4)' }}>Manage your email alerts.</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <input type="checkbox" id="n1" defaultChecked />
                    <label htmlFor="n1" className="text-sm">New Order Alerts</label>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input type="checkbox" id="n2" />
                    <label htmlFor="n2" className="text-sm">Marketing Emails</label>
                </div>
            </div>

            <button className="btn btn-primary">Save Changes</button>
        </div>
    );
};

export default Settings;
