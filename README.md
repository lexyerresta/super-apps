# Super Apps 🚀

A comprehensive collection of **65+ web-based utilities** built with **Clean Architecture** and **Microservices** principles.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/super-apps)

## ✨ Features

- **65+ Apps** across 8 categories
- **Clean Architecture** with separation of concerns
- **Vercel-Ready** serverless deployment
- **Type-Safe** with TypeScript
- **Production-Grade** error handling & validation

## 🏗️ Architecture

This project uses **Clean Architecture** with clear separation of layers:

```
┌─────────────────────────────────────┐
│   API Routes (Controllers)         │ ← Thin HTTP handlers
├─────────────────────────────────────┤
│   Services (Business Logic)        │ ← Core operations
├─────────────────────────────────────┤
│   Lib (Utilities)                  │ ← Validation, errors, logger
└─────────────────────────────────────┘
```

See [CLEAN_ARCHITECTURE.md](./CLEAN_ARCHITECTURE.md) for detailed documentation.

## 🛠️ Tech Stack

**Frontend**:
- Next.js 14+ (App Router)
- React 19
- TypeScript
- Vanilla CSS Modules

**Backend** (Serverless):
- Next.js API Routes
- pdf-lib (PDF processing)
- Clean service layer architecture

**Infrastructure**:
- Vercel (Frontend + PDF APIs)
- Optional: Railway/Render (Media service w/ FFmpeg)

## 🚀 Quick Deploy

### Deploy to Vercel (1-Click)

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Initial commit"
git push origin main

# 2. Deploy to Vercel
# Go to vercel.com → Import Repository
```

**What works on Vercel:**
- ✅ All 65+ client-side apps
- ✅ PDF Tools (merge, split, compress, info)
- ✅ Image processing
- ✅ All calculators, games, tools

**What needs external service:**
- ⚠️ Audio/Video conversion (requires FFmpeg)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full deployment guide.

## 💻 Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Project Structure

```
src/
├── app/
│   ├── api/              # API Routes (Controllers)
│   │   ├── pdf/          # PDF endpoints
│   │   └── health/       # Health check
│   └── page.tsx          # Frontend entry
│
├── services/             # Business Logic
│   ├── pdf.service.ts    # PDF operations
│   └── media.service.ts  # Media operations
│
├── lib/                  # Utilities
│   ├── errors.ts         # Error handling
│   ├── validation.ts     # Input validation
│   └── logger.ts         # Logging
│
└── components/           # React Components
    └── apps/             # 65+ mini apps
```

## 📡 API Endpoints

### PDF Service
```
POST /api/pdf/merge       - Merge multiple PDFs
POST /api/pdf/split       - Split PDF into pages
POST /api/pdf/compress    - Compress PDF file
POST /api/pdf/info        - Get PDF metadata
```

### Health Check
```
GET /api/health          - Service status
```

See [API Documentation](./docs/API.md) for full reference.

## 🧪 Code Quality

**Principles**:
- ✅ Clean Architecture
- ✅ Separation of Concerns
- ✅ Single Responsibility Principle
- ✅ Type Safety
- ✅ Error Handling
- ✅ Input Validation

**Example Service**:
```typescript
// src/services/pdf.service.ts
export class PDFService {
    static async merge(options: PDFMergeOptions): Promise<Uint8Array> {
        // Pure business logic
    }
}
```

**Example API Route**:
```typescript
// src/app/api/pdf/merge/route.ts
export async function POST(request: NextRequest) {
    try {
        const files = await extractFiles(formData, 'files', {...});
        const result = await PDFService.merge({ files });
        return createDownloadResponse(result, 'merged.pdf');
    } catch (error) {
        return handleError(error);
    }
}
```

## 🎯 Key Benefits

**For Developers**:
- 🧪 Easy to test (isolated layers)
- 🔧 Easy to maintain (clear structure)
- 📦 Reusable services
- 🎨 Type-safe end-to-end

**For Users**:
- ⚡ Fast serverless deployment
- 🆓 Free tier available
- 🌍 Global CDN
- 🔒 Secure processing

## 📚 Documentation

- [Clean Architecture Guide](./CLEAN_ARCHITECTURE.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Microservices Architecture](./ARCHITECTURE.md)
- [API Reference](./docs/API.md)

## 🤝 Contributing

1. **Add a new app**: Create component in `src/components/apps/`
2. **Add a new API**: Create service in `src/services/`, then route in `src/app/api/`
3. Follow clean architecture principles
4. Add TypeScript types
5. Add error handling

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📊 App Categories

- **Productivity**: Calculators, Notes, Timers, Date tools
- **Finance**: Currency, Crypto, Loan calculators
- **Utilities**: PDF tools, Converters, Generators
- **Fun**: Games, Random tools, Jokes
- **Info**: Weather, Countries, Dictionary
- **Media**: Image tools, Audio/Video (external service)

## 🔒 Security

- ✅ Input validation on all routes
- ✅ File size limits (10MB for PDF, 100MB for media)
- ✅ File type validation
- ✅ Error messages don't leak sensitive info
- ✅ CORS properly configured

## 📈 Performance

- ⚡ Edge functions (Vercel)
- 📦 Code splitting
- 🎨 Lazy loading
- 💾 Efficient file processing
- 🚀 CDN distribution

## 📝 License

Open source - MIT License

---

**Built with ❤️ using Clean Architecture principles**

Need help? See our [Documentation](./CLEAN_ARCHITECTURE.md) or open an issue!
