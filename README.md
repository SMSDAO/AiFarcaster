# AiFarcaster

AI-powered tools and frame builder for the Farcaster ecosystem. Build, deploy, and manage interactive Farcaster frames with ease.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/SMSDAO/AiFarcaster)

## ✨ Features

- 🎨 **Frame Builder** - Create interactive Farcaster frames with AI assistance
- 🚀 **Token Launcher** - Launch tokens on Base mainnet with one click
- 🎁 **Airdrop Manager** - Manage token distributions and allowlists
- 🖼️ **NFT Maker** - Deploy NFT collections with customizable metadata
- 💰 **Wallet Monitor** - Track wallet activities and PNL in real-time
- 📊 **Analytics** - Comprehensive engagement and performance metrics
- 💳 **Payments** - Accept crypto (Base) and fiat (Stripe) payments
- 🤖 **AI Prompts** - Get AI-powered suggestions for your frames

## 🚀 Quick Start

### One-Click Deploy

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/SMSDAO/AiFarcaster)

### Local Development

1. **Clone the repository**

```bash
git clone https://github.com/SMSDAO/AiFarcaster.git
cd AiFarcaster
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# WalletConnect (Required for wallet connections)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# Stripe (Optional - for fiat payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Crypto Payments (Optional)
NEXT_PUBLIC_PAYMENT_RECEIVER_ADDRESS=0x...
```

See [Environment Variables Documentation](./docs/ENVIRONMENT.md) for detailed configuration.

4. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

## 📦 Project Structure

```
AiFarcaster/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Dashboard pages
│   ├── auth/              # Authentication pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   └── providers.tsx      # App providers
├── components/            # React components
├── lib/                   # Utility functions
│   ├── stripe.ts         # Stripe integration
│   ├── crypto-payments.ts # Crypto payment utilities
│   └── utils.ts          # General utilities
├── types/                 # TypeScript type definitions
├── docs/                  # Documentation
└── public/               # Static assets
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 📚 Documentation

- [Environment Variables](./docs/ENVIRONMENT.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [User Guide](./docs/USER_GUIDE.md)
- [Payment Integration](./docs/PAYMENTS.md)
- [API Documentation](./docs/API.md)

## 🎯 Templates

Browse 100+ professionally designed templates:
- 20 free templates
- 80+ premium templates ($9.99 each)

Categories include:
- DeFi & Token Launch
- NFT & Collections
- Marketing & Engagement
- Fundraising & Donations
- Social & Community Tools

## 🔐 Security

- Minimal dependencies for reduced attack surface
- Regular security audits with GitHub Actions
- Environment variables kept local (never committed)
- Secure wallet connections via RainbowKit
- Smart contract safety checks

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## 📄 License

Licensed under the Apache License 2.0. See [LICENSE](./LICENSE) for details.

## 🔗 Links

- [Website](https://aifarcaster.com)
- [Documentation](./docs)
- [GitHub](https://github.com/SMSDAO/AiFarcaster)
- [Discord](https://discord.gg/aifarcaster)

## 💬 Support

Need help? Join our [Discord community](https://discord.gg/aifarcaster) or open an issue on GitHub.

---

Built with ❤️ by the SMSDAO team