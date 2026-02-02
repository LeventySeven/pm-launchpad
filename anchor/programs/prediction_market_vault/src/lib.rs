#![allow(unexpected_cfgs)]

use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{self, Mint, Token, TokenAccount, Transfer},
};

declare_id!("As8oG6d6GVyEGSgRqTHLKLEc5ZumyBy4KxHaAbv6fAZT");

// ============================================================================
// Constants
// ============================================================================

/// Fee to create a market: 2 USDC (6 decimals).
pub const CREATE_MARKET_FEE_MINOR: u64 = 2_000_000;

// ============================================================================
// Accounts
// ============================================================================

#[account]
#[derive(InitSpace)]
pub struct Config {
    /// Program upgrade/admin authority.
    pub authority: Pubkey,
    /// Off-chain quote/bet authority (backend) that co-signs bet/sell txs.
    pub quote_authority: Pubkey,
    /// Configured USDC mint (devnet: custom mint, mainnet: official).
    pub usdc_mint: Pubkey,
    pub bump: u8,
}

impl Config {
    pub const SEED: &'static [u8] = b"config";
}

/// @deprecated - LEGACY: This account was used for custodial deposits.
/// The new non-custodial flow transfers USDC directly to market vault ATAs.
/// Kept for backward compatibility but should not be used in new code.
#[account]
#[derive(InitSpace)]
pub struct UserVault {
    pub user: Pubkey,
    /// Internal vault balance in minor units (USDC has 6 decimals).
    pub balance: u64,
    pub bump: u8,
}

impl UserVault {
    pub const SEED: &'static [u8] = b"user_vault";
}

#[account]
#[derive(InitSpace)]
pub struct Market {
    /// 16 raw UUID bytes from Supabase market id.
    pub uuid: [u8; 16],
    /// 0=open/unresolved, 1=YES, 2=NO, 3=cancelled
    pub outcome: u8,
    /// Total YES shares (scaled by 1e6)
    pub q_yes: u64,
    /// Total NO shares (scaled by 1e6)
    pub q_no: u64,
    /// Liquidity parameter b (scaled by 1e6)
    pub b: u64,
    pub bump: u8,
}

impl Market {
    pub const SEED: &'static [u8] = b"market";
}

#[account]
#[derive(InitSpace)]
pub struct Position {
    pub market: Pubkey,
    pub user: Pubkey,
    pub shares_yes: u64,
    pub shares_no: u64,
    pub bump: u8,
}

impl Position {
    pub const SEED: &'static [u8] = b"position";
}

// ============================================================================
// Events (indexer-friendly)
// ============================================================================

/// @deprecated - LEGACY: Event for custodial deposits (no longer used)
#[event]
pub struct Deposited {
    pub user: Pubkey,
    pub amount_minor: u64,
    pub new_balance_minor: u64,
}

/// @deprecated - LEGACY: Event for custodial withdrawals (no longer used)
#[event]
pub struct Withdrawn {
    pub user: Pubkey,
    pub amount_minor: u64,
    pub new_balance_minor: u64,
}

#[event]
pub struct BetPlaced {
    pub user: Pubkey,
    pub market: Pubkey,
    /// 1=YES, 2=NO
    pub outcome: u8,
    pub collateral_minor: u64,
    pub shares_minor: u64,
}

#[event]
pub struct PositionSold {
    pub user: Pubkey,
    pub market: Pubkey,
    /// 1=YES, 2=NO
    pub outcome: u8,
    pub shares_minor: u64,
    pub payout_minor: u64,
}

#[event]
pub struct WinningsClaimed {
    pub user: Pubkey,
    pub market: Pubkey,
    /// 1=YES, 2=NO
    pub outcome: u8,
    pub shares_minor: u64,
    pub payout_minor: u64,
}

#[event]
pub struct MarketResolved {
    pub market: Pubkey,
    /// 1=YES, 2=NO, 3=cancelled
    pub outcome: u8,
}

#[event]
pub struct FeesCollected {
    pub market: Pubkey,
    pub authority: Pubkey,
    pub amount_minor: u64,
}

