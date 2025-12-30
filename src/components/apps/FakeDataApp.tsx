'use client';
import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { Users, UserPlus } from 'lucide-react';

export default function FakeDataApp() {
    const [count, setCount] = useState(5);
    const [people, setPeople] = useState<any[]>([]);

    const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emma', 'James', 'Olivia', 'Robert', 'Sophia'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
    const emails = ['@gmail.com', '@yahoo.com', '@outlook.com', '@icloud.com', '@hotmail.com'];

    const generatePerson = () => {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${emails[Math.floor(Math.random() * emails.length)]}`;
        const age = Math.floor(Math.random() * 50) + 20;
        const phone = `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;

        return { firstName, lastName, email, age, phone };
    };

    const generate = () => {
        const data = Array.from({ length: count }, generatePerson);
        setPeople(data);
    };

    const copyJSON = () => {
        navigator.clipboard.writeText(JSON.stringify(people, null, 2));
    };

    return (
        <div className={styles.appContainer}>
            <div className={styles.inputGroup}>
                <label style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
                    Number of People
                </label>
                <input
                    type="number"
                    value={count}
                    onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                    min="1"
                    max="50"
                    className={styles.input}
                />
            </div>

            <button onClick={generate} className={`${styles.actionBtn} ${styles.primaryBtn}`} style={{ width: '100%', marginBottom: '1.5rem' }}>
                <UserPlus size={18} />
                Generate Fake Data
            </button>

            {people.length > 0 && (
                <>
                    <div style={{ marginBottom: '1rem' }}>
                        {people.map((person, idx) => (
                            <div key={idx} style={{
                                padding: '1rem',
                                background: 'var(--bg-secondary)',
                                borderRadius: '12px',
                                marginBottom: '0.75rem'
                            }}>
                                <div style={{ fontWeight: '700', marginBottom: '0.5rem' }}>
                                    {person.firstName} {person.lastName}
                                </div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                    {person.email}
                                </div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                    {person.phone} • Age: {person.age}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button onClick={copyJSON} className={styles.actionBtn} style={{ width: '100%', background: 'var(--bg-secondary)' }}>
                        Copy as JSON
                    </button>
                </>
            )}
        </div>
    );
}
