// 📁 src/app/hooks/useUsdcBalance.ts
'use client';
import { useEffect, useState, useCallback } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import toast from 'react-hot-toast';
import { SOLANA_RPC, USDC_ADDRESS } from '../config';

const USDC_DEVNET_MINT = new PublicKey(USDC_ADDRESS);
const connection = new Connection(SOLANA_RPC);

export const useUsdcBalance = () => {
  const { publicKey, connected } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchUSDCBalance = useCallback(async () => {
    if (!publicKey || !connected) return;
    try {
      setLoading(true);
      const tokenAccounts = await connection.getTokenAccountsByOwner(publicKey, {
        mint: USDC_DEVNET_MINT,
      });

      if (tokenAccounts.value.length === 0) {
        setBalance(0);
        return;
      }

      const accountInfo = await connection.getTokenAccountBalance(tokenAccounts.value[0].pubkey);
      const balanceValue = parseFloat(accountInfo.value.uiAmountString || '0');
      setBalance(balanceValue);
    } catch (error) {
      console.error('Error fetching USDC balance:', error);
      toast.error('Failed to fetch USDC balance');
    } finally {
      setLoading(false);
    }
  }, [publicKey, connected]);

  useEffect(() => {
    fetchUSDCBalance();
  }, [fetchUSDCBalance]);

  return { balance, loading, refresh: fetchUSDCBalance };
};
