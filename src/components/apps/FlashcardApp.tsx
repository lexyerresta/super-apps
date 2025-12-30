'use client';

import React, { useState, useEffect } from 'react';
import styles from './MiniApps.module.css';
import { BookOpen, Plus, Trash2, RotateCcw, ChevronLeft, ChevronRight, Check, X, Shuffle, Save } from 'lucide-react';

interface Flashcard {
    id: string;
    front: string;
    back: string;
    known: boolean;
}

interface Deck {
    id: string;
    name: string;
    cards: Flashcard[];
}

export default function FlashcardApp() {
    const [decks, setDecks] = useState<Deck[]>([]);
    const [currentDeck, setCurrentDeck] = useState<Deck | null>(null);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [showAddDeck, setShowAddDeck] = useState(false);
    const [showAddCard, setShowAddCard] = useState(false);
    const [newDeckName, setNewDeckName] = useState('');
    const [newCardFront, setNewCardFront] = useState('');
    const [newCardBack, setNewCardBack] = useState('');
    const [studyMode, setStudyMode] = useState(false);
    const [studyCards, setStudyCards] = useState<Flashcard[]>([]);

    // Load decks from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('flashcard-decks');
        if (saved) {
            const parsed = JSON.parse(saved);
            setDecks(parsed);
        } else {
            // Default deck for demo
            const defaultDeck: Deck = {
                id: '1',
                name: 'JavaScript Basics',
                cards: [
                    { id: '1', front: 'What is a closure?', back: 'A closure is a function that has access to variables from its outer scope, even after the outer function has returned.', known: false },
                    { id: '2', front: 'What is the difference between let and var?', back: 'let has block scope, var has function scope. let cannot be redeclared in the same scope.', known: false },
                    { id: '3', front: 'What is hoisting?', back: 'Hoisting is JavaScript\'s behavior of moving declarations to the top of their scope before code execution.', known: false },
                ]
            };
            setDecks([defaultDeck]);
        }
    }, []);

    // Save decks to localStorage
    useEffect(() => {
        if (decks.length > 0) {
            localStorage.setItem('flashcard-decks', JSON.stringify(decks));
        }
    }, [decks]);

    const createDeck = () => {
        if (!newDeckName.trim()) return;
        const newDeck: Deck = {
            id: Date.now().toString(),
            name: newDeckName.trim(),
            cards: []
        };
        setDecks([...decks, newDeck]);
        setNewDeckName('');
        setShowAddDeck(false);
    };

    const deleteDeck = (id: string) => {
        setDecks(decks.filter(d => d.id !== id));
        if (currentDeck?.id === id) {
            setCurrentDeck(null);
            setStudyMode(false);
        }
    };

    const addCard = () => {
        if (!currentDeck || !newCardFront.trim() || !newCardBack.trim()) return;
        const newCard: Flashcard = {
            id: Date.now().toString(),
            front: newCardFront.trim(),
            back: newCardBack.trim(),
            known: false
        };
        const updatedDeck = {
            ...currentDeck,
            cards: [...currentDeck.cards, newCard]
        };
        setDecks(decks.map(d => d.id === currentDeck.id ? updatedDeck : d));
        setCurrentDeck(updatedDeck);
        setNewCardFront('');
        setNewCardBack('');
        setShowAddCard(false);
    };

    const deleteCard = (cardId: string) => {
        if (!currentDeck) return;
        const updatedDeck = {
            ...currentDeck,
            cards: currentDeck.cards.filter(c => c.id !== cardId)
        };
        setDecks(decks.map(d => d.id === currentDeck.id ? updatedDeck : d));
        setCurrentDeck(updatedDeck);
    };

    const startStudy = () => {
        if (!currentDeck || currentDeck.cards.length === 0) return;
        setStudyCards([...currentDeck.cards]);
        setCurrentCardIndex(0);
        setIsFlipped(false);
        setStudyMode(true);
    };

    const shuffleCards = () => {
        const shuffled = [...studyCards].sort(() => Math.random() - 0.5);
        setStudyCards(shuffled);
        setCurrentCardIndex(0);
        setIsFlipped(false);
    };

    const markCard = (known: boolean) => {
        const updatedCards = [...studyCards];
        updatedCards[currentCardIndex] = { ...updatedCards[currentCardIndex], known };
        setStudyCards(updatedCards);

        // Also update in deck
        if (currentDeck) {
            const cardId = updatedCards[currentCardIndex].id;
            const updatedDeck = {
                ...currentDeck,
                cards: currentDeck.cards.map(c => c.id === cardId ? { ...c, known } : c)
            };
            setDecks(decks.map(d => d.id === currentDeck.id ? updatedDeck : d));
            setCurrentDeck(updatedDeck);
        }

        // Next card
        if (currentCardIndex < studyCards.length - 1) {
            setCurrentCardIndex(currentCardIndex + 1);
            setIsFlipped(false);
        }
    };

    const nextCard = () => {
        if (currentCardIndex < studyCards.length - 1) {
            setCurrentCardIndex(currentCardIndex + 1);
            setIsFlipped(false);
        }
    };

    const prevCard = () => {
        if (currentCardIndex > 0) {
            setCurrentCardIndex(currentCardIndex - 1);
            setIsFlipped(false);
        }
    };

    const progress = currentDeck ? {
        total: currentDeck.cards.length,
        known: currentDeck.cards.filter(c => c.known).length
    } : { total: 0, known: 0 };

    return (
        <div className={styles.appContainer}>
            <div className={styles.appHeader}>
                <div className={styles.appIconWrapper} style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)' }}>
                    <BookOpen size={24} />
                </div>
                <div>
                    <h2>Flashcards</h2>
                    <p>Learn with spaced repetition</p>
                </div>
            </div>

            {!currentDeck ? (
                // Deck List View
                <div className={styles.flashcardDeckList}>
                    <div className={styles.sectionHeader}>
                        <h3>Your Decks</h3>
                        <button onClick={() => setShowAddDeck(true)} className={styles.addButton}>
                            <Plus size={18} /> New Deck
                        </button>
                    </div>

                    {showAddDeck && (
                        <div className={styles.addDeckForm}>
                            <input
                                type="text"
                                value={newDeckName}
                                onChange={(e) => setNewDeckName(e.target.value)}
                                placeholder="Deck name..."
                                className={styles.input}
                                autoFocus
                            />
                            <div className={styles.formActions}>
                                <button onClick={createDeck} className={styles.primaryButton}>
                                    <Save size={16} /> Save
                                </button>
                                <button onClick={() => setShowAddDeck(false)} className={styles.secondaryButton}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    <div className={styles.deckGrid}>
                        {decks.map(deck => (
                            <div
                                key={deck.id}
                                className={styles.deckCard}
                                onClick={() => setCurrentDeck(deck)}
                            >
                                <div className={styles.deckInfo}>
                                    <h4>{deck.name}</h4>
                                    <p>{deck.cards.length} cards</p>
                                    <div className={styles.deckProgress}>
                                        <div
                                            className={styles.deckProgressBar}
                                            style={{
                                                width: `${deck.cards.length > 0 ? (deck.cards.filter(c => c.known).length / deck.cards.length) * 100 : 0}%`
                                            }}
                                        />
                                    </div>
                                    <span className={styles.deckProgressText}>
                                        {deck.cards.filter(c => c.known).length} / {deck.cards.length} learned
                                    </span>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); deleteDeck(deck.id); }}
                                    className={styles.iconButton}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {decks.length === 0 && (
                        <div className={styles.emptyState}>
                            <BookOpen size={48} />
                            <p>No decks yet. Create your first deck!</p>
                        </div>
                    )}
                </div>
            ) : studyMode ? (
                // Study Mode
                <div className={styles.studyMode}>
                    <div className={styles.studyHeader}>
                        <button onClick={() => setStudyMode(false)} className={styles.backButton}>
                            <ChevronLeft size={20} /> Back
                        </button>
                        <span className={styles.cardCounter}>
                            {currentCardIndex + 1} / {studyCards.length}
                        </span>
                        <button onClick={shuffleCards} className={styles.iconButton} title="Shuffle">
                            <Shuffle size={20} />
                        </button>
                    </div>

                    <div
                        className={`${styles.flashcard} ${isFlipped ? styles.flipped : ''}`}
                        onClick={() => setIsFlipped(!isFlipped)}
                    >
                        <div className={styles.flashcardInner}>
                            <div className={styles.flashcardFront}>
                                <span className={styles.cardLabel}>Question</span>
                                <p>{studyCards[currentCardIndex]?.front}</p>
                                <span className={styles.tapHint}>Tap to flip</span>
                            </div>
                            <div className={styles.flashcardBack}>
                                <span className={styles.cardLabel}>Answer</span>
                                <p>{studyCards[currentCardIndex]?.back}</p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.studyControls}>
                        <button
                            onClick={prevCard}
                            className={styles.navButton}
                            disabled={currentCardIndex === 0}
                        >
                            <ChevronLeft size={24} />
                        </button>

                        <div className={styles.markButtons}>
                            <button
                                onClick={() => markCard(false)}
                                className={`${styles.markButton} ${styles.markUnknown}`}
                            >
                                <X size={20} /> Still Learning
                            </button>
                            <button
                                onClick={() => markCard(true)}
                                className={`${styles.markButton} ${styles.markKnown}`}
                            >
                                <Check size={20} /> Got It!
                            </button>
                        </div>

                        <button
                            onClick={nextCard}
                            className={styles.navButton}
                            disabled={currentCardIndex === studyCards.length - 1}
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>
            ) : (
                // Deck Detail View
                <div className={styles.deckDetail}>
                    <div className={styles.deckDetailHeader}>
                        <button onClick={() => setCurrentDeck(null)} className={styles.backButton}>
                            <ChevronLeft size={20} /> Decks
                        </button>
                        <h3>{currentDeck.name}</h3>
                    </div>

                    <div className={styles.deckStats}>
                        <div className={styles.statCard}>
                            <span className={styles.statValue}>{progress.total}</span>
                            <span className={styles.statLabel}>Total Cards</span>
                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statValue}>{progress.known}</span>
                            <span className={styles.statLabel}>Learned</span>
                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statValue}>{progress.total - progress.known}</span>
                            <span className={styles.statLabel}>To Learn</span>
                        </div>
                    </div>

                    <div className={styles.deckActions}>
                        <button
                            onClick={startStudy}
                            className={styles.primaryButton}
                            disabled={currentDeck.cards.length === 0}
                        >
                            <RotateCcw size={18} /> Start Study
                        </button>
                        <button onClick={() => setShowAddCard(true)} className={styles.secondaryButton}>
                            <Plus size={18} /> Add Card
                        </button>
                    </div>

                    {showAddCard && (
                        <div className={styles.addCardForm}>
                            <div className={styles.formGroup}>
                                <label>Front (Question)</label>
                                <textarea
                                    value={newCardFront}
                                    onChange={(e) => setNewCardFront(e.target.value)}
                                    placeholder="Enter the question..."
                                    rows={2}
                                    className={styles.textarea}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Back (Answer)</label>
                                <textarea
                                    value={newCardBack}
                                    onChange={(e) => setNewCardBack(e.target.value)}
                                    placeholder="Enter the answer..."
                                    rows={2}
                                    className={styles.textarea}
                                />
                            </div>
                            <div className={styles.formActions}>
                                <button onClick={addCard} className={styles.primaryButton}>
                                    <Save size={16} /> Save Card
                                </button>
                                <button onClick={() => setShowAddCard(false)} className={styles.secondaryButton}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    <div className={styles.cardList}>
                        <h4>Cards ({currentDeck.cards.length})</h4>
                        {currentDeck.cards.map((card, index) => (
                            <div key={card.id} className={`${styles.cardListItem} ${card.known ? styles.known : ''}`}>
                                <span className={styles.cardNumber}>{index + 1}</span>
                                <div className={styles.cardContent}>
                                    <p className={styles.cardFront}>{card.front}</p>
                                    <p className={styles.cardBack}>{card.back}</p>
                                </div>
                                <div className={styles.cardStatus}>
                                    {card.known && <Check size={16} className={styles.knownIcon} />}
                                </div>
                                <button onClick={() => deleteCard(card.id)} className={styles.iconButton}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
