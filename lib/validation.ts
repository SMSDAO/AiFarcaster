// lib/validation.ts
// Zod schemas for validating API request bodies.
import { z } from 'zod';

// ---------------------------------------------------------------------------
// AI Prompt Optimizer
// ---------------------------------------------------------------------------

/** Schema for POST /api/ai/optimize */
export const CreatePromptSchema = z.object({
  input: z
    .string()
    .min(1, 'input must not be empty')
    .max(5000, 'input must be at most 5000 characters'),
});

// ---------------------------------------------------------------------------
// Admin – Contracts
// ---------------------------------------------------------------------------

/** Schema for POST /api/admin/contracts */
export const DeployContractSchema = z.object({
  /** ABI-encoded bytecode for the contract being deployed */
  bytecode: z
    .string()
    .min(1, 'bytecode must not be empty')
    .regex(/^0x[0-9a-fA-F]+$/, 'bytecode must be a valid hex string prefixed with 0x'),
  /** Optional human-readable label stored alongside the address */
  label: z
    .string()
    .max(100, 'label must be at most 100 characters')
    .optional(),
});

/** Schema for PATCH /api/admin/contracts — update address after real deployment */
export const UpdateContractSchema = z.object({
  id: z.string().uuid('id must be a valid UUID'),
  /** The real on-chain address returned by the deployment transaction */
  address: z
    .string()
    .regex(/^0x[0-9a-fA-F]{40}$/, 'address must be a valid 40-hex-char Ethereum address'),
  /** Optionally update the human-readable label at the same time */
  label: z
    .string()
    .max(100, 'label must be at most 100 characters')
    .optional(),
});

// ---------------------------------------------------------------------------
// Frames
// ---------------------------------------------------------------------------

export const FrameConfigSchema = z.record(z.unknown());

export const CreateFrameSchema = z.object({
  title: z
    .string()
    .min(1, 'title must not be empty')
    .max(200, 'title must be at most 200 characters'),
  description: z
    .string()
    .max(1000, 'description must be at most 1000 characters')
    .optional(),
  templateId: z.string().uuid('templateId must be a valid UUID').optional(),
  config: FrameConfigSchema.optional(),
});

export const UpdateFrameSchema = z.object({
  title: z
    .string()
    .min(1, 'title must not be empty')
    .max(200, 'title must be at most 200 characters')
    .optional(),
  description: z
    .string()
    .max(1000, 'description must be at most 1000 characters')
    .optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']).optional(),
  config: FrameConfigSchema.optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  'At least one field must be provided',
);

// ---------------------------------------------------------------------------
// Templates
// ---------------------------------------------------------------------------

export const PurchaseTemplateSchema = z.object({
  /** Client sends the product/template ID, never a Stripe price ID */
  templateId: z.string().uuid('templateId must be a valid UUID'),
  /** Payment method: stripe checkout or verified on-chain tx */
  paymentMethod: z.enum(['stripe', 'crypto']),
  /** Idempotency key supplied by the client to prevent double charges */
  idempotencyKey: z
    .string()
    .min(16, 'idempotencyKey must be at least 16 characters')
    .max(100, 'idempotencyKey must be at most 100 characters'),
});

// ---------------------------------------------------------------------------
// Stripe Checkout
// ---------------------------------------------------------------------------

export const StripeCheckoutSchema = z.object({
  /** Product identifier (maps to a Stripe price on the server) */
  productId: z
    .string()
    .min(1, 'productId must not be empty')
    .max(100, 'productId must be at most 100 characters'),
});

// ---------------------------------------------------------------------------
// Airdrop
// ---------------------------------------------------------------------------

const EthAddressSchema = z
  .string()
  .regex(/^0x[0-9a-fA-F]{40}$/, 'must be a valid Ethereum address');

export const CreateAirdropCampaignSchema = z.object({
  name: z
    .string()
    .min(1, 'name must not be empty')
    .max(200, 'name must be at most 200 characters'),
  description: z
    .string()
    .max(1000, 'description must be at most 1000 characters')
    .optional(),
  tokenAddress: EthAddressSchema.optional(),
  tokenSymbol: z
    .string()
    .max(20, 'tokenSymbol must be at most 20 characters')
    .optional(),
  totalAmount: z
    .string()
    .regex(/^\d+(\.\d+)?$/, 'totalAmount must be a positive decimal number')
    .optional(),
  scheduledAt: z.string().datetime({ message: 'scheduledAt must be an ISO 8601 datetime' }).optional(),
});

export const UpdateAirdropCampaignSchema = z.object({
  name: z
    .string()
    .min(1, 'name must not be empty')
    .max(200, 'name must be at most 200 characters')
    .optional(),
  description: z
    .string()
    .max(1000, 'description must be at most 1000 characters')
    .optional(),
  status: z.enum(['DRAFT', 'PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED']).optional(),
  scheduledAt: z.string().datetime().optional(),
  merkleRoot: z
    .string()
    .regex(/^0x[0-9a-fA-F]{64}$/, 'merkleRoot must be a valid 32-byte hex string')
    .optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  'At least one field must be provided',
);

export const AirdropRecipientSchema = z.object({
  address: EthAddressSchema,
  amount: z
    .string()
    .regex(/^\d+(\.\d+)?$/, 'amount must be a positive decimal number'),
});

export const AirdropRecipientsUploadSchema = z.object({
  recipients: z
    .array(AirdropRecipientSchema)
    .min(1, 'At least one recipient is required')
    .max(10000, 'Maximum 10,000 recipients per upload'),
});

// ---------------------------------------------------------------------------
// Type exports
// ---------------------------------------------------------------------------

export type CreatePromptInput = z.infer<typeof CreatePromptSchema>;
export type DeployContractInput = z.infer<typeof DeployContractSchema>;
export type UpdateContractInput = z.infer<typeof UpdateContractSchema>;
export type CreateFrameInput = z.infer<typeof CreateFrameSchema>;
export type UpdateFrameInput = z.infer<typeof UpdateFrameSchema>;
export type PurchaseTemplateInput = z.infer<typeof PurchaseTemplateSchema>;
export type StripeCheckoutInput = z.infer<typeof StripeCheckoutSchema>;
export type CreateAirdropCampaignInput = z.infer<typeof CreateAirdropCampaignSchema>;
export type UpdateAirdropCampaignInput = z.infer<typeof UpdateAirdropCampaignSchema>;
export type AirdropRecipientsUploadInput = z.infer<typeof AirdropRecipientsUploadSchema>;
