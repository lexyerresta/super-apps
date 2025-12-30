'use client';

import React, { useState, useEffect } from 'react';
import styles from './MiniApps.module.css';
import { useLocalStorage } from '@/hooks';
import { n8n } from '@/lib/n8n';
import { Plus, Trash2, FileText, Search, Clock } from 'lucide-react';

interface Note {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}

export default function NotesApp() {
    const [notes, setNotes] = useLocalStorage<Note[]>('app_notes', []);
    const [activeNote, setActiveNote] = useState<Note | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const createNote = () => {
        const newNote: Note = {
            id: Date.now().toString(),
            title: 'Untitled Note',
            content: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        setNotes([newNote, ...notes]);
        setActiveNote(newNote);
        setIsEditing(true);

        n8n.noteCreated(newNote.id, 0);
    };

    const updateNote = (updates: Partial<Note>) => {
        if (!activeNote) return;
        const updated = {
            ...activeNote,
            ...updates,
            updatedAt: new Date().toISOString(),
        };
        setActiveNote(updated);
        setNotes(notes.map(n => n.id === updated.id ? updated : n));
    };

    const deleteNote = (id: string) => {
        setNotes(notes.filter(n => n.id !== id));
        if (activeNote?.id === id) {
            setActiveNote(null);
            setIsEditing(false);
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    useEffect(() => {
        if (notes.length > 0 && !activeNote) {
            setActiveNote(notes[0]);
        }
    }, [notes, activeNote]);

    return (
        <div className={styles.appContainer}>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search notes..."
                        className={styles.searchInput}
                        style={{ paddingLeft: '2.5rem' }}
                    />
                </div>
                <button onClick={createNote} className={`${styles.actionBtn} ${styles.primaryBtn}`}>
                    <Plus size={18} />
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', minHeight: '400px' }}>
                <div style={{
                    background: 'var(--bg-tertiary)',
                    borderRadius: '16px',
                    padding: '0.75rem',
                    border: '1px solid var(--glass-border)',
                    overflow: 'auto',
                    maxHeight: '400px',
                }}>
                    {filteredNotes.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center' }}>
                            <FileText size={32} color="var(--text-tertiary)" style={{ marginBottom: '0.5rem' }} />
                            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>No notes yet</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {filteredNotes.map(note => (
                                <div
                                    key={note.id}
                                    onClick={() => { setActiveNote(note); setIsEditing(false); }}
                                    style={{
                                        padding: '0.75rem 1rem',
                                        background: activeNote?.id === note.id ? 'var(--gradient-primary)' : 'var(--bg-secondary)',
                                        borderRadius: '10px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        border: '1px solid',
                                        borderColor: activeNote?.id === note.id ? 'transparent' : 'var(--glass-border)',
                                    }}
                                >
                                    <p style={{
                                        fontWeight: 600,
                                        color: activeNote?.id === note.id ? 'white' : 'var(--text-primary)',
                                        fontSize: '0.875rem',
                                        marginBottom: '0.25rem',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}>
                                        {note.title || 'Untitled'}
                                    </p>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.25rem',
                                        color: activeNote?.id === note.id ? 'rgba(255,255,255,0.7)' : 'var(--text-tertiary)',
                                        fontSize: '0.7rem',
                                    }}>
                                        <Clock size={10} />
                                        {formatDate(note.updatedAt)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div style={{
                    background: 'var(--bg-tertiary)',
                    borderRadius: '16px',
                    padding: '1.25rem',
                    border: '1px solid var(--glass-border)',
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    {activeNote ? (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <input
                                    type="text"
                                    value={activeNote.title}
                                    onChange={(e) => updateNote({ title: e.target.value })}
                                    placeholder="Note title..."
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        fontSize: '1.1rem',
                                        fontWeight: 700,
                                        color: 'var(--text-primary)',
                                        flex: 1,
                                        outline: 'none',
                                    }}
                                />
                                <button
                                    onClick={() => deleteNote(activeNote.id)}
                                    style={{
                                        background: 'rgba(239, 68, 68, 0.1)',
                                        border: '1px solid rgba(239, 68, 68, 0.2)',
                                        borderRadius: '8px',
                                        padding: '0.5rem',
                                        cursor: 'pointer',
                                        color: 'var(--accent-red)',
                                        display: 'flex',
                                    }}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <textarea
                                value={activeNote.content}
                                onChange={(e) => updateNote({ content: e.target.value })}
                                placeholder="Start writing..."
                                style={{
                                    flex: 1,
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '12px',
                                    padding: '1rem',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.9rem',
                                    lineHeight: 1.6,
                                    resize: 'none',
                                    outline: 'none',
                                    minHeight: '250px',
                                }}
                            />
                        </>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <FileText size={48} color="var(--text-tertiary)" style={{ marginBottom: '1rem' }} />
                            <p style={{ color: 'var(--text-tertiary)', marginBottom: '1rem' }}>Select or create a note</p>
                            <button onClick={createNote} className={`${styles.actionBtn} ${styles.primaryBtn}`}>
                                <Plus size={16} /> New Note
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
