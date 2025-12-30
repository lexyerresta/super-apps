# Deployment Guide

## Vercel Deployment (Recommended for Frontend)

Super Apps is optimized for deployment on Vercel with built-in serverless functions.

### Architecture on Vercel

```
Vercel Platform
├── Frontend (Next.js) - Static + SSR
└── API Routes (/api/*) - Serverless Functions
    ├── /api/pdf/merge
    ├── /api/pdf/split
    ├── /api/pdf/compress
    └── /api/pdf/info
```

### Deploy to Vercel

1. **Push to GitHub/GitLab**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository
   - Vercel will auto-detect Next.js

3. **Environment Variables** (Optional)
   ```
   # Leave empty to use built-in API routes
   NEXT_PUBLIC_PDF_SERVICE_URL=/api/pdf
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app is live! 🚀

### Limitations on Vercel

⚠️ **Serverless Function Limits:**
- Max execution time: 10s (Hobby), 60s (Pro)
- Max payload size: 4.5MB
- No FFmpeg available (audio/video conversion won't work on Vercel)

✅ **What Works on Vercel:**
- ✅ All 65+ client-side apps
- ✅ PDF merge, split, compress, info
- ✅ Image processing (client-side)
- ✅ All calculators, tools, games

❌ **What Doesn't Work on Vercel:**
- ❌ Audio conversion (needs FFmpeg)
- ❌ Video conversion (needs FFmpeg)
- ❌ Large file processing (>4.5MB)

### Solution: Hybrid Deployment

For full functionality, use this hybrid approach:

**Option 1: Vercel + Railway**
```
Vercel (Frontend + PDF APIs)
    ↓
Railway (Media Service only)
```

**Option 2: Vercel + Render**
```
Vercel (Frontend + PDF APIs)
    ↓
Render (Media Service only)
```

## Railway Deployment (For Media Service)

[Railway](https://railway.app) supports Docker and FFmpeg.

### Deploy Media Service to Railway

1. **Create `railway.json`** (already included)
2. **Push to GitHub**
3. **Deploy:**
   - Go to railway.app
   - New Project → Deploy from GitHub
   - Select `backend/media-service`
   - Railway will auto-detect Dockerfile

4. **Get Service URL:**
   - Copy the Railway deployment URL
   - Format: `https://your-service.railway.app`

5. **Update Vercel Environment:**
   ```
   NEXT_PUBLIC_MEDIA_SERVICE_URL=https://your-service.railway.app
   ```

## Alternative: Full Docker Deployment

### Deploy to Railway (All Services)

```bash
# Deploy entire docker-compose
railway up
```

### Deploy to Render

1. Create a new Web Service for each:
   - Frontend
   - PDF Service
   - Media Service

2. Configure each with Dockerfile

### Deploy to AWS ECS/Fargate

1. Build images:
   ```bash
   docker-compose build
   ```

2. Push to ECR
3. Create ECS Task Definitions
4. Deploy to Fargate

### Deploy to Google Cloud Run

```bash
# Deploy each service
gcloud run deploy web --source .
gcloud run deploy pdf-service --source ./backend/pdf-service
gcloud run deploy media-service --source ./backend/media-service
```

## Environment Variables

### Vercel (Frontend)
```env
NEXT_PUBLIC_PDF_SERVICE_URL=/api/pdf
NEXT_PUBLIC_MEDIA_SERVICE_URL=https://media-service.railway.app
```

### Local Development
```env
NEXT_PUBLIC_PDF_SERVICE_URL=http://localhost:3001
NEXT_PUBLIC_MEDIA_SERVICE_URL=http://localhost:3002
```

### Docker Production
```env
NEXT_PUBLIC_PDF_SERVICE_URL=http://pdf-service:3001
NEXT_PUBLIC_MEDIA_SERVICE_URL=http://media-service:3002
```

## Recommended Setup

🎯 **For Maximum Compatibility:**

1. **Vercel** - Frontend + PDF APIs (built-in)
2. **Railway** - Media Service (FFmpeg support)

This gives you:
- ✅ Free tier on both platforms
- ✅ Auto-scaling
- ✅ Global CDN
- ✅ HTTPS included
- ✅ All features working

## Cost Breakdown

### Free Tier (Recommended)
- **Vercel**: Unlimited bandwidth, 100GB/month
- **Railway**: $5 credit/month (Media service only)
- **Total**: ~$0-5/month

### Paid Tier (Scale)
- **Vercel Pro**: $20/month
- **Railway Pro**: $20/month
- **Total**: ~$40/month

## Quick Deploy Buttons

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/super-apps)

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template)

## Post-Deployment Checklist

- [ ] Frontend deployed and accessible
- [ ] PDF APIs working (test merge)
- [ ] Media service deployed (if using)
- [ ] Environment variables set
- [ ] Custom domain configured (optional)
- [ ] Analytics added (optional)
- [ ] Error monitoring (Sentry, optional)

## Troubleshooting

### PDF APIs not working on Vercel
- Check `/api/pdf/merge` endpoint manually
- Verify file size < 4.5MB
- Check Vercel function logs

### Media conversion fails
- Ensure Railway deployment is active
- Check NEXT_PUBLIC_MEDIA_SERVICE_URL env var
- Verify Railway service is running

### Timeout errors
- Reduce file size
- Upgrade to Vercel Pro (60s timeout)
- Use Railway for heavy processing

## Support

Need help? Check:
- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
