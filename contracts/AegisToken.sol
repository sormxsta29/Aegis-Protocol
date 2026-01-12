// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

/**
 * @title AegisToken
 * @dev Purpose-Bound Token (PBT) implementation using ERC-1155
 * @notice Each token ID represents a different spending category (Food, Medical, Education, etc.)
 */
contract AegisToken is ERC1155, AccessControl, ERC1155Burnable, ERC1155Supply {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant DISTRIBUTOR_ROLE = keccak256("DISTRIBUTOR_ROLE");

    // Token Categories
    uint256 public constant FOOD_TOKEN = 1;
    uint256 public constant MEDICAL_TOKEN = 2;
    uint256 public constant EDUCATION_TOKEN = 3;
    uint256 public constant SHELTER_TOKEN = 4;
    uint256 public constant UTILITIES_TOKEN = 5;

    // Category Manager contract
    address public categoryManager;

    // Events
    event TokensMinted(address indexed to, uint256 indexed tokenId, uint256 amount);
    event TokensDistributed(address indexed to, uint256[] tokenIds, uint256[] amounts);
    event CategoryManagerUpdated(address indexed newManager);

    constructor(string memory uri) ERC1155(uri) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(DISTRIBUTOR_ROLE, msg.sender);
    }

    /**
     * @dev Set the Category Manager contract address
     */
    function setCategoryManager(address _categoryManager) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_categoryManager != address(0), "Invalid address");
        categoryManager = _categoryManager;
        emit CategoryManagerUpdated(_categoryManager);
    }

    /**
     * @dev Mint tokens to a specific address
     * @param to Recipient address
     * @param tokenId Token category ID
     * @param amount Amount to mint
     */
    function mint(
        address to,
        uint256 tokenId,
        uint256 amount,
        bytes memory data
    ) external onlyRole(MINTER_ROLE) {
        require(tokenId >= FOOD_TOKEN && tokenId <= UTILITIES_TOKEN, "Invalid token ID");
        _mint(to, tokenId, amount, data);
        emit TokensMinted(to, tokenId, amount);
    }

    /**
     * @dev Batch mint multiple token types to a recipient
     */
    function mintBatch(
        address to,
        uint256[] memory tokenIds,
        uint256[] memory amounts,
        bytes memory data
    ) external onlyRole(MINTER_ROLE) {
        _mintBatch(to, tokenIds, amounts, data);
        emit TokensDistributed(to, tokenIds, amounts);
    }

    /**
     * @dev Override transfer to enforce category restrictions
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public override {
        require(categoryManager != address(0), "Category manager not set");
        
        // Check if the recipient is authorized for this token category
        (bool success, bytes memory result) = categoryManager.call(
            abi.encodeWithSignature("canReceiveToken(address,uint256)", to, id)
        );
        
        require(success, "Category check failed");
        require(abi.decode(result, (bool)), "Recipient not authorized for this category");
        
        super.safeTransferFrom(from, to, id, amount, data);
    }

    /**
     * @dev Override batch transfer to enforce category restrictions
     */
    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public override {
        require(categoryManager != address(0), "Category manager not set");
        
        // Check all token categories
        for (uint256 i = 0; i < ids.length; i++) {
            (bool success, bytes memory result) = categoryManager.call(
                abi.encodeWithSignature("canReceiveToken(address,uint256)", to, ids[i])
            );
            
            require(success, "Category check failed");
            require(abi.decode(result, (bool)), "Recipient not authorized for this category");
        }
        
        super.safeBatchTransferFrom(from, to, ids, amounts, data);
    }

    /**
     * @dev Get token name by ID
     */
    function getTokenName(uint256 tokenId) external pure returns (string memory) {
        if (tokenId == FOOD_TOKEN) return "Food Token";
        if (tokenId == MEDICAL_TOKEN) return "Medical Token";
        if (tokenId == EDUCATION_TOKEN) return "Education Token";
        if (tokenId == SHELTER_TOKEN) return "Shelter Token";
        if (tokenId == UTILITIES_TOKEN) return "Utilities Token";
        return "Unknown Token";
    }

    // Required overrides
    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values
    ) internal override(ERC1155, ERC1155Supply) {
        super._update(from, to, ids, values);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
