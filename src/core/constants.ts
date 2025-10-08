/**
 * SDK Constants
 */

export const DEFAULT_SERVER = 'https://x402.nolimit.foundation';

export const ENDPOINTS = {
  CHAT: '/noLimitLLM',
  CHAT_API: '/api/agent',
  SWAP: '/noLimitSwap',
  MIXER: '/noLimitMixer',
  MIX_STATUS: '/mixer/status',
  MIX_CONFIRM: '/mixer/confirm-deposit',
  STATS: '/api/stats',
} as const;

export const TOKENS = {
  ETH: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  USDT: '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2',
} as const;

export const DECIMALS: Record<string, number> = {
  ETH: 18,
  USDC: 6,
  USDT: 6,
};

export const PRICING = {
  CHAT: 0.05,      // $0.05 per message
  SWAP: 0.10,      // $0.10 per swap
  MIXER_BASE: 0.075, // $0.075 base fee
  MIXER_PERCENT: 1,  // 1% of amount
} as const;

export const TIMEOUTS = {
  CHAT: 60_000,
  SWAP: 120_000,
  MIXER: 30_000,
  DEFAULT: 30_000,
} as const;

export const CHAIN_ID = 8453; // Base mainnet

// timeouts
