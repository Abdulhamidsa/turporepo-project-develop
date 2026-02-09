import { useEffect, useState } from 'react';

import { AlertCircle, X } from 'lucide-react';

import PostList from '../features/post/components/PostList';
import { AddContentButton } from '../features/user/components/AddContentButton';
import { useAuth } from '../features/user/hooks/use.auth';

export default function Feed() {
  const { isAuthenticated } = useAuth();
  const [redirectNotification, setRedirectNotification] = useState<string | null>(null);

  useEffect(() => {
    // Check if there was a redirection due to non-existent profile
    const lastAttemptedProfile = localStorage.getItem('lastAttemptedProfile');

    if (lastAttemptedProfile) {
      setRedirectNotification(`The user "${lastAttemptedProfile}" was not found.`);
      // Clear the stored value
      localStorage.removeItem('lastAttemptedProfile');

      // Auto-hide notification after 8 seconds
      const timer = setTimeout(() => {
        setRedirectNotification(null);
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, []);
  return (
    <div className="bg-background text-foreground flex min-h-screen justify-center">
      <div className="container mx-auto flex w-full max-w-4xl gap-6 px-2 md:px-4 py-6">
        <div className="flex w-full flex-col">
          {/* Notification for redirected users */}
          {redirectNotification && (
            <div className="mb-6 p-4 rounded-lg bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 relative shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                    User Profile Not Found
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-300">
                    {redirectNotification} You have been redirected to the main feed.
                  </p>
                </div>
                <button
                  onClick={() => setRedirectNotification(null)}
                  className="text-amber-500 hover:text-amber-700 dark:hover:text-amber-300 flex-shrink-0 transition-colors duration-200"
                  aria-label="Close notification"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          <div className="bg-background z-10 pt-6 pb-4">
            {isAuthenticated ? (
              <AddContentButton />
            ) : (
              <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-6 text-center border border-border">
                <p className="text-foreground font-medium mb-2">
                  Welcome! Browse the feed or{' '}
                  <a
                    href="/"
                    className="text-primary hover:text-primary/80 underline font-semibold"
                  >
                    create an account
                  </a>{' '}
                  to share your own content.
                </p>
              </div>
            )}
          </div>

          <div className="mt-6">
            <PostList />
          </div>
        </div>
      </div>
    </div>
  );
}
