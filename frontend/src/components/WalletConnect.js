import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect } from 'wagmi';
import './WalletConnect.css';

export default function WalletConnect({ userType }) {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <div className="wallet-connect">
      <ConnectButton
        chainStatus="icon"
        accountStatus={{
          smallScreen: 'avatar',
          largeScreen: 'full',
        }}
        showBalance={{
          smallScreen: false,
          largeScreen: true,
        }}
      />
      
      {isConnected && (
        <div className="wallet-info">
          <div className="address-display">
            <span className="label">Connected as:</span>
            <span className="address">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
          </div>
          <div className="user-type">
            <span className="type-badge">{userType || 'User'}</span>
          </div>
        </div>
      )}
    </div>
  );
}
