-- Migration: 0001_init_v1_0_0
-- Creates the initial full schema for AiFarcaster v1.0.0

-- Enums
CREATE TYPE "Role" AS ENUM ('USER', 'DEVELOPER', 'ADMIN');
CREATE TYPE "TemplateTier" AS ENUM ('FREE', 'PREMIUM');
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'CANCELED', 'PAST_DUE', 'TRIALING');
CREATE TYPE "SubscriptionPlan" AS ENUM ('PRO', 'ENTERPRISE');
CREATE TYPE "AirdropStatus" AS ENUM ('DRAFT', 'PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED');
CREATE TYPE "FrameStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');

-- Users
CREATE TABLE "User" (
    "id"        TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "wallet"    TEXT NOT NULL,
    "role"      "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "User_wallet_key" ON "User"("wallet");

-- Sessions
CREATE TABLE "Session" (
    "id"        TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "userId"    TEXT NOT NULL,
    "token"     TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- Prompts
CREATE TABLE "Prompt" (
    "id"        TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "userId"    TEXT NOT NULL,
    "input"     TEXT NOT NULL,
    "optimized" TEXT NOT NULL,
    "version"   INTEGER NOT NULL DEFAULT 1,
    "shared"    BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Prompt_pkey" PRIMARY KEY ("id")
);

-- Usage
CREATE TABLE "Usage" (
    "id"         TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "userId"     TEXT NOT NULL,
    "tokensUsed" INTEGER NOT NULL,
    "timestamp"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Usage_pkey" PRIMARY KEY ("id")
);

-- Feed
CREATE TABLE "Feed" (
    "id"       TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "content"  TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "score"    INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Feed_pkey" PRIMARY KEY ("id")
);

-- Contracts
CREATE TABLE "Contract" (
    "id"           TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "address"      TEXT NOT NULL,
    "label"        TEXT,
    "deployedById" TEXT NOT NULL,
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Contract_address_key" ON "Contract"("address");
CREATE INDEX "Contract_deployedById_idx" ON "Contract"("deployedById");

-- Templates
CREATE TABLE "Template" (
    "id"          TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "name"        TEXT NOT NULL,
    "description" TEXT,
    "category"    TEXT NOT NULL,
    "tier"        "TemplateTier" NOT NULL DEFAULT 'FREE',
    "priceUsd"    DECIMAL(10,2) NOT NULL DEFAULT 0,
    "featured"    BOOLEAN NOT NULL DEFAULT false,
    "active"      BOOLEAN NOT NULL DEFAULT true,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Template_tier_idx" ON "Template"("tier");
CREATE INDEX "Template_category_idx" ON "Template"("category");

-- Frames
CREATE TABLE "Frame" (
    "id"           TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "userId"       TEXT NOT NULL,
    "title"        TEXT NOT NULL,
    "description"  TEXT,
    "status"       "FrameStatus" NOT NULL DEFAULT 'DRAFT',
    "config"       JSONB NOT NULL DEFAULT '{}',
    "templateId"   TEXT,
    "views"        INTEGER NOT NULL DEFAULT 0,
    "interactions" INTEGER NOT NULL DEFAULT 0,
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Frame_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Frame_userId_idx" ON "Frame"("userId");
CREATE INDEX "Frame_status_idx" ON "Frame"("status");

-- Template Purchases
CREATE TABLE "TemplatePurchase" (
    "id"             TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "userId"         TEXT NOT NULL,
    "templateId"     TEXT NOT NULL,
    "paymentRef"     TEXT,
    "amountUsd"      DECIMAL(10,2) NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TemplatePurchase_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "TemplatePurchase_idempotencyKey_key" ON "TemplatePurchase"("idempotencyKey");
CREATE UNIQUE INDEX "TemplatePurchase_userId_templateId_key" ON "TemplatePurchase"("userId", "templateId");
CREATE INDEX "TemplatePurchase_userId_idx" ON "TemplatePurchase"("userId");

-- Subscriptions
CREATE TABLE "Subscription" (
    "id"                   TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "userId"               TEXT NOT NULL,
    "stripeSubscriptionId" TEXT,
    "plan"                 "SubscriptionPlan" NOT NULL,
    "status"               "SubscriptionStatus" NOT NULL,
    "currentPeriodStart"   TIMESTAMP(3) NOT NULL,
    "currentPeriodEnd"     TIMESTAMP(3) NOT NULL,
    "canceledAt"           TIMESTAMP(3),
    "createdAt"            TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"            TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Subscription_stripeSubscriptionId_key" ON "Subscription"("stripeSubscriptionId");
CREATE INDEX "Subscription_userId_idx" ON "Subscription"("userId");
CREATE INDEX "Subscription_status_idx" ON "Subscription"("status");

-- Airdrop Campaigns
CREATE TABLE "AirdropCampaign" (
    "id"           TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "userId"       TEXT NOT NULL,
    "name"         TEXT NOT NULL,
    "description"  TEXT,
    "tokenAddress" TEXT,
    "tokenSymbol"  TEXT,
    "totalAmount"  TEXT,
    "status"       "AirdropStatus" NOT NULL DEFAULT 'DRAFT',
    "merkleRoot"   TEXT,
    "scheduledAt"  TIMESTAMP(3),
    "completedAt"  TIMESTAMP(3),
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AirdropCampaign_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "AirdropCampaign_userId_idx" ON "AirdropCampaign"("userId");
CREATE INDEX "AirdropCampaign_status_idx" ON "AirdropCampaign"("status");

-- Airdrop Recipients
CREATE TABLE "AirdropRecipient" (
    "id"         TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "campaignId" TEXT NOT NULL,
    "address"    TEXT NOT NULL,
    "amount"     TEXT NOT NULL,
    "claimed"    BOOLEAN NOT NULL DEFAULT false,
    "txHash"     TEXT,
    "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AirdropRecipient_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "AirdropRecipient_campaignId_address_key" ON "AirdropRecipient"("campaignId", "address");
CREATE INDEX "AirdropRecipient_campaignId_idx" ON "AirdropRecipient"("campaignId");

-- Payment Events
CREATE TABLE "PaymentEvent" (
    "id"            TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "userId"        TEXT,
    "stripeEventId" TEXT,
    "eventType"     TEXT NOT NULL,
    "payload"       JSONB NOT NULL,
    "processed"     BOOLEAN NOT NULL DEFAULT false,
    "processedAt"   TIMESTAMP(3),
    "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PaymentEvent_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "PaymentEvent_stripeEventId_key" ON "PaymentEvent"("stripeEventId");
CREATE INDEX "PaymentEvent_stripeEventId_idx" ON "PaymentEvent"("stripeEventId");
CREATE INDEX "PaymentEvent_eventType_idx" ON "PaymentEvent"("eventType");

-- Audit Logs
CREATE TABLE "AuditLog" (
    "id"         TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "userId"     TEXT,
    "action"     TEXT NOT NULL,
    "resource"   TEXT,
    "resourceId" TEXT,
    "metadata"   JSONB NOT NULL DEFAULT '{}',
    "ipAddress"  TEXT,
    "userAgent"  TEXT,
    "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- Foreign keys
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Prompt" ADD CONSTRAINT "Prompt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Usage" ADD CONSTRAINT "Usage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_deployedById_fkey" FOREIGN KEY ("deployedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Frame" ADD CONSTRAINT "Frame_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Frame" ADD CONSTRAINT "Frame_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "TemplatePurchase" ADD CONSTRAINT "TemplatePurchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TemplatePurchase" ADD CONSTRAINT "TemplatePurchase_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AirdropCampaign" ADD CONSTRAINT "AirdropCampaign_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AirdropRecipient" ADD CONSTRAINT "AirdropRecipient_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "AirdropCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PaymentEvent" ADD CONSTRAINT "PaymentEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
