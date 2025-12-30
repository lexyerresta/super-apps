'use client';

import React, { useState, useCallback } from 'react';
import styles from './MiniApps.module.css';
import { Delete, Divide, X, Minus, Plus, Equal, Percent } from 'lucide-react';

export default function CalculatorApp() {
    const [display, setDisplay] = useState('0');
    const [expression, setExpression] = useState('');
    const [isNewNumber, setIsNewNumber] = useState(true);

    const handleNumber = useCallback((num: string) => {
        if (isNewNumber) {
            setDisplay(num);
            setIsNewNumber(false);
        } else {
            setDisplay(prev => prev === '0' ? num : prev + num);
        }
    }, [isNewNumber]);

    const handleOperator = useCallback((op: string) => {
        setExpression(prev => prev + display + ' ' + op + ' ');
        setIsNewNumber(true);
    }, [display]);

    const handleDecimal = useCallback(() => {
        if (!display.includes('.')) {
            setDisplay(prev => prev + '.');
            setIsNewNumber(false);
        }
    }, [display]);

    const calculate = useCallback(() => {
        try {
            const fullExpression = expression + display;
            const sanitized = fullExpression
                .replace(/×/g, '*')
                .replace(/÷/g, '/')
                .replace(/%/g, '/100');
            const result = Function('"use strict"; return (' + sanitized + ')')();
            setDisplay(String(parseFloat(result.toFixed(10))));
            setExpression('');
            setIsNewNumber(true);
        } catch {
            setDisplay('Error');
            setExpression('');
            setIsNewNumber(true);
        }
    }, [expression, display]);

    const clear = useCallback(() => {
        setDisplay('0');
        setExpression('');
        setIsNewNumber(true);
    }, []);

    const backspace = useCallback(() => {
        if (display.length > 1) {
            setDisplay(prev => prev.slice(0, -1));
        } else {
            setDisplay('0');
            setIsNewNumber(true);
        }
    }, [display]);

    const handlePercent = useCallback(() => {
        setDisplay(prev => String(parseFloat(prev) / 100));
    }, []);

    const buttons = [
        { label: 'C', action: clear, type: 'clear' },
        { label: <Delete size={20} />, action: backspace, type: 'operator' },
        { label: <Percent size={18} />, action: handlePercent, type: 'operator' },
        { label: <Divide size={20} />, action: () => handleOperator('÷'), type: 'operator' },
        { label: '7', action: () => handleNumber('7') },
        { label: '8', action: () => handleNumber('8') },
        { label: '9', action: () => handleNumber('9') },
        { label: <X size={20} />, action: () => handleOperator('×'), type: 'operator' },
        { label: '4', action: () => handleNumber('4') },
        { label: '5', action: () => handleNumber('5') },
        { label: '6', action: () => handleNumber('6') },
        { label: <Minus size={20} />, action: () => handleOperator('-'), type: 'operator' },
        { label: '1', action: () => handleNumber('1') },
        { label: '2', action: () => handleNumber('2') },
        { label: '3', action: () => handleNumber('3') },
        { label: <Plus size={20} />, action: () => handleOperator('+'), type: 'operator' },
        { label: '0', action: () => handleNumber('0') },
        { label: '.', action: handleDecimal },
        { label: '00', action: () => { handleNumber('0'); handleNumber('0'); } },
        { label: <Equal size={20} />, action: calculate, type: 'equals' },
    ];

    return (
        <div className={styles.appContainer}>
            <div className={styles.calculator}>
                <div className={styles.calcDisplay}>
                    <div className={styles.calcExpression}>{expression}</div>
                    <div className={styles.calcResult}>{display}</div>
                </div>

                <div className={styles.calcButtons}>
                    {buttons.map((btn, index) => (
                        <button
                            key={index}
                            onClick={btn.action}
                            className={`${styles.calcBtn} ${btn.type ? styles[btn.type] : ''}`}
                        >
                            {btn.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
