/**
 * Crypto Payment Integration for Base Mainnet
 *
 * Configuration:
 * Set NEXT_PUBLIC_PAYMENT_RECEIVER_ADDRESS in .env.local
 * Set FEATURE_CRYPTO_PAYMENTS=true to enable (disabled by default until fully audited)
 *
 * NOTE: Crypto payments are currently DISABLED in production.
 * Set FEATURE_CRYPTO_PAYMENTS=true after completing security review.
 */

import { base } from 'wagmi/chains';
import { encodeFunctionData, parseEther, parseUnits, createPublicClient, http } from 'viem';

export const PAYMENT_TOKENS = {
  ETH: {
    address: '0x0000000000000000000000000000000000000000' as `0x${string}`,
    symbol: 'ETH',
    decimals: 18,
    name: 'Ethereum',
  },
  USDC: {
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as `0x${string}`, // Base Mainnet
    symbol: 'USDC',
    decimals: 6,
    name: 'USD Coin',
  },
};

// Base Sepolia Testnet tokens for testing
export const TESTNET_PAYMENT_TOKENS = {
  ETH: {
    address: '0x0000000000000000000000000000000000000000' as `0x${string}`,
    symbol: 'ETH',
    decimals: 18,
    name: 'Ethereum (Testnet)',
  },
  USDC: {
    address: '0x036CbD53842c5426634e7929541eC2318f3dCF7e' as `0x${string}`, // Base Sepolia USDC
    symbol: 'USDC',
    decimals: 6,
    name: 'USD Coin (Testnet)',
  },
};

export const PAYMENT_RECEIVER_ADDRESS = process.env.NEXT_PUBLIC_PAYMENT_RECEIVER_ADDRESS;

if (typeof window === 'undefined' && !PAYMENT_RECEIVER_ADDRESS) {
  // Only warn on server side to avoid double logging
  console.warn(
    'NEXT_PUBLIC_PAYMENT_RECEIVER_ADDRESS is not set. ' +
    'Crypto payment features will not work until this is configured.',
  );
}

export interface PaymentRequest {
  /** Token contract address — use PAYMENT_TOKENS.ETH.address for native ETH */
  tokenAddress: string;
  /**
   * Human-readable amount (e.g. "0.01" for 0.01 ETH, "10" for 10 USDC).
   * The function converts to the correct base units internally.
   */
  amount: string;
  recipient: string;
  metadata?: {
    orderId?: string;
    productId?: string;
    customerId?: string;
  };
}

export interface PreparedPayment {
  to: `0x${string}`;
  value: bigint;
  data: `0x${string}`;
}

const ERC20_TRANSFER_ABI = [
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
] as const;

/**
 * Encodes an ERC-20 transfer call using viem.
 */
function encodeERC20Transfer(to: `0x${string}`, amount: bigint): `0x${string}` {
  return encodeFunctionData({
    abi: ERC20_TRANSFER_ABI,
    functionName: 'transfer',
    args: [to, amount],
  });
}

/**
 * Prepare a crypto payment transaction for use with wagmi/viem.
 *
 * Returns a transaction object ready to be passed to wagmi's `useSendTransaction`
 * or `useWriteContract` hooks.
 *
 * @throws Error if NEXT_PUBLIC_PAYMENT_RECEIVER_ADDRESS is not set.
 * @throws Error if FEATURE_CRYPTO_PAYMENTS is not enabled.
 */
export function preparePayment(request: PaymentRequest): PreparedPayment {
  if (process.env.FEATURE_CRYPTO_PAYMENTS !== 'true') {
    throw new Error(
      'Crypto payments are currently disabled. ' +
      'Set FEATURE_CRYPTO_PAYMENTS=true to enable after security review.',
    );
  }

  if (!PAYMENT_RECEIVER_ADDRESS) {
    throw new Error('Payment receiver address is not configured');
  }

  const recipient = request.recipient as `0x${string}`;
  const isNativeETH =
    request.tokenAddress === PAYMENT_TOKENS.ETH.address ||
    request.tokenAddress === '0x0000000000000000000000000000000000000000';

  if (isNativeETH) {
    return {
      to: recipient,
      value: parseEther(request.amount),
      data: '0x',
    };
  }

  // ERC-20 transfer
  const token = Object.values(PAYMENT_TOKENS).find(
    (t) => t.address.toLowerCase() === request.tokenAddress.toLowerCase(),
  );
  const decimals = token?.decimals ?? 18;
  const tokenAmount = parseUnits(request.amount, decimals);
  const tokenContract = request.tokenAddress as `0x${string}`;

  return {
    to: tokenContract,
    value: BigInt(0),
    data: encodeERC20Transfer(recipient, tokenAmount),
  };
}

/**
 * Verify a payment transaction on Base network using a public RPC client.
 *
 * @param txHash - Transaction hash to verify.
 * @param expectedRecipient - Expected recipient address.
 * @param expectedMinAmount - Minimum expected value in wei/token units (as bigint string).
 * @returns True if the transaction is confirmed and matches expectations.
 */
export async function verifyPayment(
  txHash: string,
  expectedRecipient?: string,
  expectedMinAmount?: string,
): Promise<boolean> {
  if (process.env.FEATURE_CRYPTO_PAYMENTS !== 'true') {
    throw new Error('Crypto payments are currently disabled.');
  }

  const client = createPublicClient({
    chain: base,
    transport: http(),
  });

  let receipt;
  try {
    receipt = await client.getTransactionReceipt({ hash: txHash as `0x${string}` });
  } catch {
    return false;
  }

  if (!receipt || receipt.status !== 'success') return false;

  if (expectedRecipient) {
    const tx = await client.getTransaction({ hash: txHash as `0x${string}` });
    if (tx.to?.toLowerCase() !== expectedRecipient.toLowerCase()) return false;
    if (expectedMinAmount && tx.value < BigInt(expectedMinAmount)) return false;
  }

  return true;
}

export const BASE_CHAIN = base;
