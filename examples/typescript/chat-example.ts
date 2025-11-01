/**
 * Chat Example - TypeScript
 * Demonstrates noLimit LLM integration
 */

import { NoLimitClient } from '@nolimit/base-sdk';
import { BrowserProvider } from 'ethers';

async function main() {
  // Connect wallet
  const provider = new BrowserProvider(window.ethereum);
  await provider.send('eth_requestAccounts', []);
  const signer = await provider.getSigner();

  // Initialize client
  const client = new NoLimitClient({
    signer,
    debug: true,
  });

  console.log('Connected:', await client.getAddress());

  // Simple chat
  const response = await client.chat.send('Explain quantum entanglement in simple terms');
  console.log('AI:', response.message);
  console.log('Payment TX:', response.paymentTx);

  // Chat with history
  const history = [
    { role: 'user' as const, content: 'What is Bitcoin?' },
    { role: 'assistant' as const, content: 'Bitcoin is a decentralized digital currency...' },
  ];

  const followUp = await client.chat.send(
    'How does mining work?',
    { history }
  );
  console.log('Follow-up:', followUp.message);

  // Streaming (simulated)
  console.log('\nStreaming response:');
  for await (const chunk of client.chat.stream('Tell me a short story')) {
    process.stdout.write(chunk);
  }
  console.log('\n');
}

main().catch(console.error);

