import type { NextRequest } from 'next/server';
import { PDFService } from '@/services/pdf.service';
import { handleError, AppError } from '@/lib/errors';
import { extractFiles, createJsonResponse } from '@/lib/validation';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        // Extract and validate file
        const [file] = await extractFiles(formData, 'file', {
            minCount: 1,
            maxCount: 1,
            maxSizeMB: 10,
            allowedTypes: ['pdf']
        });

        const validation = await PDFService.validate(file);
        if (!validation.valid) {
            throw AppError.badRequest(`Invalid PDF: ${validation.error}`);
        }

        console.log(`[PDF Info] Processing file: ${file.name}`);
        const info = await PDFService.getInfo(file);

        return createJsonResponse(info);

    } catch (error) {
        return handleError(error);
    }
}
