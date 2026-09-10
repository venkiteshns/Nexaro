/**
 * Formats a given date/timestamp into a concise relative time string:
 * e.g., "Just now", "2m ago", "1h ago", "1d ago", "3d ago", "2w ago", "Oct 12"
 *
 * Pure utility function reusable across all user roles (Poster, Worker, Admin).
 */
export const formatTimeAgo = (dateInput) => {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  const now = new Date();
  const diffInSec = Math.max(0, Math.floor((now - date) / 1000));

  if (diffInSec < 60) return "Just now";
  const diffInMin = Math.floor(diffInSec / 60);
  if (diffInMin < 60) return `${diffInMin}m ago`;
  const diffInHours = Math.floor(diffInMin / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "1d ago";
  if (diffInDays < 7) return `${diffInDays}d ago`;
  if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks}w ago`;
  }
  return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
};

export default formatTimeAgo;
