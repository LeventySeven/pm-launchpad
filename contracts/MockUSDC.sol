// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IERC20.sol";

/**
 * @title MockUSDC
 * @dev A simple ERC20 token for Sepolia testnet testing
 * Mimics USDC with 6 decimals and includes a faucet function
 */
contract MockUSDC is IERC20 {
    string public constant name = "Mock USDC";
    string public constant symbol = "mUSDC";
    uint8 public constant decimals = 6;

    uint256 private _totalSupply;
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    // Faucet configuration
    uint256 public constant FAUCET_AMOUNT = 1000 * 10**6; // 1000 USDC
    uint256 public constant FAUCET_COOLDOWN = 1 hours;
    mapping(address => uint256) public lastFaucetClaim;

    // Events
    event FaucetClaimed(address indexed user, uint256 amount);

    constructor() {
        // Mint initial supply to deployer for liquidity
        uint256 initialSupply = 10_000_000 * 10**6; // 10M USDC
        _balances[msg.sender] = initialSupply;
        _totalSupply = initialSupply;
        emit Transfer(address(0), msg.sender, initialSupply);
    }

    // ============================================================================
    // ERC20 Implementation
    // ============================================================================

    function totalSupply() external view override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) external view override returns (uint256) {
        return _balances[account];
    }

    function transfer(address to, uint256 value) external override returns (bool) {
        require(to != address(0), "Transfer to zero address");
        require(_balances[msg.sender] >= value, "Insufficient balance");

        _balances[msg.sender] -= value;
        _balances[to] += value;
        emit Transfer(msg.sender, to, value);
        return true;
    }

    function allowance(address owner, address spender) external view override returns (uint256) {
        return _allowances[owner][spender];
    }

    function approve(address spender, uint256 value) external override returns (bool) {
        require(spender != address(0), "Approve to zero address");
        _allowances[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    function transferFrom(address from, address to, uint256 value) external override returns (bool) {
        require(from != address(0), "Transfer from zero address");
        require(to != address(0), "Transfer to zero address");
        require(_balances[from] >= value, "Insufficient balance");
        require(_allowances[from][msg.sender] >= value, "Insufficient allowance");

        _balances[from] -= value;
        _balances[to] += value;
        _allowances[from][msg.sender] -= value;
        emit Transfer(from, to, value);
        return true;
    }

    // ============================================================================
    // Faucet Functions (Testnet Only)
    // ============================================================================

    /**
     * @dev Claim test tokens from the faucet
     * Limited to once per hour per address
     */
    function faucet() external {
        require(
            block.timestamp >= lastFaucetClaim[msg.sender] + FAUCET_COOLDOWN,
            "Faucet cooldown active"
        );

        lastFaucetClaim[msg.sender] = block.timestamp;
        _balances[msg.sender] += FAUCET_AMOUNT;
        _totalSupply += FAUCET_AMOUNT;

        emit Transfer(address(0), msg.sender, FAUCET_AMOUNT);
        emit FaucetClaimed(msg.sender, FAUCET_AMOUNT);
    }

    /**
     * @dev Check remaining cooldown time for an address
     */
    function faucetCooldownRemaining(address account) external view returns (uint256) {
        uint256 lastClaim = lastFaucetClaim[account];
        if (lastClaim == 0) return 0;
        
        uint256 nextClaimTime = lastClaim + FAUCET_COOLDOWN;
        if (block.timestamp >= nextClaimTime) return 0;
        
        return nextClaimTime - block.timestamp;
    }
}
