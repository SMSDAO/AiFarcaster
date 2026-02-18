/**
 * Crypto Payment Integration for Base Mainnet
 * 
 * Configuration:
 * This module provides utilities for accepting crypto payments on Base.
 * Integrate with your wallet connection via RainbowKit/Wagmi.
 */

import { base } from 'wagmi/chains';

export const PAYMENT_TOKENS = {
  ETH: {
    address: '0x0000000000000000000000000000000000000000',
    symbol: 'ETH',
    decimals: 18,
    name: 'Ethereum',
  },
  USDC: {
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // Base Mainnet
    symbol: 'USDC',
    decimals: 6,
    name: 'USD Coin',
  },
  // Add more Base tokens as needed
};

// Base Sepolia Testnet tokens for testing
export const TESTNET_PAYMENT_TOKENS = {
  ETH: {
    address: '0x0000000000000000000000000000000000000000',
    symbol: 'ETH',
    decimals: 18,
    name: 'Ethereum (Testnet)',
  },
  USDC: {
    address: '0x036CbD53842c5426634e7929541eC2318f3dCF7e', // Base Sepolia USDC
    symbol: 'USDC',
    decimals: 6,
    name: 'USD Coin (Testnet)',
  },
};

export const PAYMENT_RECEIVER_ADDRESS = process.env.NEXT_PUBLIC_PAYMENT_RECEIVER_ADDRESS;

if (!PAYMENT_RECEIVER_ADDRESS) {
  console.warn(
    'NEXT_PUBLIC_PAYMENT_RECEIVER_ADDRESS is not set. ' +
    'Crypto payment features will not work until this is configured.'
  );
}

export interface PaymentRequest {
  tokenAddress: string;
  amount: string;
  recipient: string;
  metadata?: {
    orderId?: string;
    productId?: string;
    customerId?: string;
  };
}

/**
 * Prepare a crypto payment transaction
 * 
 * IMPORTANT: This function returns an incorrectly structured transaction.
 * Before using in production:
 * 1. For ERC-20: Set `to` to the token contract address, not recipient
 * 2. For ERC-20: Implement proper `encodeERC20Transfer` function
 * 3. For ETH: Convert amount to bigint wei using parseEther
 * 4. Add proper validation and error handling
 */
export async function preparePayment(request: PaymentRequest) {
  // TODO: Fix transaction structure
  // Correct implementation should:
  // - Use parseEther/parseUnits for amount conversion
  // - Set `to` = token contract for ERC-20 (not recipient)
  // - Set `value` as bigint, not string
  // - Encode transfer data properly for ERC-20
  
  if (!PAYMENT_RECEIVER_ADDRESS) {
    throw new Error('Payment receiver address is not configured');
  }
  
  return {
    to: request.recipient,
    value: request.tokenAddress === PAYMENT_TOKENS.ETH.address ? request.amount : '0',
    data: request.tokenAddress !== PAYMENT_TOKENS.ETH.address 
      ? encodeERC20Transfer(request.recipient, request.amount)
      : '0x',
  };
}

/**
 * Encode ERC20 transfer function call
 * @param to - Recipient address
 * @param amount - Amount in wei/token units
 * @returns Encoded function data
 * 
 * WARNING: This function is not implemented and returns '0x'.
 * ERC-20 transfers will fail until this is properly implemented.
 */
function encodeERC20Transfer(to: string, amount: string): string {
  // TODO: Implement ERC20 transfer encoding using viem
  // Example implementation:
  // import { encodeFunctionData } from 'viem';
  // return encodeFunctionData({
  //   abi: [{ name: 'transfer', type: 'function', inputs: [{ name: 'to', type: 'address' }, { name: 'amount', type: 'uint256' }] }],
  //   functionName: 'transfer',
  //   args: [to, BigInt(amount)]
  // });
  throw new Error(
    'ERC-20 transfer encoding is not implemented. ' +
    'This function must be completed before ERC-20 payments can work.'
  );
}

/**
 * Verify payment transaction on Base network
 * @param txHash - Transaction hash to verify
 * @returns True if payment is valid and confirmed
 * 
 * WARNING: This function always returns false.
 * Payment verification will fail until this is properly implemented.
 */
export async function verifyPayment(txHash: string): Promise<boolean> {
  // TODO: Implement payment verification using RPC provider
  // Example implementation:
  // import { createPublicClient, http } from 'viem';
  // import { base } from 'viem/chains';
  // 
  // const client = createPublicClient({
  //   chain: base,
  //   transport: http()
  // });
  // 
  // const receipt = await client.getTransactionReceipt({ hash: txHash as `0x${string}` });
  // if (!receipt || receipt.status !== 'success') return false;
  // 
  // // Verify recipient and amount match expected values
  // const tx = await client.getTransaction({ hash: txHash as `0x${string}` });
  // // Add validation logic here
  // return true;
  
  throw new Error(
    'Payment verification is not implemented. ' +
    'This function must be completed before payment verification can work.'
  );
}

export const BASE_CHAIN = base;
