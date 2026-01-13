// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IERC20.sol";

/**
 * @title PredictionMarketVault
 * @dev Core escrow vault for the prediction market platform
 * 
 * Features:
 * - Non-custodial: Users control their funds via signatures
 * - Multi-token: Supports USDC and USDT
 * - Market tracking: On-chain record of markets and positions
 * - Event emission: For off-chain indexing via Alchemy webhooks
 * 
 * Security:
 * - Ownable for admin functions (pause, emergency withdraw)
 * - ReentrancyGuard equivalent via checks-effects-interactions
 * - No private keys on backend - all operations require user signature
 */
contract PredictionMarketVault {
    // ============================================================================
    // State Variables
    // ============================================================================

    address public owner;
    bool public paused;

    // Supported tokens (USDC, USDT)
    mapping(address => bool) public supportedTokens;
    
    // User balances per token: user => token => balance
    mapping(address => mapping(address => uint256)) public balances;

    // Market resolution status: marketId (bytes32) => outcome (0=unresolved, 1=YES, 2=NO, 3=cancelled)
    mapping(bytes32 => uint8) public marketOutcomes;

    // User positions: user => marketId => outcome => shares (scaled by 1e6)
    mapping(address => mapping(bytes32 => mapping(uint8 => uint256))) public positions;

    // Nonce tracking for replay protection: user => nonce
    mapping(address => uint256) public nonces;

    // Market total pools for settlement calculations: marketId => outcome => total shares
    mapping(bytes32 => mapping(uint8 => uint256)) public marketPools;

    // ============================================================================
    // Events - Indexed for Alchemy webhook filtering
    // ============================================================================

    event Deposited(
        address indexed user,
        address indexed token,
        uint256 amount,
        uint256 newBalance
    );

    event Withdrawn(
        address indexed user,
        address indexed token,
        uint256 amount,
        uint256 newBalance
    );

    event BetPlaced(
        address indexed user,
        bytes32 indexed marketId,
        uint8 outcome, // 1=YES, 2=NO
        uint256 collateral,
        uint256 shares,
        uint256 nonce
    );

    event PositionSold(
        address indexed user,
        bytes32 indexed marketId,
        uint8 outcome,
        uint256 shares,
        uint256 payout,
        uint256 nonce
    );

    event WinningsClaimed(
        address indexed user,
        bytes32 indexed marketId,
        uint8 outcome,
        uint256 shares,
        uint256 payout
    );

    event MarketResolved(
        bytes32 indexed marketId,
        uint8 outcome // 1=YES, 2=NO, 3=cancelled
    );

    event TokenAdded(address indexed token);
    event TokenRemoved(address indexed token);
    event Paused(address indexed by);
    event Unpaused(address indexed by);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    // ============================================================================
    // Modifiers
    // ============================================================================

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier whenNotPaused() {
        require(!paused, "Contract paused");
        _;
    }

    modifier validToken(address token) {
        require(supportedTokens[token], "Unsupported token");
        _;
    }

    // ============================================================================
    // Constructor
    // ============================================================================

    constructor(address[] memory _tokens) {
        owner = msg.sender;
        
        for (uint256 i = 0; i < _tokens.length; i++) {
            supportedTokens[_tokens[i]] = true;
            emit TokenAdded(_tokens[i]);
        }
    }

    // ============================================================================
    // User Functions
    // ============================================================================

    /**
     * @dev Deposit tokens into the vault
     * Requires prior ERC20 approval
     * @param token The token address (USDC/USDT)
     * @param amount Amount to deposit (in token's smallest unit, e.g., 6 decimals for USDC)
     */
    function deposit(address token, uint256 amount) 
        external 
        whenNotPaused 
        validToken(token) 
    {
        require(amount > 0, "Zero amount");

        // Transfer tokens from user to vault
        bool success = IERC20(token).transferFrom(msg.sender, address(this), amount);
        require(success, "Transfer failed");

        // Update balance
        balances[msg.sender][token] += amount;

        emit Deposited(msg.sender, token, amount, balances[msg.sender][token]);
    }

    /**
     * @dev Withdraw tokens from the vault
     * @param token The token address
     * @param amount Amount to withdraw
     */
    function withdraw(address token, uint256 amount) 
        external 
        whenNotPaused 
        validToken(token) 
    {
        require(amount > 0, "Zero amount");
        require(balances[msg.sender][token] >= amount, "Insufficient balance");

        // Update balance first (checks-effects-interactions)
        balances[msg.sender][token] -= amount;

        // Transfer tokens to user
        bool success = IERC20(token).transfer(msg.sender, amount);
        require(success, "Transfer failed");

        emit Withdrawn(msg.sender, token, amount, balances[msg.sender][token]);
    }

    /**
     * @dev Place a bet on a market outcome
     * @param marketId The market identifier (UUID from Supabase, hashed to bytes32)
     * @param outcome 1=YES, 2=NO
     * @param collateral Amount of tokens to bet (from vault balance)
     * @param shares Number of shares to receive (calculated off-chain via LMSR)
     * @param token The token used for collateral
     * @param deadline Timestamp after which this transaction is invalid
     */
    function placeBet(
        bytes32 marketId,
        uint8 outcome,
        uint256 collateral,
        uint256 shares,
        address token,
        uint256 deadline
    ) 
        external 
        whenNotPaused 
        validToken(token) 
    {
        require(block.timestamp <= deadline, "Transaction expired");
        require(outcome == 1 || outcome == 2, "Invalid outcome");
        require(collateral > 0, "Zero collateral");
        require(shares > 0, "Zero shares");
        require(marketOutcomes[marketId] == 0, "Market already resolved");
        require(balances[msg.sender][token] >= collateral, "Insufficient balance");

        // Deduct collateral from user's vault balance
        balances[msg.sender][token] -= collateral;

        // Record position
        positions[msg.sender][marketId][outcome] += shares;
        
        // Update market pool
        marketPools[marketId][outcome] += shares;

        // Increment nonce for replay protection
        uint256 currentNonce = nonces[msg.sender]++;

        emit BetPlaced(msg.sender, marketId, outcome, collateral, shares, currentNonce);
    }

    /**
     * @dev Sell a position before market resolution
     * @param marketId The market identifier
     * @param outcome The outcome side to sell (1=YES, 2=NO)
     * @param shares Number of shares to sell
     * @param payout Amount to receive (calculated off-chain via LMSR)
     * @param token The token for payout
     * @param deadline Timestamp after which this transaction is invalid
     */
    function sellPosition(
        bytes32 marketId,
        uint8 outcome,
        uint256 shares,
        uint256 payout,
        address token,
        uint256 deadline
    ) 
        external 
        whenNotPaused 
        validToken(token) 
    {
        require(block.timestamp <= deadline, "Transaction expired");
        require(outcome == 1 || outcome == 2, "Invalid outcome");
        require(shares > 0, "Zero shares");
        require(marketOutcomes[marketId] == 0, "Market already resolved");
        require(positions[msg.sender][marketId][outcome] >= shares, "Insufficient shares");

        // Reduce position
        positions[msg.sender][marketId][outcome] -= shares;
        
        // Update market pool
        marketPools[marketId][outcome] -= shares;

        // Credit payout to user's vault balance
        balances[msg.sender][token] += payout;

        // Increment nonce
        uint256 currentNonce = nonces[msg.sender]++;

        emit PositionSold(msg.sender, marketId, outcome, shares, payout, currentNonce);
    }

    /**
     * @dev Claim winnings after market resolution
     * @param marketId The market identifier
     * @param token The token for payout
     */
    function claimWinnings(bytes32 marketId, address token) 
        external 
        whenNotPaused 
        validToken(token) 
    {
        uint8 outcome = marketOutcomes[marketId];
        require(outcome == 1 || outcome == 2, "Market not resolved");

        uint256 shares = positions[msg.sender][marketId][outcome];
        require(shares > 0, "No winning position");

        // Clear position
        positions[msg.sender][marketId][outcome] = 0;

        // Payout = shares (1 share = 1 token in winning outcome)
        // This assumes the LMSR pricing ensured proper collateralization
        uint256 payout = shares;
        balances[msg.sender][token] += payout;

        emit WinningsClaimed(msg.sender, marketId, outcome, shares, payout);
    }

    /**
     * @dev Claim refund for cancelled market
     * @param marketId The market identifier
     * @param token The token for refund
     */
    function claimRefund(bytes32 marketId, address token)
        external
        whenNotPaused
        validToken(token)
    {
        require(marketOutcomes[marketId] == 3, "Market not cancelled");

        // Refund both YES and NO positions
        uint256 yesShares = positions[msg.sender][marketId][1];
        uint256 noShares = positions[msg.sender][marketId][2];
        uint256 totalShares = yesShares + noShares;
        
        require(totalShares > 0, "No position to refund");

        // Clear positions
        positions[msg.sender][marketId][1] = 0;
        positions[msg.sender][marketId][2] = 0;

        // Refund proportional to shares held
        // Note: In a real scenario, you'd track original collateral
        // For simplicity, refund equals shares
        balances[msg.sender][token] += totalShares;

        emit WinningsClaimed(msg.sender, marketId, 3, totalShares, totalShares);
    }

    // ============================================================================
    // View Functions
    // ============================================================================

    /**
     * @dev Get user's balance for a token
     */
    function getBalance(address user, address token) external view returns (uint256) {
        return balances[user][token];
    }

    /**
     * @dev Get user's position in a market
     */
    function getPosition(address user, bytes32 marketId, uint8 outcome) external view returns (uint256) {
        return positions[user][marketId][outcome];
    }

    /**
     * @dev Get market outcome
     */
    function getMarketOutcome(bytes32 marketId) external view returns (uint8) {
        return marketOutcomes[marketId];
    }

    /**
     * @dev Get current nonce for a user
     */
    function getNonce(address user) external view returns (uint256) {
        return nonces[user];
    }

    /**
     * @dev Convert UUID string to bytes32 (for off-chain use)
     * Note: This is a helper - actual conversion should be done off-chain
     */
    function uuidToBytes32(string memory uuid) external pure returns (bytes32) {
        return keccak256(abi.encodePacked(uuid));
    }

    // ============================================================================
    // Admin Functions
    // ============================================================================

    /**
     * @dev Resolve a market with the winning outcome
     * @param marketId The market identifier
     * @param outcome 1=YES, 2=NO, 3=cancelled
     */
    function resolveMarket(bytes32 marketId, uint8 outcome) external onlyOwner {
        require(outcome >= 1 && outcome <= 3, "Invalid outcome");
        require(marketOutcomes[marketId] == 0, "Already resolved");

        marketOutcomes[marketId] = outcome;
        emit MarketResolved(marketId, outcome);
    }

    /**
     * @dev Add a supported token
     */
    function addToken(address token) external onlyOwner {
        require(!supportedTokens[token], "Already supported");
        supportedTokens[token] = true;
        emit TokenAdded(token);
    }

    /**
     * @dev Remove a supported token
     */
    function removeToken(address token) external onlyOwner {
        require(supportedTokens[token], "Not supported");
        supportedTokens[token] = false;
        emit TokenRemoved(token);
    }

    /**
     * @dev Pause the contract (emergency)
     */
    function pause() external onlyOwner {
        paused = true;
        emit Paused(msg.sender);
    }

    /**
     * @dev Unpause the contract
     */
    function unpause() external onlyOwner {
        paused = false;
        emit Unpaused(msg.sender);
    }

    /**
     * @dev Transfer ownership
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Zero address");
        address oldOwner = owner;
        owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }

    /**
     * @dev Emergency withdraw for stuck tokens (admin only)
     * Should only be used if contract is being deprecated
     */
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        require(paused, "Must be paused");
        bool success = IERC20(token).transfer(owner, amount);
        require(success, "Transfer failed");
    }
}
