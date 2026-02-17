'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { base } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { useState } from 'react';

// Get project ID - use placeholder only for build process
// At runtime, the actual value from environment will be used
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 
  // Build-time placeholder (never used at runtime)
  (typeof window === 'undefined' ? 'build-time-placeholder' : undefined);

// Runtime check - this will be evaluated when the app actually runs
if (typeof window !== 'undefined' && !process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID) {
  console.error(
    '[AiFarcaster] CRITICAL: NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not configured.\n' +
    'Wallet connection features will not work.\n' +
    'Please set this environment variable before deploying to production.\n' +
    'See docs/ENVIRONMENT.md for configuration instructions.'
  );
}

const config = getDefaultConfig({
  appName: 'AiFarcaster',
  projectId: projectId || 'unconfigured',
  chains: [base],
  ssr: true,
});

export function Providers({ children }: { children: React.ReactNode }) {
  // Create QueryClient per-request to avoid SSR cache leakage
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
