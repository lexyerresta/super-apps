# ⚡ QUICK START GUIDE
**Get productive in 5 minutes!**

---

## 🎯 Choose Your Path

### Path 1: Add New App (30 mins)
**Best for**: Learning the codebase  
**Difficulty**: ⭐⭐☆☆☆

```bash
# 1. Create the app component
cd src/components/apps
# Copy template from existing app

# 2. Add to apps config
# Edit: src/config/apps.config.ts

# 3. Register in renderer
# Edit: src/components/apps/AppRenderer.tsx

# 4. Test locally
npm run dev
```

**Example: Todo List App**
```typescript
// src/components/apps/TodoListApp.tsx
'use client';
import { useState } from 'react';
import styles from './MiniApps.module.css';

export default function TodoListApp() {
    const [todos, setTodos] = useState<string[]>([]);
    // ... rest of component
}
```

---

### Path 2: UI Improvement (15 mins)
**Best for**: Quick wins  
**Difficulty**: ⭐☆☆☆☆

```bash
# 1. Add loading spinner
# Create: src/components/ui/LoadingSpinner.tsx

# 2. Use in apps
import LoadingSpinner from '@/components/ui/LoadingSpinner';

# 3. Test
npm run dev
```

**Example: Loading Spinner**
```typescript
// src/components/ui/LoadingSpinner.tsx
export default function LoadingSpinner({ size = 32 }) {
    return (
        <div className="spinner" style={{ width: size, height: size }}>
            {/* SVG spinner */}
        </div>
    );
}
```

---

### Path 3: Service Layer (20 mins)
**Best for**: Clean architecture  
**Difficulty**: ⭐⭐⭐☆☆

```bash
# 1. Create service
# File: src/services/todo.service.ts

# 2. Add types
export interface Todo {
    id: string;
    text: string;
    completed: boolean;
}

# 3. Add CRUD methods
export class TodoService {
    static getAll(): Todo[] { /* ... */ }
    static create(text: string): Todo { /* ... */ }
    // ...
}

# 4. Use in component
import { TodoService } from '@/services/todo.service';
```

---

### Path 4: API Endpoint (25 mins)
**Best for**: Backend features  
**Difficulty**: ⭐⭐⭐⭐☆

```bash
# 1. Create route
# File: src/app/api/todos/route.ts

export async function GET() {
    // Fetch todos
}

export async function POST(request: NextRequest) {
    // Create todo
}

# 2. Use in frontend
const response = await fetch('/api/todos');
const todos = await response.json();
```

---

## 🚀 TODAY'S TASKS (Pick One)

### ⚡ Quick Win (30 mins)
```
✅ Add dark mode toggle
   1. Create ThemeContext
   2. Add toggle button
   3. Update CSS variables
   
Files to create:
- src/context/ThemeContext.tsx
- src/components/ThemeToggle.tsx
```

### 🎨 Feature Add (1 hour)
```
✅ Todo List App
   1. Create component
   2. Add localStorage
   3. Register app
   4. Test & deploy
   
Files to create:
- src/components/apps/TodoListApp.tsx
- Update: src/config/apps.config.ts
- Update: src/components/apps/AppRenderer.tsx
```

### 🏗️ Architecture (2 hours)
```
✅ Add Error Boundaries
   1. Create ErrorBoundary component
   2. Add error.tsx pages
   3. Add Toast notifications
   4. Test error cases
   
Files to create:
- src/components/ErrorBoundary.tsx
- src/components/ui/Toast.tsx
- src/app/error.tsx
```

---

## 📚 Code Templates

### Template: New App Component
```typescript
'use client';
import React, { useState } from 'react';
import styles from './MiniApps.module.css';
import { Save, Trash2 } from 'lucide-react';

export default function MyNewApp() {
    const [data, setData] = useState('');

    return (
        <div className={styles.appContainer}>
            <div className={styles.inputGroup}>
                <input
                    type="text"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    placeholder="Enter data..."
                    className={styles.input}
                />
            </div>

            <button className={`${styles.actionBtn} ${styles.primaryBtn}`}>
                <Save size={18} />
                Save
            </button>
        </div>
    );
}
```

### Template: Service Class
```typescript
// src/services/myservice.service.ts

export interface MyData {
    id: string;
    value: string;
    createdAt: Date;
}

export class MyService {
    private static STORAGE_KEY = 'my-service-data';

    static getAll(): MyData[] {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }

    static create(value: string): My Data {
        const item: MyData = {
            id: crypto.randomUUID(),
            value,
            createdAt: new Date(),
        };
        
        const all = this.getAll();
        all.push(item);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(all));
        
        return item;
    }

    static delete(id: string): void {
        const all = this.getAll().filter(item => item.id !== id);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(all));
    }
}
```

### Template: API Route
```typescript
// src/app/api/myendpoint/route.ts
import type { NextRequest } from 'next/server';
import { handleError } from '@/lib/errors';
import { createJsonResponse } from '@/lib/validation';

export async function GET() {
    try {
        const data = { message: 'Hello' };
        return createJsonResponse(data);
    } catch (error) {
        return handleError(error);
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        // Process data
        return createJsonResponse({ success: true });
    } catch (error) {
        return handleError(error);
    }
}
```

---

## 🐛 Common Issues & Fixes

### Issue: Build fails
```bash
# Clear cache
rm -rf .next
npm run build
```

### Issue: Module not found
```bash
# Check tsconfig.json paths
# Restart dev server
```

### Issue: Component not showing
```bash
# 1. Check apps.config.ts
# 2. Check AppRenderer.tsx
# 3. Clear browser cache
```

---

## ✅ Pre-commit Checklist

```
[ ] npm run build (passes)
[ ] Test on mobile
[ ] Check dark mode
[ ] Update apps.config.ts
[ ] Update AppRenderer.tsx
[ ] Git commit with clear message
```

---

## 🎓 Learning Resources

**Codebase Structure**:
```
src/
├── app/              # Next.js app router
│   ├── api/          # API endpoints
│   └── page.tsx      # Main page
├── components/       # React components
│   ├── apps/         # Mini apps (65+)
│   └── ui/           # Reusable UI
├── services/         # Business logic
├── lib/              # Utilities
└── config/           # Configuration
```

**Key Files**:
- `apps.config.ts` - App registry
- `AppRenderer.tsx` - Dynamic app loader
- `MiniApps.module.css` - Shared styles

---

## 🚀 Next Steps

1. **Read**: `TODO_COMPREHENSIVE.md`
2. **Plan**: Choose a task from `ROADMAP.md`
3. **Build**: Start with small wins
4. **Test**: `npm run dev`
5. **Deploy**: `git push` → Vercel auto-deploys

---

**Ready to code?** Let's go! 🎉

**Current Status**: ✅ Clean architecture ready  
**Apps**: 65+  
**Goal**: 80+  
**Time to first app**: 30 minutes  

**START HERE** → Pick a task from TODO_COMPREHENSIVE.md
