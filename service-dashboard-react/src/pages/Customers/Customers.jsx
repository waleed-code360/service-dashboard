import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        try {
            const data = await api.getCustomers();
            setCustomers(data);
        } catch (error) {
            console.error("Failed to fetch customers", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddCustomer = async () => {
        // Simple mock interaction for now
        const name = prompt("Enter customer name:");
        if (!name) return;

        try {
            await api.createCustomer({ name, email: `${name.toLowerCase().replace(' ', '.')}@example.com` });
            loadCustomers(); // Reload list
        } catch (error) {
            alert("Failed to create customer");
        }
    };

    if (loading) return <div style={{ padding: '24px', textAlign: 'center' }}>Loading Customers...</div>;

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
                <h1 className="font-bold text-primary" style={{ fontSize: '1.5rem' }}>Customers</h1>
                <button className="btn btn-primary" onClick={handleAddCustomer} style={{ boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.4)', padding: '8px 16px' }}>
                    <i className="ph ph-plus-circle" style={{ marginRight: 'var(--space-2)', fontSize: '1.2rem' }}></i>
                    <span style={{ fontWeight: 600 }}>New Customer</span>
                </button>
            </div>

            {/* Filters */}
            <div className="card" style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-6)', display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <i className="ph ph-magnifying-glass" style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--primary-500)' }}></i>
                    <input type="text" className="input-field" placeholder="Search by name, email, or phone" style={{ paddingLeft: '36px' }} />
                </div>
                <select className="input-field" style={{ width: '150px' }}>
                    <option>Status: All</option>
                    <option>Active</option>
                    <option>Inactive</option>
                </select>
                <button className="btn btn-secondary">
                    <i className="ph ph-faders" style={{ marginRight: 'var(--space-2)' }}></i> Filters
                </button>
            </div>

            {/* Customer Table */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: 'var(--primary-50)' }}>
                        <tr>
                            <th style={{ textAlign: 'left', padding: 'var(--space-3) var(--space-3) var(--space-3) var(--space-6)', borderBottom: '1px solid var(--primary-100)', color: 'var(--primary-500)', fontWeight: 500, fontSize: '0.875rem' }}>Customer Name</th>
                            <th style={{ textAlign: 'left', padding: 'var(--space-3)', borderBottom: '1px solid var(--primary-100)', color: 'var(--primary-500)', fontWeight: 500, fontSize: '0.875rem' }}>Email</th>
                            <th style={{ textAlign: 'left', padding: 'var(--space-3)', borderBottom: '1px solid var(--primary-100)', color: 'var(--primary-500)', fontWeight: 500, fontSize: '0.875rem' }}>Phone</th>
                            <th style={{ textAlign: 'left', padding: 'var(--space-3)', borderBottom: '1px solid var(--primary-100)', color: 'var(--primary-500)', fontWeight: 500, fontSize: '0.875rem' }}>Status</th>
                            <th style={{ textAlign: 'left', padding: 'var(--space-3)', borderBottom: '1px solid var(--primary-100)', color: 'var(--primary-500)', fontWeight: 500, fontSize: '0.875rem' }}>Joined</th>
                            <th style={{ textAlign: 'right', padding: 'var(--space-3) var(--space-6) var(--space-3) var(--space-3)', borderBottom: '1px solid var(--primary-100)', color: 'var(--primary-500)', fontWeight: 500, fontSize: '0.875rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map(customer => (
                            <tr key={customer.id} className="hover-row" style={{ borderBottom: '1px solid var(--primary-100)' }}>
                                <td style={{ padding: 'var(--space-3) var(--space-3) var(--space-3) var(--space-6)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                        <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--primary-300)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 600 }}>
                                            {customer.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-medium text-primary">{customer.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="text-secondary" style={{ padding: 'var(--space-3)' }}>{customer.email}</td>
                                <td className="text-secondary" style={{ padding: 'var(--space-3)' }}>{customer.phone || '-'}</td>
                                <td style={{ padding: 'var(--space-3)' }}>
                                    <span className="status-badge" style={{
                                        backgroundColor: customer.status === 'active' ? '#D1FAE5' : '#FEF3C7',
                                        color: customer.status === 'active' ? '#059669' : '#D97706',
                                        padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600
                                    }}>
                                        {customer.status}
                                    </span>
                                </td>
                                <td style={{ padding: 'var(--space-3)' }}>{new Date(customer.created_at).toLocaleDateString()}</td>
                                <td style={{ textAlign: 'right', padding: 'var(--space-3) var(--space-6) var(--space-3) var(--space-3)' }}>
                                    <button className="btn btn-secondary" style={{ padding: '4px 8px' }}>Edit</button>
                                </td>
                            </tr>
                        ))}

                        {customers.length === 0 && (
                            <tr>
                                <td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: 'var(--secondary)' }}>
                                    No customers found. Click "Add Customer" to create one.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                <div style={{ padding: 'var(--space-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--primary-100)' }}>
                    <span className="text-sm text-secondary">Showing {customers.length} customers</span>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                        <button className="btn btn-secondary" disabled>Previous</button>
                        <button className="btn btn-secondary" disabled>Next</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Customers;
