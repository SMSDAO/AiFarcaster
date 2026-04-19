'use client';

import { useState, useEffect, useCallback } from "react";
import { Search, Filter, Star, Lock, Zap, Loader2 } from "lucide-react";
import { createCheckoutSession } from "@/lib/stripe";

const CATEGORIES = ["All", "DeFi", "NFT", "Marketing", "Engagement", "Fundraising", "Tools", "Social", "Content", "Events"];

interface Template {
  id: string;
  name: string;
  category: string;
  tier: 'FREE' | 'PREMIUM';
  featured: boolean;
  price?: number | null;
}

interface ApiTemplate {
  id: string;
  name: string;
  category: string;
  tier: 'FREE' | 'PREMIUM';
  featured: boolean;
  price?: number | null;
}

interface SubscriptionStatus {
  hasActiveSubscription: boolean;
  plan: string | null;
}

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);

  const fetchSubscription = useCallback(async () => {
    try {
      const res = await fetch('/api/subscriptions/status');
      if (res.ok) {
        const json = await res.json() as { data: SubscriptionStatus };
        setSubscription(json.data);
      }
    } catch {
      // Gracefully handle unauthenticated state
    }
  }, []);

  const fetchTemplates = useCallback(async () => {
    setLoadingTemplates(true);
    try {
      const res = await fetch('/api/templates?limit=100');
      if (res.ok) {
        const json = await res.json() as { data: { templates: ApiTemplate[] } };
        setTemplates(json.data.templates ?? []);
      }
    } catch {
      // Fallback to empty list on error
    } finally {
      setLoadingTemplates(false);
    }
  }, []);

  useEffect(() => {
    void fetchSubscription();
    void fetchTemplates();
  }, [fetchSubscription, fetchTemplates]);

  const handlePurchase = async (templateId: string, tier: string) => {
    if (tier === 'FREE') return;
    setCheckoutLoading(templateId);
    try {
      // templateId is a real UUID from the DB — maps to a Stripe price server-side
      await createCheckoutSession(templateId);
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Checkout failed. Please try again.');
    } finally {
      setCheckoutLoading(null);
    }
  };

  const handleUpgrade = async () => {
    setCheckoutLoading('upgrade');
    try {
      await createCheckoutSession('subscription-pro-monthly');
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Checkout failed. Please try again.');
    } finally {
      setCheckoutLoading(null);
    }
  };

  const filteredTemplates = templates.filter((template) => {
    const matchesCategory = selectedCategory === "All" || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFree = !showFreeOnly || template.tier === "FREE";
    return matchesCategory && matchesSearch && matchesFree;
  });

  const freeCount = templates.filter(t => t.tier === "FREE").length;
  const paidCount = templates.filter(t => t.tier !== "FREE").length;
  const hasPremiumAccess = subscription?.hasActiveSubscription ?? false;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Template Gallery</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {loadingTemplates
              ? 'Loading templates…'
              : `Browse ${templates.length} professionally designed templates (${freeCount} free, ${paidCount} premium)`}
          </p>
        </div>
        {!hasPremiumAccess && (
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-5 py-3 rounded-lg shadow flex items-center gap-3">
            <Zap className="w-5 h-5 shrink-0" />
            <div>
              <p className="text-sm font-semibold">Unlock all {paidCount} premium templates</p>
              <p className="text-xs opacity-80">Pro plan — cancel anytime</p>
            </div>
            <button
              onClick={() => void handleUpgrade()}
              disabled={checkoutLoading === 'upgrade'}
              className="ml-2 bg-white text-purple-700 text-sm font-bold px-3 py-1.5 rounded hover:bg-gray-100 transition disabled:opacity-60 whitespace-nowrap"
            >
              {checkoutLoading === 'upgrade' ? 'Loading…' : 'Upgrade →'}
            </button>
          </div>
        )}
        {hasPremiumAccess && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 text-green-800 dark:text-green-300 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Pro plan active — all templates unlocked
          </div>
        )}
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
        {loadingTemplates
          ? 'Loading…'
          : `Showing ${filteredTemplates.length} templates`}
      </div>

      {/* Loading skeleton */}
      {loadingTemplates && (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      )}

      {/* Templates Grid */}
      {!loadingTemplates && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              hasPremiumAccess={hasPremiumAccess}
              checkoutLoading={checkoutLoading}
              onPurchase={handlePurchase}
            />
          ))}
        </div>
      )}

      {!loadingTemplates && filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">No templates found. Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
}

function TemplateCard({
  template,
  hasPremiumAccess,
  checkoutLoading,
  onPurchase,
}: {
  template: Template;
  hasPremiumAccess: boolean;
  checkoutLoading: string | null;
  onPurchase: (id: string, tier: string) => void;
}) {
  const isPremium = template.tier === 'PREMIUM';
  const isLocked = isPremium && !hasPremiumAccess;
  const isLoadingThis = checkoutLoading === template.id;
  const priceLabel = isPremium
    ? template.price != null
      ? `$${template.price.toFixed(2)}`
      : '$9.99'
    : 'Free';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-xl transition cursor-pointer group">
      {/* Thumbnail */}
      <div className="relative h-48 bg-gradient-to-br from-purple-400 to-purple-600 rounded-t-lg overflow-hidden" role="presentation" aria-hidden="true">
        {template.featured && (
          <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold flex items-center">
            <Star className="w-3 h-3 mr-1" />
            Featured
          </div>
        )}
        {isLocked && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Lock className="w-8 h-8 text-white/80" />
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition flex items-center justify-center">
          {!isLocked && (
            <button
              className="bg-white text-purple-600 px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 focus:opacity-100 transition font-semibold"
              aria-label={`Preview ${template.name} template`}
              tabIndex={0}
            >
              Preview
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 dark:text-white">{template.name}</h3>
          <span
            className={`text-sm font-bold ${
              template.tier === "FREE"
                ? "text-green-600"
                : "text-purple-600"
            }`}
            aria-label={`Price: ${priceLabel}`}
          >
            {priceLabel}
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{template.category}</p>

        {template.tier === "FREE" ? (
          <button className="w-full py-2 rounded-lg font-semibold transition bg-green-600 text-white hover:bg-green-700">
            Use Template
          </button>
        ) : hasPremiumAccess ? (
          <button className="w-full py-2 rounded-lg font-semibold transition bg-purple-600 text-white hover:bg-purple-700">
            Use Template
          </button>
        ) : (
          <button
            onClick={() => onPurchase(template.id, template.tier)}
            disabled={isLoadingThis}
            className="w-full py-2 rounded-lg font-semibold transition bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            {isLoadingThis ? 'Loading…' : 'Purchase'}
          </button>
        )}
      </div>
    </div>
  );
}
