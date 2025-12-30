'use client';

import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { Workflow, Play, Plus, Trash2, ExternalLink, AlertCircle, CheckCircle } from 'lucide-react';
import { useLocalStorage } from '@/hooks';

interface N8nWorkflow {
    id: string;
    name: string;
    webhookUrl: string;
    description?: string;
}

interface WorkflowResult {
    success: boolean;
    message: string;
    data?: unknown;
}

export default function N8nApp() {
    const [workflows, setWorkflows] = useLocalStorage<N8nWorkflow[]>('n8n_workflows', []);
    const [showForm, setShowForm] = useState(false);
    const [newWorkflow, setNewWorkflow] = useState({ name: '', webhookUrl: '', description: '' });
    const [runningId, setRunningId] = useState<string | null>(null);
    const [result, setResult] = useState<WorkflowResult | null>(null);

    const addWorkflow = () => {
        if (!newWorkflow.name || !newWorkflow.webhookUrl) return;

        const workflow: N8nWorkflow = {
            id: Date.now().toString(),
            name: newWorkflow.name,
            webhookUrl: newWorkflow.webhookUrl,
            description: newWorkflow.description,
        };

        setWorkflows([...workflows, workflow]);
        setNewWorkflow({ name: '', webhookUrl: '', description: '' });
        setShowForm(false);
    };

    const removeWorkflow = (id: string) => {
        setWorkflows(workflows.filter(w => w.id !== id));
    };

    const triggerWorkflow = async (workflow: N8nWorkflow) => {
        setRunningId(workflow.id);
        setResult(null);

        try {
            const response = await fetch(workflow.webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    triggeredAt: new Date().toISOString(),
                    source: 'SuperApps',
                }),
            });

            const data = await response.json().catch(() => ({}));

            setResult({
                success: response.ok,
                message: response.ok ? 'Workflow triggered successfully' : `Error: ${response.status}`,
                data,
            });
        } catch (error) {
            setResult({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to trigger workflow',
            });
        } finally {
            setRunningId(null);
        }
    };

    return (
        <div className={styles.appContainer}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 600 }}>
                    Your Workflows
                </h3>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className={`${styles.actionBtn} ${styles.primaryBtn}`}
                    style={{ padding: '0.5rem 1rem' }}
                >
                    <Plus size={16} /> Add Workflow
                </button>
            </div>

            {showForm && (
                <div style={{
                    background: 'var(--bg-tertiary)',
                    borderRadius: '16px',
                    padding: '1.25rem',
                    marginBottom: '1rem',
                    border: '1px solid var(--glass-border)',
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <input
                            type="text"
                            placeholder="Workflow name"
                            value={newWorkflow.name}
                            onChange={(e) => setNewWorkflow({ ...newWorkflow, name: e.target.value })}
                            className={styles.searchInput}
                        />
                        <input
                            type="url"
                            placeholder="n8n Webhook URL"
                            value={newWorkflow.webhookUrl}
                            onChange={(e) => setNewWorkflow({ ...newWorkflow, webhookUrl: e.target.value })}
                            className={styles.searchInput}
                        />
                        <input
                            type="text"
                            placeholder="Description (optional)"
                            value={newWorkflow.description}
                            onChange={(e) => setNewWorkflow({ ...newWorkflow, description: e.target.value })}
                            className={styles.searchInput}
                        />
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={addWorkflow} className={`${styles.actionBtn} ${styles.successBtn}`}>
                                Save
                            </button>
                            <button onClick={() => setShowForm(false)} className={styles.actionBtn}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {result && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '1rem',
                    borderRadius: '12px',
                    marginBottom: '1rem',
                    background: result.success
                        ? 'rgba(34, 197, 94, 0.1)'
                        : 'rgba(239, 68, 68, 0.1)',
                    border: `1px solid ${result.success ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                }}>
                    {result.success ? (
                        <CheckCircle size={20} color="#22c55e" />
                    ) : (
                        <AlertCircle size={20} color="#ef4444" />
                    )}
                    <span style={{ color: 'var(--text-primary)', fontSize: '0.875rem' }}>
                        {result.message}
                    </span>
                </div>
            )}

            {workflows.length === 0 ? (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>
                        <Workflow size={36} color="var(--primary)" />
                    </div>
                    <p>No workflows configured</p>
                    <p className={styles.emptyHint}>Add your n8n webhook URLs to trigger workflows</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {workflows.map((workflow) => (
                        <div
                            key={workflow.id}
                            className={styles.listItem}
                            style={{ justifyContent: 'space-between' }}
                        >
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Workflow size={18} color="var(--primary)" />
                                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                                        {workflow.name}
                                    </span>
                                </div>
                                {workflow.description && (
                                    <p style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                                        {workflow.description}
                                    </p>
                                )}
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                    onClick={() => triggerWorkflow(workflow)}
                                    disabled={runningId === workflow.id}
                                    className={`${styles.actionBtn} ${styles.successBtn}`}
                                    style={{ padding: '0.5rem 0.75rem' }}
                                >
                                    {runningId === workflow.id ? (
                                        <span className={styles.spinner} style={{ width: 16, height: 16 }} />
                                    ) : (
                                        <Play size={14} />
                                    )}
                                </button>
                                <a
                                    href={workflow.webhookUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.actionBtn}
                                    style={{ padding: '0.5rem 0.75rem' }}
                                >
                                    <ExternalLink size={14} />
                                </a>
                                <button
                                    onClick={() => removeWorkflow(workflow.id)}
                                    className={styles.actionBtn}
                                    style={{ padding: '0.5rem 0.75rem', color: 'var(--accent-red)' }}
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className={styles.footer} style={{ marginTop: '1.5rem' }}>
                <a
                    href="https://n8n.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}
                >
                    Learn more about n8n <ExternalLink size={12} />
                </a>
            </div>
        </div>
    );
}
