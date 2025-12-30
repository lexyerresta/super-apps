'use client';
import React, { useState, useEffect } from 'react';
import styles from './MiniApps.module.css';
import { TodoService, type Todo, type TodoFilter } from '@/services/todo.service';
import { Plus, Trash2, Check, Circle, Calendar, Filter, Download, Upload, X } from 'lucide-react';

export default function TodoListApp() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodo, setNewTodo] = useState('');
    const [category, setCategory] = useState<Todo['category']>('personal');
    const [priority, setPriority] = useState<Todo['priority']>('medium');
    const [dueDate, setDueDate] = useState('');
    const [filter, setFilter] = useState<TodoFilter>({ status: 'all' });
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editText, setEditText] = useState('');

    useEffect(() => {
        loadTodos();
    }, []);

    const loadTodos = () => {
        setTodos(TodoService.getAll());
    };

    const handleAdd = () => {
        if (newTodo.trim()) {
            TodoService.create(newTodo.trim(), category, priority, dueDate || undefined);
            setNewTodo('');
            setDueDate('');
            loadTodos();
        }
    };

    const handleToggle = (id: string) => {
        TodoService.toggle(id);
        loadTodos();
    };

    const handleDelete = (id: string) => {
        TodoService.delete(id);
        loadTodos();
    };

    const handleEdit = (todo: Todo) => {
        setEditingId(todo.id);
        setEditText(todo.text);
    };

    const handleSaveEdit = () => {
        if (editingId && editText.trim()) {
            TodoService.update(editingId, { text: editText.trim() });
            setEditingId(null);
            setEditText('');
            loadTodos();
        }
    };

    const handleClearCompleted = () => {
        TodoService.clearCompleted();
        loadTodos();
    };

    const handleExport = () => {
        const data = TodoService.export();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `todos-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const filtered = TodoService.filter(todos, filter);
    const stats = TodoService.getStats(todos);

    const categoryColors = {
        work: '#3b82f6',
        personal: '#8b5cf6',
        shopping: '#10b981',
        other: '#6b7280'
    };

    const priorityColors = {
        high: '#ef4444',
        medium: '#f59e0b',
        low: '#10b981'
    };

    return (
        <div className={styles.appContainer}>
            {/* Header Stats */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.75rem',
                marginBottom: '1.5rem'
            }}>
                <div style={{
                    padding: '1rem',
                    background: 'var(--bg-secondary)',
                    borderRadius: '12px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#3b82f6' }}>
                        {stats.total}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                        Total Tasks
                    </div>
                </div>
                <div style={{
                    padding: '1rem',
                    background: 'var(--bg-secondary)',
                    borderRadius: '12px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#f59e0b' }}>
                        {stats.active}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                        Active
                    </div>
                </div>
                <div style={{
                    padding: '1rem',
                    background: 'var(--bg-secondary)',
                    borderRadius: '12px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#10b981' }}>
                        {stats.completed}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                        Completed
                    </div>
                </div>
            </div>

            {/* Add Todo */}
            <div className={styles.inputGroup} style={{ marginBottom: '1rem' }}>
                <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
                    placeholder="Add a new task..."
                    className={styles.input}
                    style={{ flex: 1 }}
                />
                <button
                    onClick={handleAdd}
                    className={`${styles.actionBtn} ${styles.primaryBtn}`}
                    style={{ padding: '0.75rem 1.5rem' }}
                >
                    <Plus size={18} />
                    Add
                </button>
            </div>

            {/* Todo Options */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.5rem',
                marginBottom: '1.5rem'
            }}>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Todo['category'])}
                    className={styles.select}
                >
                    <option value="personal">Personal</option>
                    <option value="work">Work</option>
                    <option value="shopping">Shopping</option>
                    <option value="other">Other</option>
                </select>

                <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Todo['priority'])}
                    className={styles.select}
                >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                </select>

                <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className={styles.input}
                    style={{ padding: '0.5rem' }}
                />
            </div>

            {/* Filters */}
            <div style={{
                display: 'flex',
                gap: '0.5rem',
                marginBottom: '1rem',
                flexWrap: 'wrap'
            }}>
                {['all', 'active', 'completed'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter({ ...filter, status: status as any })}
                        style={{
                            padding: '0.5rem 1rem',
                            border: 'none',
                            borderRadius: '8px',
                            background: filter.status === status ? 'var(--gradient-primary)' : 'var(--bg-secondary)',
                            color: filter.status === status ? 'white' : 'var(--text-primary)',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            textTransform: 'capitalize'
                        }}
                    >
                        {status}
                    </button>
                ))}

                <button
                    onClick={handleClearCompleted}
                    style={{
                        marginLeft: 'auto',
                        padding: '0.5rem 1rem',
                        border: 'none',
                        borderRadius: '8px',
                        background: '#ef4444',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '500'
                    }}
                >
                    Clear Completed
                </button>

                <button
                    onClick={handleExport}
                    style={{
                        padding: '0.5rem 1rem',
                        border: 'none',
                        borderRadius: '8px',
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    <Download size={16} />
                    Export
                </button>
            </div>

            {/* Todo List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {filtered.length === 0 ? (
                    <div style={{
                        padding: '3rem',
                        textAlign: 'center',
                        color: 'var(--text-secondary)',
                        background: 'var(--bg-secondary)',
                        borderRadius: '12px'
                    }}>
                        <Circle size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                        <p style={{ margin: 0 }}>No tasks found</p>
                    </div>
                ) : (
                    filtered.map((todo) => (
                        <div
                            key={todo.id}
                            style={{
                                padding: '1rem',
                                background: 'var(--bg-secondary)',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                borderLeft: `4px solid ${priorityColors[todo.priority]}`,
                                opacity: todo.completed ? 0.6 : 1,
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <button
                                onClick={() => handleToggle(todo.id)}
                                style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    border: `2px solid ${categoryColors[todo.category]}`,
                                    background: todo.completed ? categoryColors[todo.category] : 'transparent',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                }}
                            >
                                {todo.completed && <Check size={14} color="white" />}
                            </button>

                            <div style={{ flex: 1 }}>
                                {editingId === todo.id ? (
                                    <input
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                        onBlur={handleSaveEdit}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                                        className={styles.input}
                                        autoFocus
                                        style={{ marginBottom: 0 }}
                                    />
                                ) : (
                                    <>
                                        <div
                                            onClick={() => handleEdit(todo)}
                                            style={{
                                                textDecoration: todo.completed ? 'line-through' : 'none',
                                                cursor: 'pointer',
                                                marginBottom: '0.25rem'
                                            }}
                                        >
                                            {todo.text}
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            gap: '0.5rem',
                                            fontSize: '0.75rem',
                                            color: 'var(--text-secondary)'
                                        }}>
                                            <span style={{
                                                padding: '0.125rem 0.5rem',
                                                borderRadius: '4px',
                                                background: categoryColors[todo.category] + '20',
                                                color: categoryColors[todo.category]
                                            }}>
                                                {todo.category}
                                            </span>
                                            {todo.dueDate && (
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                    <Calendar size={12} />
                                                    {new Date(todo.dueDate).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>

                            <button
                                onClick={() => handleDelete(todo.id)}
                                style={{
                                    padding: '0.5rem',
                                    border: 'none',
                                    borderRadius: '8px',
                                    background: 'transparent',
                                    color: '#ef4444',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
