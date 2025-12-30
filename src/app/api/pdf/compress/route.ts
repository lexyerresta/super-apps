import type { NextRequest } from 'next/server';
import { PDFService } from '@/services/pdf.service';
import { handleError, AppError } from '@/lib/errors';
import { extractFiles, createDownloadResponse } from '@/lib/validation';

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

        const quality = (formData.get('quality') as 'low' | 'medium' | 'high') || 'medium';

        console.log(`[PDF Compress] Processing with quality: ${quality}`);
        const result = await PDFService.compress({ file, quality });

        console.log(`[PDF Compress] Success - Saved ${result.savingsPercent}%`);

        return createDownloadResponse(
            result.compressed,
            'compressed.pdf',
            'application/pdf',
            {
                'X-Original-Size': result.originalSize.toString(),
                'X-Compressed-Size': result.compressedSize.toString(),
                'X-Savings-Percent': result.savingsPercent.toString()
            }
        );

    } catch (error) {
        return handleError(error);
    }
}
