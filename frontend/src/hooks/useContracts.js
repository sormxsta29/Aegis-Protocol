import { useEffect, useState, useCallback } from 'react';
import { useContract, useProvider, useSigner } from 'wagmi';
import { CONTRACT_ADDRESSES } from '../config/constants';

// Import ABIs (you'll need to export these from your compiled contracts)
import AegisTokenABI from '../abi/AegisToken.json';
import CategoryManagerABI from '../abi/CategoryManager.json';
import AegisVaultABI from '../abi/AegisVault.json';
import DisasterOracleABI from '../abi/DisasterOracle.json';
import AegisGovernanceABI from '../abi/AegisGovernance.json';
import AegisStakingABI from '../abi/AegisStaking.json';
import AegisBadgesABI from '../abi/AegisBadges.json';
import DonationTrackerABI from '../abi/DonationTracker.json';

export function useAegisToken() {
  const provider = useProvider();
  const { data: signer } = useSigner();

  const contract = useContract({
    address: CONTRACT_ADDRESSES.AEGIS_TOKEN,
    abi: AegisTokenABI,
    signerOrProvider: signer || provider
  });

  return contract;
}

export function useCategoryManager() {
  const provider = useProvider();
  const { data: signer } = useSigner();

  return useContract({
    address: CONTRACT_ADDRESSES.CATEGORY_MANAGER,
    abi: CategoryManagerABI,
    signerOrProvider: signer || provider
  });
}

export function useAegisVault() {
  const provider = useProvider();
  const { data: signer } = useSigner();

  return useContract({
    address: CONTRACT_ADDRESSES.AEGIS_VAULT,
    abi: AegisVaultABI,
    signerOrProvider: signer || provider
  });
}

export function useDisasterOracle() {
  const provider = useProvider();
  const { data: signer } = useSigner();

  return useContract({
    address: CONTRACT_ADDRESSES.DISASTER_ORACLE,
    abi: DisasterOracleABI,
    signerOrProvider: signer || provider
  });
}

export function useAegisGovernance() {
  const provider = useProvider();
  const { data: signer } = useSigner();

  return useContract({
    address: CONTRACT_ADDRESSES.AEGIS_GOVERNANCE,
    abi: AegisGovernanceABI,
    signerOrProvider: signer || provider
  });
}

export function useAegisStaking() {
  const provider = useProvider();
  const { data: signer } = useSigner();

  return useContract({
    address: CONTRACT_ADDRESSES.AEGIS_STAKING,
    abi: AegisStakingABI,
    signerOrProvider: signer || provider
  });
}

export function useAegisBadges() {
  const provider = useProvider();
  const { data: signer } = useSigner();

  return useContract({
    address: CONTRACT_ADDRESSES.AEGIS_BADGES,
    abi: AegisBadgesABI,
    signerOrProvider: signer || provider
  });
}

export function useDonationTracker() {
  const provider = useProvider();
  const { data: signer } = useSigner();

  return useContract({
    address: CONTRACT_ADDRESSES.DONATION_TRACKER,
    abi: DonationTrackerABI,
    signerOrProvider: signer || provider
  });
}

// Custom hook for token balances
export function useTokenBalances(address) {
  const [balances, setBalances] = useState({});
  const [loading, setLoading] = useState(false);
  const token = useAegisToken();

  const fetchBalances = useCallback(async () => {
    if (!address || !token) return;

    setLoading(true);
    try {
      const newBalances = {};
      for (let i = 1; i <= 5; i++) {
        const balance = await token.balanceOf(address, i);
        newBalances[`token${i}`] = balance.toString();
      }
      setBalances(newBalances);
    } catch (error) {
      console.error('Error fetching balances:', error);
    } finally {
      setLoading(false);
    }
  }, [address, token]);

  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  return { balances, loading, refetch: fetchBalances };
}

// Custom hook for staking info
export function useStakingInfo(address) {
  const [stakingInfo, setStakingInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const staking = useAegisStaking();

  const fetchStakingInfo = useCallback(async () => {
    if (!address || !staking) return;

    setLoading(true);
    try {
      const [stakedAmount, earnedRewards] = await Promise.all([
        staking.stakes(address),
        staking.earned(address)
      ]);
      
      setStakingInfo({
        stakedAmount: stakedAmount.toString(),
        earnedRewards: earnedRewards.toString()
      });
    } catch (error) {
      console.error('Error fetching staking info:', error);
    } finally {
      setLoading(false);
    }
  }, [address, staking]);

  useEffect(() => {
    fetchStakingInfo();
  }, [fetchStakingInfo]);

  return { stakingInfo, loading, refetch: fetchStakingInfo };
}

// Custom hook for user badges
export function useUserBadges(address) {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(false);
  const badgesContract = useAegisBadges();

  const fetchBadges = useCallback(async () => {
    if (!address || !badgesContract) return;

    setLoading(true);
    try {
      const badgeCount = await badgesContract.balanceOf(address);
      const userBadges = [];
      
      for (let i = 0; i < badgeCount.toNumber(); i++) {
        const tokenId = await badgesContract.tokenOfOwnerByIndex(address, i);
        const uri = await badgesContract.tokenURI(tokenId);
        userBadges.push({ tokenId: tokenId.toString(), uri });
      }
      
      setBadges(userBadges);
    } catch (error) {
      console.error('Error fetching badges:', error);
    } finally {
      setLoading(false);
    }
  }, [address, badgesContract]);

  useEffect(() => {
    fetchBadges();
  }, [fetchBadges]);

  return { badges, loading, refetch: fetchBadges };
}
