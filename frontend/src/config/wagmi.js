import { configureChains, createConfig } from 'wagmi';
import { mainnet, sepolia, goerli, polygon, polygonMumbai, arbitrum, arbitrumGoerli, optimism, optimismGoerli, bsc, bscTestnet } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { getDefaultWallets } from '@rainbow-me/rainbowkit';

// Configure chains
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    mainnet,
    sepolia,
    goerli,
    polygon,
    polygonMumbai,
    arbitrum,
    arbitrumGoerli,
    optimism,
    optimismGoerli,
    bsc,
    bscTestnet
  ],
  [
    alchemyProvider({ apiKey: process.env.REACT_APP_ALCHEMY_KEY || 'demo' }),
    publicProvider()
  ]
);

// Configure wallet connectors
const { connectors } = getDefaultWallets({
  appName: 'Aegis - Disaster Relief Platform',
  projectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains
});

// Create wagmi config
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient
});

export { chains, wagmiConfig };
