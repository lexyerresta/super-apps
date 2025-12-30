'use client';

import React, { useState, useEffect, useCallback } from 'react';
import styles from './MiniApps.module.css';
import { Gamepad2, RotateCcw, Trophy, User, Bot, Brain } from 'lucide-react';

type Player = 'X' | 'O';
type Winner = Player | 'Draw' | null;

export default function TicTacToeApp() {
    const [board, setBoard] = useState<(Player | null)[]>(Array(9).fill(null));
    const [isPlayerTurn, setIsPlayerTurn] = useState(true); // Player starts as X
    const [gameStatus, setGameStatus] = useState<Winner>(null);
    const [difficulty, setDifficulty] = useState<'easy' | 'hard'>('hard');
    const [stats, setStats] = useState({ wins: 0, losses: 0, draws: 0 });

    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    const checkWinner = (squares: (Player | null)[]): Winner => {
        for (let i = 0; i < winPatterns.length; i++) {
            const [a, b, c] = winPatterns[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        return squares.every((square) => square !== null) ? 'Draw' : null;
    };

    const minimax = (squares: (Player | null)[], depth: number, isMaximizing: boolean): number => {
        const winner = checkWinner(squares);
        if (winner === 'O') return 10 - depth;
        if (winner === 'X') return depth - 10;
        if (winner === 'Draw') return 0;

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (!squares[i]) {
                    squares[i] = 'O';
                    const score = minimax(squares, depth + 1, false);
                    squares[i] = null;
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (!squares[i]) {
                    squares[i] = 'X';
                    const score = minimax(squares, depth + 1, true);
                    squares[i] = null;
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    };

    const getBestMove = useCallback((squares: (Player | null)[]) => {
        let bestScore = -Infinity;
        let move = -1;

        // If easy, 30% random move
        if (difficulty === 'easy' && Math.random() < 0.3) {
            const available = squares.map((v, i) => v === null ? i : null).filter(v => v !== null) as number[];
            return available[Math.floor(Math.random() * available.length)];
        }

        for (let i = 0; i < 9; i++) {
            if (!squares[i]) {
                squares[i] = 'O';
                const score = minimax(squares, 0, false);
                squares[i] = null;
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }
        return move;
    }, [difficulty]);

    const handleCellClick = (index: number) => {
        if (board[index] || gameStatus || !isPlayerTurn) return;

        const newBoard = [...board];
        newBoard[index] = 'X';
        setBoard(newBoard);
        setIsPlayerTurn(false);

        const result = checkWinner(newBoard);
        if (result) {
            handleGameEnd(result);
        }
    };

    // Computer turn
    useEffect(() => {
        if (!isPlayerTurn && !gameStatus) {
            // Small delay for realism
            const timer = setTimeout(() => {
                const move = getBestMove([...board]);
                if (move !== -1) {
                    const newBoard = [...board];
                    newBoard[move] = 'O';
                    setBoard(newBoard);
                    setIsPlayerTurn(true);
                    const result = checkWinner(newBoard);
                    if (result) handleGameEnd(result);
                }
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isPlayerTurn, gameStatus, board, getBestMove]);

    const handleGameEnd = (result: Winner) => {
        setGameStatus(result);
        if (result === 'X') setStats(s => ({ ...s, wins: s.wins + 1 }));
        else if (result === 'O') setStats(s => ({ ...s, losses: s.losses + 1 }));
        else setStats(s => ({ ...s, draws: s.draws + 1 }));
    };

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setGameStatus(null);
        setIsPlayerTurn(true);
    };

    return (
        <div className={styles.appContainer}>
            <div className={styles.appHeader}>
                <div className={styles.appIconWrapper} style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
                    <Gamepad2 size={24} />
                </div>
                <div>
                    <h2>Tic Tac Toe</h2>
                    <p>Beat the AI!</p>
                </div>
            </div>

            {/* Difficulty Toggle */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', gap: '0.5rem' }}>
                <button
                    onClick={() => setDifficulty('easy')}
                    className={difficulty === 'easy' ? styles.primaryButton : styles.secondaryButton}
                    style={{ padding: '0.25rem 1rem', fontSize: '0.8rem' }}
                >
                    Easy
                </button>
                <button
                    onClick={() => setDifficulty('hard')}
                    className={difficulty === 'hard' ? styles.primaryButton : styles.secondaryButton}
                    style={{ padding: '0.25rem 1rem', fontSize: '0.8rem' }}
                >
                    <Brain size={12} style={{ marginRight: '4px' }} /> Hard
                </button>
            </div>

            {/* Game Board */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
                width: '100%',
                maxWidth: '300px',
                margin: '0 auto 1.5rem',
                backgroundColor: 'var(--glass-border)',
                padding: '8px',
                borderRadius: '16px'
            }}>
                {board.map((cell, index) => (
                    <button
                        key={index}
                        onClick={() => handleCellClick(index)}
                        disabled={!!cell || !!gameStatus || !isPlayerTurn}
                        style={{
                            aspectRatio: '1',
                            borderRadius: '8px',
                            border: 'none',
                            background: 'var(--bg-secondary)',
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            color: cell === 'X' ? 'var(--accent-blue)' : 'var(--accent-red)',
                            cursor: (!cell && !gameStatus && isPlayerTurn) ? 'pointer' : 'default',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s',
                            boxShadow: cell ? 'inset 0 2px 4px rgba(0,0,0,0.1)' : 'none'
                        }}
                    >
                        {cell}
                    </button>
                ))}
            </div>

            {/* Game Status */}
            {gameStatus && (
                <div style={{
                    textAlign: 'center',
                    marginBottom: '1rem',
                    padding: '0.75rem',
                    borderRadius: '12px',
                    background: gameStatus === 'X' ? 'rgba(34, 197, 94, 0.1)' : gameStatus === 'O' ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-secondary)',
                    border: `1px solid ${gameStatus === 'X' ? 'var(--accent-green)' : gameStatus === 'O' ? 'var(--accent-red)' : 'var(--border-color)'}`,
                    color: gameStatus === 'X' ? 'var(--accent-green)' : gameStatus === 'O' ? 'var(--accent-red)' : 'var(--text-primary)'
                }}>
                    <strong>
                        {gameStatus === 'X' ? '🎉 You Won!' : gameStatus === 'O' ? '🤖 AI Won!' : '🤝 It\'s a Draw!'}
                    </strong>
                </div>
            )}

            {/* Stats */}
            <div className={styles.grid3} style={{ marginBottom: '1rem' }}>
                <div className={`${styles.detailCard} ${styles.success}`}>
                    <Trophy size={16} />
                    <span className={styles.detailCardValue}>{stats.wins}</span>
                </div>
                <div className={`${styles.detailCard} ${styles.danger}`}>
                    <Bot size={16} />
                    <span className={styles.detailCardValue}>{stats.losses}</span>
                </div>
                <div className={styles.detailCard}>
                    <span>Draw</span>
                    <span className={styles.detailCardValue}>{stats.draws}</span>
                </div>
            </div>

            <button onClick={resetGame} className={styles.primaryButton} style={{ width: '100%' }}>
                <RotateCcw size={16} /> New Game
            </button>
        </div>
    );
}
