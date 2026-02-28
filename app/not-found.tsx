import Link from 'next/link';
import { Zap, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 text-center">
      <Link href="/" className="flex items-center space-x-2 mb-12">
        <Zap className="w-8 h-8 text-purple-500" />
        <span className="text-2xl font-bold text-white">AiFarcaster</span>
      </Link>

      <div className="space-y-4 mb-10">
        <p className="text-7xl font-extrabold text-purple-500">404</p>
        <h1 className="text-3xl font-bold text-white">Page Not Found</h1>
        <p className="text-gray-400 max-w-md">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          <Home className="w-4 h-4" />
          <span>Go Home</span>
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
