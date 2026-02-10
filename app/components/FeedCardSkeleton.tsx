export function FeedCardSkeleton() {
  return (
    <div className="card bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
    </div>
  );
}