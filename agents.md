# AGENTS.md — Jura Frontend

> **For AI coding agents.** Follow these rules when generating or modifying code.

---

## Stack

- **Build:** Vite
- **Language:** TypeScript (strict mode required)
- **Framework:** React
- **Styling:** Tailwind CSS
- **Data Fetching:** TanStack Query
- **Routing:** React Router v7

---

## Architecture Decision: Screaming Architecture

> **Decision Date:** 2025-12-14

This project follows **Screaming Architecture** (coined by Robert C. Martin). The folder structure "screams" the business domain, not the technical implementation.

### Principles

1. **Domain-First Organization** — Top-level folders represent business capabilities (auth, documents, chat, agents), not technical concerns (components, hooks, services)
2. **Feature Isolation** — Each feature is self-contained with its own components, hooks, API, types, and tests
3. **Explicit Dependencies** — Features should not import from other features directly; use shared modules or events
4. **Screaming Intent** — A new developer should understand what the app does by looking at the folder structure

### Why Screaming Architecture?

- **Scalability**: Features can be developed, tested, and deployed independently
- **Discoverability**: Business logic is easy to locate
- **Team Ownership**: Different teams can own different features
- **Refactoring**: Changes are isolated within feature boundaries

---

## Project Structure

```
src/
├── auth/                    # 🔐 Authentication feature
│   ├── components/          # LoginForm, SignupForm, AuthLayout
│   ├── hooks/               # useAuth, useCurrentUser
│   ├── api/                 # authApi.ts, auth mutations/queries
│   ├── types/               # AuthUser, AuthResponse, Credentials
│   ├── context/             # AuthProvider, AuthContext
│   └── index.ts             # Public API (barrel export)
│
├── documents/               # 📄 Document management feature
│   ├── components/
│   ├── hooks/
│   ├── api/
│   ├── types/
│   └── index.ts
│
├── chat/                    # 💬 Chat/conversation feature
│   ├── components/
│   ├── hooks/
│   ├── api/
│   ├── types/
│   └── index.ts
│
├── agents/                  # 🤖 Agent configuration feature
│   ├── components/
│   ├── hooks/
│   ├── api/
│   ├── types/
│   └── index.ts
│
├── shared/                  # 🔧 Shared utilities (no business logic)
│   ├── ui/                  # Button, Input, Modal, Spinner
│   ├── api/                 # apiClient, queryKeys, baseUrl
│   ├── hooks/               # useLocalStorage, useDebounce
│   ├── utils/               # formatDate, cn (classnames)
│   ├── types/               # ApiError, PaginatedResponse
│   └── errors/              # ErrorBoundary, fallbacks
│
├── app/                     # 🏠 App shell & routing
│   ├── App.tsx
│   ├── Router.tsx
│   ├── providers/           # QueryClientProvider, AuthProvider wrapper
│   └── layouts/             # MainLayout, AuthLayout
│
└── main.tsx                 # Entry point
```

### Feature Module Structure

Each feature follows this internal structure:

```
src/[feature]/
├── components/              # React components (UI)
│   ├── FeatureComponent.tsx
│   └── index.ts             # Barrel export
├── hooks/                   # Custom hooks for this feature
│   ├── useFeatureData.ts
│   └── index.ts
├── api/                     # API calls & TanStack Query hooks
│   ├── featureApi.ts        # Raw fetch functions
│   ├── featureQueries.ts    # useQuery hooks
│   ├── featureMutations.ts  # useMutation hooks
│   └── index.ts
├── types/                   # TypeScript interfaces/types
│   └── index.ts
├── context/                 # React Context (if needed)
│   └── FeatureContext.tsx
├── utils/                   # Feature-specific utilities
│   └── index.ts
└── index.ts                 # Public API (what other modules can import)
```

### Import Rules