// ============================================================================
// Errors
// ============================================================================

#[error_code]
pub enum VaultError {
    #[msg("Not authorized")]
    NotAuthorized,
    #[msg("Invalid amount")]
    InvalidAmount,
    #[msg("Insufficient balance")]
    InsufficientBalance,
    #[msg("Invalid outcome")]
    InvalidOutcome,
    #[msg("Market not open")]
    MarketNotOpen,
    #[msg("Market not resolved")]
    MarketNotResolved,
    #[msg("No winning position")]
    NoWinningPosition,
    #[msg("Insufficient shares")]
    InsufficientShares,
    #[msg("Mint mismatch")]
    MintMismatch,
    #[msg("Arithmetic overflow")]
    ArithmeticOverflow,
}

// ============================================================================
// Program
// ============================================================================

#[program]
pub mod prediction_market_vault {
    use super::*;

    /// Initialize the global config PDA. Can only be called once.
    pub fn initialize_config(
        ctx: Context<InitializeConfig>,
        quote_authority: Pubkey,
    ) -> Result<()> {
        let cfg = &mut ctx.accounts.config;
        cfg.authority = ctx.accounts.authority.key();
        cfg.quote_authority = quote_authority;
        cfg.usdc_mint = ctx.accounts.usdc_mint.key();
        cfg.bump = ctx.bumps.config;
        Ok(())
    }

    /// Create a market. Requires CREATE_MARKET_FEE_MINOR (2 USDC) transferred from payer to fee recipient.
    pub fn create_market(ctx: Context<CreateMarket>, market_uuid: [u8; 16]) -> Result<()> {
        // Transfer 2 USDC fee from payer to config's ATA
        let cpi_accounts = Transfer {
            from: ctx.accounts.payer_usdc_ata.to_account_info(),
            to: ctx.accounts.fee_recipient_ata.to_account_info(),
            authority: ctx.accounts.payer.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts);
        token::transfer(cpi_ctx, CREATE_MARKET_FEE_MINOR)?;

        let m = &mut ctx.accounts.market;
        m.uuid = market_uuid;
        m.outcome = 0;
        m.q_yes = 0;
        m.q_no = 0;
        m.b = 0;
        m.bump = ctx.bumps.market;
        Ok(())
    }

    /// @deprecated - LEGACY: This instruction was used for custodial deposits.
    /// The new non-custodial flow (place_bet, sell_position, claim_winnings) transfers 
    /// USDC directly between user wallet ATAs and market vault ATAs.
    /// Kept for backward compatibility but should not be used in new integrations.
    pub fn deposit(ctx: Context<Deposit>, amount_minor: u64) -> Result<()> {
        require!(amount_minor > 0, VaultError::InvalidAmount);

        // Transfer from user -> vault ATA (owned by config PDA)
        let cpi_accounts = Transfer {
            from: ctx.accounts.user_usdc_ata.to_account_info(),
            to: ctx.accounts.vault_usdc_ata.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts);
        token::transfer(cpi_ctx, amount_minor)?;

        let uv = &mut ctx.accounts.user_vault;
        uv.user = ctx.accounts.user.key();
        uv.bump = ctx.bumps.user_vault;
        uv.balance = uv
            .balance
            .checked_add(amount_minor)
            .ok_or(VaultError::ArithmeticOverflow)?;

        emit!(Deposited {
            user: ctx.accounts.user.key(),
            amount_minor,
            new_balance_minor: uv.balance,
        });
        Ok(())
    }

