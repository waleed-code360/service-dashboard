const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
// Note: When running locally with --host, you might need to manually set this in .env.local 
// or just rely on localhost if accessing from the same machine.
// For network access (Safari), we'll set VITE_API_URL.


export const api = {
    // Dashboard
    getDashboardStats: async () => {
        const response = await fetch(`${API_URL}/dashboard/stats`);
        if (!response.ok) throw new Error('Failed to fetch stats');
        return response.json();
    },

    // Customers
    getCustomers: async () => {
        const response = await fetch(`${API_URL}/customers`);
        if (!response.ok) throw new Error('Failed to fetch customers');
        return response.json();
    },

    createCustomer: async (customerData) => {
        const response = await fetch(`${API_URL}/customers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(customerData),
        });
        if (!response.ok) throw new Error('Failed to create customer');
        return response.json();
    },

    // Orders (Kanban)
    getOrders: async () => {
        const response = await fetch(`${API_URL}/orders`);
        if (!response.ok) throw new Error('Failed to fetch orders');
        return response.json();
    },

    createOrder: async (orderData) => {
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData),
        });
        if (!response.ok) throw new Error('Failed to create order');
        return response.json();
    },

    updateOrderStatus: async (orderId, status) => {
        const response = await fetch(`${API_URL}/orders/${orderId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
        });
        if (!response.ok) throw new Error('Failed to update order status');
        return response.json();
    }
};
