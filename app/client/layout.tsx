import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Farcaster Client — AiFarcaster',
  description: 'Browse and publish Farcaster casts from your mobile browser.',
};

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {children}
    </div>
  );
}