    /// @deprecated - LEGACY: This instruction was used for custodial withdrawals.
    /// The new non-custodial flow (place_bet, sell_position, claim_winnings) transfers 
    /// USDC directly between user wallet ATAs and market vault ATAs.
    /// Kept for backward compatibility but should not be used in new integrations.
    pub fn withdraw(ctx: Context<Withdraw>, amount_minor: u64) -> Result<()> {
        require!(amount_minor > 0, VaultError::InvalidAmount);

        let uv = &mut ctx.accounts.user_vault;
        require!(uv.balance >= amount_minor, VaultError::InsufficientBalance);
        uv.balance = uv
            .balance
            .checked_sub(amount_minor)
            .ok_or(VaultError::ArithmeticOverflow)?;

        // Transfer from vault ATA (owned by config PDA) -> user ATA
        let signer_seeds: &[&[&[u8]]] = &[&[Config::SEED, &[ctx.accounts.config.bump]]];
        let cpi_accounts = Transfer {
            from: ctx.accounts.vault_usdc_ata.to_account_info(),
            to: ctx.accounts.user_usdc_ata.to_account_info(),
            authority: ctx.accounts.config.to_account_info(),
        };
        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            cpi_accounts,
            signer_seeds,
        );
        token::transfer(cpi_ctx, amount_minor)?;

