import React, { useEffect, useState } from 'react';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
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

    if (loading) {
        return (
            <div className="card" style={{ padding: 'var(--space-6)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
                    <Skeleton width="150px" height="24px" />
                    <Skeleton width="120px" height="40px" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
                            <Skeleton width="40px" height="40px" style={{ borderRadius: '50%' }} />
                            <div style={{ flex: 1 }}>
                                <Skeleton width="30%" height="16px" style={{ marginBottom: '4px' }} />
                                <Skeleton width="20%" height="12px" />
                            </div>
                            <Skeleton width="100px" height="24px" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
                <h1 className="font-bold text-primary" style={{ fontSize: '1.5rem' }}>Customers</h1>
                <button className="btn btn-primary" onClick={handleAddCustomer} style={{ boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.4)', padding: '10px 20px', fontSize: '0.95rem' }}>
                    <i className="ph ph-plus-circle" style={{ marginRight: 'var(--space-2)', fontSize: '1.2rem' }}></i>
                    <span style={{ fontWeight: 600 }}>New Customer</span>
                </button>
            </div>

            {/* Filters */}
            <div className="card" style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-6)', display: 'flex', gap: 'var(--space-4)', alignItems: 'center', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <i className="ph ph-magnifying-glass" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary-500)', fontSize: '1.2rem' }}></i>
                    <input type="text" className="input-field" placeholder="Search customers by name, email, or phone..." style={{ paddingLeft: '48px', height: '48px', fontSize: '1rem', border: '1px solid #CBD5E1', borderRadius: '8px', width: '100%' }} />
                </div>
                <select className="input-field" style={{ width: '180px', height: '48px', fontSize: '0.95rem' }}>
                    <option>Status: All</option>
                    <option>Active</option>
                    <option>Inactive</option>
                </select>
                <button className="btn btn-secondary" style={{ height: '48px' }}>
                    <i className="ph ph-faders" style={{ marginRight: 'var(--space-2)' }}></i> Filters
                </button>
            </div>

            {/* Customer Table */}
            {customers.length === 0 ? (
                <EmptyState
                    icon="ph-users"
                    title="No Customers Found"
                    description="You haven't added any customers yet. Add your first customer to get started."
                    action={
                        <button className="btn btn-primary" onClick={handleAddCustomer}>
                            <i className="ph ph-plus" style={{ marginRight: '8px' }}></i> Add First Customer
                        </button>
                    }
                />
            ) : (
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ backgroundColor: 'var(--primary-50)', position: 'sticky', top: 0, zIndex: 10 }}>
                            <tr>
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
