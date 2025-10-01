/**
 * Configuration types
 */

export interface NoLimitConfig {
  /** ethers.js Signer */
  signer?: Signer;
  
  /** viem WalletClient */
  walletClient?: WalletClient;
  
  /** Enterprise API key (bypasses x402) */
  apiKey?: string;
  
  /** Custom server URL */
  serverUrl?: string;
  
  /** Enable debug logs */
  debug?: boolean;
  
  /** Request timeout in ms */
  timeout?: number;
}

export interface Signer {
  getAddress(): Promise<string>;
  signMessage(message: string | Uint8Array): Promise<string>;
  sendTransaction(tx: TransactionRequest): Promise<TransactionResponse>;
}

export interface WalletClient {
  account?: { address: `0x${string}` };
  chain?: { id: number };
  signMessage(args: { message: string }): Promise<`0x${string}`>;
  sendTransaction(args: {
    to: `0x${string}`;
    data?: `0x${string}`;
    value?: bigint;
  }): Promise<`0x${string}`>;
}

export interface TransactionRequest {
  to?: string;
  from?: string;
  data?: string;
  value?: bigint | string;
  gasLimit?: bigint;
  gasPrice?: bigint;
  maxFeePerGas?: bigint;
  maxPriorityFeePerGas?: bigint;
  nonce?: number;
}

export interface TransactionResponse {
  hash: string;
  wait(confirmations?: number): Promise<TransactionReceipt>;
}

export interface TransactionReceipt {
  transactionHash: string;
  blockNumber: number;
  blockHash: string;
  status: number;
  gasUsed: bigint;
}