        emit!(Withdrawn {
            user: ctx.accounts.user.key(),
            amount_minor,
            new_balance_minor: uv.balance,
        });
        Ok(())
    }

    /// Place a bet (buy shares). Pricing is enforced off-chain; on-chain enforces bounds + custody.
    /// 
    /// # Arguments
    /// * `outcome` - 1=YES, 2=NO
    /// * `collateral_minor` - Amount of USDC to pay (in minor units, 6 decimals)
    /// * `shares_minor` - Number of shares to receive (scaled by 1e6)
    /// * `max_cost_minor` - Maximum acceptable cost (slippage protection)
    pub fn place_bet(
        ctx: Context<PlaceBet>,
        outcome: u8,
        collateral_minor: u64,
        shares_minor: u64,
        max_cost_minor: u64,
    ) -> Result<()> {
        require!(outcome == 1 || outcome == 2, VaultError::InvalidOutcome);
        require!(
            collateral_minor > 0 && shares_minor > 0,
            VaultError::InvalidAmount
        );
        require!(collateral_minor <= max_cost_minor, VaultError::InvalidAmount);
        require!(ctx.accounts.market.outcome == 0, VaultError::MarketNotOpen);
        require!(
            ctx.accounts.quote_authority.key() == ctx.accounts.config.quote_authority,
            VaultError::NotAuthorized
        );

        // Update position
        let pos = &mut ctx.accounts.position;
        pos.market = ctx.accounts.market.key();
        pos.user = ctx.accounts.user.key();
        pos.bump = ctx.bumps.position;

        if outcome == 1 {
            pos.shares_yes = pos
                .shares_yes
                .checked_add(shares_minor)
                .ok_or(VaultError::ArithmeticOverflow)?;
            ctx.accounts.market.q_yes = ctx
                .accounts
                .market
                .q_yes
                .checked_add(shares_minor)
                .ok_or(VaultError::ArithmeticOverflow)?;
        } else {
            pos.shares_no = pos
                .shares_no
                .checked_add(shares_minor)
                .ok_or(VaultError::ArithmeticOverflow)?;
            ctx.accounts.market.q_no = ctx
                .accounts
                .market
                .q_no
                .checked_add(shares_minor)
                .ok_or(VaultError::ArithmeticOverflow)?;
        }

        // Transfer USDC from user -> market vault ATA
        let cpi_accounts = Transfer {
            from: ctx.accounts.user_usdc_ata.to_account_info(),
            to: ctx.accounts.market_vault_ata.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts);
        token::transfer(cpi_ctx, collateral_minor)?;

        emit!(BetPlaced {
            user: ctx.accounts.user.key(),
            market: ctx.accounts.market.key(),
            outcome,
            collateral_minor,
            shares_minor,
        });
        Ok(())
    }

    /// Sell a position (cash out shares). Payout is enforced off-chain by requiring quote authority to co-sign.
    /// 
    /// # Arguments
    /// * `outcome` - 1=YES, 2=NO (which shares to sell)
    /// * `shares_minor` - Number of shares to sell (scaled by 1e6)
    /// * `payout_minor` - Amount of USDC to receive (in minor units)
    /// * `min_payout_minor` - Minimum acceptable payout (slippage protection)
    pub fn sell_position(
        ctx: Context<SellPosition>,
        outcome: u8,
        shares_minor: u64,
        payout_minor: u64,
        min_payout_minor: u64,
    ) -> Result<()> {
        require!(outcome == 1 || outcome == 2, VaultError::InvalidOutcome);
        require!(shares_minor > 0, VaultError::InvalidAmount);
        require!(payout_minor >= min_payout_minor, VaultError::InvalidAmount);
        require!(ctx.accounts.market.outcome == 0, VaultError::MarketNotOpen);
        require!(
            ctx.accounts.quote_authority.key() == ctx.accounts.config.quote_authority,
            VaultError::NotAuthorized
        );

        // Reduce position
        let pos = &mut ctx.accounts.position;
        if outcome == 1 {
            require!(pos.shares_yes >= shares_minor, VaultError::InsufficientShares);
            pos.shares_yes = pos
                .shares_yes
                .checked_sub(shares_minor)
                .ok_or(VaultError::ArithmeticOverflow)?;
            ctx.accounts.market.q_yes = ctx
                .accounts
                .market
                .q_yes
                .checked_sub(shares_minor)
                .ok_or(VaultError::ArithmeticOverflow)?;
        } else {
            require!(pos.shares_no >= shares_minor, VaultError::InsufficientShares);
            pos.shares_no = pos
                .shares_no
                .checked_sub(shares_minor)
                .ok_or(VaultError::ArithmeticOverflow)?;
            ctx.accounts.market.q_no = ctx
                .accounts
                .market
                .q_no
                .checked_sub(shares_minor)
                .ok_or(VaultError::ArithmeticOverflow)?;
        }

        // Transfer USDC from market vault ATA -> user (market PDA signs)
        let signer_seeds: &[&[&[u8]]] = &[&[
            Market::SEED,
            ctx.accounts.market.uuid.as_ref(),
            &[ctx.accounts.market.bump],
        ]];
        let cpi_accounts = Transfer {
            from: ctx.accounts.market_vault_ata.to_account_info(),
            to: ctx.accounts.user_usdc_ata.to_account_info(),
            authority: ctx.accounts.market.to_account_info(),
        };
        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            cpi_accounts,
            signer_seeds,
        );
        token::transfer(cpi_ctx, payout_minor)?;

        emit!(PositionSold {
            user: ctx.accounts.user.key(),
            market: ctx.accounts.market.key(),
            outcome,
            shares_minor,
            payout_minor,
        });
        Ok(())
    }

    /// Resolve a market. Only the authority can call this.
    /// 
    /// # Arguments
    /// * `outcome` - 1=YES, 2=NO, 3=cancelled
    pub fn resolve_market(ctx: Context<ResolveMarket>, outcome: u8) -> Result<()> {
        require!(
            outcome == 1 || outcome == 2 || outcome == 3,
            VaultError::InvalidOutcome
        );
        require!(
            ctx.accounts.authority.key() == ctx.accounts.config.authority,
            VaultError::NotAuthorized
        );
        require!(ctx.accounts.market.outcome == 0, VaultError::MarketNotOpen);
        
        ctx.accounts.market.outcome = outcome;
        
        emit!(MarketResolved {
            market: ctx.accounts.market.key(),
            outcome,
        });
        Ok(())
    }

    /// Claim winnings after market resolution.
    /// Payout equals shares held for the winning outcome.
    /// 
    /// # Arguments
    /// * `min_payout_minor` - Minimum acceptable payout (for safety)
    pub fn claim_winnings(ctx: Context<ClaimWinnings>, min_payout_minor: u64) -> Result<()> {
        let outcome = ctx.accounts.market.outcome;
        require!(outcome == 1 || outcome == 2, VaultError::MarketNotResolved);

        let pos = &mut ctx.accounts.position;
        let shares_minor = if outcome == 1 {
            let s = pos.shares_yes;
            require!(s > 0, VaultError::NoWinningPosition);
            pos.shares_yes = 0;
            s
        } else {
            let s = pos.shares_no;
            require!(s > 0, VaultError::NoWinningPosition);
            pos.shares_no = 0;
            s
        };
        
        // Payout = shares (1:1 redemption for winning outcome)
        let payout_minor = shares_minor;
        require!(payout_minor >= min_payout_minor, VaultError::InvalidAmount);

        // Transfer USDC from market vault ATA -> user (market PDA signs)
        let signer_seeds: &[&[&[u8]]] = &[&[
            Market::SEED,
            ctx.accounts.market.uuid.as_ref(),
            &[ctx.accounts.market.bump],
        ]];
        let cpi_accounts = Transfer {
            from: ctx.accounts.market_vault_ata.to_account_info(),
            to: ctx.accounts.user_usdc_ata.to_account_info(),
            authority: ctx.accounts.market.to_account_info(),
        };
        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            cpi_accounts,
            signer_seeds,
        );
        token::transfer(cpi_ctx, payout_minor)?;

        emit!(WinningsClaimed {
            user: ctx.accounts.user.key(),
            market: ctx.accounts.market.key(),
            outcome,
            shares_minor,
            payout_minor,
        });
        Ok(())
    }

    /// Collect accumulated fees from a resolved market.
    /// Only the authority can call this. Withdraws the specified amount from the market vault
    /// to the fee recipient ATA (typically a company treasury wallet).
    /// This should only be called after all winners have claimed their winnings.
    pub fn collect_fees(ctx: Context<CollectFees>, amount_minor: u64) -> Result<()> {
        require!(amount_minor > 0, VaultError::InvalidAmount);
        require!(
            ctx.accounts.authority.key() == ctx.accounts.config.authority,
            VaultError::NotAuthorized
        );
        // Only allow fee collection from resolved or cancelled markets
        let outcome = ctx.accounts.market.outcome;
        require!(outcome > 0, VaultError::MarketNotResolved);

        // Transfer from market vault ATA -> fee recipient ATA (market PDA signs)
        let signer_seeds: &[&[&[u8]]] = &[&[
            Market::SEED,
            ctx.accounts.market.uuid.as_ref(),
            &[ctx.accounts.market.bump],
        ]];
        let cpi_accounts = Transfer {
            from: ctx.accounts.market_vault_ata.to_account_info(),
            to: ctx.accounts.fee_recipient_ata.to_account_info(),
            authority: ctx.accounts.market.to_account_info(),
        };
        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            cpi_accounts,
            signer_seeds,
        );
        token::transfer(cpi_ctx, amount_minor)?;

        emit!(FeesCollected {
            market: ctx.accounts.market.key(),
            authority: ctx.accounts.authority.key(),
            amount_minor,
        });
        Ok(())
    }
}

