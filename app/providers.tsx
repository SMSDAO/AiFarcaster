'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { base } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { useState } from 'react';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!projectId) {
  throw new Error(
    'NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID environment variable is not set. ' +
      'Please configure it to initialize WalletConnect/RainbowKit.'
  );
}

const config = getDefaultConfig({
  appName: 'AiFarcaster',
  projectId,
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
