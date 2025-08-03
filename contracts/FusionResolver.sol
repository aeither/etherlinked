// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./HTLCEtherlinkEscrow.sol";

/**
 * @title FusionResolver
 * @dev 1inch Fusion+ resolver implementation for Etherlink
 * Handles cross-chain order fulfillment and Dutch auction participation
 */
contract FusionResolver is Ownable, ReentrancyGuard {
    
    struct ResolverConfig {
        uint256 minimumStake;
        uint256 gasPriceLimit;
        uint256 maxSlippage;
        bool isActive;
    }

    struct PendingOrder {
        string orderId;
        bytes32 sourceEscrowId;
        bytes32 destEscrowId;
        address sourceChainEscrow;
        address destChainEscrow;
        uint256 amount;
        uint256 executionDeadline;
        bool isExecuted;
    }

    HTLCEtherlinkEscrow public immutable etherlinkEscrow;
    ResolverConfig public config;
    
    mapping(string => PendingOrder) public pendingOrders;
    mapping(bytes32 => bool) public processedSecrets;
    
    // Events for 1inch integration
    event OrderAccepted(
        string indexed orderId,
        bytes32 indexed sourceEscrowId,
        uint256 amount,
        uint256 executionRate
    );
    
    event OrderExecuted(
        string indexed orderId,
        bytes32 indexed destEscrowId,
        bytes32 secret,
        uint256 executionTime
    );
    
    event OrderFailed(
        string indexed orderId,
        string reason,
        uint256 failureTime
    );

    error InsufficientStake();
    error OrderAlreadyExists();
    error OrderNotFound();
    error OrderExpired();
    error InvalidConfiguration();
    error ResolverInactive();

    modifier onlyActiveResolver() {
        if (!config.isActive) revert ResolverInactive();
        _;
    }

    modifier validOrder(string memory orderId) {
        if (bytes(orderId).length == 0) revert OrderNotFound();
        _;
    }

    constructor(
        address etherlinkEscrowAddress,
        address initialOwner,
        uint256 minimumStake
    ) Ownable(initialOwner) {
        etherlinkEscrow = HTLCEtherlinkEscrow(etherlinkEscrowAddress);
        config = ResolverConfig({
            minimumStake: minimumStake,
            gasPriceLimit: 2000000000, // 2 gwei
            maxSlippage: 50, // 0.5%
            isActive: true
        });
    }

    /**
     * @dev Accept a 1inch Fusion+ order during Dutch auction
     * Creates matching escrow on destination chain
     */
    function acceptOrder(
        string memory orderId,
        bytes32 secretHash,
        bytes32 sourceEscrowId,
        address sourceChainEscrow,
        uint256 amount,
        uint256 timelockSeconds,
        address payable receiver
    ) external payable onlyOwner onlyActiveResolver nonReentrant {
        if (pendingOrders[orderId].amount != 0) revert OrderAlreadyExists();
        
        // Verify we have sufficient funds
        if (msg.value < amount) revert InsufficientStake();
        
        // Create matching escrow on Etherlink
        bytes32 destEscrowId = etherlinkEscrow.createResolverEscrow{value: msg.value}(
            secretHash,
            timelockSeconds,
            receiver,
            orderId,
            sourceEscrowId
        );
        
        pendingOrders[orderId] = PendingOrder({
            orderId: orderId,
            sourceEscrowId: sourceEscrowId,
            destEscrowId: destEscrowId,
            sourceChainEscrow: sourceChainEscrow,
            destChainEscrow: address(etherlinkEscrow),
            amount: amount,
            executionDeadline: block.timestamp + timelockSeconds,
            isExecuted: false
        });
        
        // Get current auction rate
        uint256 executionRate = etherlinkEscrow.getCurrentAuctionRate(orderId);
        
        emit OrderAccepted(orderId, sourceEscrowId, amount, executionRate);
    }
    
    /**
     * @dev Execute cross-chain swap by revealing secret
     * Called when secret is revealed on source chain
     */
    function executeOrder(
        string memory orderId,
        string memory secret
    ) external onlyOwner validOrder(orderId) nonReentrant {
        PendingOrder storage order = pendingOrders[orderId];
        
        if (order.amount == 0) revert OrderNotFound();
        if (order.isExecuted) revert OrderAlreadyExists();
        if (block.timestamp > order.executionDeadline) revert OrderExpired();
        
        bytes32 secretHash = keccak256(abi.encodePacked(secret));
        if (processedSecrets[secretHash]) revert OrderAlreadyExists();
        
        // Mark as processed
        order.isExecuted = true;
        processedSecrets[secretHash] = true;
        
        // Execute withdrawal on destination escrow
        try etherlinkEscrow.withdraw(order.destEscrowId, secret) {
            emit OrderExecuted(orderId, order.destEscrowId, secretHash, block.timestamp);
        } catch Error(string memory reason) {
            emit OrderFailed(orderId, reason, block.timestamp);
            revert();
        }
    }
    
    /**
     * @dev Cancel expired order and recover funds
     */
    function cancelExpiredOrder(
        string memory orderId
    ) external onlyOwner validOrder(orderId) nonReentrant {
        PendingOrder storage order = pendingOrders[orderId];
        
        if (order.amount == 0) revert OrderNotFound();
        if (order.isExecuted) revert OrderAlreadyExists();
        if (block.timestamp <= order.executionDeadline) revert OrderExpired();
        
        // Cancel the escrow and recover funds
        etherlinkEscrow.cancel(order.destEscrowId);
        
        // Mark as failed
        order.isExecuted = true;
        
        emit OrderFailed(orderId, "Timeout", block.timestamp);
    }
    
    /**
     * @dev Update resolver configuration
     */
    function updateConfig(
        uint256 minimumStake,
        uint256 gasPriceLimit,
        uint256 maxSlippage,
        bool isActive
    ) external onlyOwner {
        if (minimumStake == 0) revert InvalidConfiguration();
        
        config = ResolverConfig({
            minimumStake: minimumStake,
            gasPriceLimit: gasPriceLimit,
            maxSlippage: maxSlippage,
            isActive: isActive
        });
    }
    
    /**
     * @dev Emergency withdrawal for stuck funds
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        if (balance > 0) {
            (bool success, ) = owner().call{value: balance}("");
            require(success, "Emergency withdrawal failed");
        }
    }
    
    // View functions
    function getOrderStatus(string memory orderId) external view returns (PendingOrder memory) {
        return pendingOrders[orderId];
    }
    
    function isOrderActive(string memory orderId) external view returns (bool) {
        PendingOrder storage order = pendingOrders[orderId];
        return order.amount > 0 && 
               !order.isExecuted && 
               block.timestamp <= order.executionDeadline;
    }
    
    function getResolverBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    // Allow contract to receive ETH
    receive() external payable {}
}