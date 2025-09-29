/**
 * Mixer types
 */

import type { SupportedToken } from './tokens';

export type MixStatusType = 
  | 'pending_deposit'
  | 'deposited'
  | 'mixing'
  | 'completed'
  | 'failed'
  | 'expired';

export interface MixParams {
  /** Token to mix */
  token: SupportedToken;
  
  /** Amount in human readable format */
  amount: string;
  
  /** Recipient address */
  recipient: string;
  
  /** Delay in minutes (0 = instant) */
  delay?: number;
  
  /** Note (encrypted, optional) */
  note?: string;
}

export interface MixResult {
  /** Unique mix identifier */
  mixId: string;
  
  /** Address to deposit to */
  depositAddress: string;
  
  /** Amount to deposit */
  depositAmount: string;
  
  /** Fee deducted (1%) */
  fee: string;
  
  /** Amount recipient receives */
  outputAmount: string;
  
  /** Deposit deadline */
  expiresAt: string;
  
  /** x402 payment tx */
  paymentTx?: string;
}

export interface MixStatus {
  /** Mix ID */
  mixId: string;
  
  /** Current status */
  status: MixStatusType;
  
  /** Progress 0-100 */
  progress: number;
  
  /** Current hop */
  currentHop: number;
  
  /** Total hops */
  totalHops: number;
  
  /** Completion timestamp */
  completedAt?: string;
  
  /** Output tx hash (when completed) */
  outputTxHash?: string;
  
  /** Error message */
  error?: string;
}

export interface MixHop {
  index: number;
  timestamp: string;
  txHash?: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface MixHistory {
  mixId: string;
  token: string;
  amount: string;
  status: MixStatusType;
  createdAt: string;
  completedAt?: string;
}

// mixer types