```typescript
// ✅ Import from feature's public API
import { useAuth, LoginForm } from "@/auth";

// ✅ Import shared utilities
import { Button, apiClient } from "@/shared";

// ❌ NEVER import internal feature files from another feature
import { useAuth } from "@/auth/hooks/useAuth"; // BAD

// ❌ NEVER import between features directly
import { something } from "@/documents/utils"; // BAD from chat feature
```

**Rules:**

- Feature-first organization—folder names scream the domain
- Each feature exposes a public API via `index.ts`
- Shared code lives in `src/shared/` (no business logic)
- App shell and routing live in `src/app/`
- Environment variables: use `import.meta.env.*` (Vite native)

---

## TypeScript

```typescript
// ✅ Explicit interface for props
interface UserCardProps {
  name: string;
  id: number;
}

const UserCard = ({ name, id }: UserCardProps) => {
  /* ... */
};

// ❌ Avoid React.FC
const BadCard: React.FC<Props> = () => {
  /* ... */
};
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
import { Component, ReactNode } from "react";

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
    console.error("[ErrorBoundary]", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? <DefaultErrorFallback error={this.state.error} />
      );
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
  all: ["users"] as const,
  detail: (userId: number) => [...userKeys.all, "detail", userId] as const,
  list: (filters: Filter) => [...userKeys.all, "list", filters] as const,
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

## Brand & Design System

> **Decision Date:** 2025-12-14

### Brand Identity

**Jura** — Your AI Career Agent. The brand conveys professionalism, trust, and intelligence while remaining approachable and modern.

### Brand Voice & Tone

- **Professional**: Confident without being cold
- **Calm**: Reassuring, never overwhelming
- **Clear**: Direct communication, no jargon
- **Helpful**: Supportive and empowering

### Design Principles

1. **Clarity over decoration** — Every element serves a purpose
2. **Consistency over novelty** — Predictable patterns build trust
3. **Accessibility by default** — WCAG 2.1 AA minimum
4. **Design for scalability** — Components and tokens, not one-offs

### Color Palette

Jura uses a **Teal/Cyan** primary palette — conveying trust, professionalism, and growth. Warm neutrals keep it approachable.

#### Primary Colors (Teal)

| Token         | Hex       | Usage                      |
| ------------- | --------- | -------------------------- |
| `primary-50`  | `#f0fdfa` | Subtle backgrounds         |
| `primary-100` | `#ccfbf1` | Hover states, highlights   |
| `primary-200` | `#99f6e4` | Light accents              |
| `primary-300` | `#5eead4` | Secondary actions          |
| `primary-400` | `#2dd4bf` | Icons, badges              |
| `primary-500` | `#14b8a6` | **Primary buttons, links** |
| `primary-600` | `#0d9488` | **Primary hover states**   |
| `primary-700` | `#0f766e` | Active states              |
| `primary-800` | `#115e59` | Dark accents               |
| `primary-900` | `#134e4a` | Text on light bg           |
| `primary-950` | `#042f2e` | Darkest shade              |

#### Neutral Colors (Slate)

| Token         | Hex       | Usage                 |
| ------------- | --------- | --------------------- |
| `neutral-50`  | `#f8fafc` | Page backgrounds      |
| `neutral-100` | `#f1f5f9` | Card backgrounds      |
| `neutral-200` | `#e2e8f0` | Borders, dividers     |
| `neutral-300` | `#cbd5e1` | Disabled states       |
| `neutral-400` | `#94a3b8` | Placeholder text      |
| `neutral-500` | `#64748b` | Secondary text        |
| `neutral-600` | `#475569` | Body text             |
| `neutral-700` | `#334155` | Headings              |
| `neutral-800` | `#1e293b` | Primary text          |
| `neutral-900` | `#0f172a` | Darkest text          |
| `neutral-950` | `#020617` | Dark mode backgrounds |

#### Semantic Colors

