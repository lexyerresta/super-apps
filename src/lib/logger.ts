export class Logger {
    private static formatMessage(level: string, message: string, meta?: any): string {
        const timestamp = new Date().toISOString();
        const metaStr = meta ? ` | ${JSON.stringify(meta)}` : '';
        return `[${timestamp}] [${level}] ${message}${metaStr}`;
    }

    static info(message: string, meta?: any) {
        console.log(this.formatMessage('INFO', message, meta));
    }

    static error(message: string, error?: any, meta?: any) {
        const errorMeta = error instanceof Error
            ? { error: error.message, stack: error.stack, ...meta }
            : { error, ...meta };
        console.error(this.formatMessage('ERROR', message, errorMeta));
    }

    static warn(message: string, meta?: any) {
        console.warn(this.formatMessage('WARN', message, meta));
    }

    static debug(message: string, meta?: any) {
        if (process.env.NODE_ENV === 'development') {
            console.debug(this.formatMessage('DEBUG', message, meta));
        }
    }

    static apiRequest(method: string, path: string, meta?: any) {
        this.info(`${method} ${path}`, meta);
    }

    static apiResponse(method: string, path: string, status: number, duration?: number) {
        this.info(`${method} ${path} - ${status}`, { duration: duration ? `${duration}ms` : undefined });
    }
}
