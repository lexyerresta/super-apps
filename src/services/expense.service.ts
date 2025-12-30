export interface Transaction {
    id: string;
    type: 'income' | 'expense';
    amount: number;
    category: string;
    description: string;
    date: string;
    createdAt: string;
}

export interface CategoryStats {
    category: string;
    total: number;
    count: number;
    percentage: number;
}

export class ExpenseService {
    private static STORAGE_KEY = 'super-apps-expenses';

    static getAll(): Transaction[] {
        if (typeof window === 'undefined') return [];
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }

    static create(
        type: Transaction['type'],
        amount: number,
        category: string,
        description: string,
        date?: string
    ): Transaction {
        const transaction: Transaction = {
            id: crypto.randomUUID(),
            type,
            amount,
            category,
            description,
            date: date || new Date().toISOString().split('T')[0],
            createdAt: new Date().toISOString(),
        };

        const transactions = this.getAll();
        transactions.unshift(transaction);
        this.save(transactions);

        return transaction;
    }

    static delete(id: string): void {
        const transactions = this.getAll().filter(t => t.id !== id);
        this.save(transactions);
    }

    static getStats(transactions: Transaction[]) {
        const income = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const expenses = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const balance = income - expenses;

        return { income, expenses, balance };
    }

    static getCategoryStats(transactions: Transaction[]): CategoryStats[] {
        const expenses = transactions.filter(t => t.type === 'expense');
        const total = expenses.reduce((sum, t) => sum + t.amount, 0);

        const categoryMap = new Map<string, { total: number; count: number }>();

        expenses.forEach(t => {
            const current = categoryMap.get(t.category) || { total: 0, count: 0 };
            categoryMap.set(t.category, {
                total: current.total + t.amount,
                count: current.count + 1
            });
        });

        return Array.from(categoryMap.entries())
            .map(([category, data]) => ({
                category,
                total: data.total,
                count: data.count,
                percentage: total > 0 ? (data.total / total) * 100 : 0
            }))
            .sort((a, b) => b.total - a.total);
    }

    static filterByDateRange(transactions: Transaction[], days: number): Transaction[] {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        const cutoffStr = cutoffDate.toISOString().split('T')[0];

        return transactions.filter(t => t.date >= cutoffStr);
    }

    static exportToCSV(): string {
        const transactions = this.getAll();
        const headers = ['Date', 'Type', 'Category', 'Description', 'Amount'];
        const rows = transactions.map(t => [
            t.date,
            t.type,
            t.category,
            t.description,
            t.amount.toString()
        ]);

        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    private static save(transactions: Transaction[]): void {
        if (typeof window === 'undefined') return;
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(transactions));
    }
}

export const EXPENSE_CATEGORIES = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Education',
    'Other'
];

export const INCOME_CATEGORIES = [
    'Salary',
    'Freelance',
    'Investment',
    'Gift',
    'Other'
];
