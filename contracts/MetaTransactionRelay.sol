// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

/**
 * @title MetaTransactionRelay
 * @dev Enables offline/gasless transactions via meta-transactions
 * @notice Merchants can relay transactions on behalf of victims who have no internet/gas
 */
contract MetaTransactionRelay is Ownable {
    using ECDSA for bytes32;

    // Nonce management for replay protection
    mapping(address => uint256) public nonces;

    // Trusted relayers (merchants with connectivity)
    mapping(address => bool) public trustedRelayers;

    // Events
    event MetaTransactionExecuted(
        address indexed from,
        address indexed to,
        uint256 value,
        bytes data,
        uint256 nonce
    );
    event RelayerAdded(address indexed relayer);
    event RelayerRemoved(address indexed relayer);

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Add trusted relayer
     */
    function addRelayer(address relayer) external onlyOwner {
        trustedRelayers[relayer] = true;
        emit RelayerAdded(relayer);
    }

    /**
     * @dev Remove trusted relayer
     */
    function removeRelayer(address relayer) external onlyOwner {
        trustedRelayers[relayer] = false;
        emit RelayerRemoved(relayer);
    }

    /**
     * @dev Execute a meta-transaction
     * @param from The user who signed the transaction (victim)
     * @param to The destination contract
     * @param value ETH value to send
     * @param data Encoded function call
     * @param signature Signature from the user
     */
    function executeMetaTransaction(
        address from,
        address to,
        uint256 value,
        bytes memory data,
        bytes memory signature
    ) external returns (bytes memory) {
        require(trustedRelayers[msg.sender], "Not a trusted relayer");

        uint256 nonce = nonces[from];
        
        // Reconstruct the message hash
        bytes32 messageHash = keccak256(
            abi.encodePacked(from, to, value, data, nonce, address(this))
        );
        
        bytes32 ethSignedMessageHash = MessageHashUtils.toEthSignedMessageHash(messageHash);
        
        // Verify signature
        address signer = ethSignedMessageHash.recover(signature);
        require(signer == from, "Invalid signature");
        
        // Increment nonce
        nonces[from]++;
        
        // Execute the transaction
        (bool success, bytes memory returnData) = to.call{value: value}(data);
        require(success, "Meta-transaction failed");
        
        emit MetaTransactionExecuted(from, to, value, data, nonce);
        
        return returnData;
    }

    /**
     * @dev Get current nonce for a user
     */
    function getNonce(address user) external view returns (uint256) {
        return nonces[user];
    }

    /**
     * @dev Verify a meta-transaction signature without executing
     */
    function verifySignature(
        address from,
        address to,
        uint256 value,
        bytes memory data,
        bytes memory signature
    ) external view returns (bool) {
        uint256 nonce = nonces[from];
        
        bytes32 messageHash = keccak256(
            abi.encodePacked(from, to, value, data, nonce, address(this))
        );
        
        bytes32 ethSignedMessageHash = MessageHashUtils.toEthSignedMessageHash(messageHash);
        address signer = ethSignedMessageHash.recover(signature);
        
        return signer == from;
    }

    /**
     * @dev Generate message hash for signing (helper for off-chain)
     */
    function getMessageHash(
        address from,
        address to,
        uint256 value,
        bytes memory data,
        uint256 nonce
    ) public view returns (bytes32) {
        return keccak256(
            abi.encodePacked(from, to, value, data, nonce, address(this))
        );
    }
}
