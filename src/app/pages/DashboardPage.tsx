import { useAuth, useCurrentUser } from "@/auth";
import { ConversationView } from "@/chat";
import { ProfilePreviewPanel } from "@/profile";
import { ErrorBoundary } from "@/shared";

export const DashboardPage = () => {
  const { signOut } = useAuth();
  const user = useCurrentUser();

  return (
    <div className="flex h-screen flex-col bg-neutral-50">
      {/* Header */}
      <header className="flex-shrink-0 bg-white shadow">
        <div className="mx-auto flex max-w-[1800px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-neutral-900">
            Jura Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-600">{user.email}</span>
            <button
              onClick={signOut}
              className="rounded-md bg-neutral-100 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-200"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main content - 2 column layout */}
      <main className="mx-auto flex flex-1 w-full max-w-[1800px] gap-6 overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
        {/* Left column - Conversation */}
        <div className="flex-1 min-w-0">
          <ErrorBoundary>
            <ConversationView />
          </ErrorBoundary>
        </div>

        {/* Right column - Profile preview */}
        <div className="w-96 flex-shrink-0">
          <ProfilePreviewPanel />
        </div>
      </main>
    </div>
  );
};
