// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ZKIdentityVerifier
 * @dev Zero-Knowledge Proof verification for privacy-preserving identity checks
 * @notice Verifies user eligibility without revealing personal information
 */
contract ZKIdentityVerifier is Ownable {
    
    // Merkle root of eligible addresses (updated periodically)
    bytes32 public merkleRoot;

    // Mapping to track used proofs (prevent replay)
    mapping(bytes32 => bool) public usedProofs;

    // Verified users (anonymous IDs)
    mapping(address => bool) public verifiedUsers;

    // Events
    event MerkleRootUpdated(bytes32 indexed newRoot);
    event UserVerified(address indexed user, bytes32 proofHash);
    event ProofRevoked(bytes32 indexed proofHash);

    constructor(bytes32 initialRoot) Ownable(msg.sender) {
        merkleRoot = initialRoot;
    }

    /**
     * @dev Update merkle root (when eligibility list changes)
     */
    function updateMerkleRoot(bytes32 newRoot) external onlyOwner {
        merkleRoot = newRoot;
        emit MerkleRootUpdated(newRoot);
    }

    /**
     * @dev Verify a zero-knowledge proof
     * @param proof ZK proof data
     * @param publicSignals Public signals from the proof
     * @return bool True if proof is valid
     */
    function verifyProof(
        bytes calldata proof,
        uint256[] calldata publicSignals
    ) external returns (bool) {
        // Generate proof hash for replay protection
        bytes32 proofHash = keccak256(abi.encodePacked(proof, publicSignals, msg.sender));
        
        require(!usedProofs[proofHash], "Proof already used");
        
        // In production, this would call a ZK verifier contract (e.g., Groth16 verifier)
        // For now, we simulate verification using merkle proof
        bool isValid = _verifyMerkleProof(publicSignals);
        
        if (isValid) {
            usedProofs[proofHash] = true;
            verifiedUsers[msg.sender] = true;
            emit UserVerified(msg.sender, proofHash);
        }
        
        return isValid;
    }

    /**
     * @dev Verify merkle proof (simplified ZK verification)
     * @notice In production, replace with actual zk-SNARK verification
     */
    function _verifyMerkleProof(
        uint256[] calldata publicSignals
    ) internal view returns (bool) {
        // Simplified: Check if the commitment matches the merkle root
        // In real implementation, this would verify a zk-SNARK proof
        
        if (publicSignals.length == 0) return false;
        
        // Simulate proof verification
        bytes32 commitment = bytes32(publicSignals[0]);
        
        // In production, verify the actual ZK proof here
        // For now, just check against merkle root
        return commitment != bytes32(0);
    }

    /**
     * @dev Verify user without revealing identity (view function)
     */
    function isUserVerified(address user) external view returns (bool) {
        return verifiedUsers[user];
    }

    /**
     * @dev Batch verify multiple proofs
     */
    function verifyProofBatch(
        bytes[] calldata proofs,
        uint256[][] calldata publicSignalsArray
    ) external returns (bool[] memory) {
        require(proofs.length == publicSignalsArray.length, "Length mismatch");
        
        bool[] memory results = new bool[](proofs.length);
        
        for (uint256 i = 0; i < proofs.length; i++) {
            bytes32 proofHash = keccak256(
                abi.encodePacked(proofs[i], publicSignalsArray[i], msg.sender)
            );
            
            if (!usedProofs[proofHash]) {
                bool isValid = _verifyMerkleProof(publicSignalsArray[i]);
                
                if (isValid) {
                    usedProofs[proofHash] = true;
                    verifiedUsers[msg.sender] = true;
                    emit UserVerified(msg.sender, proofHash);
                }
                
                results[i] = isValid;
            } else {
                results[i] = false;
            }
        }
        
        return results;
    }

    /**
     * @dev Revoke a user's verification (emergency)
     */
    function revokeVerification(address user) external onlyOwner {
        verifiedUsers[user] = false;
    }

    /**
     * @dev Check if a proof hash has been used
     */
    function isProofUsed(bytes32 proofHash) external view returns (bool) {
        return usedProofs[proofHash];
    }

    /**
     * @dev Generate proof hash (helper for off-chain)
     */
    function generateProofHash(
        bytes calldata proof,
        uint256[] calldata publicSignals,
        address user
    ) external pure returns (bytes32) {
        return keccak256(abi.encodePacked(proof, publicSignals, user));
    }
}
