'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { base } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { useState } from 'react';

/**
 * Get WalletConnect Project ID with build-time safety
 * 
 * During Next.js build (SSR/SSG), this allows a placeholder value so the build succeeds.
 * At client runtime, if the env var is missing, we log a clear error.
 * 
 * Note: `typeof window === 'undefined'` is true during:
 * - Next.js build process
 * - Server-side rendering
 * 
 * But we only want the placeholder during build, not production SSR.
 * The env var check ensures we get the real value if it exists.
 */
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 
  (typeof window === 'undefined' ? 'build-placeholder' : '');

// Client-side validation (runs only in browser)
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
  projectId: projectId || 'not-configured', // Fallback makes the issue obvious in wallet errors
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
