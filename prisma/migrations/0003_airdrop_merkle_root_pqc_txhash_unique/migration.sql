-- Migration: 0003_airdrop_merkle_root_pqc_txhash_unique
-- Extends AirdropMerkleRoot with:
--   pqcRoot           — reserved slot for a future ML-DSA post-quantum root commitment
--   UNIQUE(txHash)    — prevents duplicate on-chain anchoring events
--   INDEX(campaignId, publishedAt) — compound index for rapid chronological retrieval

-- Add post-quantum root commitment slot (nullable; populated when ML-DSA support lands)
ALTER TABLE "AirdropMerkleRoot" ADD COLUMN "pqcRoot" TEXT;

-- Unique constraint on txHash prevents the same on-chain transaction from being
-- recorded twice across different campaign records.
-- PostgreSQL treats each NULL as distinct, so nullable txHash is safe here.
CREATE UNIQUE INDEX "AirdropMerkleRoot_txHash_key"
    ON "AirdropMerkleRoot"("txHash")
    WHERE "txHash" IS NOT NULL;

-- Compound index enables efficient chronological queries scoped to a campaign:
--   SELECT * FROM "AirdropMerkleRoot" WHERE "campaignId" = $1 ORDER BY "publishedAt" DESC
CREATE INDEX "AirdropMerkleRoot_campaignId_publishedAt_idx"
    ON "AirdropMerkleRoot"("campaignId", "publishedAt");
