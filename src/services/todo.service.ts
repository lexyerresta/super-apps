export interface Todo {
    id: string;
    text: string;
    completed: boolean;
    category: 'work' | 'personal' | 'shopping' | 'other';
    priority: 'low' | 'medium' | 'high';
    dueDate?: string;
    createdAt: string;
}

export interface TodoFilter {
    status: 'all' | 'active' | 'completed';
    category?: string;
    priority?: string;
}

export class TodoService {
    private static STORAGE_KEY = 'super-apps-todos';

    static getAll(): Todo[] {
        if (typeof window === 'undefined') return [];
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }

    static create(text: string, category: Todo['category'], priority: Todo['priority'], dueDate?: string): Todo {
        const todo: Todo = {
            id: crypto.randomUUID(),
            text,
            completed: false,
            category,
            priority,
            dueDate,
            createdAt: new Date().toISOString(),
        };

        const todos = this.getAll();
        todos.unshift(todo);
        this.save(todos);

        return todo;
    }

    static update(id: string, updates: Partial<Todo>): void {
        const todos = this.getAll();
        const index = todos.findIndex(t => t.id === id);

        if (index !== -1) {
            todos[index] = { ...todos[index], ...updates };
            this.save(todos);
        }
    }

    static delete(id: string): void {
        const todos = this.getAll().filter(t => t.id !== id);
        this.save(todos);
    }

    static toggle(id: string): void {
        const todos = this.getAll();
        const todo = todos.find(t => t.id === id);

        if (todo) {
            todo.completed = !todo.completed;
            this.save(todos);
        }
    }

    static filter(todos: Todo[], filter: TodoFilter): Todo[] {
        let filtered = todos;

        // Filter by status
        if (filter.status === 'active') {
            filtered = filtered.filter(t => !t.completed);
        } else if (filter.status === 'completed') {
            filtered = filtered.filter(t => t.completed);
        }

        // Filter by category
        if (filter.category && filter.category !== 'all') {
            filtered = filtered.filter(t => t.category === filter.category);
        }

        // Filter by priority
        if (filter.priority && filter.priority !== 'all') {
            filtered = filtered.filter(t => t.priority === filter.priority);
        }

        return filtered;
    }

    static getStats(todos: Todo[]) {
        return {
            total: todos.length,
            active: todos.filter(t => !t.completed).length,
            completed: todos.filter(t => t.completed).length,
            byCategory: {
                work: todos.filter(t => t.category === 'work').length,
                personal: todos.filter(t => t.category === 'personal').length,
                shopping: todos.filter(t => t.category === 'shopping').length,
                other: todos.filter(t => t.category === 'other').length,
            },
            byPriority: {
                high: todos.filter(t => t.priority === 'high' && !t.completed).length,
                medium: todos.filter(t => t.priority === 'medium' && !t.completed).length,
                low: todos.filter(t => t.priority === 'low' && !t.completed).length,
            }
        };
    }

    private static save(todos: Todo[]): void {
        if (typeof window === 'undefined') return;
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(todos));
    }

    static clearCompleted(): void {
        const todos = this.getAll().filter(t => !t.completed);
        this.save(todos);
    }

    static export(): string {
        return JSON.stringify(this.getAll(), null, 2);
    }

    static import(data: string): void {
        try {
            const todos = JSON.parse(data);
            if (Array.isArray(todos)) {
                this.save(todos);
            }
        } catch (error) {
            throw new Error('Invalid import data');
        }
    }
}
