import React, { useEffect, useMemo, useState } from 'react';
import { parseEther } from 'viem';
import {
  useAccount,
  useBalance,
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction
} from 'wagmi';

function SampleTransaction() {
  const { address, isConnected } = useAccount();
  const [to, setTo] = useState(address || '');
  const [amount, setAmount] = useState('0.0001');
  const [statusMessage, setStatusMessage] = useState('');
  const [useManualGas, setUseManualGas] = useState(true);
  const presetRecipients = [
    {
      label: 'Account 1',
      address: '0x0847136d78CC3198541b5BfFA4a541f211318B04'
    },
    {
      label: 'Account 2',
      address: '0xEEEb9a270622727a62527258A05885210fD1E728'
    }
  ];

  const parsedAmount = useMemo(() => {
    try {
      return amount ? parseEther(amount) : undefined;
    } catch {
      return undefined;
    }
  }, [amount]);

  useEffect(() => {
    if (!to && address) {
      setTo(address);
    }
  }, [address, to]);


  const isReady = Boolean(isConnected && to && parsedAmount);

  const { data: balanceData } = useBalance({
    address,
    watch: true,
    enabled: Boolean(address)
  });

  const { config, error: prepareError } = usePrepareSendTransaction({
    to,
    value: parsedAmount,
    gas: useManualGas ? 21000n : undefined,
    enabled: isReady
  });

  const { data, sendTransaction, error, isLoading } = useSendTransaction(config);
  const { isLoading: isConfirming, isSuccess } = useWaitForTransaction({
    hash: data?.hash
  });

  useEffect(() => {
    if (data?.hash) {
      setStatusMessage('Transaction submitted. Waiting for confirmation...');
      console.log('[SampleTransaction] hash', data.hash);
    }
  }, [data?.hash]);

  useEffect(() => {
    if (prepareError?.message) {
      setStatusMessage(prepareError.message);
      console.log('[SampleTransaction] prepare error', prepareError);
    }
  }, [prepareError]);

  useEffect(() => {
    if (isSuccess) {
      setStatusMessage('Transaction confirmed on-chain.');
      console.log('[SampleTransaction] confirmed');
    }
  }, [isSuccess]);

  const handleCopyHash = async () => {
    if (!data?.hash) return;
    try {
      await navigator.clipboard.writeText(data.hash);
      setStatusMessage('Transaction hash copied.');
    } catch {
      setStatusMessage('Unable to copy transaction hash.');
    }
  };

  const handleSend = () => {
    if (!sendTransaction) return;
    setStatusMessage('Submitting transaction...');
    console.log('[SampleTransaction] submit', { from: address, to, amount });
    sendTransaction();
  };

  return (
    <div className="sample-transaction">
      <div className="section-header">
        <h3>Sample ETH Transaction</h3>
        <span className="refresh-indicator">Testnet recommended</span>
      </div>

      <p className="sample-transaction-note">
        This sends a small amount of ETH using your connected wallet. Make sure you are on a
        testnet and have test ETH.
      </p>

      <div className="tx-form">
        <label className="tx-field">
          <span className="tx-label">Recipient address</span>
          <input
            className="tx-input"
            value={to}
            onChange={(event) => setTo(event.target.value)}
            placeholder="0x..."
          />
        </label>

        <div className="tx-actions">
          {presetRecipients.map((recipient) => (
            <button
              key={recipient.address}
              className="btn btn-outline"
              type="button"
              onClick={() => {
                setTo(recipient.address);
                setStatusMessage(`Recipient set to ${recipient.label}`);
                console.log('[SampleTransaction] set recipient', recipient);
              }}
            >
              Use {recipient.label}
            </button>
          ))}
        </div>

        <label className="tx-field">
          <span className="tx-label">Amount (ETH)</span>
          <input
            className="tx-input"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="0.0001"
          />
        </label>

        <label className="tx-field">
          <span className="tx-label">Gas estimation</span>
          <label className="tx-toggle">
            <input
              type="checkbox"
              checked={useManualGas}
              onChange={(event) => setUseManualGas(event.target.checked)}
            />
            <span>Use manual gas limit (21000) to avoid RPC timeout</span>
          </label>
        </label>

        <div className="tx-actions">
          <button
            className="btn btn-primary"
            onClick={handleSend}
            disabled={!isReady || isLoading || isConfirming}
          >
            {isLoading || isConfirming ? 'Sending...' : 'Send Sample ETH'}
          </button>
          {balanceData && (
            <span className="tx-balance">Balance: {balanceData.formatted} {balanceData.symbol}</span>
          )}
        </div>
      </div>

      {(prepareError || error) && (
        <div className="tx-error">
          {prepareError?.message || error?.message}
        </div>
      )}

      {data?.hash && (
        <div className="tx-hash">
          <span>Tx hash: {data.hash}</span>
          <button className="btn btn-outline" type="button" onClick={handleCopyHash}>
            Copy
          </button>
        </div>
      )}

      {statusMessage && (
        <div className="tx-hash">
          {statusMessage}
        </div>
      )}

      {isSuccess && (
        <div className="tx-success">✅ Transaction confirmed</div>
      )}
    </div>
  );
}

export default SampleTransaction;
