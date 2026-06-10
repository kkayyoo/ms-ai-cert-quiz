import React from 'react';

interface LoadingSpinnerProps {
  text?: string;
}

export default function LoadingSpinner({ text = 'Loading...' }: LoadingSpinnerProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem', gap: '1rem' }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '4px solid #e5e7eb',
        borderTopColor: '#0078D4',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{ color: '#6b7280', margin: 0 }}>{text}</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
