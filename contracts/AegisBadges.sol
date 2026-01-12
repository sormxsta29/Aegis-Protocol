// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title AegisBadges
 * @dev NFT badges for donors, volunteers, and disaster victims
 */
contract AegisBadges is ERC721, ERC721URIStorage, AccessControl {
    using Counters for Counters.Counter;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    Counters.Counter private _tokenIds;

    enum BadgeType {
        DONOR_BRONZE,
        DONOR_SILVER,
        DONOR_GOLD,
        VOLUNTEER,
        FIRST_RESPONDER,
        VERIFIED_VICTIM,
        COMMUNITY_HERO
    }

    struct Badge {
        BadgeType badgeType;
        uint256 timestamp;
        string metadata;
    }

    mapping(uint256 => Badge) public badges;
    mapping(address => uint256[]) public userBadges;

    event BadgeMinted(address indexed recipient, uint256 tokenId, BadgeType badgeType);

    constructor() ERC721("Aegis Achievement Badge", "AEGIS-BADGE") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    function mintBadge(
        address recipient,
        BadgeType badgeType,
        string memory tokenURI
    ) external onlyRole(MINTER_ROLE) returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _safeMint(recipient, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        badges[newTokenId] = Badge({
            badgeType: badgeType,
            timestamp: block.timestamp,
            metadata: tokenURI
        });

        userBadges[recipient].push(newTokenId);

        emit BadgeMinted(recipient, newTokenId, badgeType);

        return newTokenId;
    }

    function getUserBadges(address user) external view returns (uint256[] memory) {
        return userBadges[user];
    }

    function getBadgeInfo(uint256 tokenId) external view returns (Badge memory) {
        require(_ownerOf(tokenId) != address(0), "Badge does not exist");
        return badges[tokenId];
    }

    function getBadgeTypeName(BadgeType badgeType) external pure returns (string memory) {
        if (badgeType == BadgeType.DONOR_BRONZE) return "Bronze Donor";
        if (badgeType == BadgeType.DONOR_SILVER) return "Silver Donor";
        if (badgeType == BadgeType.DONOR_GOLD) return "Gold Donor";
        if (badgeType == BadgeType.VOLUNTEER) return "Volunteer";
        if (badgeType == BadgeType.FIRST_RESPONDER) return "First Responder";
        if (badgeType == BadgeType.VERIFIED_VICTIM) return "Verified Victim";
        if (badgeType == BadgeType.COMMUNITY_HERO) return "Community Hero";
        return "Unknown";
    }

    // Override required functions
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721)
    {
        super._increaseBalance(account, value);
    }
}
