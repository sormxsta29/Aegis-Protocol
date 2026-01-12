// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title SupplyChain
 * @dev Track relief supplies from donors through distribution to victims
 */
contract SupplyChain is AccessControl, ReentrancyGuard {
    bytes32 public constant COORDINATOR_ROLE = keccak256("COORDINATOR_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");

    enum ItemStatus {
        Created,
        InTransit,
        AtWarehouse,
        OutForDelivery,
        Delivered,
        Cancelled
    }

    struct Item {
        string itemId;
        string name;
        uint256 quantity;
        address donor;
        address currentHolder;
        address destination;
        ItemStatus status;
        string currentLocation;
        uint256 createdAt;
        uint256 updatedAt;
    }

    struct Checkpoint {
        string location;
        address handler;
        uint256 timestamp;
        string notes;
    }

    mapping(string => Item) public items;
    mapping(string => Checkpoint[]) public itemCheckpoints;
    string[] public allItemIds;

    event ItemCreated(
        string indexed itemId,
        string name,
        uint256 quantity,
        address indexed donor,
        address indexed destination
    );

    event ItemStatusUpdated(
        string indexed itemId,
        ItemStatus newStatus,
        string location,
        address updatedBy
    );

    event CheckpointAdded(
        string indexed itemId,
        string location,
        address indexed handler,
        uint256 timestamp
    );

    event ItemDelivered(
        string indexed itemId,
        address indexed recipient,
        uint256 timestamp
    );

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(COORDINATOR_ROLE, msg.sender);
        _grantRole(VERIFIER_ROLE, msg.sender);
    }

    /**
     * @dev Create a new supply item
     */
    function createItem(
        string memory _itemId,
        string memory _name,
        uint256 _quantity,
        address _destination,
        string memory _initialLocation
    ) external onlyRole(COORDINATOR_ROLE) {
        require(bytes(items[_itemId].itemId).length == 0, "Item ID already exists");
        require(_quantity > 0, "Quantity must be positive");
        require(_destination != address(0), "Invalid destination");

        items[_itemId] = Item({
            itemId: _itemId,
            name: _name,
            quantity: _quantity,
            donor: msg.sender,
            currentHolder: msg.sender,
            destination: _destination,
            status: ItemStatus.Created,
            currentLocation: _initialLocation,
            createdAt: block.timestamp,
            updatedAt: block.timestamp
        });

        allItemIds.push(_itemId);

        // Add initial checkpoint
        itemCheckpoints[_itemId].push(Checkpoint({
            location: _initialLocation,
            handler: msg.sender,
            timestamp: block.timestamp,
            notes: "Item created and registered"
        }));

        emit ItemCreated(_itemId, _name, _quantity, msg.sender, _destination);
        emit CheckpointAdded(_itemId, _initialLocation, msg.sender, block.timestamp);
    }

    /**
     * @dev Update item status and location
     */
    function updateItemStatus(
        string memory _itemId,
        ItemStatus _newStatus,
        string memory _location,
        string memory _notes
    ) external {
        Item storage item = items[_itemId];
        require(bytes(item.itemId).length > 0, "Item does not exist");
        require(
            hasRole(COORDINATOR_ROLE, msg.sender) ||
            hasRole(VERIFIER_ROLE, msg.sender) ||
            msg.sender == item.currentHolder,
            "Not authorized"
        );

        item.status = _newStatus;
        item.currentLocation = _location;
        item.updatedAt = block.timestamp;

        itemCheckpoints[_itemId].push(Checkpoint({
            location: _location,
            handler: msg.sender,
            timestamp: block.timestamp,
            notes: _notes
        }));

        emit ItemStatusUpdated(_itemId, _newStatus, _location, msg.sender);
        emit CheckpointAdded(_itemId, _location, msg.sender, block.timestamp);
    }

    /**
     * @dev Transfer item to a new holder
     */
    function transferItem(
        string memory _itemId,
        address _newHolder,
        string memory _location,
        string memory _notes
    ) external nonReentrant {
        Item storage item = items[_itemId];
        require(bytes(item.itemId).length > 0, "Item does not exist");
        require(msg.sender == item.currentHolder, "Only current holder can transfer");
        require(_newHolder != address(0), "Invalid new holder");
        require(item.status != ItemStatus.Delivered, "Item already delivered");
        require(item.status != ItemStatus.Cancelled, "Item cancelled");

        item.currentHolder = _newHolder;
        item.currentLocation = _location;
        item.updatedAt = block.timestamp;

        itemCheckpoints[_itemId].push(Checkpoint({
            location: _location,
            handler: _newHolder,
            timestamp: block.timestamp,
            notes: _notes
        }));

        emit CheckpointAdded(_itemId, _location, _newHolder, block.timestamp);
    }

    /**
     * @dev Mark item as delivered with QR code verification
     */
    function markDelivered(
        string memory _itemId,
        bytes32 _verificationCode
    ) external nonReentrant {
        Item storage item = items[_itemId];
        require(bytes(item.itemId).length > 0, "Item does not exist");
        require(msg.sender == item.destination || hasRole(VERIFIER_ROLE, msg.sender), "Not authorized");
        require(item.status == ItemStatus.OutForDelivery, "Item not out for delivery");

        // In production, verify the QR code hash
        // For now, we just accept any non-zero code
        require(_verificationCode != bytes32(0), "Invalid verification code");

        item.status = ItemStatus.Delivered;
        item.updatedAt = block.timestamp;

        itemCheckpoints[_itemId].push(Checkpoint({
            location: item.currentLocation,
            handler: msg.sender,
            timestamp: block.timestamp,
            notes: "Item delivered and verified"
        }));

        emit ItemDelivered(_itemId, item.destination, block.timestamp);
        emit ItemStatusUpdated(_itemId, ItemStatus.Delivered, item.currentLocation, msg.sender);
    }

    /**
     * @dev Cancel an item
     */
    function cancelItem(
        string memory _itemId,
        string memory _reason
    ) external onlyRole(COORDINATOR_ROLE) {
        Item storage item = items[_itemId];
        require(bytes(item.itemId).length > 0, "Item does not exist");
        require(item.status != ItemStatus.Delivered, "Cannot cancel delivered item");

        item.status = ItemStatus.Cancelled;
        item.updatedAt = block.timestamp;

        itemCheckpoints[_itemId].push(Checkpoint({
            location: item.currentLocation,
            handler: msg.sender,
            timestamp: block.timestamp,
            notes: _reason
        }));

        emit ItemStatusUpdated(_itemId, ItemStatus.Cancelled, item.currentLocation, msg.sender);
    }

    /**
     * @dev Get item details
     */
    function getItem(string memory _itemId) external view returns (Item memory) {
        require(bytes(items[_itemId].itemId).length > 0, "Item does not exist");
        return items[_itemId];
    }

    /**
     * @dev Get all checkpoints for an item
     */
    function getCheckpoints(string memory _itemId) external view returns (Checkpoint[] memory) {
        require(bytes(items[_itemId].itemId).length > 0, "Item does not exist");
        return itemCheckpoints[_itemId];
    }

    /**
     * @dev Get total number of items
     */
    function getTotalItems() external view returns (uint256) {
        return allItemIds.length;
    }

    /**
     * @dev Get items by status
     */
    function getItemsByStatus(ItemStatus _status) external view returns (string[] memory) {
        uint256 count = 0;
        
        // Count items with the status
        for (uint256 i = 0; i < allItemIds.length; i++) {
            if (items[allItemIds[i]].status == _status) {
                count++;
            }
        }

        // Create result array
        string[] memory result = new string[](count);
        uint256 index = 0;
        
        for (uint256 i = 0; i < allItemIds.length; i++) {
            if (items[allItemIds[i]].status == _status) {
                result[index] = allItemIds[i];
                index++;
            }
        }

        return result;
    }

    /**
     * @dev Get items for a destination address
     */
    function getItemsForDestination(address _destination) external view returns (string[] memory) {
        uint256 count = 0;
        
        for (uint256 i = 0; i < allItemIds.length; i++) {
            if (items[allItemIds[i]].destination == _destination) {
                count++;
            }
        }

        string[] memory result = new string[](count);
        uint256 index = 0;
        
        for (uint256 i = 0; i < allItemIds.length; i++) {
            if (items[allItemIds[i]].destination == _destination) {
                result[index] = allItemIds[i];
                index++;
            }
        }

        return result;
    }
}
