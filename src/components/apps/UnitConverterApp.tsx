'use client';

import React, { useState, useMemo } from 'react';
import styles from './MiniApps.module.css';
import { Ruler, Scale, Thermometer, Droplets, Grid3X3, ArrowUpDown } from 'lucide-react';

type UnitCategory = 'length' | 'weight' | 'temperature' | 'volume' | 'area';

const units: Record<UnitCategory, { [key: string]: { label: string; toBase: (v: number) => number; fromBase: (v: number) => number } }> = {
    length: {
        m: { label: 'Meters', toBase: (v) => v, fromBase: (v) => v },
        km: { label: 'Kilometers', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
        cm: { label: 'Centimeters', toBase: (v) => v / 100, fromBase: (v) => v * 100 },
        mm: { label: 'Millimeters', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
        mi: { label: 'Miles', toBase: (v) => v * 1609.34, fromBase: (v) => v / 1609.34 },
        ft: { label: 'Feet', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
        in: { label: 'Inches', toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
    },
    weight: {
        kg: { label: 'Kilograms', toBase: (v) => v, fromBase: (v) => v },
        g: { label: 'Grams', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
        lb: { label: 'Pounds', toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
        oz: { label: 'Ounces', toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
    },
    temperature: {
        c: { label: 'Celsius', toBase: (v) => v, fromBase: (v) => v },
        f: { label: 'Fahrenheit', toBase: (v) => (v - 32) * 5 / 9, fromBase: (v) => v * 9 / 5 + 32 },
        k: { label: 'Kelvin', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
    },
    volume: {
        l: { label: 'Liters', toBase: (v) => v, fromBase: (v) => v },
        ml: { label: 'Milliliters', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
        gal: { label: 'Gallons (US)', toBase: (v) => v * 3.78541, fromBase: (v) => v / 3.78541 },
    },
    area: {
        m2: { label: 'Square Meters', toBase: (v) => v, fromBase: (v) => v },
        km2: { label: 'Square Kilometers', toBase: (v) => v * 1000000, fromBase: (v) => v / 1000000 },
        ft2: { label: 'Square Feet', toBase: (v) => v * 0.092903, fromBase: (v) => v / 0.092903 },
        acre: { label: 'Acres', toBase: (v) => v * 4046.86, fromBase: (v) => v / 4046.86 },
    },
};

const categoryConfig: Record<UnitCategory, { icon: typeof Ruler; label: string }> = {
    length: { icon: Ruler, label: 'Length' },
    weight: { icon: Scale, label: 'Weight' },
    temperature: { icon: Thermometer, label: 'Temperature' },
    volume: { icon: Droplets, label: 'Volume' },
    area: { icon: Grid3X3, label: 'Area' },
};

export default function UnitConverterApp() {
    const [category, setCategory] = useState<UnitCategory>('length');
    const [fromUnit, setFromUnit] = useState('m');
    const [toUnit, setToUnit] = useState('km');
    const [value, setValue] = useState('1');

    const result = useMemo(() => {
        const numValue = parseFloat(value) || 0;
        const categoryUnits = units[category];
        const baseValue = categoryUnits[fromUnit].toBase(numValue);
        const converted = categoryUnits[toUnit].fromBase(baseValue);

        if (Math.abs(converted) < 0.001 || Math.abs(converted) > 1000000) {
            return converted.toExponential(4);
        }
        return converted.toLocaleString(undefined, { maximumFractionDigits: 6 });
    }, [category, fromUnit, toUnit, value]);

    const handleCategoryChange = (newCategory: UnitCategory) => {
        setCategory(newCategory);
        const unitKeys = Object.keys(units[newCategory]);
        setFromUnit(unitKeys[0]);
        setToUnit(unitKeys[1]);
    };

    const handleSwap = () => {
        setFromUnit(toUnit);
        setToUnit(fromUnit);
        setValue(result.replace(/,/g, ''));
    };

    return (
        <div className={styles.appContainer}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                {(Object.keys(units) as UnitCategory[]).map((cat) => {
                    const config = categoryConfig[cat];
                    const Icon = config.icon;
                    return (
                        <button
                            key={cat}
                            onClick={() => handleCategoryChange(cat)}
                            style={{
                                padding: '0.5rem 1rem',
                                background: category === cat ? 'var(--gradient-primary)' : 'var(--bg-secondary)',
                                border: '1px solid',
                                borderColor: category === cat ? 'transparent' : 'var(--glass-border)',
                                borderRadius: '50px',
                                color: category === cat ? 'white' : 'var(--text-secondary)',
                                fontWeight: 600,
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.375rem',
                            }}
                        >
                            <Icon size={14} /> {config.label}
                        </button>
                    );
                })}
            </div>

            <div style={{
                background: 'var(--bg-tertiary)',
                borderRadius: '20px',
                padding: '1.5rem',
                border: '1px solid var(--glass-border)',
            }}>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{
                        display: 'block',
                        color: 'var(--text-tertiary)',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        marginBottom: '0.5rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                    }}>
                        From
                    </label>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <input
                            type="number"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            className={styles.searchInput}
                            style={{ flex: 1 }}
                        />
                        <select
                            value={fromUnit}
                            onChange={(e) => setFromUnit(e.target.value)}
                            style={{
                                padding: '0.75rem 1rem',
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '12px',
                                color: 'var(--text-primary)',
                                fontWeight: 600,
                                cursor: 'pointer',
                                minWidth: '120px',
                            }}
                        >
                            {Object.entries(units[category]).map(([key, unit]) => (
                                <option key={key} value={key}>{unit.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', margin: '0.5rem 0' }}>
                    <button
                        onClick={handleSwap}
                        style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '50%',
                            background: 'var(--gradient-primary)',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <ArrowUpDown size={18} />
                    </button>
                </div>

                <div>
                    <label style={{
                        display: 'block',
                        color: 'var(--text-tertiary)',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        marginBottom: '0.5rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                    }}>
                        To
                    </label>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <div style={{
                            flex: 1,
                            padding: '0.875rem 1.25rem',
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--primary)',
                            borderRadius: '14px',
                            fontSize: '1.25rem',
                            fontWeight: 700,
                            color: 'var(--primary)',
                        }}>
                            {result}
                        </div>
                        <select
                            value={toUnit}
                            onChange={(e) => setToUnit(e.target.value)}
                            style={{
                                padding: '0.75rem 1rem',
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '12px',
                                color: 'var(--text-primary)',
                                fontWeight: 600,
                                cursor: 'pointer',
                                minWidth: '120px',
                            }}
                        >
                            {Object.entries(units[category]).map(([key, unit]) => (
                                <option key={key} value={key}>{unit.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className={styles.footer}>
                {value} {units[category][fromUnit].label} = {result} {units[category][toUnit].label}
            </div>
        </div>
    );
}
