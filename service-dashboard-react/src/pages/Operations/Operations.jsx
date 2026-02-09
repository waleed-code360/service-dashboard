import React, { useState, useEffect } from 'react';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
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

    const hasOrders = Object.values(columns).some(col => col.length > 0);

    if (loading) {
        return (
            <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
                    <Skeleton width="200px" height="32px" />
                    <Skeleton width="120px" height="40px" />
                </div>
                <div className="kanban-board" style={{ display: 'flex', gap: 'var(--space-6)', overflowX: 'auto' }}>
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} style={{ flex: '0 0 320px', backgroundColor: 'var(--primary-100)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', height: '70vh' }}>
                            <Skeleton width="100px" height="24px" style={{ marginBottom: '16px' }} />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <Skeleton height="100px" />
                                <Skeleton height="100px" />
                                <Skeleton height="100px" />
                            </div>
                        </div>
                    ))}
                </div>
            </>
        );
    }

    return (
        <>
            {/* Header Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
                <h1 className="font-bold text-primary" style={{ fontSize: '1.5rem' }}>Operations Board</h1>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <button className="btn btn-primary" onClick={handleAddOrder} style={{ boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.4)', padding: '10px 20px', fontSize: '0.95rem' }}>
                        <i className="ph ph-plus" style={{ marginRight: 'var(--space-2)', fontSize: '1.2rem' }}></i>
                        <span style={{ fontWeight: 600 }}>New Request</span>
                    </button>
                    <button className="btn btn-secondary active desktop-only" style={{ backgroundColor: 'var(--primary-100)' }}>
                        <i className="ph ph-kanban" style={{ marginRight: 'var(--space-2)' }}></i> Board
                    </button>
                    <button className="btn btn-secondary desktop-only">
                        <i className="ph ph-list-dashes" style={{ marginRight: 'var(--space-2)' }}></i> List
                    </button>
                </div>
            </div>

            {!hasOrders ? (
                <EmptyState
                    icon="ph-clipboard-text"
                    title="No Active Orders"
                    description="You don't have any orders yet. Create a new request to get started."
                    action={
                        <button className="btn btn-primary" onClick={handleAddOrder}>
                            <i className="ph ph-plus" style={{ marginRight: '8px' }}></i> Create Request
                        </button>
                    }
                />
            ) : (
                /* Kanban Board */
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
                                            borderLeft: task.status === 'new_requests' ? '4px solid #F59E0B' :
                                                task.status === 'in_progress' ? '4px solid #3B82F6' :
                                                    task.status === 'completed' ? '4px solid #10B981' : '4px solid #CBD5E1',
                                            opacity: task.status === 'completed' ? 0.8 : 1,
                                            transition: 'transform 0.2s, box-shadow 0.2s'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                                            <span className="status-badge" style={{
                                                backgroundColor: task.status === 'new_requests' ? '#FFFBEB' :
                                                    task.status === 'in_progress' ? '#EFF6FF' :
                                                        task.status === 'completed' ? '#ECFDF5' : '#F1F5F9',
                                                color: task.status === 'new_requests' ? '#D97706' :
                                                    task.status === 'in_progress' ? '#2563EB' :
                                                        task.status === 'completed' ? '#059669' : '#64748B',
                                                padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 600, textTransform: 'capitalize'
                                            }}>
                                                {task.status.replace('_', ' ')}
                                            </span>
                                            <i className="ph ph-dots-three" style={{ color: 'var(--primary-300)', cursor: 'pointer' }}></i>
                                        </div>

                                        <h4 className="font-bold text-primary" style={{ marginBottom: 'var(--space-1)', fontSize: '1rem' }}>{task.title}</h4>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                                            <i className="ph ph-user" style={{ color: 'var(--primary-400)', fontSize: '0.875rem' }}></i>
                                            <span className="text-sm text-secondary">TechCorp Inc.</span> {/* Mock Client Name for visual request */}
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--primary-100)', paddingTop: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
                                            <div className={`text-xs ${task.priority === 'urgent' ? 'text-danger' : 'text-secondary'}`} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: task.priority === 'urgent' ? 'var(--danger-500)' : 'inherit', fontWeight: 500 }}>
                                                {task.priority === 'urgent' ? <i className="ph ph-warning-circle"></i> : <i className="ph ph-calendar-blank"></i>}
                                                {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'Today'}
                                            </div>
                                            <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 600, color: '#64748B' }}>
                                                JD
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                </div >
            )}
        </>
    );
};

export default Operations;
