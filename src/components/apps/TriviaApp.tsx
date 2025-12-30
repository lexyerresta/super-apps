'use client';

import React, { useState, useEffect } from 'react';
import styles from './MiniApps.module.css';
import { httpClient } from '@/lib/http-client';
import { useAsync } from '@/hooks';
import { CheckCircle, XCircle, RotateCcw, Trophy, Brain, AlertCircle } from 'lucide-react';

interface TriviaQuestion {
    category: string;
    type: string;
    difficulty: string;
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
}

interface TriviaResponse {
    response_code: number;
    results: TriviaQuestion[];
}

export default function TriviaApp() {
    const [currentQuestion, setCurrentQuestion] = useState<TriviaQuestion | null>(null);
    const [answers, setAnswers] = useState<string[]>([]);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);

    const fetchQuestion = async () => {
        const data = await httpClient<TriviaResponse>('https://opentdb.com/api.php?amount=1&type=multiple');
        return data.results[0];
    };

    const { data: question, loading, error, execute } = useAsync<TriviaQuestion>(
        fetchQuestion,
        []
    );

    useEffect(() => {
        if (question) {
            setCurrentQuestion(question);
            const allAnswers = [...question.incorrect_answers, question.correct_answer];
            setAnswers(allAnswers.sort(() => Math.random() - 0.5));
            setSelectedAnswer(null);
            setShowResult(false);
        }
    }, [question]);

    const handleAnswer = (answer: string) => {
        if (showResult) return;
        setSelectedAnswer(answer);
        setShowResult(true);
        setTotalQuestions(prev => prev + 1);
        if (answer === currentQuestion?.correct_answer) {
            setScore(prev => prev + 1);
        }
    };

    const nextQuestion = () => {
        execute();
    };

    const resetGame = () => {
        setScore(0);
        setTotalQuestions(0);
        execute();
    };

    const decodeHTML = (html: string) => {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'easy': return 'var(--accent-green)';
            case 'medium': return 'var(--accent-yellow)';
            case 'hard': return 'var(--accent-red)';
            default: return 'var(--primary)';
        }
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner} />
                <p>Loading question...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.error}>
                <div className={styles.errorIcon}><AlertCircle size={28} color="white" /></div>
                <p>Failed to load question</p>
                <button onClick={execute} className={styles.actionBtn}>Try Again</button>
            </div>
        );
    }

    return (
        <div className={styles.appContainer}>
            <div className={styles.statsGrid} style={{ marginBottom: '1rem' }}>
                <div className={styles.statItem}>
                    <Trophy size={20} color="var(--accent-yellow)" />
                    <span className={styles.statValue}>{score}</span>
                    <span className={styles.statLabel}>Score</span>
                </div>
                <div className={styles.statItem}>
                    <Brain size={20} color="var(--primary)" />
                    <span className={styles.statValue}>{totalQuestions}</span>
                    <span className={styles.statLabel}>Questions</span>
                </div>
                <div className={styles.statItem}>
                    <CheckCircle size={20} color="var(--accent-green)" />
                    <span className={styles.statValue}>{totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0}%</span>
                    <span className={styles.statLabel}>Accuracy</span>
                </div>
            </div>

            {currentQuestion && (
                <div style={{
                    background: 'var(--bg-tertiary)',
                    borderRadius: '20px',
                    padding: '1.5rem',
                    border: '1px solid var(--glass-border)',
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <span style={{
                            padding: '0.25rem 0.75rem',
                            background: 'rgba(99, 102, 241, 0.1)',
                            borderRadius: '50px',
                            color: 'var(--primary)',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                        }}>
                            {decodeHTML(currentQuestion.category)}
                        </span>
                        <span style={{
                            padding: '0.25rem 0.75rem',
                            background: `${getDifficultyColor(currentQuestion.difficulty)}20`,
                            borderRadius: '50px',
                            color: getDifficultyColor(currentQuestion.difficulty),
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            textTransform: 'capitalize',
                        }}>
                            {currentQuestion.difficulty}
                        </span>
                    </div>

                    <p style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 600, lineHeight: 1.5, marginBottom: '1.5rem' }}>
                        {decodeHTML(currentQuestion.question)}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {answers.map((answer, index) => {
                            const isCorrect = answer === currentQuestion.correct_answer;
                            const isSelected = answer === selectedAnswer;
                            let bgColor = 'var(--bg-secondary)';
                            let borderColor = 'var(--glass-border)';
                            let textColor = 'var(--text-primary)';

                            if (showResult) {
                                if (isCorrect) {
                                    bgColor = 'rgba(34, 197, 94, 0.15)';
                                    borderColor = 'var(--accent-green)';
                                    textColor = 'var(--accent-green)';
                                } else if (isSelected && !isCorrect) {
                                    bgColor = 'rgba(239, 68, 68, 0.15)';
                                    borderColor = 'var(--accent-red)';
                                    textColor = 'var(--accent-red)';
                                }
                            }

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleAnswer(answer)}
                                    disabled={showResult}
                                    style={{
                                        padding: '1rem 1.25rem',
                                        background: bgColor,
                                        border: `1px solid ${borderColor}`,
                                        borderRadius: '12px',
                                        color: textColor,
                                        fontSize: '0.95rem',
                                        fontWeight: 500,
                                        textAlign: 'left',
                                        cursor: showResult ? 'default' : 'pointer',
                                        transition: 'all 0.2s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    {decodeHTML(answer)}
                                    {showResult && isCorrect && <CheckCircle size={18} />}
                                    {showResult && isSelected && !isCorrect && <XCircle size={18} />}
                                </button>
                            );
                        })}
                    </div>

                    {showResult && (
                        <div className={styles.actions} style={{ marginTop: '1.5rem' }}>
                            <button onClick={nextQuestion} className={`${styles.actionBtn} ${styles.primaryBtn}`}>
                                Next Question
                            </button>
                            <button onClick={resetGame} className={styles.actionBtn}>
                                <RotateCcw size={16} /> Reset
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
