import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';

export type TxValidationResult =
  | { ok: true; mode: 'sandbox' | 'live'; message: string }
  | { ok: false; error: string };

export async function validateTxHash(txHash?: string): Promise<TxValidationResult> {
  if (!txHash) {
    return { ok: false, error: 'Missing txHash' };
  }

  if (txHash.startsWith('0xFake')) {
    return {
      ok: true,
      mode: 'sandbox',
      message: 'Developer Sandbox Mode: fake transaction hash accepted.'
    };
  }

  const rpcUrl = process.env.NEXT_PUBLIC_BASE_RPC_URL;
  if (!rpcUrl) {
    return {
      ok: true,
      mode: 'sandbox',
      message: 'Developer Sandbox Mode: RPC URL not configured.'
    };
  }

  try {
    const client = createPublicClient({
      chain: base,
      transport: http(rpcUrl)
    });

    const receipt = await client.getTransactionReceipt({ hash: txHash as `0x${string}` });
    if (!receipt) {
      return { ok: false, error: 'Transaction receipt not found on chain.' };
    }

    const receiptStatus = receipt.status as unknown;
    const transactionSucceeded =
      receiptStatus === 'success' ||
      receiptStatus === 1 ||
      receiptStatus === true;

    if (!transactionSucceeded) {
      return { ok: false, error: 'Transaction did not complete successfully.' };
    }

    return {
      ok: true,
      mode: 'live',
      message: 'Live on-chain transaction receipt verified successfully.'
    };
  } catch (error: any) {
    return {
      ok: false,
      error: `Transaction verification failed: ${error?.message ?? String(error)}`
    };
  }
}
