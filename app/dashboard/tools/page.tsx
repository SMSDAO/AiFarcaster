'use client';

import {
  Rocket,
  Gift,
  Image,
  Wallet,
  TrendingUp,
  DollarSign,
  Heart,
  Zap,
  Users,
  BarChart3,
  Coins,
  Target,
} from "lucide-react";

const TOOLS = [
  {
    id: 1,
    name: "Token Launcher",
    description: "Launch ERC-20 tokens on Base with built-in liquidity and fair launch mechanisms",
    icon: Rocket,
    color: "purple",
    status: "Available",
  },
  {
    id: 2,
    name: "Airdrop Manager",
    description: "Create and manage token airdrops with CSV import, allowlists, and automated distribution",
    icon: Gift,
    color: "blue",
    status: "Available",
  },
  {
    id: 3,
    name: "NFT Maker",
    description: "Deploy NFT collections with customizable metadata, royalties, and minting controls",
    icon: Image,
    color: "green",
    status: "Available",
  },
  {
    id: 4,
    name: "Wallet Monitor",
    description: "Track wallet activities, balances, and transactions across Base network in real-time",
    icon: Wallet,
    color: "orange",
    status: "Available",
  },
  {
    id: 5,
    name: "PNL Tracker",
    description: "Monitor profit and loss across all your positions with detailed analytics and charts",
    icon: TrendingUp,
    color: "red",
    status: "Available",
  },
  {
    id: 6,
    name: "Fundraiser",
    description: "Run crowdfunding campaigns with milestone tracking and automated payouts",
    icon: Target,
    color: "pink",
    status: "Available",
  },
  {
    id: 7,
    name: "Donation System",
    description: "Accept crypto donations with customizable tiers and donor recognition",
    icon: Heart,
    color: "rose",
    status: "Available",
  },
  {
    id: 8,
    name: "Tip Jar",
    description: "Easy tipping system for creators with multiple payment options and thank you messages",
    icon: DollarSign,
    color: "yellow",
    status: "Available",
  },
  {
    id: 9,
    name: "Engagement Tools",
    description: "Boost community engagement with polls, quizzes, and interactive challenges",
    icon: Users,
    color: "indigo",
    status: "Available",
  },
  {
    id: 10,
    name: "Analytics Dashboard",
    description: "Comprehensive analytics for your frames with engagement metrics and user insights",
    icon: BarChart3,
    color: "cyan",
    status: "Available",
  },
  {
    id: 11,
    name: "Token Swap",
    description: "Integrate token swaps directly in your frames with best price routing",
    icon: Coins,
    color: "emerald",
    status: "Coming Soon",
  },
  {
    id: 12,
    name: "Staking Portal",
    description: "Create staking pools with customizable rewards and lock periods",
    icon: Zap,
    color: "violet",
    status: "Coming Soon",
  },
];

export default function ToolsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Crypto Tools</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Powerful tools for building and managing your Web3 presence
        </p>
      </div>

      {/* Featured Tool */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-lg p-8 text-white">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center mb-3">
              <Rocket className="w-8 h-8 mr-3" />
              <h2 className="text-2xl font-bold">Token Launcher</h2>
            </div>
            <p className="mb-4 opacity-90 max-w-2xl">
              Launch your token on Base mainnet with just a few clicks. Includes smart contract
              deployment, liquidity pool setup, and marketing tools.
            </p>
            <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              Launch Your Token
            </button>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-75 mb-1">Gas Estimate</div>
            <div className="text-3xl font-bold">~0.01 ETH</div>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TOOLS.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>

      {/* Payment Integration Info */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Payment Integration
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
              <Coins className="w-5 h-5 mr-2 text-purple-600" />
              Crypto Payments (Base)
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              Accept payments in ETH, USDC, and other Base tokens with automatic conversion and instant settlement.
            </p>
            <button className="text-purple-600 hover:text-purple-700 font-semibold text-sm">
              Configure Crypto Payments →
            </button>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
              Stripe Integration
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              Accept credit cards and traditional payments through Stripe with automatic Web3 conversion.
            </p>
            <button className="text-purple-600 hover:text-purple-700 font-semibold text-sm">
              Setup Stripe →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToolCard({ tool }: { tool: any }) {
  const colorClasses: { [key: string]: string } = {
    purple: "from-purple-400 to-purple-600",
    blue: "from-blue-400 to-blue-600",
    green: "from-green-400 to-green-600",
    orange: "from-orange-400 to-orange-600",
    red: "from-red-400 to-red-600",
    pink: "from-pink-400 to-pink-600",
    rose: "from-rose-400 to-rose-600",
    yellow: "from-yellow-400 to-yellow-600",
    indigo: "from-indigo-400 to-indigo-600",
    cyan: "from-cyan-400 to-cyan-600",
    emerald: "from-emerald-400 to-emerald-600",
    violet: "from-violet-400 to-violet-600",
  };

  const Icon = tool.icon;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-xl transition">
      <div className={`h-32 bg-gradient-to-br ${colorClasses[tool.color]} rounded-t-lg flex items-center justify-center`}>
        <Icon className="w-12 h-12 text-white" />
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{tool.name}</h3>
          <span
            className={`px-2 py-1 text-xs font-medium rounded ${
              tool.status === "Available"
                ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            }`}
          >
            {tool.status}
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{tool.description}</p>
        <button
          disabled={tool.status !== "Available"}
          className={`w-full py-2 rounded-lg font-semibold transition ${
            tool.status === "Available"
              ? "bg-purple-600 text-white hover:bg-purple-700"
              : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
          }`}
        >
          {tool.status === "Available" ? "Open Tool" : "Coming Soon"}
        </button>
      </div>
    </div>
  );
}
