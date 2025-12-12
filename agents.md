# AGENTS.md — Jura Frontend

> **For AI coding agents.** Follow these rules when generating or modifying code.

---

## Stack

- **Build:** Vite
- **Language:** TypeScript (strict mode required)
- **Framework:** React
- **Styling:** Tailwind CSS
- **Data Fetching:** TanStack Query

---

## Project Structure

```
src/
├── features/[featureName]/
│   ├── components/
│   ├── hooks/
│   └── api/
├── shared/
│   ├── ui/          # Reusable UI components
│   ├── api/         # Query keys, base fetchers
│   └── utils/
└── errors/          # Error boundaries & fallbacks
```

**Rules:**
- Feature-first organization—never group by file type at root level
- Shared code lives in `src/shared/`
- Environment variables: use `import.meta.env.*` (Vite native)

---

## TypeScript

```typescript
// ✅ Explicit interface for props
interface UserCardProps {
  name: string;
  id: number;
}

const UserCard = ({ name, id }: UserCardProps) => { /* ... */ };

// ❌ Avoid React.FC
const BadCard: React.FC<Props> = () => { /* ... */ };
```

**Rules:**
- Always define explicit types for props, return values, and function arguments
- Enable `"strict": true` in `tsconfig.json`

---

## React Components

**Rules:**
1. **Single Responsibility** — One component, one purpose
2. **Props Typing** — Use TypeScript interfaces, not inline types
3. **Memoization** — Only use `React.memo`, `useMemo`, `useCallback` when profiling shows a bottleneck
4. **State Colocation** — Keep state close to where it's used
5. **Custom Hooks** — Extract complex logic into `use*` hooks
6. **Semantic HTML** — Use `<button>`, `<nav>`, `<main>` over generic `<div>`
7. **List Keys** — Must be stable unique IDs (never array index)

---

## Error Handling

### ErrorBoundary Pattern

Every feature should have error boundaries to catch and handle runtime errors gracefully.

```typescript
// src/shared/errors/ErrorBoundary.tsx
import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.props.onError?.(error, errorInfo);
    // Log to monitoring service (e.g., Sentry)
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <DefaultErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

### Fallback Component

```typescript
// src/shared/errors/DefaultErrorFallback.tsx
interface Props {
  error: Error | null;
  resetError?: () => void;
}

export const DefaultErrorFallback = ({ error, resetError }: Props) => (
  <div role="alert" className="p-4 bg-red-50 border border-red-200 rounded-lg">
    <h2 className="text-lg font-semibold text-red-800">Something went wrong</h2>
    <pre className="mt-2 text-sm text-red-600 overflow-auto">
      {error?.message}
    </pre>
    {resetError && (
      <button
        onClick={resetError}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Try again
      </button>
    )}
  </div>
);
```

### Usage Rules

```typescript
// ✅ Wrap feature roots with ErrorBoundary
<ErrorBoundary fallback={<FeatureErrorFallback />}>
  <MyFeature />
</ErrorBoundary>

// ✅ Wrap async data components
<ErrorBoundary>
  <Suspense fallback={<Skeleton />}>
    <AsyncDataComponent />
  </Suspense>
</ErrorBoundary>

// ✅ Custom error handler for logging
<ErrorBoundary 
  onError={(error) => logToSentry(error)}
  fallback={<CustomFallback />}
>
  <CriticalFeature />
</ErrorBoundary>
```

**Rules:**
1. **Feature-level boundaries** — Wrap each feature's root component
2. **Critical section boundaries** — Wrap components that fetch data or have complex logic
3. **Custom fallbacks** — Provide context-appropriate fallback UI
4. **Error logging** — Use `onError` to send errors to monitoring (Sentry, etc.)
5. **Recovery actions** — Include "Try again" buttons where applicable
6. **Never catch errors silently** — Always log and display feedback

### TanStack Query Error Handling

```typescript
// In custom query hooks, handle errors explicitly
export const useGetUser = (userId: number) => {
  return useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => fetchUser(userId),
    // Error handling at query level
    throwOnError: true, // Let ErrorBoundary catch
    // OR handle inline:
    // throwOnError: false,
  });
};

// Mutation error handling
export const useUpdateUser = () => {
  return useMutation({
    mutationFn: updateUser,
    onError: (error) => {
      // Show toast, log error
      toast.error(error.message);
    },
  });
};
```

---

## TanStack Query

### Query Keys

```typescript
// src/shared/api/queryKeys.ts
export const userKeys = {
  all: ['users'] as const,
  detail: (userId: number) => [...userKeys.all, 'detail', userId] as const,
  list: (filters: Filter) => [...userKeys.all, 'list', filters] as const,
};
```

**Rules:**
- Centralize all query keys in `src/shared/api/queryKeys.ts`
- Use factory pattern with `as const`

### Custom Hooks

```typescript
// ✅ Wrap queries in feature-specific hooks
export const useGetPosts = () => {
  return useQuery({
    queryKey: postKeys.all,
    queryFn: fetchPosts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

**Rules:**
- Wrap all `useQuery`/`useMutation` in custom hooks
- Set reasonable `staleTime` for non-volatile data (5 min default)
- Handle errors with `onError` or let ErrorBoundary catch via `throwOnError`

---

## Tailwind CSS

**Rules:**
- Extend theme in `tailwind.config.js`, don't modify core utilities
- Use `@apply` for repeated complex patterns
- Mobile-first: start with base styles, add `sm:`, `md:`, `lg:` overrides
- Install and use Tailwind Prettier plugin for class ordering

```css
/* src/shared/styles/components.css */
.card-primary {
  @apply p-4 rounded-lg shadow-md bg-white border border-gray-200;
}
```

---

## Hooks Rules

**Rules:**
1. Always include all dependencies in `useEffect`, `useMemo`, `useCallback`
2. Use `react-hooks/exhaustive-deps` ESLint rule
3. Abstract complex logic into custom `use*` hooks

---

## Code Quality

| Check | Requirement |
|-------|-------------|
| Code Smells | Zero |
| Bugs | Zero |
| Vulnerabilities | Zero |
| Complexity | <10 cyclomatic |

**SonarLint Rules to Enforce:**
- `S6477` — Exhaustive hook dependencies
- `S6478` — Extract to custom hooks
- `S6475` — Stable unique list keys
- `S3776` — Low cyclomatic complexity

---

## Build & Test Commands

```bash
# Development
pnpm dev

# Build
pnpm build

# Lint
pnpm lint

# Type check
pnpm exec tsc --noEmit
```

---

## Quick Reference

| Do | Don't |
|----|-------|
| Use explicit TypeScript interfaces | Use `any` or `React.FC` |
| Wrap features with `ErrorBoundary` | Let errors crash the app |
| Extract logic to custom hooks | Put complex logic in components |
| Use stable IDs for list keys | Use array index as key |
| Colocate state near usage | Lift state unnecessarily |
| Use semantic HTML elements | Use `<div>` for everything |
| Log errors to monitoring service | Catch errors silently |
