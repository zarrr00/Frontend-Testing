import { useState } from 'react';
import { transactionService } from '../services/transaction.service';

export const useOCR = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);

  const scanReceipt = async (file) => {
    setIsScanning(true);
    setError(null);
    try {
      const result = await transactionService.scanReceipt(file);
      setScanResult(result);
      return result;
    } catch (err) {
      setError(err.message || 'Gagal memindai struk');
      throw err;
    } finally {
      setIsScanning(false);
    }
  };

  const resetScan = () => {
    setScanResult(null);
    setError(null);
  };

  return {
    scanReceipt,
    isScanning,
    scanResult,
    error,
    resetScan,
  };
};
