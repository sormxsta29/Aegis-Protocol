// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title DonationTracker
 * @dev Track and manage donations for disaster relief
 */
contract DonationTracker is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    struct Donation {
        address donor;
        uint256 amount;
        address token;
        uint256 timestamp;
        string campaign;
        bool allocated;
    }

    struct Campaign {
        string name;
        string description;
        uint256 targetAmount;
        uint256 raisedAmount;
        uint256 startTime;
        uint256 endTime;
        bool active;
        address beneficiary;
    }

    Donation[] public donations;
    mapping(string => Campaign) public campaigns;
    mapping(address => uint256[]) public donorDonations;
    mapping(address => uint256) public totalDonated;

    uint256 public totalDonationsReceived;
    uint256 public totalDonationsAllocated;

    event DonationReceived(
        address indexed donor,
        uint256 amount,
        address token,
        string campaign,
        uint256 donationId
    );
    event CampaignCreated(string campaignId, string name, uint256 targetAmount);
    event DonationAllocated(uint256 donationId, address beneficiary);
    event CampaignCompleted(string campaignId, uint256 totalRaised);

    constructor() Ownable(msg.sender) {}

    function createCampaign(
        string memory campaignId,
        string memory name,
        string memory description,
        uint256 targetAmount,
        uint256 duration,
        address beneficiary
    ) external onlyOwner {
        require(campaigns[campaignId].startTime == 0, "Campaign already exists");
        require(targetAmount > 0, "Target must be > 0");

        campaigns[campaignId] = Campaign({
            name: name,
            description: description,
            targetAmount: targetAmount,
            raisedAmount: 0,
            startTime: block.timestamp,
            endTime: block.timestamp + duration,
            active: true,
            beneficiary: beneficiary
        });

        emit CampaignCreated(campaignId, name, targetAmount);
    }

    function donate(
        string memory campaignId,
        address token,
        uint256 amount
    ) external nonReentrant {
        require(amount > 0, "Amount must be > 0");
        require(campaigns[campaignId].active, "Campaign not active");
        require(block.timestamp <= campaigns[campaignId].endTime, "Campaign ended");

        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);

        uint256 donationId = donations.length;
        donations.push(Donation({
            donor: msg.sender,
            amount: amount,
            token: token,
            timestamp: block.timestamp,
            campaign: campaignId,
            allocated: false
        }));

        donorDonations[msg.sender].push(donationId);
        totalDonated[msg.sender] += amount;
        totalDonationsReceived += amount;

        campaigns[campaignId].raisedAmount += amount;

        emit DonationReceived(msg.sender, amount, token, campaignId, donationId);

        if (campaigns[campaignId].raisedAmount >= campaigns[campaignId].targetAmount) {
            campaigns[campaignId].active = false;
            emit CampaignCompleted(campaignId, campaigns[campaignId].raisedAmount);
        }
    }

    function allocateDonation(uint256 donationId) external onlyOwner {
        require(donationId < donations.length, "Invalid donation ID");
        require(!donations[donationId].allocated, "Already allocated");

        Donation storage donation = donations[donationId];
        Campaign storage campaign = campaigns[donation.campaign];

        require(campaign.beneficiary != address(0), "No beneficiary set");

        IERC20(donation.token).safeTransfer(campaign.beneficiary, donation.amount);

        donation.allocated = true;
        totalDonationsAllocated += donation.amount;

        emit DonationAllocated(donationId, campaign.beneficiary);
    }

    function getDonorDonations(address donor) external view returns (uint256[] memory) {
        return donorDonations[donor];
    }

    function getDonationCount() external view returns (uint256) {
        return donations.length;
    }

    function getCampaign(string memory campaignId) external view returns (Campaign memory) {
        return campaigns[campaignId];
    }

    function closeCampaign(string memory campaignId) external onlyOwner {
        campaigns[campaignId].active = false;
        emit CampaignCompleted(campaignId, campaigns[campaignId].raisedAmount);
    }
}
