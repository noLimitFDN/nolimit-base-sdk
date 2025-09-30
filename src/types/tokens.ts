/**
 * Token types
 */

export type SupportedToken = 'ETH' | 'USDC' | 'USDT';

export interface TokenConfig {
  address: string;
  decimals: number;
  symbol: string;
  name: string;
}

export const TOKEN_CONFIGS: Record<SupportedToken, TokenConfig> = {
  ETH: {
    address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    decimals: 18,
    symbol: 'ETH',
    name: 'Ethereum',
  },
  USDC: {
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    decimals: 6,
    symbol: 'USDC',
    name: 'USD Coin',
  },
  USDT: {
    address: '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2',
    decimals: 6,
    symbol: 'USDT',
    name: 'Tether USD',
  },
};

// base tokens
