/**
 * Basic Usage - JavaScript (CommonJS)
 * noLimit Base SDK
 */

const { NoLimitClient } = require('@nolimit/base-sdk');
const { ethers } = require('ethers');

async function main() {
  // Using private key (for server-side)
  const provider = new ethers.JsonRpcProvider('https://mainnet.base.org');
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const client = new NoLimitClient({
    signer: wallet,
    debug: true,
  });

  // Chat
  console.log('Sending chat message...');
  const chatResponse = await client.chat.send('What is DeFi?');
  console.log('Response:', chatResponse.message);

  // Swap
  console.log('\nExecuting swap...');
  const swapResult = await client.swap.execute({
    from: 'ETH',
    to: 'USDC',
    amount: '0.01',
  });
  console.log('Swap TX:', swapResult.txHash);

  // Mixer
  console.log('\nCreating mix...');
  const mixResult = await client.mixer.create({
    token: 'USDC',
    amount: '50',
    recipient: '0x742d35Cc6634C0532925a3b844Bc9e7595f1aB34',
  });
  console.log('Mix ID:', mixResult.mixId);
  console.log('Deposit to:', mixResult.depositAddress);
}

main().catch(console.error);