| Token         | Hex       | Usage          |
| ------------- | --------- | -------------- |
| `success-500` | `#22c55e` | Success states |
| `success-600` | `#16a34a` | Success hover  |
| `warning-500` | `#f59e0b` | Warning states |
| `warning-600` | `#d97706` | Warning hover  |
| `error-500`   | `#ef4444` | Error states   |
| `error-600`   | `#dc2626` | Error hover    |
| `info-500`    | `#3b82f6` | Info states    |
| `info-600`    | `#2563eb` | Info hover     |

### Typography

- **Font Family**: `Inter` (headings & body) — clean, professional, excellent legibility
- **Fallback**: `system-ui, -apple-system, sans-serif`

| Scale       | Size | Weight | Usage            |
| ----------- | ---- | ------ | ---------------- |
| `text-xs`   | 12px | 400    | Captions, labels |
| `text-sm`   | 14px | 400    | Secondary text   |
| `text-base` | 16px | 400    | Body text        |
| `text-lg`   | 18px | 500    | Emphasis         |
| `text-xl`   | 20px | 600    | Subheadings      |
| `text-2xl`  | 24px | 700    | Section headings |
| `text-3xl`  | 30px | 700    | Page titles      |
| `text-4xl`  | 36px | 800    | Hero headings    |

### Spacing Scale

Use Tailwind's default spacing scale (4px base). Key values:

- `1` = 4px, `2` = 8px, `3` = 12px, `4` = 16px, `6` = 24px, `8` = 32px

### Border Radius

| Token          | Value  | Usage                |
| -------------- | ------ | -------------------- |
| `rounded-sm`   | 4px    | Small elements, tags |
| `rounded`      | 6px    | Inputs, buttons      |
| `rounded-lg`   | 8px    | Cards, modals        |
| `rounded-xl`   | 12px   | Large containers     |
| `rounded-full` | 9999px | Avatars, pills       |

### Shadows

| Token       | Usage                     |
| ----------- | ------------------------- |
| `shadow-sm` | Subtle elevation (inputs) |
| `shadow`    | Cards, dropdowns          |
| `shadow-md` | Modals, popovers          |
| `shadow-lg` | Floating elements         |

### Usage Rules

```typescript
// ✅ Use semantic color classes
className = "bg-primary-500 hover:bg-primary-600 text-white";

// ✅ Use neutral for text hierarchy
className = "text-neutral-800"; // Primary text
className = "text-neutral-600"; // Secondary text
className = "text-neutral-400"; // Placeholder/disabled

// ✅ Use semantic colors for feedback
className = "text-error-500"; // Error messages
className = "bg-success-100"; // Success backgrounds

// ❌ Don't use arbitrary colors
className = "bg-[#1a2b3c]"; // BAD - use tokens

// ❌ Don't mix color systems
className = "bg-blue-500"; // BAD - use primary/semantic
```

### Dark Mode (Future)

Dark mode will invert the neutral scale and adjust primary colors for contrast. Use CSS custom properties to enable theming:

```css
/* Light mode (default) */
:root {
  --color-bg-primary: theme("colors.neutral.50");
  --color-text-primary: theme("colors.neutral.800");
}

/* Dark mode */
.dark {
  --color-bg-primary: theme("colors.neutral-950");
  --color-text-primary: theme("colors.neutral.100");
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

| Check           | Requirement    |
| --------------- | -------------- |
| Code Smells     | Zero           |
| Bugs            | Zero           |
| Vulnerabilities | Zero           |
| Complexity      | <10 cyclomatic |

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

| Do                                 | Don't                           |
| ---------------------------------- | ------------------------------- |
| Use explicit TypeScript interfaces | Use `any` or `React.FC`         |
| Wrap features with `ErrorBoundary` | Let errors crash the app        |
| Extract logic to custom hooks      | Put complex logic in components |
| Use stable IDs for list keys       | Use array index as key          |
| Colocate state near usage          | Lift state unnecessarily        |
| Use semantic HTML elements         | Use `<div>` for everything      |
| Log errors to monitoring service   | Catch errors silently           |
