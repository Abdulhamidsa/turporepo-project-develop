export function timeAgo(dateString: string): string {
  const now = new Date();
  const pastDate = new Date(dateString);
  const diffInMs = now.getTime() - pastDate.getTime();

  const seconds = Math.floor(diffInMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);

  if (seconds < 60) return `${seconds}s`; // Less than a minute
  if (minutes < 60) return `${minutes}m`; // Less than an hour
  if (hours < 24) return `${hours}h`; // Less than a day
  if (days < 7) return `${days}d`; // Less than a week
  return `${weeks}w`; // Weeks
}
