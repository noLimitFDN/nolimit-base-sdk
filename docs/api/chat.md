# Chat API Reference

The Chat client provides access to noLimit LLM, an uncensored AI with zero data retention.

## Methods

### send(message, options?)

Send a message to the AI.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| message | `string` | Yes | User message |
| options.history | `ChatMessage[]` | No | Previous messages for context |
| options.timeout | `number` | No | Request timeout in ms (default: 60000) |

**Returns:** `Promise<ChatResponse>`

```typescript
interface ChatResponse {
  message: string;      // AI response
  paymentTx?: string;   // x402 payment transaction hash
}
```

**Example:**

```typescript
const response = await client.chat.send('Explain quantum computing');
console.log(response.message);
```

### stream(message, options?)

Stream response in chunks (async generator).

**Example:**

```typescript
for await (const chunk of client.chat.stream('Tell me a story')) {
  process.stdout.write(chunk);
}
```

## Conversation Context

Pass previous messages for contextual responses:

```typescript
const history = [
  { role: 'user', content: 'What is Bitcoin?' },
  { role: 'assistant', content: 'Bitcoin is...' },
];

const response = await client.chat.send(
  'How does mining work?',
  { history }
);
```

## Pricing

- **$0.05 USDC** per message
- Paid via x402 protocol on Base
- API key bypasses payment

## Rate Limits

- Default: 60 requests/minute
- Enterprise: Custom limits available

## Errors
