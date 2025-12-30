# Clean Architecture Guide

## 📁 Project Structure

```
src/
├── app/
│   └── api/                    # API Routes (Thin Controllers)
│       ├── pdf/
│       │   ├── merge/route.ts       # POST /api/pdf/merge
│       │   ├── split/route.ts       # POST /api/pdf/split
│       │   ├── compress/route.ts    # POST /api/pdf/compress
│       │   └── info/route.ts        # POST /api/pdf/info
│       ├── media/
│       │   └── convert/
│       │       └── audio/route.ts   # POST /api/media/convert/audio
│       └── health/route.ts          # GET /api/health
│
├── services/                   # Business Logic Layer
│   ├── pdf.service.ts          # PDF operations (merge, split, compress, info, validate)
│   └── media.service.ts        # Media operations (validate, estimate, format)
│
├── lib/                        # Utilities & Helpers
│   ├── errors.ts               # Error handling (AppError, handleError)
│   ├── validation.ts           # Input validation (validateFormData, extractFiles)
│   └── logger.ts               # Structured logging
│
└── components/                 # Frontend Components
    └── apps/
        ├── PDFToolsApp.tsx     # PDF UI (calls /api/pdf/*)
        └── AudioConverterApp.tsx  # Audio UI (calls /api/media/*)
```

## 🏗️ Architecture Layers

### 1. API Routes (Controllers)
**Location**: `src/app/api/`

**Purpose**: Thin controllers that handle HTTP requests

**Responsibilities**:
- Parse request data
- Validate inputs using `lib/validation.ts`
- Call service layer
- Format responses
- Handle errors using `lib/errors.ts`

**Example**:
```typescript
// src/app/api/pdf/merge/route.ts
export async function POST(request: NextRequest) {
    try {
        // 1. Extract & validate
        const files = await extractFiles(formData, 'files', {...});
        
        // 2. Call service layer
        const result = await PDFService.merge({ files });
        
        // 3. Return response
        return createDownloadResponse(result, 'merged.pdf', 'application/pdf');
    } catch (error) {
        return handleError(error);
    }
}
```

**Rules**:
- ✅ Keep routes thin (< 30 lines)
- ✅ Always use try-catch with handleError()
- ✅ Validate all inputs
- ✅ Log important actions
- ❌ No business logic in routes
- ❌ No direct PDF/media library usage

### 2. Service Layer
**Location**: `src/services/`

**Purpose**: Business logic and core operations

**Responsibilities**:
- Core PDF/media processing
- Business rules
- Data validation
- Complex calculations

**Example**:
```typescript
// src/services/pdf.service.ts
export class PDFService {
    static async merge(options: PDFMergeOptions): Promise<Uint8Array> {
        // Business logic here
    }
    
    static async validate(file: File): Promise<ValidationResult> {
        // Validation logic
    }
}
```

**Rules**:
- ✅ Pure functions when possible
- ✅ Return typed results
- ✅ Throw AppError for known errors
- ✅ Static methods for stateless operations
- ❌ No HTTP/request handling
- ❌ No response formatting

### 3. Lib Layer
**Location**: `src/lib/`

**Purpose**: Reusable utilities

**Components**:
- `errors.ts`: Error handling
- `validation.ts`: Input validation
- `logger.ts`: Structured logging

**Example**:
```typescript
// src/lib/validation.ts
export async function extractFiles(
    formData: FormData,
    fieldName: string,
    options: FileOptions
): Promise<File[]> {
    // Validation logic
}
```

**Rules**:
- ✅ Framework-agnostic when possible
- ✅ Fully typed
- ✅ Well-tested
- ❌ No business logic

## 🔄 Data Flow

```
User Request
    ↓
API Route (Controller)
    ↓ validate using lib/validation.ts
    ↓
Service Layer (Business Logic)
    ↓ process data
    ↓
API Route (Controller)
    ↓ format response
    ↓
User Response
```

## 📝 Adding New Features

### Example: Add "Rotate PDF" Feature

**Step 1**: Add to Service Layer
```typescript
// src/services/pdf.service.ts
static async rotate(options: PDFRotateOptions): Promise<Uint8Array> {
    const { file, angle } = options;
    const pdfDoc = await PDFDocument.load(...);
    const pages = pdfDoc.getPages();
    pages[0].setRotation(degrees(angle));
    return await pdfDoc.save();
}
```

**Step 2**: Create API Route
```typescript
// src/app/api/pdf/rotate/route.ts
export async function POST(request: NextRequest) {
    try {
        const [file] = await extractFiles(formData, 'file', {...});
        const angle = parseInt(formData.get('angle') as string);
        
        const result = await PDFService.rotate({ file, angle });
        
        return createDownloadResponse(result, 'rotated.pdf', 'application/pdf');
    } catch (error) {
        return handleError(error);
    }
}
```

**Step 3**: Update Frontend
```typescript
// src/components/apps/PDFToolsApp.tsx
const rotate = async () => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('angle', '90');
    
    const response = await fetch('/api/pdf/rotate', {
        method: 'POST',
        body: formData,
    });
    // Handle response
};
```

## 🧪 Testing Strategy

### Unit Tests (Services)
```typescript
describe('PDFService', () => {
    test('merge should combine multiple PDFs', async () => {
        const files = [mockPDF1, mockPDF2];
        const result = await PDFService.merge({ files });
        expect(result).toBeInstanceOf(Uint8Array);
    });
});
```

### Integration Tests (API Routes)
```typescript
describe('POST /api/pdf/merge', () => {
    test('should return merged PDF', async () => {
        const formData = new FormData();
        formData.append('files', file1);
        formData.append('files', file2);
        
        const response = await POST(mockRequest);
        expect(response.status).toBe(200);
    });
});
```

## 🚀 Benefits

✅ **Separation of Concerns**: Clear boundaries between layers
✅ **Testability**: Each layer can be tested independently
✅ **Reusability**: Services can be used by multiple routes
✅ **Maintainability**: Easy to locate and modify code
✅ **Scalability**: Add features without touching existing code
✅ **Type Safety**: Full TypeScript coverage

## 🎯 Best Practices

### DO ✅
- Use dependency injection for testability
- Keep functions small and focused
- Add comprehensive error handling
- Log all important operations
- Validate all inputs
- Return typed results
- Use const assertions
- Document public APIs

### DON'T ❌
- Mix business logic in routes
- Duplicate code across services
- Ignore error handling
- Skip input validation
- Use `any` type
- Couple frontend to backend structure
- Hard-code configuration

## 🔒 Security

- ✅ Validate file sizes (prevent DOS)
- ✅ Validate file types (prevent malicious files)
- ✅ Sanitize inputs
- ✅ Use content type headers
- ✅ Implement rate limiting (future)
- ✅ Add CORS properly

## 📊 Performance

- Use streaming for large files
- Implement caching where appropriate
- Limit concurrent operations
- Add timeout handling
- Monitor memory usage
- Use lazy loading

## 🔄 Migration from Monolith

If migrating from tightly coupled code:

1. **Identify** business logic in routes
2. **Extract** to service layer
3. **Create** validation utilities
4. **Refactor** routes to be thin
5. **Test** each layer independently
6. **Deploy** with confidence

## 📚 Resources

- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
