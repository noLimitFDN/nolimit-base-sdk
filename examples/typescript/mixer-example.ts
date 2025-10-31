/**
 * Mixer Example - TypeScript
 * Demonstrates noLimit Mixer integration
 */

import { NoLimitClient, MixerError } from '@nolimit/base-sdk';
import { BrowserProvider, parseUnits } from 'ethers';

async function main() {
  const provider = new BrowserProvider(window.ethereum);
  await provider.send('eth_requestAccounts', []);
  const signer = await provider.getSigner();

  const client = new NoLimitClient({ signer });

  // Calculate fee
  const amount = '100';
  const { fee, output } = client.mixer.calculateFee(amount);
  console.log(`Mixing ${amount} USDC`);
  console.log(`  Fee (1%): ${fee} USDC`);
  console.log(`  Recipient gets: ${output} USDC`);

  // Create mix request
  console.log('\nCreating mix request...');
  
  const mix = await client.mixer.create({
    token: 'USDC',
    amount: '100',
    recipient: '0x742d35Cc6634C0532925a3b844Bc9e7595f1aB34',
    delay: 5, // 5 minute delay for extra privacy
  });

  console.log('Mix created:');
  console.log('  Mix ID:', mix.mixId);
  console.log('  Deposit to:', mix.depositAddress);
  console.log('  Amount:', mix.depositAmount, 'USDC');
  console.log('  Expires:', mix.expiresAt);

  // In real app, send tokens to depositAddress here
  // const depositTx = await usdcContract.transfer(mix.depositAddress, parseUnits('100', 6));
  // await client.mixer.confirmDeposit(mix.mixId, depositTx.hash);

  // Monitor status
  console.log('\nMonitoring mix status...');
  
  const checkStatus = async () => {
    const status = await client.mixer.getStatus(mix.mixId);
    console.log(`Status: ${status.status} (${status.progress}%)`);
    console.log(`  Hop: ${status.currentHop}/${status.totalHops}`);
    return status;
  };

  // Poll for completion
  try {
    const finalStatus = await client.mixer.waitForCompletion(mix.mixId, {
      timeout: 600000, // 10 min
      pollInterval: 10000, // 10 sec
    });

    console.log('\nMix completed!');
    console.log('  Output TX:', finalStatus.outputTxHash);
  } catch (err) {
    if (err instanceof MixerError) {
      console.error('Mix failed:', err.message);
    }
    throw err;
  }
}

main().catch(console.error);

// poll
