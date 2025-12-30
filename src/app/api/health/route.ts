export async function GET() {
    return Response.json({
        status: 'operational',
        services: {
            pdf: {
                available: true,
                endpoints: ['/api/pdf/merge', '/api/pdf/split', '/api/pdf/compress', '/api/pdf/info']
            },
            media: {
                available: false,
                message: 'Media conversion requires FFmpeg. Deploy media-service separately to Railway/Render.',
                endpoints: ['/api/media/convert/audio', '/api/media/convert/video']
            }
        },
        platform: 'vercel',
        timestamp: new Date().toISOString()
    });
}
