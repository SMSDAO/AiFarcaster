-- Migration: 0002_frame_events_social_graph_merkle_roots
-- Adds three new models:
--   FrameEvent        — per-interaction event log for Farcaster Frames
--   SocialGraphCache  — cached Farcaster social-graph snapshot per user
--   AirdropMerkleRoot — immutable merkle-root history per airdrop campaign

-- FrameEvent
CREATE TABLE "FrameEvent" (
    "id"          TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "frameId"     TEXT NOT NULL,
    "userId"      TEXT,
    "eventType"   TEXT NOT NULL,
    "buttonIndex" INTEGER,
    "inputText"   TEXT,
    "castHash"    TEXT,
    "fid"         INTEGER,
    "payload"     JSONB NOT NULL DEFAULT '{}',
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FrameEvent_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "FrameEvent"
    ADD CONSTRAINT "FrameEvent_frameId_fkey"
    FOREIGN KEY ("frameId") REFERENCES "Frame"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX "FrameEvent_frameId_idx"   ON "FrameEvent"("frameId");
CREATE INDEX "FrameEvent_eventType_idx" ON "FrameEvent"("eventType");
CREATE INDEX "FrameEvent_fid_idx"       ON "FrameEvent"("fid");
CREATE INDEX "FrameEvent_createdAt_idx" ON "FrameEvent"("createdAt");

-- SocialGraphCache
CREATE TABLE "SocialGraphCache" (
    "id"            TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "userId"        TEXT NOT NULL,
    "fid"           INTEGER NOT NULL,
    "followingFids" INTEGER[] NOT NULL DEFAULT '{}',
    "followerFids"  INTEGER[] NOT NULL DEFAULT '{}',
    "mutualFids"    INTEGER[] NOT NULL DEFAULT '{}',
    "lastSyncedAt"  TIMESTAMP(3) NOT NULL,
    "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"     TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SocialGraphCache_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "SocialGraphCache"
    ADD CONSTRAINT "SocialGraphCache_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE UNIQUE INDEX "SocialGraphCache_userId_key" ON "SocialGraphCache"("userId");
CREATE UNIQUE INDEX "SocialGraphCache_fid_key"    ON "SocialGraphCache"("fid");
CREATE INDEX "SocialGraphCache_fid_idx"           ON "SocialGraphCache"("fid");

-- AirdropMerkleRoot
CREATE TABLE "AirdropMerkleRoot" (
    "id"          TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "campaignId"  TEXT NOT NULL,
    "merkleRoot"  TEXT NOT NULL,
    "ipfsCid"     TEXT,
    "leafCount"   INTEGER NOT NULL,
    "txHash"      TEXT,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AirdropMerkleRoot_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "AirdropMerkleRoot"
    ADD CONSTRAINT "AirdropMerkleRoot_campaignId_fkey"
    FOREIGN KEY ("campaignId") REFERENCES "AirdropCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE UNIQUE INDEX "AirdropMerkleRoot_campaignId_merkleRoot_key"
    ON "AirdropMerkleRoot"("campaignId", "merkleRoot");
CREATE INDEX "AirdropMerkleRoot_campaignId_idx" ON "AirdropMerkleRoot"("campaignId");
