'use client';
import React, { useState, useEffect } from 'react';
import styles from './MiniApps.module.css';
import { ExpenseService, EXPENSE_CATEGORIES, INCOME_CATEGORIES, type Transaction } from '@/services/expense.service';
import { Plus, TrendingUp, TrendingDown, DollarSign, Trash2, Download, Filter } from 'lucide-react';

export default function ExpenseTrackerApp() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [type, setType] = useState<'income' | 'expense'>('expense');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [dateFilter, setDateFilter] = useState<number>(30); // days

    useEffect(() => {
        loadTransactions();
    }, []);

    const loadTransactions = () => {
        setTransactions(ExpenseService.getAll());
    };

    const handleAdd = () => {
        if (amount && category && description) {
            ExpenseService.create(type, parseFloat(amount), category, description);
            setAmount('');
            setDescription('');
            loadTransactions();
        }
    };

    const handleDelete = (id: string) => {
        ExpenseService.delete(id);
        loadTransactions();
    };

    const handleExportCSV = () => {
        const csv = ExpenseService.exportToCSV();
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `expenses-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const filteredTransactions = ExpenseService.filterByDateRange(transactions, dateFilter);
    const stats = ExpenseService.getStats(filteredTransactions);
    const categoryStats = ExpenseService.getCategoryStats(filteredTransactions);

    const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

    return (
        <div className={styles.appContainer}>
            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{
                    padding: '1.5rem',
                    background: 'linear-gradient(135deg, #10b981, #14b8a6)',
                    borderRadius: '16px',
                    color: 'white'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <TrendingUp size={20} />
                        <span style={{ fontSize: '0.875rem', opacity: 0.9 }}>Income</span>
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: '700' }}>
                        ${stats.income.toFixed(2)}
                    </div>
                </div>

                <div style={{
                    padding: '1.5rem',
                    background: 'linear-gradient(135deg, #ef4444, #f97316)',
                    borderRadius: '16px',
                    color: 'white'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <TrendingDown size={20} />
                        <span style={{ fontSize: '0.875rem', opacity: 0.9 }}>Expenses</span>
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: '700' }}>
                        ${stats.expenses.toFixed(2)}
                    </div>
                </div>

                <div style={{
                    padding: '1.5rem',
                    background: stats.balance >= 0
                        ? 'linear-gradient(135deg, #3b82f6, #6366f1)'
                        : 'linear-gradient(135deg, #8b5cf6, #a855f7)',
                    borderRadius: '16px',
                    color: 'white'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <DollarSign size={20} />
                        <span style={{ fontSize: '0.875rem', opacity: 0.9 }}>Balance</span>
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: '700' }}>
                        ${stats.balance.toFixed(2)}
                    </div>
                </div>
            </div>

            {/* Add Transaction */}
            <div style={{
                background: 'var(--bg-secondary)',
                padding: '1.5rem',
                borderRadius: '16px',
                marginBottom: '1.5rem'
            }}>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: '600' }}>
                    Add Transaction
                </h3>

                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                    <button
                        onClick={() => setType('expense')}
                        style={{
                            flex: 1,
                            padding: '0.75rem',
                            border: 'none',
                            borderRadius: '10px',
                            background: type === 'expense' ? 'linear-gradient(135deg, #ef4444, #f97316)' : 'var(--bg-tertiary)',
                            color: type === 'expense' ? 'white' : 'var(--text-primary)',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        Expense
                    </button>
                    <button
                        onClick={() => setType('income')}
                        style={{
                            flex: 1,
                            padding: '0.75rem',
                            border: 'none',
                            borderRadius: '10px',
                            background: type === 'income' ? 'linear-gradient(135deg, #10b981, #14b8a6)' : 'var(--bg-tertiary)',
                            color: type === 'income' ? 'white' : 'var(--text-primary)',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        Income
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Amount"
                        className={styles.input}
                        step="0.01"
                    />
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className={styles.select}
                    >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                    className={styles.input}
                    style={{ marginBottom: '1rem' }}
                />

                <button
                    onClick={handleAdd}
                    className={`${styles.actionBtn} ${styles.primaryBtn}`}
                    style={{ width: '100%' }}
                >
                    <Plus size={18} />
                    Add Transaction
                </button>
            </div>

            {/* Filter & Export */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', alignItems: 'center' }}>
                <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(Number(e.target.value))}
                    className={styles.select}
                    style={{ flex: 1 }}
                >
                    <option value={7}>Last 7 days</option>
                    <option value={30}>Last 30 days</option>
                    <option value={90}>Last 90 days</option>
                    <option value={365}>Last year</option>
                    <option value={99999}>All time</option>
                </select>

                <button
                    onClick={handleExportCSV}
                    style={{
                        padding: '0.75rem 1.5rem',
                        border: 'none',
                        borderRadius: '10px',
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontWeight: '500'
                    }}
                >
                    <Download size={18} />
                    Export CSV
                </button>
            </div>

            {/* Category Breakdown */}
            {categoryStats.length > 0 && (
                <div style={{
                    background: 'var(--bg-secondary)',
                    padding: '1.5rem',
                    borderRadius: '16px',
                    marginBottom: '1.5rem'
                }}>
                    <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: '600' }}>
                        Expense Breakdown
                    </h3>
                    {categoryStats.map((stat, index) => (
                        <div key={stat.category} style={{ marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{stat.category}</span>
                                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                    ${stat.total.toFixed(2)} ({stat.percentage.toFixed(1)}%)
                                </span>
                            </div>
                            <div style={{
                                height: '8px',
                                background: 'var(--bg-tertiary)',
                                borderRadius: '4px',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    height: '100%',
                                    width: `${stat.percentage}%`,
                                    background: `hsl(${(index * 40) % 360}, 70%, 60%)`,
                                    transition: 'width 0.3s ease'
                                }} />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Transactions List */}
            <div>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: '600' }}>
                    Recent Transactions ({filteredTransactions.length})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {filteredTransactions.map(t => (
                        <div
                            key={t.id}
                            style={{
                                padding: '1rem',
                                background: 'var(--bg-secondary)',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                borderLeft: `4px solid ${t.type === 'income' ? '#10b981' : '#ef4444'}`
                            }}
                        >
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                background: t.type === 'income'
                                    ? 'linear-gradient(135deg, #10b981, #14b8a6)'
                                    : 'linear-gradient(135deg, #ef4444, #f97316)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                flexShrink: 0
                            }}>
                                {t.type === 'income' ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                                    {t.description}
                                </div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                    {t.category} • {new Date(t.date).toLocaleDateString()}
                                </div>
                            </div>

                            <div style={{ textAlign: 'right' }}>
                                <div style={{
                                    fontSize: '1.125rem',
                                    fontWeight: '700',
                                    color: t.type === 'income' ? '#10b981' : '#ef4444'
                                }}>
                                    {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                                </div>
                            </div>

                            <button
                                onClick={() => handleDelete(t.id)}
                                style={{
                                    padding: '0.5rem',
                                    border: 'none',
                                    borderRadius: '8px',
                                    background: 'transparent',
                                    color: '#ef4444',
                                    cursor: 'pointer'
                                }}
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}

                    {filteredTransactions.length === 0 && (
                        <div style={{
                            padding: '3rem',
                            textAlign: 'center',
                            color: 'var(--text-secondary)',
                            background: 'var(--bg-secondary)',
                            borderRadius: '12px'
                        }}>
                            No transactions found
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
