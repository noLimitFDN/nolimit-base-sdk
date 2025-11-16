# @nolimit/base-sdk

Official Base chain SDK for noLimit Foundation - Privacy-first AI, Swap, and Mixer

[![npm](https://img.shields.io/npm/v/@nolimit/base-sdk)](https://www.npmjs.com/package/@nolimit/base-sdk)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Integrate noLimit's privacy utilities into your Base dApp:

- **noLimit LLM** - Uncensored AI with zero data retention
- **noLimit Swap** - Privacy-enhanced DEX aggregation (1inch)
- **noLimit Mixer** - Break on-chain transaction links

All services use [x402 protocol](https://x402.org) for trustless micropayments.

## Installation

```bash
npm install @nolimit/base-sdk
```

## Quick Start

```typescript
import { NoLimitClient } from '@nolimit/base-sdk';
import { BrowserProvider } from 'ethers';

const provider = new BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

const client = new NoLimitClient({ signer });

// Chat - $0.05/message
const response = await client.chat.send('Explain zero-knowledge proofs');
console.log(response.message);

// Swap - $0.10/swap
const swap = await client.swap.execute({
  from: 'ETH',
  to: 'USDC',
  amount: '0.5',
});

// Mixer - $0.075 + 1% fee
const mix = await client.mixer.create({
  token: 'USDC',
  amount: '500',
  recipient: '0x...',
});
```

## Python

```python
from nolimit_base import NoLimitClient

client = NoLimitClient(private_key="0x...")
response = client.chat.send("How do mixers work?")
```

## API Reference

### NoLimitClient

```typescript
const client = new NoLimitClient({
  signer?: Signer,           // ethers.js signer
  walletClient?: WalletClient, // viem client
  apiKey?: string,           // enterprise API key
  serverUrl?: string,        // custom server
});
```

### Chat

```typescript
const { message } = await client.chat.send(prompt, { history });
```

### Swap

```typescript
const result = await client.swap.execute({
  from: 'ETH',
  to: 'USDC',
  amount: '1.0',
  slippage: 1, // percent
});
```

### Mixer

```typescript
const mix = await client.mixer.create({
  token: 'USDC',
  amount: '100',
  recipient: '0x...',
  delay: 5, // minutes
});

const status = await client.mixer.getStatus(mix.mixId);
```

## Token Addresses (Base)

| Token | Address |
|-------|---------|
| ETH | Native |
| USDC | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` |
| USDT | `0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2` |

## Pricing

| Service | Cost |
|---------|------|
| Chat | $0.05 USDC / message |
| Swap | $0.10 USDC / transaction |
| Mixer | $0.075 USDC + 1% |

## Links

- [Documentation](https://docs.nolimit.foundation)
- [Integration Guide](https://nolimit.foundation/integration)
- [Discord](https://discord.gg/nolimit)
- [Twitter](https://twitter.com/noLimitFDN)

## License

MIT - noLimit Foundation
<!-- v1 -->
