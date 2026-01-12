// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./AegisToken.sol";

/**
 * @title AegisVault
 * @dev Manages stablecoin reserves and handles instant settlement for merchants
 * @notice Implements atomic swap: Token -> USDC conversion in a single transaction
 */
contract AegisVault is AccessControl {
    using SafeERC20 for IERC20;

    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    
    // Contracts
    AegisToken public aegisToken;
    IERC20 public stablecoin; // USDC or other stablecoin

    // Exchange rate: 1 token = X USDC (with 6 decimals for USDC)
    // Default: 1 token = 1 USDC (1000000 = 1.0 USDC)
    mapping(uint256 => uint256) public exchangeRates;

    // Total redeemed per token type
    mapping(uint256 => uint256) public totalRedeemed;

    // Events
    event TokensRedeemed(
        address indexed merchant,
        uint256 indexed tokenId,
        uint256 tokenAmount,
        uint256 stablecoinAmount
    );
    event ExchangeRateUpdated(uint256 indexed tokenId, uint256 newRate);
    event StablecoinDeposited(address indexed depositor, uint256 amount);
    event StablecoinWithdrawn(address indexed recipient, uint256 amount);

    constructor(
        address _aegisToken,
        address _stablecoin
    ) {
        require(_aegisToken != address(0), "Invalid token address");
        require(_stablecoin != address(0), "Invalid stablecoin address");
        
        aegisToken = AegisToken(_aegisToken);
        stablecoin = IERC20(_stablecoin);
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(OPERATOR_ROLE, msg.sender);

        // Set default exchange rates (1:1)
        exchangeRates[1] = 1000000; // 1 USDC (6 decimals)
        exchangeRates[2] = 1000000;
        exchangeRates[3] = 1000000;
        exchangeRates[4] = 1000000;
        exchangeRates[5] = 1000000;
    }

    /**
     * @dev Deposit stablecoin into the vault
     */
    function depositStablecoin(uint256 amount) external {
        require(amount > 0, "Amount must be > 0");
        stablecoin.safeTransferFrom(msg.sender, address(this), amount);
        emit StablecoinDeposited(msg.sender, amount);
    }

    /**
     * @dev Set exchange rate for a token type
     * @param tokenId Token category ID
     * @param rate Exchange rate (in stablecoin's decimals, e.g., 1000000 = 1 USDC)
     */
    function setExchangeRate(
        uint256 tokenId,
        uint256 rate
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(rate > 0, "Rate must be > 0");
        exchangeRates[tokenId] = rate;
        emit ExchangeRateUpdated(tokenId, rate);
    }

    /**
     * @dev Redeem tokens for stablecoin (Instant Settlement)
     * @notice This function burns the Aegis tokens and transfers USDC to the merchant
     * @param tokenId Token category ID
     * @param amount Amount of tokens to redeem
     */
    function redeemTokens(uint256 tokenId, uint256 amount) external {
        require(amount > 0, "Amount must be > 0");
        require(exchangeRates[tokenId] > 0, "Exchange rate not set");

        // Calculate stablecoin amount
        uint256 stablecoinAmount = (amount * exchangeRates[tokenId]) / 1e18;
        
        // Check vault has enough balance
        require(
            stablecoin.balanceOf(address(this)) >= stablecoinAmount,
            "Insufficient vault balance"
        );

        // Burn the tokens from merchant's wallet
        aegisToken.burn(msg.sender, tokenId, amount);

        // Transfer stablecoin to merchant
        stablecoin.safeTransfer(msg.sender, stablecoinAmount);

        // Update statistics
        totalRedeemed[tokenId] += amount;

        emit TokensRedeemed(msg.sender, tokenId, amount, stablecoinAmount);
    }

    /**
     * @dev Batch redeem multiple token types
     */
    function redeemTokensBatch(
        uint256[] calldata tokenIds,
        uint256[] calldata amounts
    ) external {
        require(tokenIds.length == amounts.length, "Length mismatch");
        
        uint256 totalStablecoin = 0;
        
        // Calculate total stablecoin needed
        for (uint256 i = 0; i < tokenIds.length; i++) {
            require(amounts[i] > 0, "Amount must be > 0");
            require(exchangeRates[tokenIds[i]] > 0, "Exchange rate not set");
            
            uint256 stablecoinAmount = (amounts[i] * exchangeRates[tokenIds[i]]) / 1e18;
            totalStablecoin += stablecoinAmount;
        }
        
        // Check vault has enough balance
        require(
            stablecoin.balanceOf(address(this)) >= totalStablecoin,
            "Insufficient vault balance"
        );

        // Burn all tokens
        aegisToken.burnBatch(msg.sender, tokenIds, amounts);

        // Transfer stablecoin to merchant
        stablecoin.safeTransfer(msg.sender, totalStablecoin);

        // Update statistics and emit events
        for (uint256 i = 0; i < tokenIds.length; i++) {
            uint256 stablecoinAmount = (amounts[i] * exchangeRates[tokenIds[i]]) / 1e18;
            totalRedeemed[tokenIds[i]] += amounts[i];
            emit TokensRedeemed(msg.sender, tokenIds[i], amounts[i], stablecoinAmount);
        }
    }

    /**
     * @dev Emergency withdrawal (admin only)
     */
    function emergencyWithdraw(
        address recipient,
        uint256 amount
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(recipient != address(0), "Invalid recipient");
        stablecoin.safeTransfer(recipient, amount);
        emit StablecoinWithdrawn(recipient, amount);
    }

    /**
     * @dev Get vault balance
     */
    function getVaultBalance() external view returns (uint256) {
        return stablecoin.balanceOf(address(this));
    }

    /**
     * @dev Calculate redemption value
     */
    function calculateRedemptionValue(
        uint256 tokenId,
        uint256 amount
    ) external view returns (uint256) {
        return (amount * exchangeRates[tokenId]) / 1e18;
    }
}
