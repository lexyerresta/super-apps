# Environment Variables Configuration

Copy this file to `.env.local` for local development.

## PDF Service
```env
# Use local API route (default for Vercel)
NEXT_PUBLIC_PDF_SERVICE_URL=/api/pdf
```

## Media Service
For audio/video conversion, deploy the media service to Railway/Render:
```env
NEXT_PUBLIC_MEDIA_SERVICE_URL=https://your-media-service.railway.app
```

## File Size Limits
```env
NEXT_PUBLIC_MAX_PDF_SIZE_MB=10
NEXT_PUBLIC_MAX_MEDIA_SIZE_MB=100
```

## Development
```env
NODE_ENV=development
```

## Production (Vercel)
Vercel will automatically use `/api/pdf` for PDF operations.  
For media conversion, add the Railway/Render URL to Vercel environment variables.
