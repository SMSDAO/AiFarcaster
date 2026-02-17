'use client';

import { Frame, Plus, Eye, Heart, MessageCircle } from "lucide-react";

const FRAMES = [
  {
    id: 1,
    title: "Token Launch Frame",
    description: "Interactive token launch with live price feed",
    status: "Active",
    views: 1234,
    likes: 89,
    comments: 23,
    thumbnail: "gradient-purple",
  },
  {
    id: 2,
    title: "NFT Mint Frame",
    description: "Mint NFTs directly from Farcaster",
    status: "Active",
    views: 890,
    likes: 67,
    comments: 15,
    thumbnail: "gradient-blue",
  },
  {
    id: 3,
    title: "Community Poll",
    description: "Governance voting frame",
    status: "Active",
    views: 2345,
    likes: 234,
    comments: 89,
    thumbnail: "gradient-green",
  },
  {
    id: 4,
    title: "Airdrop Claim",
    description: "Claim airdrop tokens",
    status: "Draft",
    views: 0,
    likes: 0,
    comments: 0,
    thumbnail: "gradient-orange",
  },
  {
    id: 5,
    title: "Tip Jar",
    description: "Accept tips in crypto",
    status: "Active",
    views: 567,
    likes: 45,
    comments: 12,
    thumbnail: "gradient-pink",
  },
  {
    id: 6,
    title: "Fundraiser",
    description: "Crowdfunding campaign",
    status: "Active",
    views: 1890,
    likes: 156,
    comments: 67,
    thumbnail: "gradient-red",
  },
];

export default function FramesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Frames Timeline</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and monitor your Farcaster frames
          </p>
        </div>
        <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition font-semibold flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Create Frame
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Frames</div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">{FRAMES.length}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Views</div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {FRAMES.reduce((sum, f) => sum + f.views, 0).toLocaleString()}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Likes</div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {FRAMES.reduce((sum, f) => sum + f.likes, 0)}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Engagement</div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {(() => {
              const totalViews = FRAMES.reduce((sum, f) => sum + f.views, 0);
              if (totalViews === 0) return '0.0';
              const totalEngagement = FRAMES.reduce((sum, f) => sum + f.likes + f.comments, 0);
              return ((totalEngagement / totalViews) * 100).toFixed(1);
            })()}%
          </div>
        </div>
      </div>

      {/* Frames Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FRAMES.map((frame) => (
          <FrameCard key={frame.id} frame={frame} />
        ))}
      </div>
    </div>
  );
}

function FrameCard({ frame }: { frame: any }) {
  const gradients: { [key: string]: string } = {
    "gradient-purple": "from-purple-400 to-purple-600",
    "gradient-blue": "from-blue-400 to-blue-600",
    "gradient-green": "from-green-400 to-green-600",
    "gradient-orange": "from-orange-400 to-orange-600",
    "gradient-pink": "from-pink-400 to-pink-600",
    "gradient-red": "from-red-400 to-red-600",
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-xl transition">
      {/* Thumbnail */}
      <div className={`h-48 bg-gradient-to-br ${gradients[frame.thumbnail]} rounded-t-lg flex items-center justify-center`}>
        <Frame className="w-16 h-16 text-white opacity-50" />
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 dark:text-white">{frame.title}</h3>
          <span
            className={`px-2 py-1 text-xs font-medium rounded ${
              frame.status === "Active"
                ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            }`}
          >
            {frame.status}
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{frame.description}</p>

        {/* Stats */}
        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center">
            <Eye className="w-4 h-4 mr-1" />
            {frame.views}
          </div>
          <div className="flex items-center">
            <Heart className="w-4 h-4 mr-1" />
            {frame.likes}
          </div>
          <div className="flex items-center">
            <MessageCircle className="w-4 h-4 mr-1" />
            {frame.comments}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex space-x-2">
          <button className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition text-sm font-semibold">
            Edit
          </button>
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-sm font-semibold text-gray-700 dark:text-gray-300">
            View
          </button>
        </div>
      </div>
    </div>
  );
}
