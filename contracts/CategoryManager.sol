// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title CategoryManager
 * @dev Manages merchant/vendor categories and enforces spending restrictions
 * @notice This contract acts as the "Spending Policy Manager"
 */
contract CategoryManager is AccessControl {
    bytes32 public constant REGISTRAR_ROLE = keccak256("REGISTRAR_ROLE");

    // Token IDs (must match AegisToken)
    uint256 public constant FOOD_TOKEN = 1;
    uint256 public constant MEDICAL_TOKEN = 2;
    uint256 public constant EDUCATION_TOKEN = 3;
    uint256 public constant SHELTER_TOKEN = 4;
    uint256 public constant UTILITIES_TOKEN = 5;

    // Merchant category types
    enum Category {
        UNREGISTERED,
        GROCERY,
        PHARMACY,
        SCHOOL,
        LANDLORD,
        UTILITY_PROVIDER
    }

    // Mapping: merchant address => category
    mapping(address => Category) public merchantCategories;

    // Mapping: merchant address => verification status
    mapping(address => bool) public verifiedMerchants;

    // Events
    event MerchantRegistered(address indexed merchant, Category category);
    event MerchantVerified(address indexed merchant);
    event MerchantRevoked(address indexed merchant);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(REGISTRAR_ROLE, msg.sender);
    }

    /**
     * @dev Register a merchant with a specific category
     */
    function registerMerchant(
        address merchant,
        Category category
    ) external onlyRole(REGISTRAR_ROLE) {
        require(merchant != address(0), "Invalid merchant address");
        require(category != Category.UNREGISTERED, "Invalid category");
        
        merchantCategories[merchant] = category;
        verifiedMerchants[merchant] = true;
        
        emit MerchantRegistered(merchant, category);
        emit MerchantVerified(merchant);
    }

    /**
     * @dev Batch register multiple merchants
     */
    function registerMerchantBatch(
        address[] calldata merchants,
        Category[] calldata categories
    ) external onlyRole(REGISTRAR_ROLE) {
        require(merchants.length == categories.length, "Length mismatch");
        
        for (uint256 i = 0; i < merchants.length; i++) {
            require(merchants[i] != address(0), "Invalid merchant address");
            require(categories[i] != Category.UNREGISTERED, "Invalid category");
            
            merchantCategories[merchants[i]] = categories[i];
            verifiedMerchants[merchants[i]] = true;
            
            emit MerchantRegistered(merchants[i], categories[i]);
            emit MerchantVerified(merchants[i]);
        }
    }

    /**
     * @dev Revoke merchant verification
     */
    function revokeMerchant(address merchant) external onlyRole(REGISTRAR_ROLE) {
        verifiedMerchants[merchant] = false;
        emit MerchantRevoked(merchant);
    }

    /**
     * @dev Check if a merchant can receive a specific token type
     * @param merchant Merchant address
     * @param tokenId Token category ID
     * @return bool True if merchant is authorized
     */
    function canReceiveToken(
        address merchant,
        uint256 tokenId
    ) external view returns (bool) {
        // Allow transfers to any address if it's a burn (address(0))
        if (merchant == address(0)) return true;
        
        // Check if merchant is verified
        if (!verifiedMerchants[merchant]) return false;
        
        Category merchantCategory = merchantCategories[merchant];
        
        // Match token ID with merchant category
        if (tokenId == FOOD_TOKEN && merchantCategory == Category.GROCERY) return true;
        if (tokenId == MEDICAL_TOKEN && merchantCategory == Category.PHARMACY) return true;
        if (tokenId == EDUCATION_TOKEN && merchantCategory == Category.SCHOOL) return true;
        if (tokenId == SHELTER_TOKEN && merchantCategory == Category.LANDLORD) return true;
        if (tokenId == UTILITIES_TOKEN && merchantCategory == Category.UTILITY_PROVIDER) return true;
        
        return false;
    }

    /**
     * @dev Get merchant category
     */
    function getMerchantCategory(address merchant) external view returns (Category) {
        return merchantCategories[merchant];
    }

    /**
     * @dev Check if merchant is verified
     */
    function isMerchantVerified(address merchant) external view returns (bool) {
        return verifiedMerchants[merchant];
    }

    /**
     * @dev Get category name as string
     */
    function getCategoryName(Category category) external pure returns (string memory) {
        if (category == Category.GROCERY) return "Grocery Store";
        if (category == Category.PHARMACY) return "Pharmacy";
        if (category == Category.SCHOOL) return "Educational Institution";
        if (category == Category.LANDLORD) return "Housing Provider";
        if (category == Category.UTILITY_PROVIDER) return "Utility Provider";
        return "Unregistered";
    }
}
