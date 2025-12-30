'use client';

import React, { useState, useEffect } from 'react';
import styles from './MiniApps.module.css';
import { Target, Plus, Trash2, Check, Flame, TrendingUp, Award } from 'lucide-react';

interface Habit {
    id: string;
    name: string;
    color: string;
    completedDates: string[];
    createdAt: string;
}

const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#22c55e', '#10b981', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899'];

export default function HabitTrackerApp() {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [showAddHabit, setShowAddHabit] = useState(false);
    const [newHabitName, setNewHabitName] = useState('');
    const [selectedColor, setSelectedColor] = useState(COLORS[4]);

    useEffect(() => {
        const saved = localStorage.getItem('habit-tracker');
        if (saved) setHabits(JSON.parse(saved));
    }, []);

    useEffect(() => {
        localStorage.setItem('habit-tracker', JSON.stringify(habits));
    }, [habits]);

    const getTodayString = () => new Date().toISOString().split('T')[0];

    const addHabit = () => {
        if (!newHabitName.trim()) return;
        const newHabit: Habit = {
            id: Date.now().toString(),
            name: newHabitName.trim(),
            color: selectedColor,
            completedDates: [],
            createdAt: getTodayString(),
        };
        setHabits([...habits, newHabit]);
        setNewHabitName('');
        setShowAddHabit(false);
    };

    const deleteHabit = (id: string) => setHabits(habits.filter(h => h.id !== id));

    const toggleHabit = (habitId: string, dateStr: string) => {
        setHabits(habits.map(habit => {
            if (habit.id !== habitId) return habit;
            const isCompleted = habit.completedDates.includes(dateStr);
            return {
                ...habit,
                completedDates: isCompleted
                    ? habit.completedDates.filter(d => d !== dateStr)
                    : [...habit.completedDates, dateStr]
            };
        }));
    };

    const getStreak = (habit: Habit) => {
        let streak = 0;
        const today = new Date();
        for (let i = 0; i < 365; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            if (habit.completedDates.includes(dateStr)) streak++;
            else if (i > 0) break;
        }
        return streak;
    };

    const todayStr = getTodayString();
    const completedToday = habits.filter(h => h.completedDates.includes(todayStr)).length;

    return (
        <div className={styles.appContainer}>
            <div className={styles.appHeader}>
                <div className={styles.appIconWrapper} style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}>
                    <Target size={24} />
                </div>
                <div>
                    <h2>Habit Tracker</h2>
                    <p>Build better habits daily</p>
                </div>
            </div>

            <div className={styles.habitStats}>
                <div className={styles.statCard}>
                    <Flame size={24} style={{ color: '#ef4444' }} />
                    <div>
                        <span className={styles.statValue}>{habits.length > 0 ? Math.max(...habits.map(h => getStreak(h))) : 0}</span>
                        <span className={styles.statLabel}>Best Streak</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <Check size={24} style={{ color: '#22c55e' }} />
                    <div>
                        <span className={styles.statValue}>{completedToday}/{habits.length}</span>
                        <span className={styles.statLabel}>Today</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <Award size={24} style={{ color: '#6366f1' }} />
                    <div>
                        <span className={styles.statValue}>{habits.length}</span>
                        <span className={styles.statLabel}>Habits</span>
                    </div>
                </div>
            </div>

            {showAddHabit ? (
                <div className={styles.addHabitForm}>
                    <input type="text" value={newHabitName} onChange={(e) => setNewHabitName(e.target.value)} placeholder="Habit name..." className={styles.input} autoFocus />
                    <div className={styles.colorPicker}>
                        {COLORS.map(color => (
                            <button key={color} className={`${styles.colorOption} ${selectedColor === color ? styles.selected : ''}`} style={{ backgroundColor: color }} onClick={() => setSelectedColor(color)} />
                        ))}
                    </div>
                    <div className={styles.formActions}>
                        <button onClick={addHabit} className={styles.primaryButton}><Plus size={16} /> Add</button>
                        <button onClick={() => setShowAddHabit(false)} className={styles.secondaryButton}>Cancel</button>
                    </div>
                </div>
            ) : (
                <button onClick={() => setShowAddHabit(true)} className={styles.addHabitButton}><Plus size={18} /> Add New Habit</button>
            )}

            <div className={styles.habitList}>
                {habits.map(habit => {
                    const isCompleted = habit.completedDates.includes(todayStr);
                    const streak = getStreak(habit);
                    return (
                        <div key={habit.id} className={`${styles.habitItem} ${isCompleted ? styles.completed : ''}`}>
                            <button className={styles.habitCheck} style={{ borderColor: habit.color, backgroundColor: isCompleted ? habit.color : 'transparent' }} onClick={() => toggleHabit(habit.id, todayStr)}>
                                {isCompleted && <Check size={16} />}
                            </button>
                            <div className={styles.habitInfo}>
                                <span className={styles.habitName}>{habit.name}</span>
                                {streak > 0 && <span className={styles.streak}><Flame size={14} /> {streak} days</span>}
                            </div>
                            <button onClick={() => deleteHabit(habit.id)} className={styles.iconButton}><Trash2 size={16} /></button>
                        </div>
                    );
                })}
            </div>

            {habits.length === 0 && (
                <div className={styles.emptyState}><Target size={48} /><p>No habits yet. Start building better habits!</p></div>
            )}
        </div>
    );
}