// ============================================================================
// Instruction contexts
// ============================================================================

#[derive(Accounts)]
pub struct InitializeConfig<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        payer = authority,
        space = 8 + Config::INIT_SPACE,
        seeds = [Config::SEED],
        bump
    )]
    pub config: Box<Account<'info, Config>>,

    /// USDC mint to use for the program.
    pub usdc_mint: Box<Account<'info, Mint>>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(market_uuid: [u8; 16])]
pub struct CreateMarket<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        init,
        payer = payer,
        space = 8 + Market::INIT_SPACE,
        seeds = [Market::SEED, market_uuid.as_ref()],
        bump
    )]
    pub market: Box<Account<'info, Market>>,

    #[account(
        seeds = [Config::SEED],
        bump = config.bump
    )]
    pub config: Box<Account<'info, Config>>,

    /// Payer's USDC ATA (source of 2 USDC fee).
    #[account(
        mut,
        associated_token::mint = usdc_mint,
        associated_token::authority = payer,
    )]
    pub payer_usdc_ata: Box<Account<'info, TokenAccount>>,

    /// Fee recipient USDC ATA (config PDA's ATA).
    #[account(
        init_if_needed,
        payer = payer,
        associated_token::mint = usdc_mint,
        associated_token::authority = config,
    )]
    pub fee_recipient_ata: Box<Account<'info, TokenAccount>>,

    /// USDC mint - validated against config.
    #[account(
        constraint = usdc_mint.key() == config.usdc_mint @ VaultError::MintMismatch
    )]
    pub usdc_mint: Box<Account<'info, Mint>>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

