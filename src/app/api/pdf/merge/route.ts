import type { NextRequest } from 'next/server';
import { PDFService } from '@/services/pdf.service';
import { handleError, AppError } from '@/lib/errors';
import { extractFiles, createDownloadResponse } from '@/lib/validation';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        // Extract and validate files
        const files = await extractFiles(formData, 'files', {
            minCount: 2,
            maxCount: 10,
            maxSizeMB: 10,
            allowedTypes: ['pdf']
        });

        // Validate each PDF
        for (const file of files) {
            const validation = await PDFService.validate(file);
            if (!validation.valid) {
                throw AppError.badRequest(`Invalid PDF: ${validation.error}`);
            }
        }

        // Merge PDFs using service layer
        console.log(`[PDF Merge] Processing ${files.length} files...`);
        const mergedPdf = await PDFService.merge({ files });

        console.log(`[PDF Merge] Success -Size: ${mergedPdf.length} bytes`);

        return createDownloadResponse(
            mergedPdf,
            'merged.pdf',
            'application/pdf',
            {
                'X-File-Count': files.length.toString(),
                'X-Total-Size': mergedPdf.length.toString()
            }
        );

    } catch (error) {
        return handleError(error);
    }
}
