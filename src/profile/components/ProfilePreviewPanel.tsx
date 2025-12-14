import { useMyProfileQuery } from '../api';

export const ProfilePreviewPanel = () => {
  const { data: profile, isLoading, error } = useMyProfileQuery();

  if (isLoading) {
    return (
      <div className="flex h-full flex-col rounded-lg border border-neutral-200 bg-white p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-neutral-900">Profile Preview</h2>
        </div>
        
        <div className="space-y-4 animate-pulse">
          <div className="h-8 bg-neutral-200 rounded w-3/4"></div>
          <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
          <div className="h-24 bg-neutral-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full flex-col rounded-lg border border-neutral-200 bg-white p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-neutral-900">Profile Preview</h2>
        </div>
        <div className="flex flex-col items-center justify-center flex-1 text-center">
          <div className="text-error-500 mb-2">⚠️</div>
          <p className="text-sm text-neutral-600">Unable to load profile</p>
          <p className="text-xs text-neutral-400 mt-1">
            {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      </div>
    );
  }

  const completenessPercentage = profile ? Math.round(profile.completenessScore * 100) : 0;
  const totalHighlights = profile?.roles.reduce(
    (sum, role) => sum + role.highlights.length,
    0
  ) ?? 0;

  return (
    <div className="flex h-full flex-col rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-neutral-900">Profile Preview</h2>
        <button
          disabled
          className="rounded-md bg-neutral-200 px-4 py-2 text-sm font-medium text-neutral-400 cursor-not-allowed"
          title="Publishing coming soon"
        >
          Publish
        </button>
      </div>

      {/* Profile Content */}
      <div className="flex-1 space-y-6 overflow-y-auto">
        {/* Basic Info */}
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">
            {profile?.basics.name || 'Your Name'}
          </h3>
          <p className="mt-1 text-sm text-neutral-600">
            {profile?.basics.headline || 'Professional headline'}
          </p>
        </div>

        {/* Completeness Score */}
        <div className="rounded-lg bg-neutral-50 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-neutral-700">
              Profile Completeness
            </span>
            <span className="text-sm font-semibold text-primary-600">
              {completenessPercentage}%
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200">
            <div
              className="h-full rounded-full bg-primary-500 transition-all duration-300"
              style={{ width: `${completenessPercentage}%` }}
            />
          </div>
        </div>

        {/* Summary */}
        {profile?.basics.summary && (
          <div>
            <h4 className="text-sm font-medium text-neutral-700 mb-2">Summary</h4>
            <p className="text-sm text-neutral-600 leading-relaxed">
              {profile.basics.summary}
            </p>
          </div>
        )}

        {/* Roles */}
        <div>
          <h4 className="text-sm font-medium text-neutral-700 mb-3">
            Experience ({profile?.roles.length || 0} roles)
          </h4>
          {profile?.roles && profile.roles.length > 0 ? (
            <div className="space-y-4">
              {profile.roles.map((role) => (
                <div
                  key={role.id}
                  className="rounded-lg border border-neutral-200 bg-white p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="font-medium text-neutral-900">{role.title}</h5>
                      <p className="text-sm text-neutral-600">{role.company}</p>
                      <p className="text-xs text-neutral-400 mt-1">
                        {new Date(role.startDate).getFullYear()}
                        {role.current
                          ? ' - Present'
                          : role.endDate
                            ? ` - ${new Date(role.endDate).getFullYear()}`
                            : ''}
                      </p>
                    </div>
                    {role.highlights.length > 0 && (
                      <span className="ml-2 rounded-full bg-primary-100 px-2 py-1 text-xs font-medium text-primary-700">
                        {role.highlights.length} highlights
                      </span>
                    )}
                  </div>
                  {role.description && (
                    <p className="mt-2 text-sm text-neutral-600">{role.description}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-neutral-400 italic">No roles added yet</p>
          )}
        </div>

        {/* Stats */}
        <div className="rounded-lg bg-primary-50 p-4">
          <h4 className="text-sm font-medium text-primary-900 mb-2">Quick Stats</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl font-bold text-primary-700">
                {profile?.roles.length || 0}
              </p>
              <p className="text-xs text-primary-600">Total Roles</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-700">{totalHighlights}</p>
              <p className="text-xs text-primary-600">Highlights</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
