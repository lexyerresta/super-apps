export class AppError extends Error {
    constructor(
        public statusCode: number,
        public message: string,
        public code?: string
    ) {
        super(message);
        this.name = 'AppError';
    }

    static badRequest(message: string, code?: string) {
        return new AppError(400, message, code);
    }

    static notFound(message: string, code?: string) {
        return new AppError(404, message, code);
    }

    static internal(message: string, code?: string) {
        return new AppError(500, message, code);
    }

    static payloadTooLarge(message: string, code?: string) {
        return new AppError(413, message, code);
    }

    static timeout(message: string, code?: string) {
        return new AppError(408, message, code);
    }

    toJSON() {
        return {
            error: this.message,
            code: this.code,
            statusCode: this.statusCode
        };
    }
}

export function handleError(error: any): Response {
    console.error('Error:', error);

    if (error instanceof AppError) {
        return Response.json(error.toJSON(), { status: error.statusCode });
    }

    // PDF-lib specific errors
    if (error.message?.includes('PDF')) {
        return Response.json(
            { error: 'Invalid or corrupted PDF file', message: error.message },
            { status: 400 }
        );
    }

    // Generic error
    return Response.json(
        {
            error: 'Internal server error',
            message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
        },
        { status: 500 }
    );
}

export async function withErrorHandling<T>(
    fn: () => Promise<T>
): Promise<T | Response> {
    try {
        return await fn();
    } catch (error) {
        return handleError(error);
    }
}
