import React from 'react';

const EmptyState = ({ icon = 'ph-folder-open', title, description, action }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-12) var(--space-6)',
            textAlign: 'center',
            backgroundColor: 'var(--primary-50)',
            borderRadius: 'var(--radius-lg)',
            border: '2px dashed var(--primary-300)',
            color: 'var(--primary-500)'
        }}>
            <div style={{
                backgroundColor: 'var(--white)',
                padding: 'var(--space-4)',
                borderRadius: '50%',
                marginBottom: 'var(--space-4)',
                boxShadow: 'var(--shadow-sm)'
            }}>
                <i className={`ph ${icon}`} style={{ fontSize: '2rem', color: 'var(--primary-400)' }}></i>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--primary-900)', marginBottom: 'var(--space-2)' }}>{title}</h3>
            <p style={{ maxWidth: '400px', marginBottom: 'var(--space-6)', lineHeight: 1.6 }}>{description}</p>
            {action && (
                <div>
                    {action}
                </div>
            )}
        </div>
    );
};

export default EmptyState;
