import type { NextRequest } from 'next/server';
import { MediaService } from '@/services/media.service';
import { handleError, AppError } from '@/lib/errors';
import { extractFiles } from '@/lib/validation';

// Route segment config for Next.js 16
export const maxDuration = 60;

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        // Extract and validate file
        const [file] = await extractFiles(formData, 'file', {
            minCount: 1,
            maxCount: 1,
            maxSizeMB: 100,
            allowedTypes: ['audio', 'video']
        });

        const targetFormat = formData.get('format') as string;
        const quality = (formData.get('quality') as 'low' | 'medium' | 'high') || 'medium';
        const bitrate = parseInt(formData.get('bitrate') as string) || MediaService.getRecommendedBitrate(quality, 'audio');

        // Validate conversion
        const validation = MediaService.validateConversion({ file, targetFormat, quality, bitrate });
        if (!validation.valid) {
            throw AppError.badRequest(validation.error!);
        }

        // Note: Real conversion requires FFmpeg which is not available on Vercel
        // This endpoint is for external media service (Railway/Render)
        throw AppError.internal(
            'Audio conversion requires FFmpeg. Please deploy media-service to Railway or use client-side conversion.',
            'FFMPEG_NOT_AVAILABLE'
        );

    } catch (error) {
        return handleError(error);
    }
}