/// @deprecated - Legacy custodial deposit context
#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        seeds = [Config::SEED],
        bump = config.bump
    )]
    pub config: Box<Account<'info, Config>>,

    /// USDC mint - validated against config.
    #[account(
        constraint = usdc_mint.key() == config.usdc_mint @ VaultError::MintMismatch
    )]
    pub usdc_mint: Box<Account<'info, Mint>>,

    #[account(
        init_if_needed,
        payer = user,
        space = 8 + UserVault::INIT_SPACE,
        seeds = [UserVault::SEED, user.key().as_ref()],
        bump
    )]
    pub user_vault: Box<Account<'info, UserVault>>,

    /// User's USDC ATA (source of deposit).
    #[account(
        mut,
        associated_token::mint = usdc_mint,
        associated_token::authority = user,
    )]
    pub user_usdc_ata: Box<Account<'info, TokenAccount>>,

    /// Config PDA's USDC ATA (vault destination).
    #[account(
        init_if_needed,
        payer = user,
        associated_token::mint = usdc_mint,
        associated_token::authority = config,
    )]
    pub vault_usdc_ata: Box<Account<'info, TokenAccount>>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

/// @deprecated - Legacy custodial withdraw context
#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        seeds = [Config::SEED],
        bump = config.bump
    )]
    pub config: Box<Account<'info, Config>>,

    /// USDC mint - validated against config.
    #[account(
        constraint = usdc_mint.key() == config.usdc_mint @ VaultError::MintMismatch
    )]
    pub usdc_mint: Box<Account<'info, Mint>>,

    #[account(
        mut,
        seeds = [UserVault::SEED, user.key().as_ref()],
        bump = user_vault.bump,
        constraint = user_vault.user == user.key() @ VaultError::NotAuthorized
    )]
    pub user_vault: Box<Account<'info, UserVault>>,

    /// User's USDC ATA (withdraw destination).
    #[account(
        mut,
        associated_token::mint = usdc_mint,
        associated_token::authority = user,
    )]
    pub user_usdc_ata: Box<Account<'info, TokenAccount>>,

    /// Config PDA's USDC ATA (vault source).
    #[account(
        mut,
        associated_token::mint = usdc_mint,
        associated_token::authority = config,
    )]
    pub vault_usdc_ata: Box<Account<'info, TokenAccount>>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct PlaceBet<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    /// Off-chain pricing authority that must co-sign bet/sell.
    pub quote_authority: Signer<'info>,

    #[account(
        seeds = [Config::SEED],
        bump = config.bump
    )]
    pub config: Box<Account<'info, Config>>,

    #[account(
        mut,
        seeds = [Market::SEED, market.uuid.as_ref()],
        bump = market.bump
    )]
    pub market: Box<Account<'info, Market>>,

    #[account(
        init_if_needed,
        payer = user,
        space = 8 + Position::INIT_SPACE,
        seeds = [Position::SEED, market.key().as_ref(), user.key().as_ref()],
        bump
    )]
    pub position: Box<Account<'info, Position>>,

    /// USDC mint - validated against config.
    #[account(
        constraint = usdc_mint.key() == config.usdc_mint @ VaultError::MintMismatch
    )]
    pub usdc_mint: Box<Account<'info, Mint>>,

    /// User's USDC ATA (source of collateral).
    #[account(
        mut,
        associated_token::mint = usdc_mint,
        associated_token::authority = user,
    )]
    pub user_usdc_ata: Box<Account<'info, TokenAccount>>,

    /// Market PDA's USDC ATA (vault destination).
    #[account(
        init_if_needed,
        payer = user,
        associated_token::mint = usdc_mint,
        associated_token::authority = market,
    )]
    pub market_vault_ata: Box<Account<'info, TokenAccount>>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SellPosition<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    /// Off-chain pricing authority that must co-sign bet/sell.
    pub quote_authority: Signer<'info>,

    #[account(
        seeds = [Config::SEED],
        bump = config.bump
    )]
    pub config: Box<Account<'info, Config>>,

    #[account(
        mut,
        seeds = [Market::SEED, market.uuid.as_ref()],
        bump = market.bump
    )]
    pub market: Box<Account<'info, Market>>,

    #[account(
        mut,
        seeds = [Position::SEED, market.key().as_ref(), user.key().as_ref()],
        bump = position.bump,
        constraint = position.user == user.key() @ VaultError::NotAuthorized
    )]
    pub position: Box<Account<'info, Position>>,

    /// USDC mint - validated against config.
    #[account(
        constraint = usdc_mint.key() == config.usdc_mint @ VaultError::MintMismatch
    )]
    pub usdc_mint: Box<Account<'info, Mint>>,

    /// User's USDC ATA (payout destination). User must already have an ATA.
    #[account(
        mut,
        associated_token::mint = usdc_mint,
        associated_token::authority = user,
    )]
    pub user_usdc_ata: Box<Account<'info, TokenAccount>>,

    /// Market PDA's USDC ATA (payout source).
    #[account(
        mut,
        associated_token::mint = usdc_mint,
        associated_token::authority = market,
    )]
    pub market_vault_ata: Box<Account<'info, TokenAccount>>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct ResolveMarket<'info> {
    pub authority: Signer<'info>,

    #[account(
        seeds = [Config::SEED],
        bump = config.bump
    )]
    pub config: Box<Account<'info, Config>>,

    #[account(
        mut,
        seeds = [Market::SEED, market.uuid.as_ref()],
        bump = market.bump
    )]
    pub market: Box<Account<'info, Market>>,
}

