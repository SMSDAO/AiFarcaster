'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Zap, RefreshCw, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 text-center">
      <Link href="/" className="flex items-center space-x-2 mb-12">
        <Zap className="w-8 h-8 text-purple-500" />
        <span className="text-2xl font-bold text-white">AiFarcaster</span>
      </Link>

      <div className="space-y-4 mb-10">
        <p className="text-5xl font-extrabold text-red-400">Oops!</p>
        <h1 className="text-3xl font-bold text-white">Something went wrong</h1>
        <p className="text-gray-400 max-w-md">
          An unexpected error occurred. Please try again, or return to the home page.
        </p>
        {error.digest && (
          <p className="text-xs text-gray-600 font-mono">Error ID: {error.digest}</p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={reset}
          className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
        <Link
          href="/"
          className="inline-flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          <Home className="w-4 h-4" />
          <span>Go Home</span>
        </Link>
      </div>
    </div>
  );
}
