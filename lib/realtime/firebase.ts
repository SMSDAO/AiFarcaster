// lib/realtime/firebase.ts
// Firebase Realtime Database integration for prompt event broadcasting.
// Supports server-side writes (broadcast) and client-side subscriptions.
//
// Required environment variables:
//   NEXT_PUBLIC_FIREBASE_API_KEY
//   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
//   NEXT_PUBLIC_FIREBASE_DATABASE_URL
//   NEXT_PUBLIC_FIREBASE_PROJECT_ID
//   NEXT_PUBLIC_FIREBASE_APP_ID

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import {
  getDatabase,
  ref,
  set,
  onValue,
  type Unsubscribe,
  type Database,
} from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function isConfigured(): boolean {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.databaseURL &&
      firebaseConfig.projectId,
  );
}

function getFirebaseApp(): FirebaseApp | null {
  if (!isConfigured()) return null;
  if (getApps().length > 0) return getApps()[0]!;
  return initializeApp(firebaseConfig);
}

function getDb(): Database | null {
  const app = getFirebaseApp();
  if (!app) return null;
  try {
    return getDatabase(app);
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Event payloads
// ---------------------------------------------------------------------------

export interface PromptEvent {
  id: string;
  userId: string;
  input: string;
  optimized: string;
  version: number;
  shared: boolean;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Server-side broadcast helpers
// ---------------------------------------------------------------------------

/**
 * Broadcasts a `prompt_created` event to `prompts/{userId}/latest`.
 * No-op when Firebase is not configured.
 */
export async function broadcastPromptCreated(event: PromptEvent): Promise<void> {
  const db = getDb();
  if (!db) return;
  const path = `prompts/${event.userId}/latest`;
  await set(ref(db, path), { ...event, _event: 'prompt_created' });
}

/**
 * Broadcasts a `prompt_updated` event to `prompts/{userId}/latest`.
 * No-op when Firebase is not configured.
 */
export async function broadcastPromptUpdated(event: PromptEvent): Promise<void> {
  const db = getDb();
  if (!db) return;
  const path = `prompts/${event.userId}/latest`;
  await set(ref(db, path), { ...event, _event: 'prompt_updated' });
}

// ---------------------------------------------------------------------------
// Client-side subscription helpers
// ---------------------------------------------------------------------------

/**
 * Subscribes to real-time prompt updates for `userId`.
 * The returned function unsubscribes the listener when called.
 *
 * Returns null when Firebase is not configured (e.g., unit tests, CI).
 */
export function subscribeToUserPrompts(
  userId: string,
  callback: (event: PromptEvent & { _event: string }) => void,
): Unsubscribe | null {
  const db = getDb();
  if (!db) return null;

  const promptRef = ref(db, `prompts/${userId}/latest`);
  // onValue returns an Unsubscribe function. Use it directly so we only remove
  // this specific listener and don't inadvertently clear other listeners on the
  // same ref (which off(promptRef) without a callback would do).
  const unsubscribe = onValue(promptRef, (snapshot) => {
    const data = snapshot.val();
    if (data) callback(data as PromptEvent & { _event: string });
  });

  return unsubscribe;
}