#[derive(Accounts)]
pub struct ClaimWinnings<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        seeds = [Config::SEED],
        bump = config.bump
    )]
    pub config: Box<Account<'info, Config>>,

    #[account(
        mut,
        seeds = [Market::SEED, market.uuid.as_ref()],
        bump = market.bump
    )]
    pub market: Box<Account<'info, Market>>,

    #[account(
        mut,
        seeds = [Position::SEED, market.key().as_ref(), user.key().as_ref()],
        bump = position.bump,
        constraint = position.user == user.key() @ VaultError::NotAuthorized
    )]
    pub position: Box<Account<'info, Position>>,

    /// USDC mint - validated against config.
    #[account(
        constraint = usdc_mint.key() == config.usdc_mint @ VaultError::MintMismatch
    )]
    pub usdc_mint: Box<Account<'info, Mint>>,

    /// User's USDC ATA (payout destination). User must already have an ATA.
    #[account(
        mut,
        associated_token::mint = usdc_mint,
        associated_token::authority = user,
    )]
    pub user_usdc_ata: Box<Account<'info, TokenAccount>>,

    /// Market PDA's USDC ATA (payout source).
    #[account(
        mut,
        associated_token::mint = usdc_mint,
        associated_token::authority = market,
    )]
    pub market_vault_ata: Box<Account<'info, TokenAccount>>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct CollectFees<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        seeds = [Config::SEED],
        bump = config.bump
    )]
    pub config: Box<Account<'info, Config>>,

    #[account(
        mut,
        seeds = [Market::SEED, market.uuid.as_ref()],
        bump = market.bump
    )]
    pub market: Box<Account<'info, Market>>,

    /// Fee recipient wallet (typically company treasury).
    /// CHECK: Any valid address can be a fee recipient.
    pub fee_recipient: UncheckedAccount<'info>,

    /// USDC mint - validated against config.
    #[account(
        constraint = usdc_mint.key() == config.usdc_mint @ VaultError::MintMismatch
    )]
    pub usdc_mint: Box<Account<'info, Mint>>,

    /// Market PDA's USDC ATA (source of fees).
    #[account(
        mut,
        associated_token::mint = usdc_mint,
        associated_token::authority = market,
    )]
    pub market_vault_ata: Box<Account<'info, TokenAccount>>,

    /// Fee recipient's USDC ATA (destination).
    #[account(
        init_if_needed,
        payer = authority,
        associated_token::mint = usdc_mint,
        associated_token::authority = fee_recipient,
    )]
    pub fee_recipient_ata: Box<Account<'info, TokenAccount>>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}
