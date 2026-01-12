// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/**
 * @title AegisPaymaster
 * @dev ERC-4337 Paymaster implementation for gasless transactions
 * @notice Pays gas fees on behalf of disaster victims
 */
contract AegisPaymaster is Ownable {
    using ECDSA for bytes32;

    // Paymaster deposit for gas sponsorship
    uint256 public deposit;

    // Whitelist of addresses eligible for gas sponsorship
    mapping(address => bool) public sponsoredUsers;

    // Gas limit per transaction
    uint256 public maxGasLimit = 500000;

    // Total gas sponsored
    uint256 public totalGasSponsored;

    // Events
    event UserSponsored(address indexed user);
    event UserRevoked(address indexed user);
    event GasSponsored(address indexed user, uint256 gasUsed, uint256 gasCost);
    event DepositAdded(address indexed donor, uint256 amount);
    event DepositWithdrawn(address indexed recipient, uint256 amount);

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Add funds to paymaster deposit
     */
    receive() external payable {
        deposit += msg.value;
        emit DepositAdded(msg.sender, msg.value);
    }

    /**
     * @dev Add user to sponsored list
     */
    function addSponsoredUser(address user) external onlyOwner {
        require(user != address(0), "Invalid user address");
        sponsoredUsers[user] = true;
        emit UserSponsored(user);
    }

    /**
     * @dev Add multiple users to sponsored list
     */
    function addSponsoredUserBatch(address[] calldata users) external onlyOwner {
        for (uint256 i = 0; i < users.length; i++) {
            require(users[i] != address(0), "Invalid user address");
            sponsoredUsers[users[i]] = true;
            emit UserSponsored(users[i]);
        }
    }

    /**
     * @dev Remove user from sponsored list
     */
    function revokeSponsoredUser(address user) external onlyOwner {
        sponsoredUsers[user] = false;
        emit UserRevoked(user);
    }

    /**
     * @dev Validate and sponsor a user operation
     * @notice This is called by the EntryPoint before executing a user operation
     */
    function validatePaymasterUserOp(
        address sender,
        uint256 /* userOpHash */,
        uint256 maxCost
    ) external view returns (bytes memory context, uint256 validationData) {
        require(sponsoredUsers[sender], "User not sponsored");
        require(deposit >= maxCost, "Insufficient paymaster deposit");
        require(maxCost <= maxGasLimit * tx.gasprice, "Gas limit exceeded");
        
        // Return success (validationData = 0 means valid)
        context = abi.encode(sender, maxCost);
        validationData = 0;
    }

    /**
     * @dev Post-operation handler
     * @notice Called after the user operation is executed
     */
    function postOp(
        bytes calldata context,
        uint256 actualGasCost
    ) external {
        (address user, ) = abi.decode(context, (address, uint256));
        
        // Deduct from deposit
        require(deposit >= actualGasCost, "Insufficient deposit");
        deposit -= actualGasCost;
        totalGasSponsored += actualGasCost;
        
        emit GasSponsored(user, actualGasCost / tx.gasprice, actualGasCost);
    }

    /**
     * @dev Update maximum gas limit
     */
    function setMaxGasLimit(uint256 newLimit) external onlyOwner {
        maxGasLimit = newLimit;
    }

    /**
     * @dev Withdraw from deposit (emergency)
     */
    function withdrawDeposit(address payable recipient, uint256 amount) external onlyOwner {
        require(amount <= deposit, "Insufficient balance");
        deposit -= amount;
        
        (bool success, ) = recipient.call{value: amount}("");
        require(success, "Transfer failed");
        
        emit DepositWithdrawn(recipient, amount);
    }

    /**
     * @dev Check if user is sponsored
     */
    function isUserSponsored(address user) external view returns (bool) {
        return sponsoredUsers[user];
    }

    /**
     * @dev Get current deposit balance
     */
    function getDeposit() external view returns (uint256) {
        return deposit;
    }

    /**
     * @dev Estimate cost for sponsorship
     */
    function estimateCost(uint256 gasLimit) external view returns (uint256) {
        return gasLimit * tx.gasprice;
    }
}
