'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { coinbaseWallet, injectedWallet, walletConnectWallet } from '@rainbow-me/rainbowkit/wallets';
import { WagmiProvider } from 'wagmi';
import { base } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'build-placeholder';

const config = getDefaultConfig({
  appName: 'AiFarcaster',
  projectId,
  chains: [base],
  ssr: true,
  wallets: [
    {
      groupName: 'Recommended',
      wallets: [injectedWallet, walletConnectWallet, coinbaseWallet],
    },
  ],
});

const createQueryClient = () => new QueryClient();

let browserQueryClient: QueryClient | undefined;

const getQueryClient = () => {
  if (typeof window === 'undefined') {
    return createQueryClient();
  }

  if (!browserQueryClient) {
    browserQueryClient = createQueryClient();
  }

  return browserQueryClient;
};

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(getQueryClient);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID) {
      console.warn(
        '[AiFarcaster] NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not configured. WalletConnect-based flows will be disabled.',
      );
    }
  }, []);

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
