'use client';

import { Sparkles, Copy, ThumbsUp } from "lucide-react";
import { useState } from "react";

const PROMPTS = [
  {
    id: 1,
    category: "Token Launch",
    title: "Create a viral token launch frame",
    prompt: "Build an interactive token launch frame with a countdown timer, live price feed from DEX, and one-click buy button. Include social sharing incentives.",
    tags: ["DeFi", "Marketing", "Viral"],
  },
  {
    id: 2,
    category: "NFT",
    title: "NFT mint with allowlist",
    prompt: "Design an NFT minting frame with allowlist verification, mint counter, and rarity reveal. Add wallet verification and transaction confirmation.",
    tags: ["NFT", "Allowlist", "Mint"],
  },
  {
    id: 3,
    category: "Engagement",
    title: "Community poll with rewards",
    prompt: "Create a community governance poll where voters receive reward tokens. Include vote verification, real-time results, and automatic distribution.",
    tags: ["Governance", "Rewards", "Community"],
  },
  {
    id: 4,
    category: "Airdrop",
    title: "Multi-step airdrop campaign",
    prompt: "Build an airdrop frame with multiple claim tiers based on user activity. Include social verification, wallet tracking, and distribution analytics.",
    tags: ["Airdrop", "Marketing", "Distribution"],
  },
  {
    id: 5,
    category: "Fundraising",
    title: "Milestone-based fundraiser",
    prompt: "Create a fundraising frame with progress bars, milestone rewards, and contributor benefits. Add automatic milestone unlocks and donor recognition.",
    tags: ["Fundraising", "Milestones", "Community"],
  },
  {
    id: 6,
    category: "Social",
    title: "Referral program frame",
    prompt: "Design a referral program with unique referral links, tiered rewards, and leaderboard. Include tracking dashboard and automatic reward distribution.",
    tags: ["Referral", "Growth", "Rewards"],
  },
  {
    id: 7,
    category: "Gaming",
    title: "Play-to-earn mini game",
    prompt: "Build a simple play-to-earn game frame with high scores, daily challenges, and token rewards. Add leaderboard and achievement system.",
    tags: ["Gaming", "P2E", "Engagement"],
  },
  {
    id: 8,
    category: "Content",
    title: "Creator tip jar with tiers",
    prompt: "Create a tip jar frame with multiple tip tiers and custom messages. Include top supporter showcase and automatic thank you messages.",
    tags: ["Monetization", "Creator", "Tips"],
  },
  {
    id: 9,
    category: "Analytics",
    title: "Portfolio tracker frame",
    prompt: "Design a portfolio tracking frame showing wallet holdings, PNL, and transaction history. Add alerts for price changes and new opportunities.",
    tags: ["Analytics", "Portfolio", "Tracking"],
  },
  {
    id: 10,
    category: "Education",
    title: "Learn-to-earn quiz",
    prompt: "Build an educational quiz frame with reward tokens for correct answers. Include progress tracking, certificates, and difficulty levels.",
    tags: ["Education", "Quiz", "Rewards"],
  },
];

const CATEGORIES = ["All", ...Array.from(new Set(PROMPTS.map((p) => p.category)))];

export default function PromptsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const filteredPrompts = PROMPTS.filter(
    (prompt) => selectedCategory === "All" || prompt.category === selectedCategory
  );

  const copyPrompt = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">AI Prompts & Ideas</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Get inspired with AI-powered suggestions for your next frame
        </p>
      </div>

      {/* Category Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedCategory === category
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* AI Assistant */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-start space-x-4">
          <Sparkles className="w-8 h-8 flex-shrink-0" />
          <div>
            <h2 className="text-xl font-bold mb-2">AI Frame Assistant</h2>
            <p className="mb-4 opacity-90">
              Describe your idea, and I&apos;ll help you build the perfect frame with detailed specifications.
            </p>
            <button className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition">
              Start AI Chat
            </button>
          </div>
        </div>
      </div>

      {/* Prompts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPrompts.map((prompt) => (
          <PromptCard
            key={prompt.id}
            prompt={prompt}
            isCopied={copiedId === prompt.id}
            onCopy={(text) => copyPrompt(prompt.id, text)}
          />
        ))}
      </div>
    </div>
  );
}

function PromptCard({
  prompt,
  isCopied,
  onCopy,
}: {
  prompt: any;
  isCopied: boolean;
  onCopy: (text: string) => void;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-xl transition p-6">
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
            {prompt.category}
          </span>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
            {prompt.title}
          </h3>
        </div>
        <Sparkles className="w-5 h-5 text-purple-600" />
      </div>

      <p className="text-gray-600 dark:text-gray-300 mb-4">{prompt.prompt}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {prompt.tags.map((tag: string) => (
          <span
            key={tag}
            className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => onCopy(prompt.prompt)}
          className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg font-semibold transition ${
            isCopied
              ? "bg-green-600 text-white"
              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          }`}
        >
          <Copy className="w-4 h-4 mr-2" />
          {isCopied ? "Copied!" : "Copy"}
        </button>
        <button className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold">
          <ThumbsUp className="w-4 h-4 mr-2" />
          Use
        </button>
      </div>
    </div>
  );
}
