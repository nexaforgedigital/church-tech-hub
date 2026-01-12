import { Loader2 } from 'lucide-react';

export default function Loading({ message = 'Loading...', fullScreen = false }) {
  if (fullScreen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center text-white">
          <Loader2 className="mx-auto mb-4 animate-spin" size={48} />
          <p className="text-xl font-semibold">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <Loader2 className="mx-auto mb-2 animate-spin text-blue-500" size={32} />
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}

// Skeleton loader for cards
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
    </div>
  );
}

// Skeleton loader for list
export function ListSkeleton({ count = 5 }) {
  return (
    <div className="space-y-3">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-gray-200 rounded-lg h-16 animate-pulse"></div>
      ))}
    </div>
  );
}