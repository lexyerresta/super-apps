export interface MediaConversionOptions {
    file: File;
    targetFormat: string;
    quality?: 'low' | 'medium' | 'high';
    bitrate?: number;
}

export interface MediaInfo {
    format: string;
    duration: number;
    size: number;
    bitrate: number;
    type: 'audio' | 'video' | 'unknown';
}

export class MediaService {
    /**
     * Check if browser supports the conversion
     * Note: Real conversion happens server-side, this is client validation
     */
    static validateConversion(options: MediaConversionOptions): { valid: boolean; error?: string } {
        const { file, targetFormat } = options;

        // Validate file size (100MB limit for Vercel)
        if (file.size > 100 * 1024 * 1024) {
            return { valid: false, error: 'File size must be less than 100MB' };
        }

        // Validate audio formats
        const audioFormats = ['mp3', 'wav', 'ogg', 'aac', 'm4a', 'flac', 'aiff', 'wma'];
        const videoFormats = ['mp4', 'webm', 'avi', 'mov', 'mkv'];

        const isAudioSource = file.type.startsWith('audio/');
        const isVideoSource = file.type.startsWith('video/');

        if (!isAudioSource && !isVideoSource) {
            return { valid: false, error: 'File must be audio or video' };
        }

        if (isAudioSource && !audioFormats.includes(targetFormat.toLowerCase())) {
            return { valid: false, error: 'Invalid audio target format' };
        }

        return { valid: true };
    }

    /**
     * Get estimated processing time (for UI feedback)
     */
    static estimateProcessingTime(fileSizeBytes: number, operation: 'convert' | 'extract'): number {
        // Rough estimate in seconds
        const sizeMB = fileSizeBytes / (1024 * 1024);

        switch (operation) {
            case 'convert':
                return Math.max(5, Math.ceil(sizeMB * 2)); // ~2 seconds per MB
            case 'extract':
                return Math.max(3, Math.ceil(sizeMB * 1)); // ~1 second per MB
            default:
                return 5;
        }
    }

    /**
     * Format duration from seconds
     */
    static formatDuration(seconds: number): string {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }

    /**
     * Get recommended bitrate based on quality
     */
    static getRecommendedBitrate(quality: 'low' | 'medium' | 'high', type: 'audio' | 'video'): number {
        if (type === 'audio') {
            return {
                low: 128,
                medium: 192,
                high: 320
            }[quality];
        } else {
            return {
                low: 500,
                medium: 1000,
                high: 2500
            }[quality];
        }
    }
}
