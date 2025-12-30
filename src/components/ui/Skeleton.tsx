import React from 'react';

interface SkeletonProps {
    width?: string | number;
    height?: string | number;
    borderRadius?: string | number;
    style?: React.CSSProperties;
}

export default function Skeleton({
    width = '100%',
    height = '20px',
    borderRadius = '8px',
    style = {}
}: SkeletonProps) {
    return (
        <div
            style={{
                width,
                height,
                borderRadius,
                background: 'linear-gradient(90deg, var(--bg-secondary) 25%, var(--bg-tertiary) 50%, var(--bg-secondary) 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s ease-in-out infinite',
                ...style
            }}
        />
    );
}

export function SkeletonCard() {
    return (
        <div style={{
            padding: '1.5rem',
            background: 'var(--bg-secondary)',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
        }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <Skeleton width="48px" height="48px" borderRadius="12px" />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <Skeleton height="16px" width="60%" />
                    <Skeleton height="14px" width="40%" />
                </div>
            </div>
            <Skeleton height="12px" width="100%" />
            <Skeleton height="12px" width="80%" />
        </div>
    );
}
