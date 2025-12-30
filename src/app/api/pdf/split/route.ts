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

        console.log(`[PDF Split] Processing file: ${file.name}`);
        const result = await PDFService.split({ file });

        console.log(`[PDF Split] Success - ${result.pageCount} pages`);

        return createJsonResponse({
            success: true,
            ...result,
            message: `PDF split into ${result.pageCount} pages`
        });

    } catch (error) {
        return handleError(error);
    }
}
