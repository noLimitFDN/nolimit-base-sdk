/**
 * API Key Usage - JavaScript
 * Enterprise access without x402 payments
 */

const { NoLimitClient } = require('@nolimit/base-sdk');

async function main() {
  // Initialize with API key (no wallet needed for chat)
  const client = NoLimitClient.withApiKey(process.env.NOLIMIT_API_KEY);

  // Chat - no payment required
  const response = await client.chat.send('Explain smart contracts');
  console.log('Response:', response.message);

  // For swap/mixer, you still need a wallet to sign transactions
  // but API key bypasses the x402 service fee

  // Multiple messages with context
  const history = [];
  
  const topics = [
    'What is Ethereum?',
    'How do gas fees work?',
    'What are L2 solutions?',
  ];

  for (const question of topics) {
    const answer = await client.chat.send(question, { history });
    console.log(`\nQ: ${question}`);
    console.log(`A: ${answer.message.slice(0, 200)}...`);
    
    history.push(
      { role: 'user', content: question },
      { role: 'assistant', content: answer.message }
    );
  }
}

main().catch(console.error);

