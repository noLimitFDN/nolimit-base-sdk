/**
 * Swap Example - TypeScript
 * Demonstrates noLimit Swap integration
 */

import { NoLimitClient, PaymentError, NetworkError } from '@nolimit/base-sdk';
import { BrowserProvider, formatUnits } from 'ethers';

async function main() {
  // Connect wallet
  const provider = new BrowserProvider(window.ethereum);
  await provider.send('eth_requestAccounts', []);
  const signer = await provider.getSigner();

  const client = new NoLimitClient({ signer });

  // Get quote first
  console.log('Getting quote for 0.1 ETH -> USDC...');
  
  const quote = await client.swap.quote({
    from: 'ETH',
    to: 'USDC',
    amount: '0.1',
    slippage: 1,
  });

  console.log('Quote received:');
  console.log('  Output:', formatUnits(quote.toAmount, 6), 'USDC');
  console.log('  Min output:', formatUnits(quote.minOutput, 6), 'USDC');
  console.log('  Price impact:', quote.priceImpact, '%');
  console.log('  Route:', quote.route.join(' -> '));

  // Execute swap
  console.log('\nExecuting swap...');

  try {
    const result = await client.swap.execute({
      from: 'ETH',
      to: 'USDC',
      amount: '0.1',
      slippage: 1,
    });

    console.log('Swap successful!');
    console.log('  TX Hash:', result.txHash);
    console.log('  Received:', formatUnits(result.toAmount, 6), 'USDC');
    console.log('  NL Rewards:', result.nlRewards, '$NL');
    console.log('  Payment TX:', result.paymentTx);
  } catch (err) {
    if (err instanceof PaymentError) {
      console.error('Insufficient USDC for payment:', err.required);
    } else if (err instanceof NetworkError) {
      console.error('Network error:', err.message);
    } else {
      throw err;
    }
  }
}

main().catch(console.error);

