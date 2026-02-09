import React, { useState } from 'react';

const Chat = () => {
    const [messages, setMessages] = useState([
        { id: 1, author: 'Admin User', text: 'Please review the new order for TechCorp.', time: '10:30 AM', initial: 'AU', color: '#3B82F6' },
        { id: 2, author: 'Support Team', text: 'Customer #42 called about delivery status. Updated in system.', time: '11:15 AM', initial: 'ST', color: '#10B981' }
    ]);
    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setMessages([
            ...messages,
            {
                id: messages.length + 1,
                author: 'Admin User',
                text: newMessage,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                initial: 'AU',
                color: '#3B82F6'
            }
        ]);
        setNewMessage('');
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
                <div>
                    <h1 className="font-bold text-primary" style={{ fontSize: '1.5rem' }}>Team Messages</h1>
                    <p className="text-secondary text-sm">Internal notes and staff communication</p>
                </div>
            </div>

            <div className="card" style={{ height: '500px', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
                <div style={{ flex: 1, padding: 'var(--space-6)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', backgroundColor: '#F8FAFC' }}>
                    {messages.map(msg => (
                        <div key={msg.id} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: msg.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 600, flexShrink: 0 }}>
                                {msg.initial}
                            </div>
                            <div style={{ backgroundColor: 'white', padding: '12px 16px', borderRadius: '0 12px 12px 12px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', maxWidth: '80%' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', gap: '12px' }}>
                                    <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--primary-800)' }}>{msg.author}</span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--primary-400)' }}>{msg.time}</span>
                                </div>
                                <p style={{ color: 'var(--primary-700)', fontSize: '0.95rem', lineHeight: 1.5 }}>{msg.text}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ padding: 'var(--space-4)', backgroundColor: 'white', borderTop: '1px solid var(--primary-100)' }}>
                    <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: 'var(--space-3)' }}>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Type a note or message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            style={{ flex: 1 }}
                        />
                        <button type="submit" className="btn btn-primary">
                            <i className="ph ph-paper-plane-right" style={{ marginRight: '8px' }}></i> Add Note
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Chat;
