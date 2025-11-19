# Getting Started

This guide will help you integrate noLimit services into your Base dApp.

## Prerequisites

- Node.js 18+
- Base network wallet (MetaMask, Rabby, etc.)
- USDC on Base for x402 payments

## Installation

```bash
npm install @nolimit/base-sdk
```

## Initialize Client

### With ethers.js

```typescript
import { NoLimitClient } from '@nolimit/base-sdk';
import { BrowserProvider } from 'ethers';

const provider = new BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

const client = new NoLimitClient({ signer });
```

### With viem

```typescript
import { NoLimitClient } from '@nolimit/base-sdk';
import { createWalletClient, custom } from 'viem';
import { base } from 'viem/chains';

const walletClient = createWalletClient({
  chain: base,
  transport: custom(window.ethereum),
});

const client = NoLimitClient.fromViem(walletClient);
```

### With API Key (Enterprise)

```typescript
const client = NoLimitClient.withApiKey('nl_live_xxxxx');
```

## Using Services

### Chat (noLimit LLM)

```typescript
const response = await client.chat.send('Your question here');
console.log(response.message);
```

### Swap (noLimit Swap)

```typescript
const result = await client.swap.execute({
  from: 'ETH',
  to: 'USDC',
  amount: '0.1',
});
console.log('TX:', result.txHash);
```

### Mixer (noLimit Mixer)

```typescript
const mix = await client.mixer.create({
  token: 'USDC',
  amount: '100',
  recipient: '0x...',
});
// Send tokens to mix.depositAddress
```

## Error Handling

```typescript
import { PaymentError, NetworkError } from '@nolimit/base-sdk';

try {
  await client.chat.send('...');
} catch (err) {
  if (err instanceof PaymentError) {
    // Insufficient USDC for x402 payment
  }
}
```

## Next Steps

- [Chat API Reference](../api/chat.md)
- [Swap API Reference](../api/swap.md)
- [Mixer API Reference](../api/mixer.md)
- [Examples](../../examples/)

