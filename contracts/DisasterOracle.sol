// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./AegisToken.sol";

/**
 * @title DisasterOracle
 * @dev Oracle-triggered automatic fund release based on disaster data
 * @notice Implements parametric insurance logic using Chainlink oracles
 */
contract DisasterOracle is ChainlinkClient, ConfirmedOwner {
    using Chainlink for Chainlink.Request;
    using SafeERC20 for IERC20;

    // Contracts
    AegisToken public aegisToken;
    IERC20 public fundingToken;

    // Oracle configuration
    bytes32 private jobId;
    uint256 private fee;

    // Disaster parameters
    struct DisasterEvent {
        uint256 magnitude;       // For earthquakes (scaled by 10, e.g., 60 = 6.0)
        uint256 floodLevel;      // For floods (in meters, scaled by 100)
        uint256 windSpeed;       // For hurricanes (in km/h)
        string location;         // Geographic coordinates or region code
        uint256 timestamp;
        bool triggered;
        bool fundsReleased;
    }

    // Mapping: disaster ID => DisasterEvent
    mapping(bytes32 => DisasterEvent) public disasters;

    // Authorized responders per region
    mapping(string => address[]) public regionalResponders;

    // Trigger thresholds
    uint256 public earthquakeThreshold = 60; // 6.0 magnitude
    uint256 public floodThreshold = 200;     // 2 meters
    uint256 public hurricaneThreshold = 120; // 120 km/h

    // Relief package amounts (in token units with 18 decimals)
    uint256 public standardReliefPackage = 1000 * 1e18; // 1000 tokens

    // Events
    event DisasterReported(bytes32 indexed requestId, string location);
    event DisasterDataReceived(bytes32 indexed requestId, uint256 magnitude, string location);
    event FundsReleased(bytes32 indexed disasterId, address[] responders, uint256 totalAmount);
    event ThresholdUpdated(string indexed parameterType, uint256 newThreshold);
    event ResponderAdded(string indexed region, address responder);

    constructor(
        address _aegisToken,
        address _fundingToken,
        address _linkToken,
        address _oracle
    ) ConfirmedOwner(msg.sender) {
        require(_aegisToken != address(0), "Invalid token address");
        require(_fundingToken != address(0), "Invalid funding token");
        
        aegisToken = AegisToken(_aegisToken);
        fundingToken = IERC20(_fundingToken);
        
        setChainlinkToken(_linkToken);
        setChainlinkOracle(_oracle);
        
        // Default Chainlink configuration (update based on network)
        jobId = "ca98366cc7314957b8c012c72f05aeeb"; // Example job ID
        fee = (1 * LINK_DIVISIBILITY) / 10; // 0.1 LINK
    }

    /**
     * @dev Request disaster data from external API
     */
    function requestDisasterData(
        string memory apiEndpoint,
        string memory location
    ) public returns (bytes32 requestId) {
        Chainlink.Request memory req = buildChainlinkRequest(
            jobId,
            address(this),
            this.fulfill.selector
        );

        // Set the URL to perform the GET request on
        req.add("get", apiEndpoint);
        req.add("path", "magnitude"); // JSON path to extract data
        
        // Send the request
        requestId = sendChainlinkRequest(req, fee);
        
        disasters[requestId].location = location;
        disasters[requestId].timestamp = block.timestamp;
        
        emit DisasterReported(requestId, location);
        
        return requestId;
    }

    /**
     * @dev Receive the response from Chainlink oracle
     */
    function fulfill(
        bytes32 _requestId,
        uint256 _magnitude
    ) public recordChainlinkFulfillment(_requestId) {
        DisasterEvent storage disaster = disasters[_requestId];
        disaster.magnitude = _magnitude;
        disaster.triggered = _magnitude >= earthquakeThreshold;
        
        emit DisasterDataReceived(_requestId, _magnitude, disaster.location);
        
        // Auto-release funds if threshold is met
        if (disaster.triggered && !disaster.fundsReleased) {
            _releaseFunds(_requestId);
        }
    }

    /**
     * @dev Manually trigger fund release (for verified disasters)
     */
    function manualReleaseFunds(
        bytes32 disasterId,
        uint256 magnitude,
        string memory location
    ) external onlyOwner {
        require(!disasters[disasterId].fundsReleased, "Funds already released");
        
        DisasterEvent storage disaster = disasters[disasterId];
        disaster.magnitude = magnitude;
        disaster.location = location;
        disaster.timestamp = block.timestamp;
        disaster.triggered = true;
        
        _releaseFunds(disasterId);
    }

    /**
     * @dev Internal function to release funds to regional responders
     */
    function _releaseFunds(bytes32 disasterId) internal {
        DisasterEvent storage disaster = disasters[disasterId];
        require(disaster.triggered, "Disaster not triggered");
        require(!disaster.fundsReleased, "Funds already released");
        
        address[] memory responders = regionalResponders[disaster.location];
        require(responders.length > 0, "No responders registered for region");
        
        // Calculate amount per responder
        uint256 amountPerResponder = standardReliefPackage;
        uint256 totalAmount = amountPerResponder * responders.length;
        
        // Mint emergency tokens to each responder
        // Distribute across all token types
        uint256[] memory tokenIds = new uint256[](5);
        uint256[] memory amounts = new uint256[](5);
        
        tokenIds[0] = 1; // Food
        tokenIds[1] = 2; // Medical
        tokenIds[2] = 3; // Education
        tokenIds[3] = 4; // Shelter
        tokenIds[4] = 5; // Utilities
        
        // Distribute equally across categories
        for (uint256 i = 0; i < 5; i++) {
            amounts[i] = amountPerResponder / 5;
        }
        
        for (uint256 i = 0; i < responders.length; i++) {
            aegisToken.mintBatch(responders[i], tokenIds, amounts, "");
        }
        
        disaster.fundsReleased = true;
        
        emit FundsReleased(disasterId, responders, totalAmount);
    }

    /**
     * @dev Add regional responder
     */
    function addRegionalResponder(
        string memory region,
        address responder
    ) external onlyOwner {
        require(responder != address(0), "Invalid responder address");
        regionalResponders[region].push(responder);
        emit ResponderAdded(region, responder);
    }

    /**
     * @dev Add multiple responders for a region
     */
    function addRegionalResponderBatch(
        string memory region,
        address[] calldata responders
    ) external onlyOwner {
        for (uint256 i = 0; i < responders.length; i++) {
            require(responders[i] != address(0), "Invalid responder address");
            regionalResponders[region].push(responders[i]);
            emit ResponderAdded(region, responders[i]);
        }
    }

    /**
     * @dev Update disaster thresholds
     */
    function updateEarthquakeThreshold(uint256 newThreshold) external onlyOwner {
        earthquakeThreshold = newThreshold;
        emit ThresholdUpdated("earthquake", newThreshold);
    }

    function updateFloodThreshold(uint256 newThreshold) external onlyOwner {
        floodThreshold = newThreshold;
        emit ThresholdUpdated("flood", newThreshold);
    }

    function updateHurricaneThreshold(uint256 newThreshold) external onlyOwner {
        hurricaneThreshold = newThreshold;
        emit ThresholdUpdated("hurricane", newThreshold);
    }

    /**
     * @dev Update relief package amount
     */
    function updateReliefPackage(uint256 newAmount) external onlyOwner {
        standardReliefPackage = newAmount;
    }

    /**
     * @dev Get responders for a region
     */
    function getRegionalResponders(string memory region) external view returns (address[] memory) {
        return regionalResponders[region];
    }

    /**
     * @dev Withdraw LINK tokens
     */
    function withdrawLink() external onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
        require(link.transfer(msg.sender, link.balanceOf(address(this))), "Unable to transfer");
    }

    /**
     * @dev Update oracle configuration
     */
    function updateOracleConfig(
        address _oracle,
        bytes32 _jobId,
        uint256 _fee
    ) external onlyOwner {
        setChainlinkOracle(_oracle);
        jobId = _jobId;
        fee = _fee;
    }
}
