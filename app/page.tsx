import Link from "next/link";
import { Zap, Frame, Wallet, Rocket, Gift, TrendingUp, Coins, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Zap className="w-8 h-8 text-purple-600" />
          <span className="text-2xl font-bold text-gray-900 dark:text-white">AiFarcaster</span>
        </div>
        <nav className="hidden md:flex space-x-8">
          <Link href="#features" className="text-gray-600 hover:text-purple-600 dark:text-gray-300">Features</Link>
          <Link href="#templates" className="text-gray-600 hover:text-purple-600 dark:text-gray-300">Templates</Link>
          <Link href="#pricing" className="text-gray-600 hover:text-purple-600 dark:text-gray-300">Pricing</Link>
        </nav>
        <Link 
          href="/dashboard" 
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
        >
          Get Started
        </Link>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          AI-Powered Farcaster
          <br />
          <span className="text-purple-600">Frame Builder</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Create, deploy, and manage Farcaster frames with AI assistance. 
          Build engagement tools, launch tokens, and grow your community.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/dashboard" 
            className="bg-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-purple-700 transition"
          >
            Start Building Free
          </Link>
          <Link 
            href="/dashboard/templates" 
            className="bg-white dark:bg-gray-800 text-purple-600 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-purple-600 hover:bg-purple-50 dark:hover:bg-gray-700 transition"
          >
            View Templates
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Everything You Need
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard 
            icon={<Frame className="w-12 h-12 text-purple-600" />}
            title="Frame Builder"
            description="Create interactive Farcaster frames with AI assistance"
          />
          <FeatureCard 
            icon={<Rocket className="w-12 h-12 text-purple-600" />}
            title="Token Launcher"
            description="Launch tokens on Base with built-in smart contracts"
          />
          <FeatureCard 
            icon={<Gift className="w-12 h-12 text-purple-600" />}
            title="Airdrops & NFTs"
            description="Create and manage airdrops and NFT collections"
          />
          <FeatureCard 
            icon={<Wallet className="w-12 h-12 text-purple-600" />}
            title="Wallet Monitor"
            description="Track wallet activity and PNL in real-time"
          />
          <FeatureCard 
            icon={<TrendingUp className="w-12 h-12 text-purple-600" />}
            title="Fundraising"
            description="Run raises, accept donations, and manage tips"
          />
          <FeatureCard 
            icon={<Coins className="w-12 h-12 text-purple-600" />}
            title="Crypto Payments"
            description="Accept payments on Base mainnet seamlessly"
          />
          <FeatureCard 
            icon={<Users className="w-12 h-12 text-purple-600" />}
            title="Engagement Tools"
            description="Boost community engagement with interactive features"
          />
          <FeatureCard 
            icon={<Zap className="w-12 h-12 text-purple-600" />}
            title="AI Prompts"
            description="Get AI-powered suggestions and ideas"
          />
        </div>
      </section>

      {/* Templates Preview */}
      <section id="templates" className="bg-purple-50 dark:bg-gray-900 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-4">
            100+ Ready Templates
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-12">
            20 free templates, 80+ premium designs
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <TemplateCard title="Token Launch Frame" price="Free" />
            <TemplateCard title="NFT Gallery" price="Free" />
            <TemplateCard title="Airdrop Campaign" price="Free" />
            <TemplateCard title="Fundraiser Frame" price="$9.99" />
            <TemplateCard title="Community Polls" price="$9.99" />
            <TemplateCard title="Tip Jar" price="Free" />
          </div>
          <div className="text-center mt-8">
            <Link 
              href="/dashboard/templates" 
              className="text-purple-600 hover:text-purple-700 font-semibold"
            >
              View All Templates →
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Simple Pricing
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <PricingCard 
            name="Free"
            price="$0"
            features={[
              "20 free templates",
              "Basic frame builder",
              "Community support",
              "Base mainnet support"
            ]}
          />
          <PricingCard 
            name="Pro"
            price="$29"
            features={[
              "All free features",
              "100+ premium templates",
              "Advanced AI prompts",
              "Priority support",
              "Custom branding"
            ]}
            highlighted
          />
          <PricingCard 
            name="Enterprise"
            price="Custom"
            features={[
              "All Pro features",
              "White-label solution",
              "Dedicated support",
              "Custom integrations",
              "API access"
            ]}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Zap className="w-6 h-6" />
                <span className="text-xl font-bold">AiFarcaster</span>
              </div>
              <p className="text-gray-400">
                AI-powered tools for the Farcaster ecosystem
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/dashboard">Dashboard</Link></li>
                <li><Link href="/dashboard/templates">Templates</Link></li>
                <li><Link href="#pricing">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#features">Documentation</Link></li>
                <li><Link href="#templates">Guides</Link></li>
                <li><Link href="#pricing">API</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#features">About</Link></li>
                <li><Link href="#pricing">Privacy</Link></li>
                <li><Link href="#pricing">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 AiFarcaster. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
}

function TemplateCard({ title, price }: { title: string; price: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition cursor-pointer">
      <div className="bg-gradient-to-br from-purple-400 to-purple-600 h-40 rounded-lg mb-4"></div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-purple-600 font-bold">{price}</p>
    </div>
  );
}

function PricingCard({ 
  name, 
  price, 
  features, 
  highlighted 
}: { 
  name: string; 
  price: string; 
  features: string[]; 
  highlighted?: boolean 
}) {
  return (
    <div className={`bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg ${highlighted ? 'ring-2 ring-purple-600 scale-105' : ''}`}>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{name}</h3>
      <div className="mb-6">
        <span className="text-4xl font-bold text-gray-900 dark:text-white">{price}</span>
        {price !== "Custom" && <span className="text-gray-600 dark:text-gray-400">/month</span>}
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-gray-600 dark:text-gray-300">
            <Zap className="w-4 h-4 text-purple-600 mr-2" />
            {feature}
          </li>
        ))}
      </ul>
      <button className={`w-full py-3 rounded-lg font-semibold transition ${
        highlighted 
          ? 'bg-purple-600 text-white hover:bg-purple-700' 
          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
      }`}>
        Get Started
      </button>
    </div>
  );
}
