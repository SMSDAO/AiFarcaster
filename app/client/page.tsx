'use client';

import { useState, useEffect, useCallback } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { MessageSquare, RefreshCw, Send, User } from 'lucide-react';
import type { FarcasterCast, FarcasterUserProfile } from '@/types/farcaster';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Farcaster epoch: Jan 1 2021 00:00:00 UTC in Unix seconds */
const FARCASTER_EPOCH = 1609459200;

function formatTimestamp(farcasterTs: number): string {
  const unixMs = (farcasterTs + FARCASTER_EPOCH) * 1000;
  return new Date(unixMs).toLocaleString();
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function CastCard({ cast }: { cast: FarcasterCast }) {
  return (
    <article className="border border-gray-700 rounded-xl p-4 bg-gray-900 space-y-2">
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <User size={14} aria-hidden="true" />
        <span>FID {cast.fid}</span>
        <span>·</span>
        <time dateTime={new Date((cast.timestamp + FARCASTER_EPOCH) * 1000).toISOString()}>
          {formatTimestamp(cast.timestamp)}
        </time>
      </div>
      <p className="text-sm text-gray-100 whitespace-pre-wrap break-words">{cast.text}</p>
      {cast.embeds.length > 0 && (
        <ul className="space-y-1">
          {cast.embeds.map((embed, i) =>
            embed.url ? (
              <li key={i}>
                <a
                  href={embed.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-purple-400 hover:underline break-all"
                >
                  {embed.url}
                </a>
              </li>
            ) : null,
          )}
        </ul>
      )}
    </article>
  );
}

function ProfileCard({ profile }: { profile: FarcasterUserProfile }) {
  return (
    <div className="flex items-center gap-3 p-4 border border-gray-700 rounded-xl bg-gray-900">
      {profile.pfpUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={profile.pfpUrl}
          alt={profile.displayName ?? `FID ${profile.fid}`}
          className="w-12 h-12 rounded-full object-cover"
        />
      ) : (
        <div
          className="w-12 h-12 rounded-full bg-purple-700 flex items-center justify-center text-white font-bold"
          aria-hidden="true"
        >
          {(profile.displayName ?? String(profile.fid)).charAt(0).toUpperCase()}
        </div>
      )}
      <div className="min-w-0">
        <p className="font-semibold text-white truncate">
          {profile.displayName ?? `FID ${profile.fid}`}
        </p>
        {profile.username && (
          <p className="text-sm text-purple-400 truncate">@{profile.username}</p>
        )}
        {profile.bio && (
          <p className="text-xs text-gray-400 truncate mt-0.5">{profile.bio}</p>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main client page
// ---------------------------------------------------------------------------

export default function FarcasterClientPage() {
  const { address, isConnected } = useAccount();

  const [fid, setFid] = useState<number | null>(null);
  const [fidInput, setFidInput] = useState('');
  const [profile, setProfile] = useState<FarcasterUserProfile | null>(null);
  const [casts, setCasts] = useState<FarcasterCast[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [composeText, setComposeText] = useState('');
  const [composeOpen, setComposeOpen] = useState(false);

  // Resolve FID from connected wallet address
  useEffect(() => {
    if (!isConnected || !address) return;
    fetch(`/api/farcaster/auth?address=${address}`)
      .then((r) => r.json())
      .then((data: { fid?: number }) => {
        if (data.fid) setFid(data.fid);
      })
      .catch(() => null);
  }, [isConnected, address]);

  const loadProfile = useCallback((targetFid: number) => {
    setProfileLoading(true);
    fetch(`/api/farcaster/user?fid=${targetFid}`)
      .then((r) => r.json())
      .then((data: FarcasterUserProfile & { error?: string }) => {
        if (data.error) return;
        setProfile(data);
      })
      .catch(() => null)
      .finally(() => setProfileLoading(false));
  }, []);

  const loadFeed = useCallback(
    (targetFid: number, pageToken?: string, append = false) => {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({ fid: String(targetFid), pageSize: '20' });
      if (pageToken) params.set('pageToken', pageToken);
      fetch(`/api/farcaster/feed?${params}`)
        .then((r) => r.json())
        .then((data: { casts?: FarcasterCast[]; nextPageToken?: string; error?: string }) => {
          if (data.error) {
            setError(data.error);
            return;
          }
          setCasts((prev) => (append ? [...prev, ...(data.casts ?? [])] : (data.casts ?? [])));
          setNextPageToken(data.nextPageToken);
        })
        .catch((err: Error) => setError(err.message))
        .finally(() => setLoading(false));
    },
    [],
  );

  const handleLookup = () => {
    const parsed = parseInt(fidInput, 10);
    if (isNaN(parsed) || parsed <= 0) {
      setError('Please enter a valid positive FID number.');
      return;
    }
    setFid(parsed);
    setCasts([]);
    setNextPageToken(undefined);
    setProfile(null);
    loadProfile(parsed);
    loadFeed(parsed);
  };

  // Auto-load when FID resolves from wallet
  useEffect(() => {
    if (fid === null) return;
    loadProfile(fid);
    loadFeed(fid);
  }, [fid, loadProfile, loadFeed]);

  const handleRefresh = () => {
    if (fid === null) return;
    setCasts([]);
    setNextPageToken(undefined);
    loadFeed(fid);
  };

  const handleLoadMore = () => {
    if (fid === null || !nextPageToken) return;
    loadFeed(fid, nextPageToken, true);
  };

  const handlePublish = async () => {
    if (!composeText.trim()) return;
    // NOTE: Publishing requires a registered Ed25519 signer key for the FID.
    // This UI demonstrates the flow — full signer management is out of scope here.
    alert(
      'Publishing requires a registered Ed25519 signer key stored securely. ' +
        'See /api/farcaster/cast for the server-side endpoint.',
    );
  };

  return (
    <main className="mx-auto max-w-lg min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-black/80 backdrop-blur-sm border-b border-gray-800 px-4 py-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <MessageSquare size={20} className="text-purple-500" aria-hidden="true" />
          <h1 className="font-bold text-white text-lg">Farcaster</h1>
        </div>
        <div className="flex items-center gap-2">
          {fid !== null && (
            <button
              onClick={handleRefresh}
              disabled={loading}
              aria-label="Refresh feed"
              className="p-2 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors disabled:opacity-40"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
          )}
          <ConnectButton chainStatus="none" showBalance={false} />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 pb-24 space-y-4 pt-4">
        {/* FID lookup */}
        {fid === null && (
          <section
            aria-label="Look up a Farcaster feed"
            className="space-y-3 p-4 border border-gray-700 rounded-xl bg-gray-900"
          >
            <p className="text-sm text-gray-400">
              {!isConnected
                ? 'Connect your wallet to auto-detect your FID, or enter one manually.'
                : 'We couldn’t find a Farcaster ID for your connected wallet. Enter a FID to view a feed.'}
            </p>
            <div className="flex gap-2">
              <label htmlFor="fid-input" className="sr-only">
                Farcaster FID
              </label>
              <input
                id="fid-input"
                type="number"
                min={1}
                value={fidInput}
                onChange={(e) => setFidInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
                placeholder="Enter FID (e.g. 3)"
                className="flex-1 rounded-lg bg-gray-800 border border-gray-600 text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={handleLookup}
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-colors"
              >
                Load
              </button>
            </div>
          </section>
        )}

        {/* Profile card */}
        {profileLoading && (
          <div className="text-center text-gray-500 text-sm py-2">Loading profile…</div>
        )}
        {profile && <ProfileCard profile={profile} />}

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="text-sm text-red-400 bg-red-950 border border-red-800 rounded-xl px-4 py-3"
          >
            {error}
          </div>
        )}

        {/* Feed */}
        {casts.length === 0 && !loading && fid !== null && !error && (
          <p className="text-center text-gray-500 text-sm py-8">No casts found.</p>
        )}
        {casts.map((cast) => (
          <CastCard key={cast.hash} cast={cast} />
        ))}

        {loading && (
          <div className="text-center text-gray-500 text-sm py-4">Loading…</div>
        )}

        {nextPageToken && !loading && (
          <button
            onClick={handleLoadMore}
            className="w-full py-3 text-sm text-purple-400 hover:text-purple-300 transition-colors"
          >
            Load more
          </button>
        )}
      </div>

      {/* Compose FAB */}
      {fid !== null && (
        <div className="fixed bottom-6 right-6 z-20">
          <button
            onClick={() => setComposeOpen((o) => !o)}
            aria-label={composeOpen ? 'Close compose' : 'Compose cast'}
            aria-expanded={composeOpen}
            className="w-14 h-14 rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg flex items-center justify-center transition-colors"
          >
            <Send size={22} aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Compose drawer */}
      {composeOpen && (
        <div
          role="dialog"
          aria-label="Compose a new cast"
          className="fixed bottom-0 inset-x-0 z-10 bg-gray-950 border-t border-gray-700 p-4 space-y-3 max-w-lg mx-auto"
        >
          <label htmlFor="compose-text" className="block text-sm font-medium text-gray-300">
            New cast
          </label>
          <textarea
            id="compose-text"
            rows={3}
            maxLength={320}
            value={composeText}
            onChange={(e) => setComposeText(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full rounded-lg bg-gray-800 border border-gray-600 text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">{composeText.length}/320</span>
            <div className="flex gap-2">
              <button
                onClick={() => setComposeOpen(false)}
                className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 text-sm hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePublish}
                disabled={!composeText.trim()}
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white text-sm font-medium transition-colors"
              >
                Cast
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
