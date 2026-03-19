// lib/validation.ts
// Zod schemas for validating API request bodies.
import { z } from 'zod';

/** Schema for POST /api/ai/optimize */
export const CreatePromptSchema = z.object({
  input: z
    .string()
    .min(1, 'input must not be empty')
    .max(5000, 'input must be at most 5000 characters'),
});

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

export type CreatePromptInput = z.infer<typeof CreatePromptSchema>;
export type DeployContractInput = z.infer<typeof DeployContractSchema>;
export type UpdateContractInput = z.infer<typeof UpdateContractSchema>;
