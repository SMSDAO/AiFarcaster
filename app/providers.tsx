'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { coinbaseWallet, injectedWallet, walletConnectWallet } from '@rainbow-me/rainbowkit/wallets';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { coinbaseWallet as coinbaseWalletConnector, injected as injectedConnector } from 'wagmi/connectors';
import { base } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
const hasWalletConnectProjectId = Boolean(walletConnectProjectId);

const config = hasWalletConnectProjectId
  ? getDefaultConfig({
      appName: 'AiFarcaster',
      projectId: walletConnectProjectId!,
      chains: [base],
      ssr: true,
      wallets: [
        {
          groupName: 'Recommended',
          wallets: [injectedWallet, walletConnectWallet, coinbaseWallet],
        },
      ],
    })
  : createConfig({
      chains: [base],
      ssr: true,
      connectors: [
        injectedConnector(),
        coinbaseWalletConnector({ appName: 'AiFarcaster' }),
      ],
      transports: {
        [base.id]: http(),
      },
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
