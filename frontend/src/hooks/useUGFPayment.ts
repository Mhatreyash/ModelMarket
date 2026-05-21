import { useState } from 'react';

export function useUGFPayment() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const MODEL_MARKET_ADDRESS = process.env.NEXT_PUBLIC_MODEL_MARKET_ADDRESS;
  const MOCK_USD_ADDRESS = process.env.NEXT_PUBLIC_MOCK_USD_ADDRESS;

  const processPayment = async (costInMockUSD: number, promptId: string) => {
    if (!MODEL_MARKET_ADDRESS || !MOCK_USD_ADDRESS) {
      console.error("Missing Environment Variables! Make sure .env.local is setup.");
      return null;
    }

    setIsProcessing(true);
    setError(null);

    try {
      console.log(`[UGF] Initializing payment of ${costInMockUSD} MockUSD...`);
      console.log(`[UGF] Target Contract: ${MODEL_MARKET_ADDRESS}`);
      
      console.log("1. QUOTE: Fetching gasless quote from UGF...");
      await new Promise(r => setTimeout(r, 800));

      console.log("2. SETTLE: Asking user to sign the Mock USD approval...");
      await new Promise(r => setTimeout(r, 800));

      console.log("3. EXECUTE: UGF is paying the ETH gas and calling our contract...");
      await new Promise(r => setTimeout(r, 800));

      console.log("4. CONFIRM: Transaction successful!");
      
      setIsProcessing(false);
      return "0xFakeTransactionHashReceipt123456"; 

    } catch (err: any) {
      console.error("UGF Payment Failed:", err);
      setError(err.message);
      setIsProcessing(false);
      return null;
    }
  };

  return { processPayment, isProcessing, error };
}