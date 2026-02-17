'use client';

import { useState } from "react";
import { Search, Filter, Star } from "lucide-react";

const TEMPLATES = [
  // Free templates (20)
  { id: 1, name: "Token Launch", category: "DeFi", price: "Free", featured: true },
  { id: 2, name: "NFT Gallery", category: "NFT", price: "Free", featured: true },
  { id: 3, name: "Airdrop Campaign", category: "Marketing", price: "Free", featured: true },
  { id: 4, name: "Tip Jar", category: "Monetization", price: "Free", featured: false },
  { id: 5, name: "Community Poll", category: "Engagement", price: "Free", featured: false },
  { id: 6, name: "Simple Fundraiser", category: "Fundraising", price: "Free", featured: false },
  { id: 7, name: "Basic Profile", category: "Social", price: "Free", featured: false },
  { id: 8, name: "Link Directory", category: "Content", price: "Free", featured: false },
  { id: 9, name: "Event RSVP", category: "Events", price: "Free", featured: false },
  { id: 10, name: "Newsletter Signup", category: "Marketing", price: "Free", featured: false },
  { id: 11, name: "Contact Form", category: "Content", price: "Free", featured: false },
  { id: 12, name: "Quiz Basic", category: "Engagement", price: "Free", featured: false },
  { id: 13, name: "Giveaway Entry", category: "Marketing", price: "Free", featured: false },
  { id: 14, name: "Meme Generator", category: "Social", price: "Free", featured: false },
  { id: 15, name: "Voting System", category: "Engagement", price: "Free", featured: false },
  { id: 16, name: "Whitelist Entry", category: "NFT", price: "Free", featured: false },
  { id: 17, name: "Wallet Connect", category: "Tools", price: "Free", featured: false },
  { id: 18, name: "Social Links", category: "Social", price: "Free", featured: false },
  { id: 19, name: "Price Checker", category: "DeFi", price: "Free", featured: false },
  { id: 20, name: "Transaction Status", category: "Tools", price: "Free", featured: false },
  
  // Paid templates (80)
  ...Array.from({ length: 80 }, (_, i) => ({
    id: i + 21,
    name: `Premium Template ${i + 1}`,
    category: ["DeFi", "NFT", "Marketing", "Engagement", "Fundraising", "Tools", "Social", "Content"][i % 8],
    price: "$9.99",
    featured: i < 10,
  })),
];

const CATEGORIES = ["All", "DeFi", "NFT", "Marketing", "Engagement", "Fundraising", "Tools", "Social", "Content", "Events"];

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFreeOnly, setShowFreeOnly] = useState(false);

  const filteredTemplates = TEMPLATES.filter((template) => {
    const matchesCategory = selectedCategory === "All" || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFree = !showFreeOnly || template.price === "Free";
    return matchesCategory && matchesSearch && matchesFree;
  });

  const freeCount = TEMPLATES.filter(t => t.price === "Free").length;
  const paidCount = TEMPLATES.filter(t => t.price !== "Free").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Template Gallery</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Browse {TEMPLATES.length} professionally designed templates ({freeCount} free, {paidCount} premium)
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Free Only Toggle */}
          <button
            onClick={() => setShowFreeOnly(!showFreeOnly)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              showFreeOnly
                ? "bg-purple-600 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            <Filter className="w-5 h-5 inline mr-2" />
            Free Only
          </button>
        </div>

        {/* Categories */}
        <div className="mt-4 flex flex-wrap gap-2">
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

      {/* Results count */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Showing {filteredTemplates.length} templates
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTemplates.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">No templates found. Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
}

function TemplateCard({ template }: { template: any }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-xl transition cursor-pointer group">
      {/* Thumbnail */}
      <div className="relative h-48 bg-gradient-to-br from-purple-400 to-purple-600 rounded-t-lg overflow-hidden">
        {template.featured && (
          <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold flex items-center">
            <Star className="w-3 h-3 mr-1" />
            Featured
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition flex items-center justify-center">
          <button className="bg-white text-purple-600 px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition font-semibold">
            Preview
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 dark:text-white">{template.name}</h3>
          <span
            className={`text-sm font-bold ${
              template.price === "Free"
                ? "text-green-600"
                : "text-purple-600"
            }`}
          >
            {template.price}
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{template.category}</p>
        <button
          className={`w-full py-2 rounded-lg font-semibold transition ${
            template.price === "Free"
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-purple-600 text-white hover:bg-purple-700"
          }`}
        >
          {template.price === "Free" ? "Use Template" : "Purchase"}
        </button>
      </div>
    </div>
  );
}
