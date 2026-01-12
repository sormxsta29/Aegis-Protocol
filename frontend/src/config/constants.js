// Contract addresses (update after deployment)
export const CONTRACT_ADDRESSES = {
  // Core contracts
  AEGIS_TOKEN: process.env.REACT_APP_AEGIS_TOKEN_ADDRESS || '',
  CATEGORY_MANAGER: process.env.REACT_APP_CATEGORY_MANAGER_ADDRESS || '',
  AEGIS_VAULT: process.env.REACT_APP_AEGIS_VAULT_ADDRESS || '',
  DISASTER_ORACLE: process.env.REACT_APP_DISASTER_ORACLE_ADDRESS || '',
  META_TRANSACTION_RELAY: process.env.REACT_APP_META_TRANSACTION_RELAY_ADDRESS || '',
  AEGIS_PAYMASTER: process.env.REACT_APP_AEGIS_PAYMASTER_ADDRESS || '',
  ZK_IDENTITY_VERIFIER: process.env.REACT_APP_ZK_IDENTITY_VERIFIER_ADDRESS || '',
  
  // Advanced contracts
  AEGIS_GOVERNANCE: process.env.REACT_APP_AEGIS_GOVERNANCE_ADDRESS || '',
  AEGIS_STAKING: process.env.REACT_APP_AEGIS_STAKING_ADDRESS || '',
  AEGIS_BADGES: process.env.REACT_APP_AEGIS_BADGES_ADDRESS || '',
  DONATION_TRACKER: process.env.REACT_APP_DONATION_TRACKER_ADDRESS || '',
  
  // Mock tokens
  MOCK_USDC: process.env.REACT_APP_MOCK_USDC_ADDRESS || ''
};

// API endpoint
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
export const WS_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:5000';
