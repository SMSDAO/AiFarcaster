'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { coinbaseWallet, injectedWallet, walletConnectWallet } from '@rainbow-me/rainbowkit/wallets';
import { WagmiProvider } from 'wagmi';
import { base } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
const hasWalletConnectProjectId = Boolean(walletConnectProjectId);

const config = getDefaultConfig({
  appName: 'AiFarcaster',
  projectId: walletConnectProjectId || '',
  chains: [base],
  ssr: true,
  wallets: [
    {
      groupName: 'Recommended',
      wallets: hasWalletConnectProjectId
        ? [injectedWallet, walletConnectWallet, coinbaseWallet]
        : [injectedWallet, coinbaseWallet],
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
    if (!hasWalletConnectProjectId) {
      console.warn(
        '[AiFarcaster] NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not configured. WalletConnect has been hidden from wallet options.',
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
