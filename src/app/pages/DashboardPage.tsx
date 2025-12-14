import { useAuth, useCurrentUser } from "@/auth";

export const DashboardPage = () => {
  const { signOut } = useAuth();
  const user = useCurrentUser();

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
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

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-neutral-900">
            Welcome to Jura!
          </h2>
          <p className="mt-2 text-neutral-600">
            Your AI Career Agent is ready to help. Start by uploading your CV or
            documents.
          </p>

          {/* Placeholder cards */}
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-dashed border-neutral-300 p-6 text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-primary-100 p-3">
                <span className="text-xl">📄</span>
              </div>
              <h3 className="mt-4 font-medium text-neutral-900">
                Upload Documents
              </h3>
              <p className="mt-1 text-sm text-neutral-500">
                Add your CV and career documents
              </p>
            </div>

            <div className="rounded-lg border border-dashed border-neutral-300 p-6 text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-primary-100 p-3">
                <span className="text-xl">💬</span>
              </div>
              <h3 className="mt-4 font-medium text-neutral-900">
                Chat with AI
              </h3>
              <p className="mt-1 text-sm text-neutral-500">
                Refine your professional story
              </p>
            </div>

            <div className="rounded-lg border border-dashed border-neutral-300 p-6 text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-primary-100 p-3">
                <span className="text-xl">🔗</span>
              </div>
              <h3 className="mt-4 font-medium text-neutral-900">
                Share Profile
              </h3>
              <p className="mt-1 text-sm text-neutral-500">
                Generate shareable links for recruiters
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
