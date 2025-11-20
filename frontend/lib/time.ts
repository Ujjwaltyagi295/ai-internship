export function timeAgo(dateInput: string | Date): string {
  if (!dateInput) return "";
  
  const date = new Date(dateInput);
  const now = new Date();

  // FIX: Use .getTime() to convert both to numbers (milliseconds) before subtracting
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // intervals in seconds
  const intervalYear = 31536000;
  const intervalMonth = 2592000;
  const intervalDay = 86400;
  const intervalHour = 3600;
  const intervalMinute = 60;

  if (seconds >= intervalYear) {
    const count = Math.floor(seconds / intervalYear);
    return count === 1 ? "1 year ago" : `${count} years ago`;
  }
  if (seconds >= intervalMonth) {
    const count = Math.floor(seconds / intervalMonth);
    return count === 1 ? "1 month ago" : `${count} months ago`;
  }
  if (seconds >= intervalDay) {
    const count = Math.floor(seconds / intervalDay);
    return count === 1 ? "1 day ago" : `${count} days ago`;
  }
  if (seconds >= intervalHour) {
    const count = Math.floor(seconds / intervalHour);
    return count === 1 ? "1 hour ago" : `${count} hours ago`;
  }
  if (seconds >= intervalMinute) {
    const count = Math.floor(seconds / intervalMinute);
    return count === 1 ? "1 minute ago" : `${count} minutes ago`;
  }

  return "Just now";
}