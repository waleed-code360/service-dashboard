import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

const Operations = () => {
    const [columns, setColumns] = useState({
        new_requests: [],
        in_progress: [],
        review: [],
        completed: []
    });
    const [loading, setLoading] = useState(true);
    const [draggedTask, setDraggedTask] = useState(null);
    const [draggedSourceColumn, setDraggedSourceColumn] = useState(null);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const orders = await api.getOrders();
            // Transform flat list to columns
            const newColumns = {
                new_requests: [],
                in_progress: [],
                review: [],
                completed: []
            };

            orders.forEach(order => {
                const status = order.status || 'new_requests';
                if (newColumns[status]) {
                    newColumns[status].push(order);
                }
            });
            setColumns(newColumns);
        } catch (error) {
            console.error("Failed to load orders", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDragStart = (e, task, sourceColumnId) => {
        setDraggedTask(task);
        setDraggedSourceColumn(sourceColumnId);
        e.dataTransfer.effectAllowed = 'move';
        e.target.classList.add('dragging');
    };

    const handleDragEnd = (e) => {
        e.target.classList.remove('dragging');
        setDraggedTask(null);
        setDraggedSourceColumn(null);
        document.querySelectorAll('.kanban-column').forEach(col => col.classList.remove('drag-over'));
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        const column = e.target.closest('.kanban-column');
        if (column) column.classList.add('drag-over');
    };

    const handleDragLeave = (e) => {
        const column = e.target.closest('.kanban-column');
        if (column) column.classList.remove('drag-over');
    }

    const handleDrop = async (e, targetColumnId) => {
        e.preventDefault();
        document.querySelectorAll('.kanban-column').forEach(col => col.classList.remove('drag-over'));

        if (!draggedTask || !draggedSourceColumn) return;
        if (draggedSourceColumn === targetColumnId) return;

        // Optimistic UI Update
        const sourceList = [...columns[draggedSourceColumn]];
        const targetList = [...columns[targetColumnId]];

        const taskIndex = sourceList.findIndex(t => t.id === draggedTask.id);
        if (taskIndex === -1) return;

        const [movedTask] = sourceList.splice(taskIndex, 1);
        // Update local object status
        const updatedTask = { ...movedTask, status: targetColumnId };
        targetList.push(updatedTask);

        setColumns({
            ...columns,
            [draggedSourceColumn]: sourceList,
            [targetColumnId]: targetList
        });

        // API Call
        try {
            await api.updateOrderStatus(draggedTask.id, targetColumnId);
        } catch (error) {
            console.error("Failed to update status", error);
            alert("Failed to save move. Refreshing...");
            loadOrders(); // Revert on failure
        }
    };

    const handleAddOrder = async () => {
        // Simple prompt for now - ideally a modal
        const title = prompt("Enter Order Title:");
        if (!title) return;

        const clientName = prompt("Enter Client Name (optional):") || "New Client";

        const newOrder = {
            title,
            status: 'new_requests',
            priority: 'normal',
            tags: ['New']
        };

        try {
            // Check if client exists or create one (skipped for simplicity, just passed as string in a real app we'd need ID)
            // For this demo, we'll create the order directly. 
            // Note: Our DB schema expects client_id (UUID). 
            // fallback: in a real app, we'd select a client from a dropdown. 
            // For now, we will assume the backend allows NULL client_id or we pick the first one if available.

            // Fetch a customer to link (mock logic to make it work)
            const customers = await api.getCustomers();
            let clientId = null;
            if (customers.length > 0) {
                clientId = customers[0].id;
            } else {
                // Create a dummy customer if none
                const c = await api.createCustomer({ name: clientName });
                clientId = c.id;
            }

            await api.createOrder({ ...newOrder, client_id: clientId });
            loadOrders();
        } catch (error) {
            console.error("Failed to create order", error);
            alert("Failed to create order. Check console.");
        }
    };

    const getColumnTitle = (key) => {
        const titles = { new_requests: 'New Requests', in_progress: 'In Progress', review: 'Review', completed: 'Completed' };
        return titles[key] || key;
    };

    if (loading) return <div style={{ padding: '24px', textAlign: 'center' }}>Loading Board...</div>;

    return (
        <>
            {/* Header Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
                <h1 className="font-bold text-primary" style={{ fontSize: '1.5rem' }}>Operations Board</h1>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <button className="btn btn-primary" onClick={handleAddOrder}>
                        <i className="ph ph-plus" style={{ marginRight: 'var(--space-2)' }}></i> New Request
                    </button>
                    <button className="btn btn-secondary active" style={{ backgroundColor: 'var(--primary-100)' }}>
                        <i className="ph ph-kanban" style={{ marginRight: 'var(--space-2)' }}></i> Board
                    </button>
                    <button className="btn btn-secondary">
                        <i className="ph ph-list-dashes" style={{ marginRight: 'var(--space-2)' }}></i> List
                    </button>
                </div>
            </div>

            {/* Kanban Board */}
            <div className="kanban-board" style={{
                display: 'flex',
                gap: 'var(--space-6)',
                overflowX: 'auto',
                paddingBottom: 'var(--space-6)',
                height: 'calc(100vh - 180px)'
            }}>
                {Object.keys(columns).map(columnId => (
                    <div
                        key={columnId}
                        className="kanban-column"
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, columnId)}
                        style={{
                            flex: '0 0 320px',
                            backgroundColor: 'var(--primary-100)',
                            borderRadius: 'var(--radius-lg)',
                            display: 'flex',
                            flexDirection: 'column',
                            maxHeight: '100%'
                        }}
                    >
                        <div className="kanban-header" style={{ padding: 'var(--space-4)', fontWeight: 600, color: 'var(--primary-700)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                            <span>{getColumnTitle(columnId)}</span>
                            <span className="kanban-count" style={{ backgroundColor: 'var(--white)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', color: 'var(--primary-500)' }}>{columns[columnId].length}</span>
                        </div>

                        <div className="kanban-tasks" style={{ padding: 'var(--space-3)', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                            {columns[columnId].map(task => (
                                <div
                                    key={task.id}
                                    className="kanban-card"
                                    draggable="true"
                                    onDragStart={(e) => handleDragStart(e, task, columnId)}
                                    onDragEnd={handleDragEnd}
                                    style={{
                                        backgroundColor: 'var(--white)',
                                        borderRadius: 'var(--radius-md)',
                                        padding: 'var(--space-4)',
                                        boxShadow: 'var(--shadow-sm)',
                                        cursor: 'move',
                                        borderLeft: task.priority === 'urgent' ? '3px solid #EF4444' : '1px solid transparent',
                                        opacity: task.status === 'completed' ? 0.7 : 1
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                                        {task.tags && task.tags.map((tag, idx) => (
                                            <span key={idx} className="tag tag-design" style={{
                                                display: 'inline-block',
                                                padding: '2px 6px',
                                                borderRadius: '4px',
                                                fontSize: '0.7rem',
                                                fontWeight: 600,
                                                textTransform: 'uppercase',
                                                backgroundColor: '#E0E7FF',
                                                color: '#4338CA',
                                                marginRight: '4px'
                                            }}>
                                                {tag}
                                            </span>
                                        ))}
                                        {!task.tags || task.tags.length === 0 ? <span></span> : null}

                                        <i className="ph ph-dots-three" style={{ color: 'var(--primary-300)', cursor: 'pointer' }}></i>
                                    </div>
                                    <h4 className="font-medium text-primary" style={{ marginBottom: 'var(--space-1)' }}>{task.title}</h4>
                                    <p className="text-xs text-secondary" style={{ marginBottom: 'var(--space-3)' }}>Client ID: {task.client_id ? task.client_id.substring(0, 8) : 'N/A'}</p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        {task.due_date && (
                                            <div className={`text-xs ${task.priority === 'urgent' ? 'text-danger' : 'text-secondary'}`} style={{ color: task.priority === 'urgent' ? 'var(--danger-500)' : 'inherit' }}>
                                                {task.priority === 'urgent' ? <i className="ph ph-warning"></i> : <i className="ph ph-calendar-blank"></i>} {new Date(task.due_date).toLocaleDateString()}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Operations;
