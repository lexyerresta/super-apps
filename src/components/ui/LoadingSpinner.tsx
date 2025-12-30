import React from 'react';

interface LoadingSpinnerProps {
    size?: number;
    color?: string;
}

export default function LoadingSpinner({ size = 32, color = 'var(--primary-color)' }: LoadingSpinnerProps) {
    return (
        <div
            style={{
                width: size,
                height: size,
                border: `3px solid rgba(255, 255, 255, 0.1)`,
                borderTop: `3px solid ${color}`,
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
            }}
        />
    );
}
