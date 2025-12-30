type EventType =
    | 'app_opened'
    | 'pomodoro_completed'
    | 'note_created'
    | 'favorite_added'
    | 'feedback_submitted'
    | 'custom';

interface N8nEvent {
    type: EventType;
    payload: Record<string, unknown>;
    timestamp: string;
}

interface N8nConfig {
    webhookUrl: string | null;
    enabled: boolean;
}

const STORAGE_KEY = 'n8n_config';

function getConfig(): N8nConfig {
    if (typeof window === 'undefined') {
        return { webhookUrl: null, enabled: false };
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch {
            return { webhookUrl: null, enabled: false };
        }
    }
    return { webhookUrl: null, enabled: false };
}

function saveConfig(config: N8nConfig): void {
    if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    }
}

async function sendEvent(event: N8nEvent): Promise<boolean> {
    const config = getConfig();

    if (!config.enabled || !config.webhookUrl) {
        return false;
    }

    try {
        const response = await fetch(config.webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(event),
        });
        return response.ok;
    } catch (error) {
        console.error('n8n webhook error:', error);
        return false;
    }
}

export const n8n = {
    configure(webhookUrl: string): void {
        saveConfig({ webhookUrl, enabled: true });
    },

    disable(): void {
        const config = getConfig();
        saveConfig({ ...config, enabled: false });
    },

    enable(): void {
        const config = getConfig();
        saveConfig({ ...config, enabled: true });
    },

    isEnabled(): boolean {
        return getConfig().enabled;
    },

    getWebhookUrl(): string | null {
        return getConfig().webhookUrl;
    },

    async track(type: EventType, payload: Record<string, unknown> = {}): Promise<boolean> {
        return sendEvent({
            type,
            payload: {
                ...payload,
                source: 'SuperApps',
                userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
            },
            timestamp: new Date().toISOString(),
        });
    },

    async appOpened(appId: string, appName: string): Promise<boolean> {
        return this.track('app_opened', { appId, appName });
    },

    async pomodoroCompleted(focusMinutes: number, totalSessions: number): Promise<boolean> {
        return this.track('pomodoro_completed', { focusMinutes, totalSessions });
    },

    async noteCreated(noteId: string, wordCount: number): Promise<boolean> {
        return this.track('note_created', { noteId, wordCount });
    },

    async favoriteAdded(appId: string, appName: string): Promise<boolean> {
        return this.track('favorite_added', { appId, appName });
    },

    async submitFeedback(message: string, rating?: number): Promise<boolean> {
        return this.track('feedback_submitted', { message, rating });
    },

    async custom(eventName: string, data: Record<string, unknown>): Promise<boolean> {
        return this.track('custom', { eventName, ...data });
    },
};

export type { EventType, N8nEvent, N8nConfig };
