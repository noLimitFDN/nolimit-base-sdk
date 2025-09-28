/**
 * Swap types
 */

import type { SupportedToken } from './tokens';

export interface SwapParams {
  /** Source token symbol or address */
  from: SupportedToken | string;
  
  /** Destination token symbol or address */
  to: SupportedToken | string;
  
  /** Amount in human readable format */
  amount: string;
  
  /** Slippage tolerance % (default: 1) */
  slippage?: number;
  
  /** Deadline in seconds */
  deadline?: number;
  
  /** Recipient address (defaults to sender) */
  recipient?: string;
}

export interface SwapQuote {
  /** Input amount in wei */
  fromAmount: string;
  
  /** Output amount in wei */
  toAmount: string;
  
  /** Minimum output (after slippage) */
  minOutput: string;
  
  /** Price impact % */
  priceImpact: number;
  
  /** Gas estimate */
  estimatedGas: string;
  
  /** Route path */
  route: string[];
  
  /** Quote valid until */
  validUntil: number;
}

export interface SwapResult {
  /** Transaction hash */
  txHash: string;
  
  /** Input amount */
  fromAmount: string;
  
  /** Output amount */
  toAmount: string;
  
  /** $NL rewards earned */
  nlRewards: string;
  
  /** x402 payment tx */
  paymentTx?: string;
  
  /** Gas used */
  gasUsed?: string;
}

export interface TokenInfo {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
}

export interface SwapTransaction {
  to: string;
  data: string;
  value: string;
  gasPrice?: string;
  gasLimit?: string;
}

// swap v1
