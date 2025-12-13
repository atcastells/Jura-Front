# Jura-Front

**Frontend for Jura: Your AI Career Agent & Personal Professional Assistant**

Jura-Front is the user-facing application for Jura, an AI-powered career agent that helps job seekers create recruiter-ready profiles through natural language conversations. Upload your CV, chat with the AI to refine your professional story, and generate a shareable career profile optimized for recruiters and hiring managers.

## Product Vision

Jura transforms the traditional resume experience into an intelligent, conversational career management platform. Job seekers interact with Jura through natural language Q&A, receiving context-aware career assistance that goes beyond simple CV parsing. The result is a comprehensive, recruiter-ready profile that can be shared, edited, and continuously improved with AI guidance.

**Core Value Proposition:**
- **AI Career Agent**: Intelligent assistant that understands your professional journey
- **Personal Professional Assistant**: Context-aware guidance tailored to your career goals
- **Recruiter-Ready Profiles**: Optimized output designed for hiring professionals
- **Natural Interaction**: Conversational interface replaces tedious form-filling

## Key Features

### User Experience & Frontend Capabilities

- **📤 CV Upload & Smart Parsing**: Upload PDFs or documents with real-time feedback and intelligent extraction
- **✏️ Interactive Profile Editor**: Edit and view your recruiter-ready profile with intuitive controls
- **💬 Natural Language Q&A**: Chat interface powered by AI to refine and enhance your professional narrative
- **🔗 Shareable Profile Links**: Generate unique URLs to share your career profile with recruiters
- **⚡ Loading & Error States**: Polished UX with skeleton loaders, progress indicators, and graceful error handling
- **♿ Accessibility Focus**: WCAG-compliant design with keyboard navigation and screen reader support
- **🚀 Performance Optimized**: Fast load times, code splitting, and efficient rendering

## Tech Stack

### Frontend Architecture

- **Runtime & Build Tools**: Node.js with TypeScript for type-safe development
- **Framework**: React 19 with Vite for fast builds and hot module replacement
- **UI Components**: Modern component library with design tokens for consistent theming
- **State Management**: React hooks and context for application state
- **API Integration**: RESTful/GraphQL client calls to backend services

### Backend Integration (via API)

- **LLM Services**: Integration with Gemini AI and other language models via backend endpoints
- **Vector Database**: Supabase for semantic search and context retrieval
- **Data Storage**: Backend leverages MongoDB for document storage and PostgreSQL for relational data
- **CV Parsing**: Server-side document processing with frontend feedback

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run linter
pnpm lint
```

## Roadmap

### Phase 1: MVP UI (Q1 2025)
- ✅ Core React + TypeScript + Vite setup
- ⏳ CV upload interface with drag-and-drop
- ⏳ Basic profile view/edit functionality
- ⏳ Initial API integration with backend

### Phase 2: Q&A + Shareable Profiles (Q2 2025)
- ⏳ Chat interface with AI-powered Q&A
- ⏳ Shareable profile link generation
- ⏳ Profile customization options
- ⏳ Real-time parsing feedback

### Phase 3: Optimization & Accessibility (Q2 2025)
- ⏳ Performance optimization (code splitting, lazy loading)
- ⏳ WCAG 2.1 AA compliance
- ⏳ Mobile-responsive design refinements
- ⏳ Progressive Web App (PWA) features

### Phase 4: Observability & Testing (Q3 2025)
- ⏳ Comprehensive unit and integration tests
- ⏳ End-to-end testing with Playwright or Cypress
- ⏳ Error tracking and analytics integration
- ⏳ Performance monitoring

### Phase 5: Recruiter Experience (Q3 2025)
- ⏳ Recruiter dashboard features
- ⏳ Candidate search and filtering
- ⏳ Profile comparison tools
- ⏳ Communication features

### Phase 6: Localization & Security (Q4 2025)
- ⏳ Multi-language support (i18n)
- ⏳ Security hardening and penetration testing
- ⏳ GDPR compliance features
- ⏳ Advanced privacy controls

## Contributing

Contributions are welcome! Please read our contributing guidelines and code of conduct before submitting pull requests.

## License

[Include appropriate license information]

---

### SEO Keywords

**Primary**: AI career agent, personal professional assistant, recruiter-ready profile, job seeker AI, career management AI

**Secondary**: CV parser, natural language Q&A, shareable career profile, context-aware career assistant, personalized professional AI

**Technology**: LLM, vector database, Supabase, Gemini AI, Node.js, TypeScript, MongoDB, PostgreSQL, React, Vite
