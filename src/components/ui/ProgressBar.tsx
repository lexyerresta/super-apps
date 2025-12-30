import React from 'react';

interface ProgressBarProps {
    progress: number; // 0-100
    height?: number;
    color?: string;
    showLabel?: boolean;
}

export default function ProgressBar({
    progress,
    height = 8,
    color = 'var(--primary-color)',
    showLabel = false
}: ProgressBarProps) {
    const clampedProgress = Math.min(100, Math.max(0, progress));

    return (
        <div>
            {showLabel && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)'
                }}>
                    <span>Progress</span>
                    <span>{clampedProgress.toFixed(0)}%</span>
                </div>
            )}
            <div style={{
                width: '100%',
                height: `${height}px`,
                background: 'var(--bg-tertiary)',
                borderRadius: `${height / 2}px`,
                overflow: 'hidden'
            }}>
                <div style={{
                    width: `${clampedProgress}%`,
                    height: '100%',
                    background: color,
                    transition: 'width 0.3s ease',
                    borderRadius: `${height / 2}px`
                }} />
            </div>
        </div>
    );
}
