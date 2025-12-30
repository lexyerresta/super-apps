import type { NextRequest } from 'next/server';

export async function validateFormData(
    request: NextRequest,
    expectedFields: string[]
): Promise<FormData> {
    const contentType = request.headers.get('content-type');

    if (!contentType?.includes('multipart/form-data')) {
        throw new Error('Request must be multipart/form-data');
    }

    const formData = await request.formData();

    for (const field of expectedFields) {
        if (!formData.has(field)) {
            throw new Error(`Missing required field: ${field}`);
        }
    }

    return formData;
}

export function validateFileSize(file: File, maxSizeMB: number): void {
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
        throw new Error(`File size exceeds ${maxSizeMB}MB limit`);
    }
}

export function validateFileType(file: File, allowedTypes: string[]): void {
    const isValid = allowedTypes.some(type =>
        file.type.includes(type) || file.name.toLowerCase().endsWith(`.${type}`)
    );

    if (!isValid) {
        throw new Error(`File type must be one of: ${allowedTypes.join(', ')}`);
    }
}

export async function extractFiles(
    formData: FormData,
    fieldName: string,
    options?: {
        minCount?: number;
        maxCount?: number;
        maxSizeMB?: number;
        allowedTypes?: string[];
    }
): Promise<File[]> {
    const files = formData.getAll(fieldName) as File[];

    if (options?.minCount && files.length < options.minCount) {
        throw new Error(`At least ${options.minCount} files required`);
    }

    if (options?.maxCount && files.length > options.maxCount) {
        throw new Error(`Maximum ${options.maxCount} files allowed`);
    }

    for (const file of files) {
        if (options?.maxSizeMB) {
            validateFileSize(file, options.maxSizeMB);
        }

        if (options?.allowedTypes) {
            validateFileType(file, options.allowedTypes);
        }
    }

    return files;
}

export function createDownloadResponse(
    data: Uint8Array | Buffer,
    filename: string,
    contentType: string,
    metadata?: Record<string, string>
): Response {
    const headers: Record<string, string> = {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': data.length.toString(),
        ...metadata
    };

    // Convert to Buffer and typecast for Response constructor
    const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data);

    // @ts-ignore - Buffer is compatible with Response but TS doesn't recognize it
    return new Response(buffer, { status: 200, headers });
}

export function createJsonResponse<T>(
    data: T,
    status: number = 200,
    headers?: Record<string, string>
): Response {
    return Response.json(data, { status, headers });
}
