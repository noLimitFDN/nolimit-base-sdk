/**
 * Format Utils Unit Tests
 */

import { describe, it, expect } from 'vitest';
import {
  parseAmount,
  formatAmount,
  isValidAddress,
  truncateAddress,
  formatUSD,
} from '../../src/utils/format';

describe('parseAmount', () => {
  it('should parse ETH amounts (18 decimals)', () => {
    expect(parseAmount('1', 18)).toBe('1000000000000000000');
    expect(parseAmount('0.1', 18)).toBe('100000000000000000');
    expect(parseAmount('1.5', 18)).toBe('1500000000000000000');
  });

  it('should parse USDC amounts (6 decimals)', () => {
    expect(parseAmount('1', 6)).toBe('1000000');
    expect(parseAmount('100.5', 6)).toBe('100500000');
    expect(parseAmount('0.000001', 6)).toBe('1');
  });

  it('should handle whole numbers', () => {
    expect(parseAmount('100', 6)).toBe('100000000');
  });
});

describe('formatAmount', () => {
  it('should format wei to ETH', () => {
    expect(formatAmount('1000000000000000000', 18)).toBe('1');
    expect(formatAmount('1500000000000000000', 18)).toBe('1.5');
  });

  it('should format wei to USDC', () => {
    expect(formatAmount('1000000', 6)).toBe('1');
    expect(formatAmount('100500000', 6)).toBe('100.5');
  });

  it('should strip trailing zeros', () => {
    expect(formatAmount('1000000', 6)).toBe('1');
    expect(formatAmount('1100000', 6)).toBe('1.1');
  });
});

describe('isValidAddress', () => {
  it('should validate correct addresses', () => {
    expect(isValidAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f1aB34')).toBe(true);
    expect(isValidAddress('0x0000000000000000000000000000000000000000')).toBe(true);
  });

  it('should reject invalid addresses', () => {
    expect(isValidAddress('0x123')).toBe(false);
    expect(isValidAddress('742d35Cc6634C0532925a3b844Bc9e7595f1aB34')).toBe(false);
    expect(isValidAddress('')).toBe(false);
    expect(isValidAddress('not an address')).toBe(false);
  });
});

describe('truncateAddress', () => {
  it('should truncate address', () => {
    const addr = '0x742d35Cc6634C0532925a3b844Bc9e7595f1aB34';
    expect(truncateAddress(addr)).toBe('0x742d...aB34');
    expect(truncateAddress(addr, 6)).toBe('0x742d35...f1aB34');
  });

  it('should handle empty string', () => {
    expect(truncateAddress('')).toBe('');
  });
});

describe('formatUSD', () => {
  it('should format numbers as USD', () => {
    expect(formatUSD(100)).toBe('$100.00');
    expect(formatUSD(1234.56)).toBe('$1,234.56');
    expect(formatUSD('99.9')).toBe('$99.90');
  });
});

// edge
