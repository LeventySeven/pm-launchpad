; ModuleID = 'LLVMDialectModule'
source_filename = "LLVMDialectModule"

@"mut,close=user,seeds=[Position::SEED,position.market.as_ref(),user.key().as_ref()],bump=position.bump,constraint=position.user==user.key()@VaultError::NotAuthorized" = internal constant [164 x i8] c"mut,close=user,seeds=[Position::SEED,position.market.as_ref(),user.key().as_ref()],bump=position.bump,constraint=position.user==user.key()@VaultError::NotAuthorized"
@fee_recipient_ata = internal constant [17 x i8] c"fee_recipient_ata"
@"mut,associated_token::mint=usdc_mint,associated_token::authority=fee_recipient,constraint=fee_recipient_ata.key()!=market_vault_ata.key()@VaultError::InvalidAmount" = internal constant [163 x i8] c"mut,associated_token::mint=usdc_mint,associated_token::authority=fee_recipient,constraint=fee_recipient_ata.key()!=market_vault_ata.key()@VaultError::InvalidAmount"
@"mut,associated_token::mint=usdc_mint,associated_token::authority=market," = internal constant [72 x i8] c"mut,associated_token::mint=usdc_mint,associated_token::authority=market,"
@"UncheckedAccount<'info>" = internal constant [23 x i8] c"UncheckedAccount<'info>"
@fee_recipient = internal constant [13 x i8] c"fee_recipient"
@"constraint=fee_recipient.key()==config.authority@VaultError::NotAuthorized" = internal constant [74 x i8] c"constraint=fee_recipient.key()==config.authority@VaultError::NotAuthorized"
@"mut,seeds=[Position::SEED,market.key().as_ref(),user.key().as_ref()],bump=position.bump,constraint=position.user==user.key()@VaultError::NotAuthorized" = internal constant [150 x i8] c"mut,seeds=[Position::SEED,market.key().as_ref(),user.key().as_ref()],bump=position.bump,constraint=position.user==user.key()@VaultError::NotAuthorized"
@market_vault_ata = internal constant [16 x i8] c"market_vault_ata"
@"mut,associated_token::mint=usdc_mint,associated_token::authority=market,constraint=market_vault_ata.key()!=user_usdc_ata.key()@VaultError::InvalidAmount" = internal constant [152 x i8] c"mut,associated_token::mint=usdc_mint,associated_token::authority=market,constraint=market_vault_ata.key()!=user_usdc_ata.key()@VaultError::InvalidAmount"
@"Box<Account<'info,Position>>" = internal constant [28 x i8] c"Box<Account<'info,Position>>"
@position = internal constant [8 x i8] c"position"
@"init_if_needed,payer=user,space=8+Position::INIT_SPACE,seeds=[Position::SEED,market.key().as_ref(),user.key().as_ref()],bump" = internal constant [124 x i8] c"init_if_needed,payer=user,space=8+Position::INIT_SPACE,seeds=[Position::SEED,market.key().as_ref(),user.key().as_ref()],bump"
@"mut,seeds=[Market::SEED,market.uuid.as_ref()],bump=market.bump" = internal constant [62 x i8] c"mut,seeds=[Market::SEED,market.uuid.as_ref()],bump=market.bump"
@"mut,seeds=[UserVault::SEED,user.key().as_ref()],bump=user_vault.bump,constraint=user_vault.user==user.key()@VaultError::NotAuthorized" = internal constant [133 x i8] c"mut,seeds=[UserVault::SEED,user.key().as_ref()],bump=user_vault.bump,constraint=user_vault.user==user.key()@VaultError::NotAuthorized"
@"Program<'info,AssociatedToken>" = internal constant [30 x i8] c"Program<'info,AssociatedToken>"
@associated_token_program = internal constant [24 x i8] c"associated_token_program"
@"Program<'info,Token>" = internal constant [20 x i8] c"Program<'info,Token>"
@token_program = internal constant [13 x i8] c"token_program"
@vault_usdc_ata = internal constant [14 x i8] c"vault_usdc_ata"
@"mut,associated_token::mint=usdc_mint,associated_token::authority=config,constraint=vault_usdc_ata.key()!=user_usdc_ata.key()@VaultError::InvalidAmount" = internal constant [150 x i8] c"mut,associated_token::mint=usdc_mint,associated_token::authority=config,constraint=vault_usdc_ata.key()!=user_usdc_ata.key()@VaultError::InvalidAmount"
@"Box<Account<'info,TokenAccount>>" = internal constant [32 x i8] c"Box<Account<'info,TokenAccount>>"
@user_usdc_ata = internal constant [13 x i8] c"user_usdc_ata"
@"mut,associated_token::mint=usdc_mint,associated_token::authority=user," = internal constant [70 x i8] c"mut,associated_token::mint=usdc_mint,associated_token::authority=user,"
@"Box<Account<'info,UserVault>>" = internal constant [29 x i8] c"Box<Account<'info,UserVault>>"
@user_vault = internal constant [10 x i8] c"user_vault"
@"init_if_needed,payer=user,space=8+UserVault::INIT_SPACE,seeds=[UserVault::SEED,user.key().as_ref()],bump" = internal constant [104 x i8] c"init_if_needed,payer=user,space=8+UserVault::INIT_SPACE,seeds=[UserVault::SEED,user.key().as_ref()],bump"
@"constraint=usdc_mint.key()==config.usdc_mint@VaultError::MintMismatch" = internal constant [69 x i8] c"constraint=usdc_mint.key()==config.usdc_mint@VaultError::MintMismatch"
@"Box<Account<'info,UserMarketCreation>>" = internal constant [38 x i8] c"Box<Account<'info,UserMarketCreation>>"
@user_market_creation = internal constant [20 x i8] c"user_market_creation"
@"init_if_needed,payer=payer,space=8+UserMarketCreation::INIT_SPACE,seeds=[UserMarketCreation::SEED,payer.key().as_ref()],bump" = internal constant [124 x i8] c"init_if_needed,payer=payer,space=8+UserMarketCreation::INIT_SPACE,seeds=[UserMarketCreation::SEED,payer.key().as_ref()],bump"
@"Box<Account<'info,Market>>" = internal constant [26 x i8] c"Box<Account<'info,Market>>"
@"init,payer=payer,space=8+Market::INIT_SPACE,seeds=[Market::SEED,market_uuid.as_ref()],bump" = internal constant [90 x i8] c"init,payer=payer,space=8+Market::INIT_SPACE,seeds=[Market::SEED,market_uuid.as_ref()],bump"
@payer = internal constant [5 x i8] c"payer"
@"mut,close=new_authority,seeds=[AuthorityTransfer::SEED],bump=authority_transfer.bump" = internal constant [84 x i8] c"mut,close=new_authority,seeds=[AuthorityTransfer::SEED],bump=authority_transfer.bump"
@"mut,seeds=[Config::SEED],bump=config.bump" = internal constant [41 x i8] c"mut,seeds=[Config::SEED],bump=config.bump"
@"mut,close=authority,seeds=[AuthorityTransfer::SEED],bump=authority_transfer.bump" = internal constant [80 x i8] c"mut,close=authority,seeds=[AuthorityTransfer::SEED],bump=authority_transfer.bump"
@"Box<Account<'info,AuthorityTransfer>>" = internal constant [37 x i8] c"Box<Account<'info,AuthorityTransfer>>"
@authority_transfer = internal constant [18 x i8] c"authority_transfer"
@"init_if_needed,payer=authority,space=8+AuthorityTransfer::INIT_SPACE,seeds=[AuthorityTransfer::SEED],bump" = internal constant [105 x i8] c"init_if_needed,payer=authority,space=8+AuthorityTransfer::INIT_SPACE,seeds=[AuthorityTransfer::SEED],bump"
@"seeds=[Config::SEED],bump=config.bump" = internal constant [37 x i8] c"seeds=[Config::SEED],bump=config.bump"
@"Program<'info,System>" = internal constant [21 x i8] c"Program<'info,System>"
@system_program = internal constant [14 x i8] c"system_program"
@"Box<Account<'info,Mint>>" = internal constant [24 x i8] c"Box<Account<'info,Mint>>"
@"Box<Account<'info,Config>>" = internal constant [26 x i8] c"Box<Account<'info,Config>>"
@config = internal constant [6 x i8] c"config"
@"init,payer=authority,space=8+Config::INIT_SPACE,seeds=[Config::SEED],bump" = internal constant [73 x i8] c"init,payer=authority,space=8+Config::INIT_SPACE,seeds=[Config::SEED],bump"
@"Account<'info,ProgramData>" = internal constant [26 x i8] c"Account<'info,ProgramData>"
@program_data = internal constant [12 x i8] c"program_data"
@"Program<'info,PredictionMarketVault>" = internal constant [36 x i8] c"Program<'info,PredictionMarketVault>"
@program = internal constant [7 x i8] c"program"
@"constraint=program.programdata_address()?==Some(program_data.key())" = internal constant [67 x i8] c"constraint=program.programdata_address()?==Some(program_data.key())"
@"Signer<'info>" = internal constant [13 x i8] c"Signer<'info>"
@mut = internal constant [3 x i8] c"mut"
@program_id = internal constant [10 x i8] c"program_id"
@"ctx:Context<ClosePosition>" = internal constant [26 x i8] c"ctx:Context<ClosePosition>"
@"ctx:Context<RefundCancelled>" = internal constant [28 x i8] c"ctx:Context<RefundCancelled>"
@"ctx:Context<CollectFees>" = internal constant [24 x i8] c"ctx:Context<CollectFees>"
@"ctx:Context<ClaimWinnings>" = internal constant [26 x i8] c"ctx:Context<ClaimWinnings>"
@"ctx:Context<ResolveMarket>" = internal constant [26 x i8] c"ctx:Context<ResolveMarket>"
@"min_payout_minor:u64" = internal constant [20 x i8] c"min_payout_minor:u64"
@"payout_minor:u64" = internal constant [16 x i8] c"payout_minor:u64"
@"ctx:Context<SellPosition>" = internal constant [25 x i8] c"ctx:Context<SellPosition>"
@"deadline_ts:i64" = internal constant [15 x i8] c"deadline_ts:i64"
@"max_cost_minor:u64" = internal constant [18 x i8] c"max_cost_minor:u64"
@"shares_minor:u64" = internal constant [16 x i8] c"shares_minor:u64"
@"collateral_minor:u64" = internal constant [20 x i8] c"collateral_minor:u64"
@"outcome:u8" = internal constant [10 x i8] c"outcome:u8"
@"ctx:Context<PlaceBet>" = internal constant [21 x i8] c"ctx:Context<PlaceBet>"
@"ctx:Context<Withdraw>" = internal constant [21 x i8] c"ctx:Context<Withdraw>"
@"amount_minor:u64" = internal constant [16 x i8] c"amount_minor:u64"
@"ctx:Context<Deposit>" = internal constant [20 x i8] c"ctx:Context<Deposit>"
@"market_uuid:[u8;16]" = internal constant [19 x i8] c"market_uuid:[u8;16]"
@"ctx:Context<CreateMarket>" = internal constant [25 x i8] c"ctx:Context<CreateMarket>"
@"ctx:Context<AcceptAuthorityTransfer>" = internal constant [36 x i8] c"ctx:Context<AcceptAuthorityTransfer>"
@"ctx:Context<CancelAuthorityTransfer>" = internal constant [36 x i8] c"ctx:Context<CancelAuthorityTransfer>"
@"new_authority:Pubkey" = internal constant [20 x i8] c"new_authority:Pubkey"
@"ctx:Context<SetPendingAuthority>" = internal constant [32 x i8] c"ctx:Context<SetPendingAuthority>"
@"quote_authority:Pubkey" = internal constant [22 x i8] c"quote_authority:Pubkey"
@"ctx:Context<InitializeConfig>" = internal constant [29 x i8] c"ctx:Context<InitializeConfig>"
@"pos.shares_yes==0&&pos.shares_no==0" = internal constant [35 x i8] c"pos.shares_yes==0&&pos.shares_no==0"
@"Context<ClosePosition>" = internal constant [22 x i8] c"Context<ClosePosition>"
@"ctx.accounts.market.outcome==3" = internal constant [30 x i8] c"ctx.accounts.market.outcome==3"
@"Context<RefundCancelled>" = internal constant [24 x i8] c"Context<RefundCancelled>"
@"authority:ctx.accounts.authority.key(),amount_minor,timestamp:now_ts,}" = internal constant [70 x i8] c"authority:ctx.accounts.authority.key(),amount_minor,timestamp:now_ts,}"
@"FeesCollected{market:ctx.accounts.market.key()" = internal constant [46 x i8] c"FeesCollected{market:ctx.accounts.market.key()"
@ctx.accounts.fee_recipient_ata = internal constant [30 x i8] c"ctx.accounts.fee_recipient_ata"
@"amount_minor<=max_collectible" = internal constant [29 x i8] c"amount_minor<=max_collectible"
@max_collectible = internal constant [15 x i8] c"max_collectible"
@ctx.accounts.market_vault_ata.amount = internal constant [36 x i8] c"ctx.accounts.market_vault_ata.amount"
@"remaining_liability==0" = internal constant [22 x i8] c"remaining_liability==0"
@remaining_liability = internal constant [19 x i8] c"remaining_liability"
@liability_shares = internal constant [16 x i8] c"liability_shares"
@"2" = internal constant [1 x i8] c"2"
@"outcome>0" = internal constant [9 x i8] c"outcome>0"
@"Context<CollectFees>" = internal constant [20 x i8] c"Context<CollectFees>"
@"WinningsClaimed{user:ctx.accounts.user.key()" = internal constant [44 x i8] c"WinningsClaimed{user:ctx.accounts.user.key()"
@ctx.accounts.market.total_claimed = internal constant [33 x i8] c"ctx.accounts.market.total_claimed"
@"VaultError::MarketNotResolved" = internal constant [29 x i8] c"VaultError::MarketNotResolved"
@"Context<ClaimWinnings>" = internal constant [22 x i8] c"Context<ClaimWinnings>"
@"VaultError::NoWinningPosition" = internal constant [29 x i8] c"VaultError::NoWinningPosition"
@"s>0" = internal constant [3 x i8] c"s>0"
@s = internal constant [1 x i8] c"s"
@"outcome,timestamp:now_ts,}" = internal constant [26 x i8] c"outcome,timestamp:now_ts,}"
@"MarketResolved{market:ctx.accounts.market.key()" = internal constant [47 x i8] c"MarketResolved{market:ctx.accounts.market.key()"
@ctx.accounts.market.outcome = internal constant [27 x i8] c"ctx.accounts.market.outcome"
@"outcome==1||outcome==2||outcome==3" = internal constant [34 x i8] c"outcome==1||outcome==2||outcome==3"
@"Context<ResolveMarket>" = internal constant [22 x i8] c"Context<ResolveMarket>"
@"market:ctx.accounts.market.key(),outcome,shares_minor,payout_minor,timestamp:now_ts,}" = internal constant [85 x i8] c"market:ctx.accounts.market.key(),outcome,shares_minor,payout_minor,timestamp:now_ts,}"
@"PositionSold{user:ctx.accounts.user.key()" = internal constant [41 x i8] c"PositionSold{user:ctx.accounts.user.key()"
@"[&[Market::SEED,ctx.accounts.market.uuid.as_ref(),&[ctx.accounts.market.bump],]]" = internal constant [80 x i8] c"[&[Market::SEED,ctx.accounts.market.uuid.as_ref(),&[ctx.accounts.market.bump],]]"
@"payout_minor>=min_payout_minor" = internal constant [30 x i8] c"payout_minor>=min_payout_minor"
@"shares_minor>0" = internal constant [14 x i8] c"shares_minor>0"
@min_payout_minor = internal constant [16 x i8] c"min_payout_minor"
@payout_minor = internal constant [12 x i8] c"payout_minor"
@"Context<SellPosition>" = internal constant [21 x i8] c"Context<SellPosition>"
@"pos.shares_no>=shares_minor" = internal constant [27 x i8] c"pos.shares_no>=shares_minor"
@"VaultError::InsufficientShares" = internal constant [30 x i8] c"VaultError::InsufficientShares"
@"pos.shares_yes>=shares_minor" = internal constant [28 x i8] c"pos.shares_yes>=shares_minor"
@"market:ctx.accounts.market.key(),outcome,collateral_minor,shares_minor,timestamp:now_ts,}" = internal constant [89 x i8] c"market:ctx.accounts.market.key(),outcome,collateral_minor,shares_minor,timestamp:now_ts,}"
@"BetPlaced{user:ctx.accounts.user.key()" = internal constant [38 x i8] c"BetPlaced{user:ctx.accounts.user.key()"
@ctx.accounts.market_vault_ata = internal constant [29 x i8] c"ctx.accounts.market_vault_ata"
@pos.bump = internal constant [8 x i8] c"pos.bump"
@ctx.bumps.position = internal constant [18 x i8] c"ctx.bumps.position"
@pos.user = internal constant [8 x i8] c"pos.user"
@pos.market = internal constant [10 x i8] c"pos.market"
@pos = internal constant [3 x i8] c"pos"
@ctx.accounts.position = internal constant [21 x i8] c"ctx.accounts.position"
@"ctx.accounts.quote_authority.key()==ctx.accounts.config.quote_authority" = internal constant [71 x i8] c"ctx.accounts.quote_authority.key()==ctx.accounts.config.quote_authority"
@"VaultError::MarketNotOpen" = internal constant [25 x i8] c"VaultError::MarketNotOpen"
@"ctx.accounts.market.outcome==0" = internal constant [30 x i8] c"ctx.accounts.market.outcome==0"
@"collateral_minor<=max_cost_minor" = internal constant [32 x i8] c"collateral_minor<=max_cost_minor"
@"collateral_minor>0&&shares_minor>0" = internal constant [34 x i8] c"collateral_minor>0&&shares_minor>0"
@"VaultError::InvalidOutcome" = internal constant [26 x i8] c"VaultError::InvalidOutcome"
@"outcome==1||outcome==2" = internal constant [22 x i8] c"outcome==1||outcome==2"
@"VaultError::DeadlineExceeded" = internal constant [28 x i8] c"VaultError::DeadlineExceeded"
@"now_ts<=deadline_ts" = internal constant [19 x i8] c"now_ts<=deadline_ts"
@deadline_ts = internal constant [11 x i8] c"deadline_ts"
@max_cost_minor = internal constant [14 x i8] c"max_cost_minor"
@collateral_minor = internal constant [16 x i8] c"collateral_minor"
@"Context<PlaceBet>" = internal constant [17 x i8] c"Context<PlaceBet>"
@ctx.accounts.market.q_no = internal constant [24 x i8] c"ctx.accounts.market.q_no"
@pos.shares_no = internal constant [13 x i8] c"pos.shares_no"
@ctx.accounts.market.q_yes = internal constant [25 x i8] c"ctx.accounts.market.q_yes"
@shares_minor = internal constant [12 x i8] c"shares_minor"
@pos.shares_yes = internal constant [14 x i8] c"pos.shares_yes"
@"Withdrawn{user:ctx.accounts.user.key()" = internal constant [38 x i8] c"Withdrawn{user:ctx.accounts.user.key()"
@signer_seeds = internal constant [12 x i8] c"signer_seeds"
@"[&[Config::SEED,&[ctx.accounts.config.bump]]]" = internal constant [45 x i8] c"[&[Config::SEED,&[ctx.accounts.config.bump]]]"
@"VaultError::InsufficientBalance" = internal constant [31 x i8] c"VaultError::InsufficientBalance"
@"uv.balance>=amount_minor" = internal constant [24 x i8] c"uv.balance>=amount_minor"
@"Context<Withdraw>" = internal constant [17 x i8] c"Context<Withdraw>"
@"amount_minor,new_balance_minor:uv.balance,timestamp:now_ts,}" = internal constant [60 x i8] c"amount_minor,new_balance_minor:uv.balance,timestamp:now_ts,}"
@"Deposited{user:ctx.accounts.user.key()" = internal constant [38 x i8] c"Deposited{user:ctx.accounts.user.key()"
@uv.balance = internal constant [10 x i8] c"uv.balance"
@uv.bump = internal constant [7 x i8] c"uv.bump"
@ctx.bumps.user_vault = internal constant [20 x i8] c"ctx.bumps.user_vault"
@uv.user = internal constant [7 x i8] c"uv.user"
@uv = internal constant [2 x i8] c"uv"
@ctx.accounts.user_vault = internal constant [23 x i8] c"ctx.accounts.user_vault"
@"6" = internal constant [1 x i8] c"6"
@cpi_ctx = internal constant [7 x i8] c"cpi_ctx"
@ctx.accounts.token_program = internal constant [26 x i8] c"ctx.accounts.token_program"
@cpi_accounts = internal constant [12 x i8] c"cpi_accounts"
@mint = internal constant [4 x i8] c"mint"
@ctx.accounts.user = internal constant [17 x i8] c"ctx.accounts.user"
@to = internal constant [2 x i8] c"to"
@ctx.accounts.vault_usdc_ata = internal constant [27 x i8] c"ctx.accounts.vault_usdc_ata"
@from = internal constant [4 x i8] c"from"
@ctx.accounts.user_usdc_ata = internal constant [26 x i8] c"ctx.accounts.user_usdc_ata"
@"amount_minor>0" = internal constant [14 x i8] c"amount_minor>0"
@amount_minor = internal constant [12 x i8] c"amount_minor"
@"Context<Deposit>" = internal constant [16 x i8] c"Context<Deposit>"
@m.bump = internal constant [6 x i8] c"m.bump"
@ctx.bumps.market = internal constant [16 x i8] c"ctx.bumps.market"
@m.total_claimed = internal constant [15 x i8] c"m.total_claimed"
@m.b = internal constant [3 x i8] c"m.b"
@m.q_no = internal constant [6 x i8] c"m.q_no"
@m.q_yes = internal constant [7 x i8] c"m.q_yes"
@m.outcome = internal constant [9 x i8] c"m.outcome"
@m.uuid = internal constant [6 x i8] c"m.uuid"
@m = internal constant [1 x i8] c"m"
@ctx.accounts.market = internal constant [19 x i8] c"ctx.accounts.market"
@rate.bump = internal constant [9 x i8] c"rate.bump"
@ctx.bumps.user_market_creation = internal constant [30 x i8] c"ctx.bumps.user_market_creation"
@rate.user = internal constant [9 x i8] c"rate.user"
@ctx.accounts.payer = internal constant [18 x i8] c"ctx.accounts.payer"
@packed_state = internal constant [12 x i8] c"packed_state"
@v = internal constant [1 x i8] c"v"
@"10" = internal constant [2 x i8] c"10"
@"1" = internal constant [1 x i8] c"1"
@"VaultError::RateLimitExceeded" = internal constant [29 x i8] c"VaultError::RateLimitExceeded"
@"created_count<MARKET_CREATION_LIMIT" = internal constant [35 x i8] c"created_count<MARKET_CREATION_LIMIT"
@MARKET_CREATION_WINDOW_SECONDS = internal constant [30 x i8] c"MARKET_CREATION_WINDOW_SECONDS"
@"(mutwindow_start_ts,mutcreated_count)" = internal constant [37 x i8] c"(mutwindow_start_ts,mutcreated_count)"
@rate = internal constant [4 x i8] c"rate"
@ctx.accounts.user_market_creation = internal constant [33 x i8] c"ctx.accounts.user_market_creation"
@market_uuid = internal constant [11 x i8] c"market_uuid"
@"Context<CreateMarket>" = internal constant [21 x i8] c"Context<CreateMarket>"
@created_count = internal constant [13 x i8] c"created_count"
@window_start_ts = internal constant [15 x i8] c"window_start_ts"
@"0" = internal constant [1 x i8] c"0"
@"0,0" = internal constant [3 x i8] c"0,0"
@"rate.last_created_ts,1" = internal constant [22 x i8] c"rate.last_created_ts,1"
@"packed/10,packed%10" = internal constant [19 x i8] c"packed/10,packed%10"
@packed = internal constant [6 x i8] c"packed"
@rate.last_created_ts = internal constant [20 x i8] c"rate.last_created_ts"
@ctx.accounts.config.authority = internal constant [29 x i8] c"ctx.accounts.config.authority"
@ctx.accounts.new_authority = internal constant [26 x i8] c"ctx.accounts.new_authority"
@"now_ts>=ready_at" = internal constant [16 x i8] c"now_ts>=ready_at"
@ready_at = internal constant [8 x i8] c"ready_at"
@"VaultError::ArithmeticOverflow" = internal constant [30 x i8] c"VaultError::ArithmeticOverflow"
@AUTHORITY_TRANSFER_DELAY_SECONDS = internal constant [32 x i8] c"AUTHORITY_TRANSFER_DELAY_SECONDS"
@ctx.accounts.authority_transfer.requested_at_ts = internal constant [47 x i8] c"ctx.accounts.authority_transfer.requested_at_ts"
@now_ts = internal constant [6 x i8] c"now_ts"
@"ctx.accounts.authority_transfer.pending_authority==ctx.accounts.new_authority.key()" = internal constant [83 x i8] c"ctx.accounts.authority_transfer.pending_authority==ctx.accounts.new_authority.key()"
@"Context<AcceptAuthorityTransfer>" = internal constant [32 x i8] c"Context<AcceptAuthorityTransfer>"
@"Context<CancelAuthorityTransfer>" = internal constant [32 x i8] c"Context<CancelAuthorityTransfer>"
@transfer.bump = internal constant [13 x i8] c"transfer.bump"
@ctx.bumps.authority_transfer = internal constant [28 x i8] c"ctx.bumps.authority_transfer"
@transfer.requested_at_ts = internal constant [24 x i8] c"transfer.requested_at_ts"
@"Clock::get()?.unix_timestamp" = internal constant [28 x i8] c"Clock::get()?.unix_timestamp"
@transfer.pending_authority = internal constant [26 x i8] c"transfer.pending_authority"
@transfer = internal constant [8 x i8] c"transfer"
@ctx.accounts.authority_transfer = internal constant [31 x i8] c"ctx.accounts.authority_transfer"
@"VaultError::InvalidAuthority" = internal constant [28 x i8] c"VaultError::InvalidAuthority"
@"new_authority!=Pubkey::default()" = internal constant [32 x i8] c"new_authority!=Pubkey::default()"
@"ctx.accounts.authority.key()==ctx.accounts.config.authority" = internal constant [59 x i8] c"ctx.accounts.authority.key()==ctx.accounts.config.authority"
@new_authority = internal constant [13 x i8] c"new_authority"
@"Context<SetPendingAuthority>" = internal constant [28 x i8] c"Context<SetPendingAuthority>"
@"()" = internal constant [2 x i8] c"()"
@cfg.bump = internal constant [8 x i8] c"cfg.bump"
@ctx.bumps.config = internal constant [16 x i8] c"ctx.bumps.config"
@cfg.usdc_mint = internal constant [13 x i8] c"cfg.usdc_mint"
@ctx.accounts.usdc_mint = internal constant [22 x i8] c"ctx.accounts.usdc_mint"
@cfg.quote_authority = internal constant [19 x i8] c"cfg.quote_authority"
@cfg.authority = internal constant [13 x i8] c"cfg.authority"
@ctx.accounts.authority = internal constant [22 x i8] c"ctx.accounts.authority"
@cfg = internal constant [3 x i8] c"cfg"
@ctx.accounts.config = internal constant [19 x i8] c"ctx.accounts.config"
@"VaultError::InvalidAmount" = internal constant [25 x i8] c"VaultError::InvalidAmount"
@"ctx.accounts.usdc_mint.decimals==6" = internal constant [34 x i8] c"ctx.accounts.usdc_mint.decimals==6"
@"VaultError::NotAuthorized" = internal constant [25 x i8] c"VaultError::NotAuthorized"
@"ctx.accounts.program_data.upgrade_authority_address==Some(ctx.accounts.authority.key())" = internal constant [87 x i8] c"ctx.accounts.program_data.upgrade_authority_address==Some(ctx.accounts.authority.key())"
@"Context<InitializeConfig>" = internal constant [25 x i8] c"Context<InitializeConfig>"
@ctx = internal constant [3 x i8] c"ctx"
@shares_no = internal constant [9 x i8] c"shares_no"
@shares_yes = internal constant [10 x i8] c"shares_yes"
@market = internal constant [6 x i8] c"market"
@total_claimed = internal constant [13 x i8] c"total_claimed"
@b = internal constant [1 x i8] c"b"
@q_no = internal constant [4 x i8] c"q_no"
@q_yes = internal constant [5 x i8] c"q_yes"
@outcome = internal constant [7 x i8] c"outcome"
@"[u8;16]" = internal constant [7 x i8] c"[u8;16]"
@uuid = internal constant [4 x i8] c"uuid"
@last_created_ts = internal constant [15 x i8] c"last_created_ts"
@u64 = internal constant [3 x i8] c"u64"
@balance = internal constant [7 x i8] c"balance"
@user = internal constant [4 x i8] c"user"
@i64 = internal constant [3 x i8] c"i64"
@requested_at_ts = internal constant [15 x i8] c"requested_at_ts"
@pending_authority = internal constant [17 x i8] c"pending_authority"
@u8 = internal constant [2 x i8] c"u8"
@bump = internal constant [4 x i8] c"bump"
@usdc_mint = internal constant [9 x i8] c"usdc_mint"
@quote_authority = internal constant [15 x i8] c"quote_authority"
@Pubkey = internal constant [6 x i8] c"Pubkey"
@authority = internal constant [9 x i8] c"authority"
@"*i8" = internal constant [3 x i8] c"*i8"
@parser.error = internal constant [12 x i8] c"parser.error"
@"5NhVm566owfbBC38poCjtpyXSr7iYwMxUb6fJd4BagbR" = internal constant [44 x i8] c"5NhVm566owfbBC38poCjtpyXSr7iYwMxUb6fJd4BagbR"
@"8.0.0" = internal constant [5 x i8] c"8.0.0"
@dependencies.spl-token.version = internal constant [30 x i8] c"dependencies.spl-token.version"
@dependencies.anchor-spl.version = internal constant [31 x i8] c"dependencies.anchor-spl.version"
@"0.32.1" = internal constant [6 x i8] c"0.32.1"
@dependencies.anchor-lang.version = internal constant [32 x i8] c"dependencies.anchor-lang.version"

declare i8* @malloc(i64)

declare void @free(i8*)

declare i8* @sol.model.struct.constraint(i8*)

declare i8* @sol.close_position.1(i8*)

declare i8* @sol.refund_cancelled.2(i8*, i8*)

declare i8* @sol.collect_fees.2(i8*, i8*)

declare i8* @sol.claim_winnings.2(i8*, i8*)

declare i8* @sol.resolve_market.2(i8*, i8*)

declare i8* @sol.sell_position.6(i8*, i8*, i8*, i8*, i8*, i8*)

declare i8* @sol.place_bet.6(i8*, i8*, i8*, i8*, i8*, i8*)

declare i8* @sol.withdraw.2(i8*, i8*)

declare i8* @sol.deposit.2(i8*, i8*)

declare i8* @sol.create_market.2(i8*, i8*)

declare i8* @sol.accept_authority_transfer.1(i8*)

declare i8* @sol.cancel_authority_transfer.1(i8*)

declare i8* @sol.set_pending_authority.2(i8*, i8*)

declare i8* @sol.initialize_config.2(i8*, i8*)

declare i8* @sol.unwrap_or.2(i8*, i8*)

declare i8* @"sol.lib::collect_fees.anon.3"(i8*)

declare i8* @"sol.lib::collect_fees.anon.2"(i8*)

declare i8* @"sol.lib::collect_fees.anon.1"(i8*)

declare i8* @"sol.lib::claim_winnings.anon.2"(i8*)

declare i8* @"sol.lib::claim_winnings.anon.1"(i8*)

declare i8* @"sol.lib::sell_position.anon.2"(i8*)

declare i8* @"sol.lib::sell_position.anon.1"(i8*)

declare i8* @"sol.lib::place_bet.anon.2"(i8*)

declare i8* @"sol.lib::place_bet.anon.1"(i8*)

declare i8* @"sol.CpiContext::new_with_signer.3"(i8*, i8*, i8*)

declare i8* @sol.checked_sub.2(i8*, i8*)

declare i8* @"sol.emit.!2"(i8*, i8*)

declare i8* @"sol.token::transfer_checked.3"(i8*, i8*, i8*)

declare i8* @"sol.CpiContext::new.2"(i8*, i8*)

declare i8* @sol.model.struct.new.TransferChecked.4(i8*, i8*, i8*, i8*)

declare i8* @sol.to_account_info.1(i8*)

declare i8* @sol.and_then.2(i8*, i8*)

declare i8* @sol.checked_mul.2(i8*, i8*)

declare i8* @"sol.lib::create_market.anon.6"(i8*)

declare i8* @"sol.=="(i8*, i8*)

declare i8* @"sol.lib::create_market.anon.5"(i8*)

declare i8* @"sol.&&"(i8*, i8*)

declare i8* @"sol.>="(i8*, i8*)

declare i8* @sol.-(i8*, i8*)

declare i8* @"sol.!="(i8*, i8*)

declare i8* @"sol.lib::create_market.anon.4"(i8*)

declare i8* @sol.ifTrueFalse.anon.(i8*, i8*)

declare i8* @sol.ifFalse.anon.(i8*)

declare i8* @"sol.lib::create_market.anon.3"(i8*)

declare i8* @"sol.lib::create_market.anon.2"(i8*)

declare i8* @"sol.>"(i8*, i8*)

declare i8* @sol.ifTrue.anon.(i8*)

declare i8* @"sol.lib::create_market.anon.1"(i8*)

declare i8* @sol.if(i8*)

declare i8* @"sol.<"(i8*, i8*)

declare i8* @sol.checked_neg.1(i8*)

declare i8* @sol.ok_or.2(i8*, i8*)

declare i8* @sol.checked_add.2(i8*, i8*)

declare i8* @sol.Ok.1(i8*)

declare i8* @sol.key.1(i8*)

declare void @sol.model.opaqueAssign(i8*, i8*)

declare i8* @"sol.require.!2"(i8*, i8*)

declare i8* @sol.model.struct.field(i8*, i8*)

declare i8* @sol.model.funcArg(i8*, i8*)

declare i8* @sol.model.declare_id(i8*)

declare i8* @sol.model.toml(i8*, i8*)

define i64 @sol.model.cargo.toml(i8* %0) !dbg !3 {
  %2 = call i8* @sol.model.toml(i8* getelementptr inbounds ([32 x i8], [32 x i8]* @dependencies.anchor-lang.version, i64 0, i64 0), i8* getelementptr inbounds ([6 x i8], [6 x i8]* @"0.32.1", i64 0, i64 0)), !dbg !7
  %3 = call i8* @sol.model.toml(i8* getelementptr inbounds ([31 x i8], [31 x i8]* @dependencies.anchor-spl.version, i64 0, i64 0), i8* getelementptr inbounds ([6 x i8], [6 x i8]* @"0.32.1", i64 0, i64 0)), !dbg !7
  %4 = call i8* @sol.model.toml(i8* getelementptr inbounds ([30 x i8], [30 x i8]* @dependencies.spl-token.version, i64 0, i64 0), i8* getelementptr inbounds ([5 x i8], [5 x i8]* @"8.0.0", i64 0, i64 0)), !dbg !7
  ret i64 0, !dbg !10
}

define i64 @sol.model.declare_id.address(i8* %0) !dbg !12 {
  %2 = call i8* @sol.model.declare_id(i8* getelementptr inbounds ([44 x i8], [44 x i8]* @"5NhVm566owfbBC38poCjtpyXSr7iYwMxUb6fJd4BagbR", i64 0, i64 0)), !dbg !13
  ret i64 0, !dbg !16
}

define i8* @sol.model.struct.anchor.Config(i8* %0) !dbg !18 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !20
  %3 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0), i8* getelementptr inbounds ([6 x i8], [6 x i8]* @Pubkey, i64 0, i64 0)), !dbg !22
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @quote_authority, i64 0, i64 0), i8* getelementptr inbounds ([6 x i8], [6 x i8]* @Pubkey, i64 0, i64 0)), !dbg !23
  %5 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @usdc_mint, i64 0, i64 0), i8* getelementptr inbounds ([6 x i8], [6 x i8]* @Pubkey, i64 0, i64 0)), !dbg !24
  %6 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @bump, i64 0, i64 0), i8* getelementptr inbounds ([2 x i8], [2 x i8]* @u8, i64 0, i64 0)), !dbg !25
  ret i8* %0, !dbg !20
}

define i8* @sol.model.struct.Config(i8* %0) !dbg !26 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !27
  %3 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0), i8* getelementptr inbounds ([6 x i8], [6 x i8]* @Pubkey, i64 0, i64 0)), !dbg !29
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @quote_authority, i64 0, i64 0), i8* getelementptr inbounds ([6 x i8], [6 x i8]* @Pubkey, i64 0, i64 0)), !dbg !30
  %5 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @usdc_mint, i64 0, i64 0), i8* getelementptr inbounds ([6 x i8], [6 x i8]* @Pubkey, i64 0, i64 0)), !dbg !31
  %6 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @bump, i64 0, i64 0), i8* getelementptr inbounds ([2 x i8], [2 x i8]* @u8, i64 0, i64 0)), !dbg !32
  ret i8* %0, !dbg !27
}

define i8* @sol.model.struct.anchor.AuthorityTransfer(i8* %0) !dbg !33 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !34
  %3 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @pending_authority, i64 0, i64 0), i8* getelementptr inbounds ([6 x i8], [6 x i8]* @Pubkey, i64 0, i64 0)), !dbg !36
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @requested_at_ts, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @i64, i64 0, i64 0)), !dbg !37
  %5 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @bump, i64 0, i64 0), i8* getelementptr inbounds ([2 x i8], [2 x i8]* @u8, i64 0, i64 0)), !dbg !38
  ret i8* %0, !dbg !34
}

define i8* @sol.model.struct.AuthorityTransfer(i8* %0) !dbg !39 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !40
  %3 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @pending_authority, i64 0, i64 0), i8* getelementptr inbounds ([6 x i8], [6 x i8]* @Pubkey, i64 0, i64 0)), !dbg !42
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @requested_at_ts, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @i64, i64 0, i64 0)), !dbg !43
  %5 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @bump, i64 0, i64 0), i8* getelementptr inbounds ([2 x i8], [2 x i8]* @u8, i64 0, i64 0)), !dbg !44
  ret i8* %0, !dbg !40
}

define i8* @sol.model.struct.anchor.UserVault(i8* %0) !dbg !45 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !46
  %3 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @user, i64 0, i64 0), i8* getelementptr inbounds ([6 x i8], [6 x i8]* @Pubkey, i64 0, i64 0)), !dbg !48
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @balance, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !49
  %5 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @bump, i64 0, i64 0), i8* getelementptr inbounds ([2 x i8], [2 x i8]* @u8, i64 0, i64 0)), !dbg !50
  ret i8* %0, !dbg !46
}

define i8* @sol.model.struct.UserVault(i8* %0) !dbg !51 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !52
  %3 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @user, i64 0, i64 0), i8* getelementptr inbounds ([6 x i8], [6 x i8]* @Pubkey, i64 0, i64 0)), !dbg !54
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @balance, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !55
  %5 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @bump, i64 0, i64 0), i8* getelementptr inbounds ([2 x i8], [2 x i8]* @u8, i64 0, i64 0)), !dbg !56
  ret i8* %0, !dbg !52
}

define i8* @sol.model.struct.anchor.UserMarketCreation(i8* %0) !dbg !57 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !58
  %3 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @user, i64 0, i64 0), i8* getelementptr inbounds ([6 x i8], [6 x i8]* @Pubkey, i64 0, i64 0)), !dbg !60
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @last_created_ts, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @i64, i64 0, i64 0)), !dbg !61
  %5 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @bump, i64 0, i64 0), i8* getelementptr inbounds ([2 x i8], [2 x i8]* @u8, i64 0, i64 0)), !dbg !62
  ret i8* %0, !dbg !58
}

define i8* @sol.model.struct.UserMarketCreation(i8* %0) !dbg !63 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !64
  %3 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @user, i64 0, i64 0), i8* getelementptr inbounds ([6 x i8], [6 x i8]* @Pubkey, i64 0, i64 0)), !dbg !66
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @last_created_ts, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @i64, i64 0, i64 0)), !dbg !67
  %5 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @bump, i64 0, i64 0), i8* getelementptr inbounds ([2 x i8], [2 x i8]* @u8, i64 0, i64 0)), !dbg !68
  ret i8* %0, !dbg !64
}

define i8* @sol.model.struct.anchor.Market(i8* %0) !dbg !69 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !70
  %3 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @uuid, i64 0, i64 0), i8* getelementptr inbounds ([7 x i8], [7 x i8]* @"[u8;16]", i64 0, i64 0)), !dbg !72
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @outcome, i64 0, i64 0), i8* getelementptr inbounds ([2 x i8], [2 x i8]* @u8, i64 0, i64 0)), !dbg !73
  %5 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @q_yes, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !74
  %6 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @q_no, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !75
  %7 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([1 x i8], [1 x i8]* @b, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !76
  %8 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @total_claimed, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !77
  %9 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @bump, i64 0, i64 0), i8* getelementptr inbounds ([2 x i8], [2 x i8]* @u8, i64 0, i64 0)), !dbg !78
  ret i8* %0, !dbg !70
}

define i8* @sol.model.struct.Market(i8* %0) !dbg !79 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !80
  %3 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @uuid, i64 0, i64 0), i8* getelementptr inbounds ([7 x i8], [7 x i8]* @"[u8;16]", i64 0, i64 0)), !dbg !82
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @outcome, i64 0, i64 0), i8* getelementptr inbounds ([2 x i8], [2 x i8]* @u8, i64 0, i64 0)), !dbg !83
  %5 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @q_yes, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !84
  %6 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @q_no, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !85
  %7 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([1 x i8], [1 x i8]* @b, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !86
  %8 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @total_claimed, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !87
  %9 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @bump, i64 0, i64 0), i8* getelementptr inbounds ([2 x i8], [2 x i8]* @u8, i64 0, i64 0)), !dbg !88
  ret i8* %0, !dbg !80
}

define i8* @sol.model.struct.anchor.Position(i8* %0) !dbg !89 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !90
  %3 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @market, i64 0, i64 0), i8* getelementptr inbounds ([6 x i8], [6 x i8]* @Pubkey, i64 0, i64 0)), !dbg !92
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @user, i64 0, i64 0), i8* getelementptr inbounds ([6 x i8], [6 x i8]* @Pubkey, i64 0, i64 0)), !dbg !93
  %5 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @shares_yes, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !94
  %6 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @shares_no, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !95
  %7 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @bump, i64 0, i64 0), i8* getelementptr inbounds ([2 x i8], [2 x i8]* @u8, i64 0, i64 0)), !dbg !96
  ret i8* %0, !dbg !90
}

define i8* @sol.model.struct.Position(i8* %0) !dbg !97 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !98
  %3 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @market, i64 0, i64 0), i8* getelementptr inbounds ([6 x i8], [6 x i8]* @Pubkey, i64 0, i64 0)), !dbg !100
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @user, i64 0, i64 0), i8* getelementptr inbounds ([6 x i8], [6 x i8]* @Pubkey, i64 0, i64 0)), !dbg !101
  %5 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @shares_yes, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !102
  %6 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @shares_no, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !103
  %7 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @bump, i64 0, i64 0), i8* getelementptr inbounds ([2 x i8], [2 x i8]* @u8, i64 0, i64 0)), !dbg !104
  ret i8* %0, !dbg !98
}

define i8* @"lib::initialize_config.2"(i8* %0, i8* %1) !dbg !105 {
  %3 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @"Context<InitializeConfig>", i64 0, i64 0)), !dbg !106
  %4 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @quote_authority, i64 0, i64 0), i8* getelementptr inbounds ([6 x i8], [6 x i8]* @Pubkey, i64 0, i64 0)), !dbg !106
  %5 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([87 x i8], [87 x i8]* @"ctx.accounts.program_data.upgrade_authority_address==Some(ctx.accounts.authority.key())", i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @"VaultError::NotAuthorized", i64 0, i64 0)), !dbg !108
  %6 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([34 x i8], [34 x i8]* @"ctx.accounts.usdc_mint.decimals==6", i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @"VaultError::InvalidAmount", i64 0, i64 0)), !dbg !109
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @cfg, i64 0, i64 0), i8* getelementptr inbounds ([19 x i8], [19 x i8]* @ctx.accounts.config, i64 0, i64 0)), !dbg !110
  %7 = call i8* @sol.key.1(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @ctx.accounts.authority, i64 0, i64 0)), !dbg !111
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @cfg.authority, i64 0, i64 0), i8* %7), !dbg !112
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([19 x i8], [19 x i8]* @cfg.quote_authority, i64 0, i64 0), i8* %1), !dbg !113
  %8 = call i8* @sol.key.1(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @ctx.accounts.usdc_mint, i64 0, i64 0)), !dbg !114
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @cfg.usdc_mint, i64 0, i64 0), i8* %8), !dbg !115
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([8 x i8], [8 x i8]* @cfg.bump, i64 0, i64 0), i8* getelementptr inbounds ([16 x i8], [16 x i8]* @ctx.bumps.config, i64 0, i64 0)), !dbg !116
  %9 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !117
  ret i8* %0, !dbg !106
}

define i8* @"lib::set_pending_authority.2"(i8* %0, i8* %1) !dbg !118 {
  %3 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"Context<SetPendingAuthority>", i64 0, i64 0)), !dbg !119
  %4 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @new_authority, i64 0, i64 0), i8* getelementptr inbounds ([6 x i8], [6 x i8]* @Pubkey, i64 0, i64 0)), !dbg !119
  %5 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([59 x i8], [59 x i8]* @"ctx.accounts.authority.key()==ctx.accounts.config.authority", i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @"VaultError::NotAuthorized", i64 0, i64 0)), !dbg !121
  %6 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([32 x i8], [32 x i8]* @"new_authority!=Pubkey::default()", i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"VaultError::InvalidAuthority", i64 0, i64 0)), !dbg !122
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([8 x i8], [8 x i8]* @transfer, i64 0, i64 0), i8* getelementptr inbounds ([31 x i8], [31 x i8]* @ctx.accounts.authority_transfer, i64 0, i64 0)), !dbg !123
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([26 x i8], [26 x i8]* @transfer.pending_authority, i64 0, i64 0), i8* %1), !dbg !124
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([24 x i8], [24 x i8]* @transfer.requested_at_ts, i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"Clock::get()?.unix_timestamp", i64 0, i64 0)), !dbg !125
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @transfer.bump, i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @ctx.bumps.authority_transfer, i64 0, i64 0)), !dbg !126
  %7 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !127
  ret i8* %0, !dbg !119
}

define i8* @"lib::cancel_authority_transfer.1"(i8* %0) !dbg !128 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([32 x i8], [32 x i8]* @"Context<CancelAuthorityTransfer>", i64 0, i64 0)), !dbg !129
  %3 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([59 x i8], [59 x i8]* @"ctx.accounts.authority.key()==ctx.accounts.config.authority", i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @"VaultError::NotAuthorized", i64 0, i64 0)), !dbg !131
  %4 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !132
  ret i8* %0, !dbg !129
}

define i8* @"lib::accept_authority_transfer.1"(i8* %0) !dbg !133 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([32 x i8], [32 x i8]* @"Context<AcceptAuthorityTransfer>", i64 0, i64 0)), !dbg !134
  %3 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([83 x i8], [83 x i8]* @"ctx.accounts.authority_transfer.pending_authority==ctx.accounts.new_authority.key()", i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @"VaultError::NotAuthorized", i64 0, i64 0)), !dbg !136
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @now_ts, i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"Clock::get()?.unix_timestamp", i64 0, i64 0)), !dbg !137
  %4 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([47 x i8], [47 x i8]* @ctx.accounts.authority_transfer.requested_at_ts, i64 0, i64 0), i8* getelementptr inbounds ([32 x i8], [32 x i8]* @AUTHORITY_TRANSFER_DELAY_SECONDS, i64 0, i64 0)), !dbg !138
  %5 = call i8* @sol.ok_or.2(i8* %4, i8* getelementptr inbounds ([30 x i8], [30 x i8]* @"VaultError::ArithmeticOverflow", i64 0, i64 0)), !dbg !139
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([8 x i8], [8 x i8]* @ready_at, i64 0, i64 0), i8* %5), !dbg !140
  %6 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @"now_ts>=ready_at", i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @"VaultError::NotAuthorized", i64 0, i64 0)), !dbg !141
  %7 = call i8* @sol.key.1(i8* getelementptr inbounds ([26 x i8], [26 x i8]* @ctx.accounts.new_authority, i64 0, i64 0)), !dbg !142
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([29 x i8], [29 x i8]* @ctx.accounts.config.authority, i64 0, i64 0), i8* %7), !dbg !143
  %8 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !144
  ret i8* %0, !dbg !134
}

define i8* @"lib::create_market.anon.1"(i8* %0) !dbg !145 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !146
  %3 = call i8* @sol.checked_neg.1(i8* getelementptr inbounds ([20 x i8], [20 x i8]* @rate.last_created_ts, i64 0, i64 0)), !dbg !148
  %4 = call i8* @sol.ok_or.2(i8* %3, i8* getelementptr inbounds ([30 x i8], [30 x i8]* @"VaultError::ArithmeticOverflow", i64 0, i64 0)), !dbg !149
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @packed, i64 0, i64 0), i8* %4), !dbg !150
  ret i8* %0, !dbg !146
}

define i8* @"lib::create_market.anon.2"(i8* %0) !dbg !151 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !152
  ret i8* %0, !dbg !152
}

define i8* @"lib::create_market.anon.3"(i8* %0) !dbg !154 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !155
  ret i8* %0, !dbg !155
}

define i8* @"lib::create_market.anon.4"(i8* %0) !dbg !157 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !158
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @window_start_ts, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !160
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @created_count, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !161
  ret i8* %0, !dbg !158
}

define i8* @"lib::create_market.anon.5"(i8* %0) !dbg !162 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !163
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @window_start_ts, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !165
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @created_count, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !166
  ret i8* %0, !dbg !163
}

define i8* @"lib::create_market.anon.6"(i8* %0) !dbg !167 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !168
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @window_start_ts, i64 0, i64 0), i8* getelementptr inbounds ([6 x i8], [6 x i8]* @now_ts, i64 0, i64 0)), !dbg !170
  ret i8* %0, !dbg !168
}

define i8* @"lib::create_market.2"(i8* %0, i8* %1) !dbg !171 {
  %3 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"Context<CreateMarket>", i64 0, i64 0)), !dbg !172
  %4 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @market_uuid, i64 0, i64 0), i8* getelementptr inbounds ([7 x i8], [7 x i8]* @"[u8;16]", i64 0, i64 0)), !dbg !172
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @now_ts, i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"Clock::get()?.unix_timestamp", i64 0, i64 0)), !dbg !174
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @rate, i64 0, i64 0), i8* getelementptr inbounds ([33 x i8], [33 x i8]* @ctx.accounts.user_market_creation, i64 0, i64 0)), !dbg !175
  %5 = call i8* @"sol.<"(i8* getelementptr inbounds ([20 x i8], [20 x i8]* @rate.last_created_ts, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !176
  %6 = call i8* @sol.if(i8* %5), !dbg !177
  %7 = call i8* @"sol.lib::create_market.anon.1"(i8* %6), !dbg !178
  %8 = call i8* @sol.ifTrue.anon.(i8* %7), !dbg !178
  %9 = call i8* @"sol.>"(i8* getelementptr inbounds ([20 x i8], [20 x i8]* @rate.last_created_ts, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !179
  %10 = call i8* @sol.if(i8* %9), !dbg !180
  %11 = call i8* @"sol.lib::create_market.anon.2"(i8* %10), !dbg !181
  %12 = call i8* @sol.ifTrue.anon.(i8* %11), !dbg !181
  %13 = call i8* @"sol.lib::create_market.anon.3"(i8* %12), !dbg !182
  %14 = call i8* @sol.ifFalse.anon.(i8* %13), !dbg !182
  %15 = call i8* @sol.ifTrueFalse.anon.(i8* %8, i8* %14), !dbg !180
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([37 x i8], [37 x i8]* @"(mutwindow_start_ts,mutcreated_count)", i64 0, i64 0), i8* %15), !dbg !183
  %16 = call i8* @"sol.>"(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @window_start_ts, i64 0, i64 0), i8* getelementptr inbounds ([6 x i8], [6 x i8]* @now_ts, i64 0, i64 0)), !dbg !184
  %17 = call i8* @sol.if(i8* %16), !dbg !185
  %18 = call i8* @"sol.lib::create_market.anon.4"(i8* %17), !dbg !186
  %19 = call i8* @sol.ifTrue.anon.(i8* %18), !dbg !186
  %20 = call i8* @"sol.!="(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @window_start_ts, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !187
  %21 = call i8* @sol.-(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @now_ts, i64 0, i64 0), i8* getelementptr inbounds ([15 x i8], [15 x i8]* @window_start_ts, i64 0, i64 0)), !dbg !188
  %22 = call i8* @"sol.>="(i8* %21, i8* getelementptr inbounds ([30 x i8], [30 x i8]* @MARKET_CREATION_WINDOW_SECONDS, i64 0, i64 0)), !dbg !188
  %23 = call i8* @"sol.&&"(i8* %20, i8* %22), !dbg !187
  %24 = call i8* @sol.if(i8* %23), !dbg !189
  %25 = call i8* @"sol.lib::create_market.anon.5"(i8* %24), !dbg !190
  %26 = call i8* @sol.ifTrue.anon.(i8* %25), !dbg !190
  %27 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([35 x i8], [35 x i8]* @"created_count<MARKET_CREATION_LIMIT", i64 0, i64 0), i8* getelementptr inbounds ([29 x i8], [29 x i8]* @"VaultError::RateLimitExceeded", i64 0, i64 0)), !dbg !191
  %28 = call i8* @"sol.=="(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @window_start_ts, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !192
  %29 = call i8* @sol.if(i8* %28), !dbg !193
  %30 = call i8* @"sol.lib::create_market.anon.6"(i8* %29), !dbg !194
  %31 = call i8* @sol.ifTrue.anon.(i8* %30), !dbg !194
  %32 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @created_count, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"1", i64 0, i64 0)), !dbg !195
  %33 = call i8* @sol.ok_or.2(i8* %32, i8* getelementptr inbounds ([30 x i8], [30 x i8]* @"VaultError::ArithmeticOverflow", i64 0, i64 0)), !dbg !196
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @created_count, i64 0, i64 0), i8* %33), !dbg !197
  %34 = call i8* @sol.checked_mul.2(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @window_start_ts, i64 0, i64 0), i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"10", i64 0, i64 0)), !dbg !198
  %35 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([1 x i8], [1 x i8]* @v, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @created_count, i64 0, i64 0)), !dbg !199
  %36 = call i8* @sol.and_then.2(i8* %34, i8* %35), !dbg !200
  %37 = call i8* @sol.checked_neg.1(i8* getelementptr inbounds ([1 x i8], [1 x i8]* @v, i64 0, i64 0)), !dbg !201
  %38 = call i8* @sol.and_then.2(i8* %36, i8* %37), !dbg !202
  %39 = call i8* @sol.ok_or.2(i8* %38, i8* getelementptr inbounds ([30 x i8], [30 x i8]* @"VaultError::ArithmeticOverflow", i64 0, i64 0)), !dbg !203
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @packed_state, i64 0, i64 0), i8* %39), !dbg !204
  %40 = call i8* @sol.key.1(i8* getelementptr inbounds ([18 x i8], [18 x i8]* @ctx.accounts.payer, i64 0, i64 0)), !dbg !205
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @rate.user, i64 0, i64 0), i8* %40), !dbg !206
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([20 x i8], [20 x i8]* @rate.last_created_ts, i64 0, i64 0), i8* getelementptr inbounds ([12 x i8], [12 x i8]* @packed_state, i64 0, i64 0)), !dbg !207
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @rate.bump, i64 0, i64 0), i8* getelementptr inbounds ([30 x i8], [30 x i8]* @ctx.bumps.user_market_creation, i64 0, i64 0)), !dbg !208
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([1 x i8], [1 x i8]* @m, i64 0, i64 0), i8* getelementptr inbounds ([19 x i8], [19 x i8]* @ctx.accounts.market, i64 0, i64 0)), !dbg !209
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @m.uuid, i64 0, i64 0), i8* %1), !dbg !210
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @m.outcome, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !211
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @m.q_yes, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !212
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @m.q_no, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !213
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @m.b, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !214
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @m.total_claimed, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !215
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @m.bump, i64 0, i64 0), i8* getelementptr inbounds ([16 x i8], [16 x i8]* @ctx.bumps.market, i64 0, i64 0)), !dbg !216
  %41 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !217
  ret i8* %0, !dbg !172
}

define i8* @"lib::deposit.2"(i8* %0, i8* %1) !dbg !218 {
  %3 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([16 x i8], [16 x i8]* @"Context<Deposit>", i64 0, i64 0)), !dbg !219
  %4 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @amount_minor, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !219
  %5 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @"amount_minor>0", i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @"VaultError::InvalidAmount", i64 0, i64 0)), !dbg !221
  %6 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([26 x i8], [26 x i8]* @ctx.accounts.user_usdc_ata, i64 0, i64 0)), !dbg !222
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @from, i64 0, i64 0), i8* %6), !dbg !223
  %7 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([27 x i8], [27 x i8]* @ctx.accounts.vault_usdc_ata, i64 0, i64 0)), !dbg !224
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @to, i64 0, i64 0), i8* %7), !dbg !225
  %8 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @ctx.accounts.user, i64 0, i64 0)), !dbg !226
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0), i8* %8), !dbg !227
  %9 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @ctx.accounts.usdc_mint, i64 0, i64 0)), !dbg !228
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @mint, i64 0, i64 0), i8* %9), !dbg !229
  %10 = call i8* @sol.model.struct.new.TransferChecked.4(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @from, i64 0, i64 0), i8* getelementptr inbounds ([2 x i8], [2 x i8]* @to, i64 0, i64 0), i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @mint, i64 0, i64 0)), !dbg !230
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @cpi_accounts, i64 0, i64 0), i8* %10), !dbg !231
  %11 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([26 x i8], [26 x i8]* @ctx.accounts.token_program, i64 0, i64 0)), !dbg !232
  %12 = call i8* @"sol.CpiContext::new.2"(i8* %11, i8* getelementptr inbounds ([12 x i8], [12 x i8]* @cpi_accounts, i64 0, i64 0)), !dbg !233
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @cpi_ctx, i64 0, i64 0), i8* %12), !dbg !234
  %13 = call i8* @"sol.token::transfer_checked.3"(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @cpi_ctx, i64 0, i64 0), i8* %1, i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"6", i64 0, i64 0)), !dbg !235
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @uv, i64 0, i64 0), i8* getelementptr inbounds ([23 x i8], [23 x i8]* @ctx.accounts.user_vault, i64 0, i64 0)), !dbg !236
  %14 = call i8* @sol.key.1(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @ctx.accounts.user, i64 0, i64 0)), !dbg !237
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @uv.user, i64 0, i64 0), i8* %14), !dbg !238
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @uv.bump, i64 0, i64 0), i8* getelementptr inbounds ([20 x i8], [20 x i8]* @ctx.bumps.user_vault, i64 0, i64 0)), !dbg !239
  %15 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @uv.balance, i64 0, i64 0), i8* %1), !dbg !240
  %16 = call i8* @sol.ok_or.2(i8* %15, i8* getelementptr inbounds ([30 x i8], [30 x i8]* @"VaultError::ArithmeticOverflow", i64 0, i64 0)), !dbg !241
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @uv.balance, i64 0, i64 0), i8* %16), !dbg !242
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @now_ts, i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"Clock::get()?.unix_timestamp", i64 0, i64 0)), !dbg !243
  %17 = call i8* @"sol.emit.!2"(i8* getelementptr inbounds ([38 x i8], [38 x i8]* @"Deposited{user:ctx.accounts.user.key()", i64 0, i64 0), i8* getelementptr inbounds ([60 x i8], [60 x i8]* @"amount_minor,new_balance_minor:uv.balance,timestamp:now_ts,}", i64 0, i64 0)), !dbg !244
  %18 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !245
  ret i8* %0, !dbg !219
}

define i8* @"lib::withdraw.2"(i8* %0, i8* %1) !dbg !246 {
  %3 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([17 x i8], [17 x i8]* @"Context<Withdraw>", i64 0, i64 0)), !dbg !247
  %4 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @amount_minor, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !247
  %5 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @"amount_minor>0", i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @"VaultError::InvalidAmount", i64 0, i64 0)), !dbg !249
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @uv, i64 0, i64 0), i8* getelementptr inbounds ([23 x i8], [23 x i8]* @ctx.accounts.user_vault, i64 0, i64 0)), !dbg !250
  %6 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([24 x i8], [24 x i8]* @"uv.balance>=amount_minor", i64 0, i64 0), i8* getelementptr inbounds ([31 x i8], [31 x i8]* @"VaultError::InsufficientBalance", i64 0, i64 0)), !dbg !251
  %7 = call i8* @sol.checked_sub.2(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @uv.balance, i64 0, i64 0), i8* %1), !dbg !252
  %8 = call i8* @sol.ok_or.2(i8* %7, i8* getelementptr inbounds ([30 x i8], [30 x i8]* @"VaultError::ArithmeticOverflow", i64 0, i64 0)), !dbg !253
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @uv.balance, i64 0, i64 0), i8* %8), !dbg !254
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @signer_seeds, i64 0, i64 0), i8* getelementptr inbounds ([45 x i8], [45 x i8]* @"[&[Config::SEED,&[ctx.accounts.config.bump]]]", i64 0, i64 0)), !dbg !255
  %9 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([27 x i8], [27 x i8]* @ctx.accounts.vault_usdc_ata, i64 0, i64 0)), !dbg !256
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @from, i64 0, i64 0), i8* %9), !dbg !257
  %10 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([26 x i8], [26 x i8]* @ctx.accounts.user_usdc_ata, i64 0, i64 0)), !dbg !258
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @to, i64 0, i64 0), i8* %10), !dbg !259
  %11 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([19 x i8], [19 x i8]* @ctx.accounts.config, i64 0, i64 0)), !dbg !260
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0), i8* %11), !dbg !261
  %12 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @ctx.accounts.usdc_mint, i64 0, i64 0)), !dbg !262
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @mint, i64 0, i64 0), i8* %12), !dbg !263
  %13 = call i8* @sol.model.struct.new.TransferChecked.4(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @from, i64 0, i64 0), i8* getelementptr inbounds ([2 x i8], [2 x i8]* @to, i64 0, i64 0), i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @mint, i64 0, i64 0)), !dbg !264
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @cpi_accounts, i64 0, i64 0), i8* %13), !dbg !265
  %14 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([26 x i8], [26 x i8]* @ctx.accounts.token_program, i64 0, i64 0)), !dbg !266
  %15 = call i8* @"sol.CpiContext::new_with_signer.3"(i8* %14, i8* getelementptr inbounds ([12 x i8], [12 x i8]* @cpi_accounts, i64 0, i64 0), i8* getelementptr inbounds ([12 x i8], [12 x i8]* @signer_seeds, i64 0, i64 0)), !dbg !267
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @cpi_ctx, i64 0, i64 0), i8* %15), !dbg !268
  %16 = call i8* @"sol.token::transfer_checked.3"(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @cpi_ctx, i64 0, i64 0), i8* %1, i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"6", i64 0, i64 0)), !dbg !269
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @now_ts, i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"Clock::get()?.unix_timestamp", i64 0, i64 0)), !dbg !270
  %17 = call i8* @"sol.emit.!2"(i8* getelementptr inbounds ([38 x i8], [38 x i8]* @"Withdrawn{user:ctx.accounts.user.key()", i64 0, i64 0), i8* getelementptr inbounds ([60 x i8], [60 x i8]* @"amount_minor,new_balance_minor:uv.balance,timestamp:now_ts,}", i64 0, i64 0)), !dbg !271
  %18 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !272
  ret i8* %0, !dbg !247
}

define i8* @"lib::place_bet.anon.1"(i8* %0) !dbg !273 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !274
  %3 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @pos.shares_yes, i64 0, i64 0), i8* getelementptr inbounds ([12 x i8], [12 x i8]* @shares_minor, i64 0, i64 0)), !dbg !276
  %4 = call i8* @sol.ok_or.2(i8* %3, i8* getelementptr inbounds ([30 x i8], [30 x i8]* @"VaultError::ArithmeticOverflow", i64 0, i64 0)), !dbg !277
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @pos.shares_yes, i64 0, i64 0), i8* %4), !dbg !278
  %5 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @ctx.accounts.market.q_yes, i64 0, i64 0), i8* getelementptr inbounds ([12 x i8], [12 x i8]* @shares_minor, i64 0, i64 0)), !dbg !279
  %6 = call i8* @sol.ok_or.2(i8* %5, i8* getelementptr inbounds ([30 x i8], [30 x i8]* @"VaultError::ArithmeticOverflow", i64 0, i64 0)), !dbg !280
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @ctx.accounts.market.q_yes, i64 0, i64 0), i8* %6), !dbg !281
  ret i8* %0, !dbg !274
}

define i8* @"lib::place_bet.anon.2"(i8* %0) !dbg !282 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !283
  %3 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @pos.shares_no, i64 0, i64 0), i8* getelementptr inbounds ([12 x i8], [12 x i8]* @shares_minor, i64 0, i64 0)), !dbg !285
  %4 = call i8* @sol.ok_or.2(i8* %3, i8* getelementptr inbounds ([30 x i8], [30 x i8]* @"VaultError::ArithmeticOverflow", i64 0, i64 0)), !dbg !286
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @pos.shares_no, i64 0, i64 0), i8* %4), !dbg !287
  %5 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([24 x i8], [24 x i8]* @ctx.accounts.market.q_no, i64 0, i64 0), i8* getelementptr inbounds ([12 x i8], [12 x i8]* @shares_minor, i64 0, i64 0)), !dbg !288
  %6 = call i8* @sol.ok_or.2(i8* %5, i8* getelementptr inbounds ([30 x i8], [30 x i8]* @"VaultError::ArithmeticOverflow", i64 0, i64 0)), !dbg !289
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([24 x i8], [24 x i8]* @ctx.accounts.market.q_no, i64 0, i64 0), i8* %6), !dbg !290
  ret i8* %0, !dbg !283
}

define i8* @"lib::place_bet.6"(i8* %0, i8* %1, i8* %2, i8* %3, i8* %4, i8* %5) !dbg !291 {
  %7 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([17 x i8], [17 x i8]* @"Context<PlaceBet>", i64 0, i64 0)), !dbg !292
  %8 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @outcome, i64 0, i64 0), i8* getelementptr inbounds ([2 x i8], [2 x i8]* @u8, i64 0, i64 0)), !dbg !292
  %9 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @collateral_minor, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !292
  %10 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @shares_minor, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !292
  %11 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @max_cost_minor, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !292
  %12 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @deadline_ts, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @i64, i64 0, i64 0)), !dbg !292
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @now_ts, i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"Clock::get()?.unix_timestamp", i64 0, i64 0)), !dbg !294
  %13 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([19 x i8], [19 x i8]* @"now_ts<=deadline_ts", i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"VaultError::DeadlineExceeded", i64 0, i64 0)), !dbg !295
  %14 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @"outcome==1||outcome==2", i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"VaultError::InvalidOutcome", i64 0, i64 0)), !dbg !296
  %15 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([34 x i8], [34 x i8]* @"collateral_minor>0&&shares_minor>0", i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @"VaultError::InvalidAmount", i64 0, i64 0)), !dbg !297
  %16 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([32 x i8], [32 x i8]* @"collateral_minor<=max_cost_minor", i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @"VaultError::InvalidAmount", i64 0, i64 0)), !dbg !298
  %17 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([30 x i8], [30 x i8]* @"ctx.accounts.market.outcome==0", i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @"VaultError::MarketNotOpen", i64 0, i64 0)), !dbg !299
  %18 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([71 x i8], [71 x i8]* @"ctx.accounts.quote_authority.key()==ctx.accounts.config.quote_authority", i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @"VaultError::NotAuthorized", i64 0, i64 0)), !dbg !300
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @pos, i64 0, i64 0), i8* getelementptr inbounds ([21 x i8], [21 x i8]* @ctx.accounts.position, i64 0, i64 0)), !dbg !301
  %19 = call i8* @sol.key.1(i8* getelementptr inbounds ([19 x i8], [19 x i8]* @ctx.accounts.market, i64 0, i64 0)), !dbg !302
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @pos.market, i64 0, i64 0), i8* %19), !dbg !303
  %20 = call i8* @sol.key.1(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @ctx.accounts.user, i64 0, i64 0)), !dbg !304
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([8 x i8], [8 x i8]* @pos.user, i64 0, i64 0), i8* %20), !dbg !305
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([8 x i8], [8 x i8]* @pos.bump, i64 0, i64 0), i8* getelementptr inbounds ([18 x i8], [18 x i8]* @ctx.bumps.position, i64 0, i64 0)), !dbg !306
  %21 = call i8* @"sol.=="(i8* %1, i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"1", i64 0, i64 0)), !dbg !307
  %22 = call i8* @sol.if(i8* %21), !dbg !308
  %23 = call i8* @"sol.lib::place_bet.anon.1"(i8* %22), !dbg !309
  %24 = call i8* @sol.ifTrue.anon.(i8* %23), !dbg !309
  %25 = call i8* @"sol.lib::place_bet.anon.2"(i8* %24), !dbg !310
  %26 = call i8* @sol.ifFalse.anon.(i8* %25), !dbg !310
  %27 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([26 x i8], [26 x i8]* @ctx.accounts.user_usdc_ata, i64 0, i64 0)), !dbg !311
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @from, i64 0, i64 0), i8* %27), !dbg !312
  %28 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([29 x i8], [29 x i8]* @ctx.accounts.market_vault_ata, i64 0, i64 0)), !dbg !313
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @to, i64 0, i64 0), i8* %28), !dbg !314
  %29 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @ctx.accounts.user, i64 0, i64 0)), !dbg !315
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0), i8* %29), !dbg !316
  %30 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @ctx.accounts.usdc_mint, i64 0, i64 0)), !dbg !317
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @mint, i64 0, i64 0), i8* %30), !dbg !318
  %31 = call i8* @sol.model.struct.new.TransferChecked.4(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @from, i64 0, i64 0), i8* getelementptr inbounds ([2 x i8], [2 x i8]* @to, i64 0, i64 0), i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @mint, i64 0, i64 0)), !dbg !319
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @cpi_accounts, i64 0, i64 0), i8* %31), !dbg !320
  %32 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([26 x i8], [26 x i8]* @ctx.accounts.token_program, i64 0, i64 0)), !dbg !321
  %33 = call i8* @"sol.CpiContext::new.2"(i8* %32, i8* getelementptr inbounds ([12 x i8], [12 x i8]* @cpi_accounts, i64 0, i64 0)), !dbg !322
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @cpi_ctx, i64 0, i64 0), i8* %33), !dbg !323
  %34 = call i8* @"sol.token::transfer_checked.3"(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @cpi_ctx, i64 0, i64 0), i8* %2, i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"6", i64 0, i64 0)), !dbg !324
  %35 = call i8* @"sol.emit.!2"(i8* getelementptr inbounds ([38 x i8], [38 x i8]* @"BetPlaced{user:ctx.accounts.user.key()", i64 0, i64 0), i8* getelementptr inbounds ([89 x i8], [89 x i8]* @"market:ctx.accounts.market.key(),outcome,collateral_minor,shares_minor,timestamp:now_ts,}", i64 0, i64 0)), !dbg !325
  %36 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !326
  ret i8* %0, !dbg !292
}

define i8* @"lib::sell_position.anon.1"(i8* %0) !dbg !327 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !328
  %3 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"pos.shares_yes>=shares_minor", i64 0, i64 0), i8* getelementptr inbounds ([30 x i8], [30 x i8]* @"VaultError::InsufficientShares", i64 0, i64 0)), !dbg !330
  %4 = call i8* @sol.checked_sub.2(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @pos.shares_yes, i64 0, i64 0), i8* getelementptr inbounds ([12 x i8], [12 x i8]* @shares_minor, i64 0, i64 0)), !dbg !331
  %5 = call i8* @sol.ok_or.2(i8* %4, i8* getelementptr inbounds ([30 x i8], [30 x i8]* @"VaultError::ArithmeticOverflow", i64 0, i64 0)), !dbg !332
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @pos.shares_yes, i64 0, i64 0), i8* %5), !dbg !333
  %6 = call i8* @sol.checked_sub.2(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @ctx.accounts.market.q_yes, i64 0, i64 0), i8* getelementptr inbounds ([12 x i8], [12 x i8]* @shares_minor, i64 0, i64 0)), !dbg !334
  %7 = call i8* @sol.ok_or.2(i8* %6, i8* getelementptr inbounds ([30 x i8], [30 x i8]* @"VaultError::ArithmeticOverflow", i64 0, i64 0)), !dbg !335
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @ctx.accounts.market.q_yes, i64 0, i64 0), i8* %7), !dbg !336
  ret i8* %0, !dbg !328
}

define i8* @"lib::sell_position.anon.2"(i8* %0) !dbg !337 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !338
  %3 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([27 x i8], [27 x i8]* @"pos.shares_no>=shares_minor", i64 0, i64 0), i8* getelementptr inbounds ([30 x i8], [30 x i8]* @"VaultError::InsufficientShares", i64 0, i64 0)), !dbg !340
  %4 = call i8* @sol.checked_sub.2(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @pos.shares_no, i64 0, i64 0), i8* getelementptr inbounds ([12 x i8], [12 x i8]* @shares_minor, i64 0, i64 0)), !dbg !341
  %5 = call i8* @sol.ok_or.2(i8* %4, i8* getelementptr inbounds ([30 x i8], [30 x i8]* @"VaultError::ArithmeticOverflow", i64 0, i64 0)), !dbg !342
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @pos.shares_no, i64 0, i64 0), i8* %5), !dbg !343
  %6 = call i8* @sol.checked_sub.2(i8* getelementptr inbounds ([24 x i8], [24 x i8]* @ctx.accounts.market.q_no, i64 0, i64 0), i8* getelementptr inbounds ([12 x i8], [12 x i8]* @shares_minor, i64 0, i64 0)), !dbg !344
  %7 = call i8* @sol.ok_or.2(i8* %6, i8* getelementptr inbounds ([30 x i8], [30 x i8]* @"VaultError::ArithmeticOverflow", i64 0, i64 0)), !dbg !345
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([24 x i8], [24 x i8]* @ctx.accounts.market.q_no, i64 0, i64 0), i8* %7), !dbg !346
  ret i8* %0, !dbg !338
}

define i8* @"lib::sell_position.6"(i8* %0, i8* %1, i8* %2, i8* %3, i8* %4, i8* %5) !dbg !347 {
  %7 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"Context<SellPosition>", i64 0, i64 0)), !dbg !348
  %8 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @outcome, i64 0, i64 0), i8* getelementptr inbounds ([2 x i8], [2 x i8]* @u8, i64 0, i64 0)), !dbg !348
  %9 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @shares_minor, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !348
  %10 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @payout_minor, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !348
  %11 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @min_payout_minor, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !348
  %12 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @deadline_ts, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @i64, i64 0, i64 0)), !dbg !348
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @now_ts, i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"Clock::get()?.unix_timestamp", i64 0, i64 0)), !dbg !350
  %13 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([19 x i8], [19 x i8]* @"now_ts<=deadline_ts", i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"VaultError::DeadlineExceeded", i64 0, i64 0)), !dbg !351
  %14 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @"outcome==1||outcome==2", i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"VaultError::InvalidOutcome", i64 0, i64 0)), !dbg !352
  %15 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @"shares_minor>0", i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @"VaultError::InvalidAmount", i64 0, i64 0)), !dbg !353
  %16 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([30 x i8], [30 x i8]* @"payout_minor>=min_payout_minor", i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @"VaultError::InvalidAmount", i64 0, i64 0)), !dbg !354
  %17 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([30 x i8], [30 x i8]* @"ctx.accounts.market.outcome==0", i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @"VaultError::MarketNotOpen", i64 0, i64 0)), !dbg !355
  %18 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([71 x i8], [71 x i8]* @"ctx.accounts.quote_authority.key()==ctx.accounts.config.quote_authority", i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @"VaultError::NotAuthorized", i64 0, i64 0)), !dbg !356
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @pos, i64 0, i64 0), i8* getelementptr inbounds ([21 x i8], [21 x i8]* @ctx.accounts.position, i64 0, i64 0)), !dbg !357
  %19 = call i8* @"sol.=="(i8* %1, i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"1", i64 0, i64 0)), !dbg !358
  %20 = call i8* @sol.if(i8* %19), !dbg !359
  %21 = call i8* @"sol.lib::sell_position.anon.1"(i8* %20), !dbg !360
  %22 = call i8* @sol.ifTrue.anon.(i8* %21), !dbg !360
  %23 = call i8* @"sol.lib::sell_position.anon.2"(i8* %22), !dbg !361
  %24 = call i8* @sol.ifFalse.anon.(i8* %23), !dbg !361
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @signer_seeds, i64 0, i64 0), i8* getelementptr inbounds ([80 x i8], [80 x i8]* @"[&[Market::SEED,ctx.accounts.market.uuid.as_ref(),&[ctx.accounts.market.bump],]]", i64 0, i64 0)), !dbg !362
  %25 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([29 x i8], [29 x i8]* @ctx.accounts.market_vault_ata, i64 0, i64 0)), !dbg !363
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @from, i64 0, i64 0), i8* %25), !dbg !364
  %26 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([26 x i8], [26 x i8]* @ctx.accounts.user_usdc_ata, i64 0, i64 0)), !dbg !365
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @to, i64 0, i64 0), i8* %26), !dbg !366
  %27 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([19 x i8], [19 x i8]* @ctx.accounts.market, i64 0, i64 0)), !dbg !367
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0), i8* %27), !dbg !368
  %28 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @ctx.accounts.usdc_mint, i64 0, i64 0)), !dbg !369
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @mint, i64 0, i64 0), i8* %28), !dbg !370
  %29 = call i8* @sol.model.struct.new.TransferChecked.4(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @from, i64 0, i64 0), i8* getelementptr inbounds ([2 x i8], [2 x i8]* @to, i64 0, i64 0), i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @mint, i64 0, i64 0)), !dbg !371
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @cpi_accounts, i64 0, i64 0), i8* %29), !dbg !372
  %30 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([26 x i8], [26 x i8]* @ctx.accounts.token_program, i64 0, i64 0)), !dbg !373
  %31 = call i8* @"sol.CpiContext::new_with_signer.3"(i8* %30, i8* getelementptr inbounds ([12 x i8], [12 x i8]* @cpi_accounts, i64 0, i64 0), i8* getelementptr inbounds ([12 x i8], [12 x i8]* @signer_seeds, i64 0, i64 0)), !dbg !374
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @cpi_ctx, i64 0, i64 0), i8* %31), !dbg !375
  %32 = call i8* @"sol.token::transfer_checked.3"(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @cpi_ctx, i64 0, i64 0), i8* %3, i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"6", i64 0, i64 0)), !dbg !376
  %33 = call i8* @"sol.emit.!2"(i8* getelementptr inbounds ([41 x i8], [41 x i8]* @"PositionSold{user:ctx.accounts.user.key()", i64 0, i64 0), i8* getelementptr inbounds ([85 x i8], [85 x i8]* @"market:ctx.accounts.market.key(),outcome,shares_minor,payout_minor,timestamp:now_ts,}", i64 0, i64 0)), !dbg !377
  %34 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !378
  ret i8* %0, !dbg !348
}

define i8* @"lib::resolve_market.2"(i8* %0, i8* %1) !dbg !379 {
  %3 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([22 x i8], [22 x i8]* @"Context<ResolveMarket>", i64 0, i64 0)), !dbg !380
  %4 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @outcome, i64 0, i64 0), i8* getelementptr inbounds ([2 x i8], [2 x i8]* @u8, i64 0, i64 0)), !dbg !380
  %5 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([34 x i8], [34 x i8]* @"outcome==1||outcome==2||outcome==3", i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"VaultError::InvalidOutcome", i64 0, i64 0)), !dbg !382
  %6 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([59 x i8], [59 x i8]* @"ctx.accounts.authority.key()==ctx.accounts.config.authority", i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @"VaultError::NotAuthorized", i64 0, i64 0)), !dbg !383
  %7 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([30 x i8], [30 x i8]* @"ctx.accounts.market.outcome==0", i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @"VaultError::MarketNotOpen", i64 0, i64 0)), !dbg !384
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([27 x i8], [27 x i8]* @ctx.accounts.market.outcome, i64 0, i64 0), i8* %1), !dbg !385
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @now_ts, i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"Clock::get()?.unix_timestamp", i64 0, i64 0)), !dbg !386
  %8 = call i8* @"sol.emit.!2"(i8* getelementptr inbounds ([47 x i8], [47 x i8]* @"MarketResolved{market:ctx.accounts.market.key()", i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"outcome,timestamp:now_ts,}", i64 0, i64 0)), !dbg !387
  %9 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !388
  ret i8* %0, !dbg !380
}

define i8* @"lib::claim_winnings.anon.1"(i8* %0) !dbg !389 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !390
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([1 x i8], [1 x i8]* @s, i64 0, i64 0), i8* getelementptr inbounds ([14 x i8], [14 x i8]* @pos.shares_yes, i64 0, i64 0)), !dbg !392
  %3 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"s>0", i64 0, i64 0), i8* getelementptr inbounds ([29 x i8], [29 x i8]* @"VaultError::NoWinningPosition", i64 0, i64 0)), !dbg !393
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @pos.shares_yes, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !394
  ret i8* %0, !dbg !390
}

define i8* @"lib::claim_winnings.anon.2"(i8* %0) !dbg !395 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !396
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([1 x i8], [1 x i8]* @s, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @pos.shares_no, i64 0, i64 0)), !dbg !398
  %3 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"s>0", i64 0, i64 0), i8* getelementptr inbounds ([29 x i8], [29 x i8]* @"VaultError::NoWinningPosition", i64 0, i64 0)), !dbg !399
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @pos.shares_no, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !400
  ret i8* %0, !dbg !396
}

define i8* @"lib::claim_winnings.2"(i8* %0, i8* %1) !dbg !401 {
  %3 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([22 x i8], [22 x i8]* @"Context<ClaimWinnings>", i64 0, i64 0)), !dbg !402
  %4 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @min_payout_minor, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !402
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @outcome, i64 0, i64 0), i8* getelementptr inbounds ([27 x i8], [27 x i8]* @ctx.accounts.market.outcome, i64 0, i64 0)), !dbg !404
  %5 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @"outcome==1||outcome==2", i64 0, i64 0), i8* getelementptr inbounds ([29 x i8], [29 x i8]* @"VaultError::MarketNotResolved", i64 0, i64 0)), !dbg !405
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @pos, i64 0, i64 0), i8* getelementptr inbounds ([21 x i8], [21 x i8]* @ctx.accounts.position, i64 0, i64 0)), !dbg !406
  %6 = call i8* @"sol.=="(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @outcome, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"1", i64 0, i64 0)), !dbg !407
  %7 = call i8* @sol.if(i8* %6), !dbg !408
  %8 = call i8* @"sol.lib::claim_winnings.anon.1"(i8* %7), !dbg !409
  %9 = call i8* @sol.ifTrue.anon.(i8* %8), !dbg !409
  %10 = call i8* @"sol.lib::claim_winnings.anon.2"(i8* %9), !dbg !410
  %11 = call i8* @sol.ifFalse.anon.(i8* %10), !dbg !410
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @shares_minor, i64 0, i64 0), i8* %11), !dbg !411
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @payout_minor, i64 0, i64 0), i8* getelementptr inbounds ([12 x i8], [12 x i8]* @shares_minor, i64 0, i64 0)), !dbg !412
  %12 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([30 x i8], [30 x i8]* @"payout_minor>=min_payout_minor", i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @"VaultError::InvalidAmount", i64 0, i64 0)), !dbg !413
  %13 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([33 x i8], [33 x i8]* @ctx.accounts.market.total_claimed, i64 0, i64 0), i8* getelementptr inbounds ([12 x i8], [12 x i8]* @payout_minor, i64 0, i64 0)), !dbg !414
  %14 = call i8* @sol.ok_or.2(i8* %13, i8* getelementptr inbounds ([30 x i8], [30 x i8]* @"VaultError::ArithmeticOverflow", i64 0, i64 0)), !dbg !415
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([33 x i8], [33 x i8]* @ctx.accounts.market.total_claimed, i64 0, i64 0), i8* %14), !dbg !416
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @signer_seeds, i64 0, i64 0), i8* getelementptr inbounds ([80 x i8], [80 x i8]* @"[&[Market::SEED,ctx.accounts.market.uuid.as_ref(),&[ctx.accounts.market.bump],]]", i64 0, i64 0)), !dbg !417
  %15 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([29 x i8], [29 x i8]* @ctx.accounts.market_vault_ata, i64 0, i64 0)), !dbg !418
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @from, i64 0, i64 0), i8* %15), !dbg !419
  %16 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([26 x i8], [26 x i8]* @ctx.accounts.user_usdc_ata, i64 0, i64 0)), !dbg !420
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @to, i64 0, i64 0), i8* %16), !dbg !421
  %17 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([19 x i8], [19 x i8]* @ctx.accounts.market, i64 0, i64 0)), !dbg !422
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0), i8* %17), !dbg !423
  %18 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @ctx.accounts.usdc_mint, i64 0, i64 0)), !dbg !424
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @mint, i64 0, i64 0), i8* %18), !dbg !425
  %19 = call i8* @sol.model.struct.new.TransferChecked.4(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @from, i64 0, i64 0), i8* getelementptr inbounds ([2 x i8], [2 x i8]* @to, i64 0, i64 0), i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @mint, i64 0, i64 0)), !dbg !426
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @cpi_accounts, i64 0, i64 0), i8* %19), !dbg !427
  %20 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([26 x i8], [26 x i8]* @ctx.accounts.token_program, i64 0, i64 0)), !dbg !428
  %21 = call i8* @"sol.CpiContext::new_with_signer.3"(i8* %20, i8* getelementptr inbounds ([12 x i8], [12 x i8]* @cpi_accounts, i64 0, i64 0), i8* getelementptr inbounds ([12 x i8], [12 x i8]* @signer_seeds, i64 0, i64 0)), !dbg !429
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @cpi_ctx, i64 0, i64 0), i8* %21), !dbg !430
  %22 = call i8* @"sol.token::transfer_checked.3"(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @cpi_ctx, i64 0, i64 0), i8* getelementptr inbounds ([12 x i8], [12 x i8]* @payout_minor, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"6", i64 0, i64 0)), !dbg !431
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @now_ts, i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"Clock::get()?.unix_timestamp", i64 0, i64 0)), !dbg !432
  %23 = call i8* @"sol.emit.!2"(i8* getelementptr inbounds ([44 x i8], [44 x i8]* @"WinningsClaimed{user:ctx.accounts.user.key()", i64 0, i64 0), i8* getelementptr inbounds ([85 x i8], [85 x i8]* @"market:ctx.accounts.market.key(),outcome,shares_minor,payout_minor,timestamp:now_ts,}", i64 0, i64 0)), !dbg !433
  %24 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !434
  ret i8* %0, !dbg !402
}

define i8* @"lib::collect_fees.anon.1"(i8* %0) !dbg !435 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !436
  ret i8* %0, !dbg !436
}

define i8* @"lib::collect_fees.anon.2"(i8* %0) !dbg !438 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !439
  ret i8* %0, !dbg !439
}

define i8* @"lib::collect_fees.anon.3"(i8* %0) !dbg !441 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !442
  %3 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @ctx.accounts.market.q_yes, i64 0, i64 0), i8* getelementptr inbounds ([24 x i8], [24 x i8]* @ctx.accounts.market.q_no, i64 0, i64 0)), !dbg !444
  %4 = call i8* @sol.ok_or.2(i8* %3, i8* getelementptr inbounds ([30 x i8], [30 x i8]* @"VaultError::ArithmeticOverflow", i64 0, i64 0)), !dbg !445
  ret i8* %0, !dbg !442
}

define i8* @"lib::collect_fees.2"(i8* %0, i8* %1) !dbg !446 {
  %3 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"Context<CollectFees>", i64 0, i64 0)), !dbg !447
  %4 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @amount_minor, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !447
  %5 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @"amount_minor>0", i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @"VaultError::InvalidAmount", i64 0, i64 0)), !dbg !449
  %6 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([59 x i8], [59 x i8]* @"ctx.accounts.authority.key()==ctx.accounts.config.authority", i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @"VaultError::NotAuthorized", i64 0, i64 0)), !dbg !450
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @outcome, i64 0, i64 0), i8* getelementptr inbounds ([27 x i8], [27 x i8]* @ctx.accounts.market.outcome, i64 0, i64 0)), !dbg !451
  %7 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @"outcome>0", i64 0, i64 0), i8* getelementptr inbounds ([29 x i8], [29 x i8]* @"VaultError::MarketNotResolved", i64 0, i64 0)), !dbg !452
  %8 = call i8* @"sol.=="(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @outcome, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"1", i64 0, i64 0)), !dbg !453
  %9 = call i8* @sol.if(i8* %8), !dbg !454
  %10 = call i8* @"sol.lib::collect_fees.anon.1"(i8* %9), !dbg !455
  %11 = call i8* @sol.ifTrue.anon.(i8* %10), !dbg !455
  %12 = call i8* @"sol.=="(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @outcome, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"2", i64 0, i64 0)), !dbg !456
  %13 = call i8* @sol.if(i8* %12), !dbg !457
  %14 = call i8* @"sol.lib::collect_fees.anon.2"(i8* %13), !dbg !458
  %15 = call i8* @sol.ifTrue.anon.(i8* %14), !dbg !458
  %16 = call i8* @"sol.lib::collect_fees.anon.3"(i8* %15), !dbg !459
  %17 = call i8* @sol.ifFalse.anon.(i8* %16), !dbg !459
  %18 = call i8* @sol.ifTrueFalse.anon.(i8* %11, i8* %17), !dbg !457
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @liability_shares, i64 0, i64 0), i8* %18), !dbg !460
  %19 = call i8* @sol.checked_sub.2(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @liability_shares, i64 0, i64 0), i8* getelementptr inbounds ([33 x i8], [33 x i8]* @ctx.accounts.market.total_claimed, i64 0, i64 0)), !dbg !461
  %20 = call i8* @sol.unwrap_or.2(i8* %19, i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !462
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([19 x i8], [19 x i8]* @remaining_liability, i64 0, i64 0), i8* %20), !dbg !463
  %21 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @"remaining_liability==0", i64 0, i64 0), i8* getelementptr inbounds ([31 x i8], [31 x i8]* @"VaultError::InsufficientBalance", i64 0, i64 0)), !dbg !464
  %22 = call i8* @sol.checked_sub.2(i8* getelementptr inbounds ([36 x i8], [36 x i8]* @ctx.accounts.market_vault_ata.amount, i64 0, i64 0), i8* getelementptr inbounds ([19 x i8], [19 x i8]* @remaining_liability, i64 0, i64 0)), !dbg !465
  %23 = call i8* @sol.ok_or.2(i8* %22, i8* getelementptr inbounds ([31 x i8], [31 x i8]* @"VaultError::InsufficientBalance", i64 0, i64 0)), !dbg !466
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @max_collectible, i64 0, i64 0), i8* %23), !dbg !467
  %24 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([29 x i8], [29 x i8]* @"amount_minor<=max_collectible", i64 0, i64 0), i8* getelementptr inbounds ([31 x i8], [31 x i8]* @"VaultError::InsufficientBalance", i64 0, i64 0)), !dbg !468
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @signer_seeds, i64 0, i64 0), i8* getelementptr inbounds ([80 x i8], [80 x i8]* @"[&[Market::SEED,ctx.accounts.market.uuid.as_ref(),&[ctx.accounts.market.bump],]]", i64 0, i64 0)), !dbg !469
  %25 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([29 x i8], [29 x i8]* @ctx.accounts.market_vault_ata, i64 0, i64 0)), !dbg !470
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @from, i64 0, i64 0), i8* %25), !dbg !471
  %26 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([30 x i8], [30 x i8]* @ctx.accounts.fee_recipient_ata, i64 0, i64 0)), !dbg !472
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @to, i64 0, i64 0), i8* %26), !dbg !473
  %27 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([19 x i8], [19 x i8]* @ctx.accounts.market, i64 0, i64 0)), !dbg !474
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0), i8* %27), !dbg !475
  %28 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @ctx.accounts.usdc_mint, i64 0, i64 0)), !dbg !476
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @mint, i64 0, i64 0), i8* %28), !dbg !477
  %29 = call i8* @sol.model.struct.new.TransferChecked.4(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @from, i64 0, i64 0), i8* getelementptr inbounds ([2 x i8], [2 x i8]* @to, i64 0, i64 0), i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @mint, i64 0, i64 0)), !dbg !478
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @cpi_accounts, i64 0, i64 0), i8* %29), !dbg !479
  %30 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([26 x i8], [26 x i8]* @ctx.accounts.token_program, i64 0, i64 0)), !dbg !480
  %31 = call i8* @"sol.CpiContext::new_with_signer.3"(i8* %30, i8* getelementptr inbounds ([12 x i8], [12 x i8]* @cpi_accounts, i64 0, i64 0), i8* getelementptr inbounds ([12 x i8], [12 x i8]* @signer_seeds, i64 0, i64 0)), !dbg !481
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @cpi_ctx, i64 0, i64 0), i8* %31), !dbg !482
  %32 = call i8* @"sol.token::transfer_checked.3"(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @cpi_ctx, i64 0, i64 0), i8* %1, i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"6", i64 0, i64 0)), !dbg !483
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @now_ts, i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"Clock::get()?.unix_timestamp", i64 0, i64 0)), !dbg !484
  %33 = call i8* @"sol.emit.!2"(i8* getelementptr inbounds ([46 x i8], [46 x i8]* @"FeesCollected{market:ctx.accounts.market.key()", i64 0, i64 0), i8* getelementptr inbounds ([70 x i8], [70 x i8]* @"authority:ctx.accounts.authority.key(),amount_minor,timestamp:now_ts,}", i64 0, i64 0)), !dbg !485
  %34 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !486
  ret i8* %0, !dbg !447
}

define i8* @"lib::refund_cancelled.2"(i8* %0, i8* %1) !dbg !487 {
  %3 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([24 x i8], [24 x i8]* @"Context<RefundCancelled>", i64 0, i64 0)), !dbg !488
  %4 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @min_payout_minor, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !488
  %5 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([30 x i8], [30 x i8]* @"ctx.accounts.market.outcome==3", i64 0, i64 0), i8* getelementptr inbounds ([29 x i8], [29 x i8]* @"VaultError::MarketNotResolved", i64 0, i64 0)), !dbg !490
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @pos, i64 0, i64 0), i8* getelementptr inbounds ([21 x i8], [21 x i8]* @ctx.accounts.position, i64 0, i64 0)), !dbg !491
  %6 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @pos.shares_yes, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @pos.shares_no, i64 0, i64 0)), !dbg !492
  %7 = call i8* @sol.ok_or.2(i8* %6, i8* getelementptr inbounds ([30 x i8], [30 x i8]* @"VaultError::ArithmeticOverflow", i64 0, i64 0)), !dbg !493
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @shares_minor, i64 0, i64 0), i8* %7), !dbg !494
  %8 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @"shares_minor>0", i64 0, i64 0), i8* getelementptr inbounds ([29 x i8], [29 x i8]* @"VaultError::NoWinningPosition", i64 0, i64 0)), !dbg !495
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @pos.shares_yes, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !496
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @pos.shares_no, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !497
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @payout_minor, i64 0, i64 0), i8* getelementptr inbounds ([12 x i8], [12 x i8]* @shares_minor, i64 0, i64 0)), !dbg !498
  %9 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([30 x i8], [30 x i8]* @"payout_minor>=min_payout_minor", i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @"VaultError::InvalidAmount", i64 0, i64 0)), !dbg !499
  %10 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([33 x i8], [33 x i8]* @ctx.accounts.market.total_claimed, i64 0, i64 0), i8* getelementptr inbounds ([12 x i8], [12 x i8]* @payout_minor, i64 0, i64 0)), !dbg !500
  %11 = call i8* @sol.ok_or.2(i8* %10, i8* getelementptr inbounds ([30 x i8], [30 x i8]* @"VaultError::ArithmeticOverflow", i64 0, i64 0)), !dbg !501
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([33 x i8], [33 x i8]* @ctx.accounts.market.total_claimed, i64 0, i64 0), i8* %11), !dbg !502
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @signer_seeds, i64 0, i64 0), i8* getelementptr inbounds ([80 x i8], [80 x i8]* @"[&[Market::SEED,ctx.accounts.market.uuid.as_ref(),&[ctx.accounts.market.bump],]]", i64 0, i64 0)), !dbg !503
  %12 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([29 x i8], [29 x i8]* @ctx.accounts.market_vault_ata, i64 0, i64 0)), !dbg !504
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @from, i64 0, i64 0), i8* %12), !dbg !505
  %13 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([26 x i8], [26 x i8]* @ctx.accounts.user_usdc_ata, i64 0, i64 0)), !dbg !506
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @to, i64 0, i64 0), i8* %13), !dbg !507
  %14 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([19 x i8], [19 x i8]* @ctx.accounts.market, i64 0, i64 0)), !dbg !508
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0), i8* %14), !dbg !509
  %15 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @ctx.accounts.usdc_mint, i64 0, i64 0)), !dbg !510
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @mint, i64 0, i64 0), i8* %15), !dbg !511
  %16 = call i8* @sol.model.struct.new.TransferChecked.4(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @from, i64 0, i64 0), i8* getelementptr inbounds ([2 x i8], [2 x i8]* @to, i64 0, i64 0), i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @mint, i64 0, i64 0)), !dbg !512
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @cpi_accounts, i64 0, i64 0), i8* %16), !dbg !513
  %17 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([26 x i8], [26 x i8]* @ctx.accounts.token_program, i64 0, i64 0)), !dbg !514
  %18 = call i8* @"sol.CpiContext::new_with_signer.3"(i8* %17, i8* getelementptr inbounds ([12 x i8], [12 x i8]* @cpi_accounts, i64 0, i64 0), i8* getelementptr inbounds ([12 x i8], [12 x i8]* @signer_seeds, i64 0, i64 0)), !dbg !515
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @cpi_ctx, i64 0, i64 0), i8* %18), !dbg !516
  %19 = call i8* @"sol.token::transfer_checked.3"(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @cpi_ctx, i64 0, i64 0), i8* getelementptr inbounds ([12 x i8], [12 x i8]* @payout_minor, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"6", i64 0, i64 0)), !dbg !517
  %20 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !518
  ret i8* %0, !dbg !488
}

define i8* @"lib::close_position.1"(i8* %0) !dbg !519 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([22 x i8], [22 x i8]* @"Context<ClosePosition>", i64 0, i64 0)), !dbg !520
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @pos, i64 0, i64 0), i8* getelementptr inbounds ([21 x i8], [21 x i8]* @ctx.accounts.position, i64 0, i64 0)), !dbg !522
  %3 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([35 x i8], [35 x i8]* @"pos.shares_yes==0&&pos.shares_no==0", i64 0, i64 0), i8* getelementptr inbounds ([30 x i8], [30 x i8]* @"VaultError::InsufficientShares", i64 0, i64 0)), !dbg !523
  %4 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !524
  ret i8* %0, !dbg !520
}

define i8* @sol.model.anchor.program.prediction_market_vault(i8* %0) !dbg !525 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !526
  %3 = call i8* @sol.initialize_config.2(i8* getelementptr inbounds ([29 x i8], [29 x i8]* @"ctx:Context<InitializeConfig>", i64 0, i64 0), i8* getelementptr inbounds ([22 x i8], [22 x i8]* @"quote_authority:Pubkey", i64 0, i64 0)), !dbg !528
  %4 = call i8* @sol.set_pending_authority.2(i8* getelementptr inbounds ([32 x i8], [32 x i8]* @"ctx:Context<SetPendingAuthority>", i64 0, i64 0), i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"new_authority:Pubkey", i64 0, i64 0)), !dbg !529
  %5 = call i8* @sol.cancel_authority_transfer.1(i8* getelementptr inbounds ([36 x i8], [36 x i8]* @"ctx:Context<CancelAuthorityTransfer>", i64 0, i64 0)), !dbg !530
  %6 = call i8* @sol.accept_authority_transfer.1(i8* getelementptr inbounds ([36 x i8], [36 x i8]* @"ctx:Context<AcceptAuthorityTransfer>", i64 0, i64 0)), !dbg !531
  %7 = call i8* @sol.create_market.2(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @"ctx:Context<CreateMarket>", i64 0, i64 0), i8* getelementptr inbounds ([19 x i8], [19 x i8]* @"market_uuid:[u8;16]", i64 0, i64 0)), !dbg !532
  %8 = call i8* @sol.deposit.2(i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"ctx:Context<Deposit>", i64 0, i64 0), i8* getelementptr inbounds ([16 x i8], [16 x i8]* @"amount_minor:u64", i64 0, i64 0)), !dbg !533
  %9 = call i8* @sol.withdraw.2(i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"ctx:Context<Withdraw>", i64 0, i64 0), i8* getelementptr inbounds ([16 x i8], [16 x i8]* @"amount_minor:u64", i64 0, i64 0)), !dbg !534
  %10 = call i8* @sol.place_bet.6(i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"ctx:Context<PlaceBet>", i64 0, i64 0), i8* getelementptr inbounds ([10 x i8], [10 x i8]* @"outcome:u8", i64 0, i64 0), i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"collateral_minor:u64", i64 0, i64 0), i8* getelementptr inbounds ([16 x i8], [16 x i8]* @"shares_minor:u64", i64 0, i64 0), i8* getelementptr inbounds ([18 x i8], [18 x i8]* @"max_cost_minor:u64", i64 0, i64 0), i8* getelementptr inbounds ([15 x i8], [15 x i8]* @"deadline_ts:i64", i64 0, i64 0)), !dbg !535
  %11 = call i8* @sol.sell_position.6(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @"ctx:Context<SellPosition>", i64 0, i64 0), i8* getelementptr inbounds ([10 x i8], [10 x i8]* @"outcome:u8", i64 0, i64 0), i8* getelementptr inbounds ([16 x i8], [16 x i8]* @"shares_minor:u64", i64 0, i64 0), i8* getelementptr inbounds ([16 x i8], [16 x i8]* @"payout_minor:u64", i64 0, i64 0), i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"min_payout_minor:u64", i64 0, i64 0), i8* getelementptr inbounds ([15 x i8], [15 x i8]* @"deadline_ts:i64", i64 0, i64 0)), !dbg !536
  %12 = call i8* @sol.resolve_market.2(i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"ctx:Context<ResolveMarket>", i64 0, i64 0), i8* getelementptr inbounds ([10 x i8], [10 x i8]* @"outcome:u8", i64 0, i64 0)), !dbg !537
  %13 = call i8* @sol.claim_winnings.2(i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"ctx:Context<ClaimWinnings>", i64 0, i64 0), i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"min_payout_minor:u64", i64 0, i64 0)), !dbg !538
  %14 = call i8* @sol.collect_fees.2(i8* getelementptr inbounds ([24 x i8], [24 x i8]* @"ctx:Context<CollectFees>", i64 0, i64 0), i8* getelementptr inbounds ([16 x i8], [16 x i8]* @"amount_minor:u64", i64 0, i64 0)), !dbg !539
  %15 = call i8* @sol.refund_cancelled.2(i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"ctx:Context<RefundCancelled>", i64 0, i64 0), i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"min_payout_minor:u64", i64 0, i64 0)), !dbg !540
  %16 = call i8* @sol.close_position.1(i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"ctx:Context<ClosePosition>", i64 0, i64 0)), !dbg !541
  ret i8* %0, !dbg !526
}

define i8* @main(i8* %0) !dbg !542 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !543
  %3 = call i8* @sol.model.anchor.program.prediction_market_vault(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @program_id, i64 0, i64 0)), !dbg !543
  ret i8* %0, !dbg !543
}

define i8* @sol.model.struct.anchor.InitializeConfig(i8* %0) !dbg !545 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !546
  %3 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @mut, i64 0, i64 0)), !dbg !548
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @"Signer<'info>", i64 0, i64 0)), !dbg !549
  %5 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([67 x i8], [67 x i8]* @"constraint=program.programdata_address()?==Some(program_data.key())", i64 0, i64 0)), !dbg !550
  %6 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @program, i64 0, i64 0), i8* getelementptr inbounds ([36 x i8], [36 x i8]* @"Program<'info,PredictionMarketVault>", i64 0, i64 0)), !dbg !551
  %7 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @program_data, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Account<'info,ProgramData>", i64 0, i64 0)), !dbg !552
  %8 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([73 x i8], [73 x i8]* @"init,payer=authority,space=8+Config::INIT_SPACE,seeds=[Config::SEED],bump", i64 0, i64 0)), !dbg !553
  %9 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @config, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Box<Account<'info,Config>>", i64 0, i64 0)), !dbg !554
  %10 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @usdc_mint, i64 0, i64 0), i8* getelementptr inbounds ([24 x i8], [24 x i8]* @"Box<Account<'info,Mint>>", i64 0, i64 0)), !dbg !555
  %11 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @system_program, i64 0, i64 0), i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"Program<'info,System>", i64 0, i64 0)), !dbg !556
  ret i8* %0, !dbg !546
}

define i8* @sol.model.struct.anchor.SetPendingAuthority(i8* %0) !dbg !557 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !558
  %3 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @mut, i64 0, i64 0)), !dbg !560
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @"Signer<'info>", i64 0, i64 0)), !dbg !561
  %5 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([37 x i8], [37 x i8]* @"seeds=[Config::SEED],bump=config.bump", i64 0, i64 0)), !dbg !562
  %6 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @config, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Box<Account<'info,Config>>", i64 0, i64 0)), !dbg !563
  %7 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([105 x i8], [105 x i8]* @"init_if_needed,payer=authority,space=8+AuthorityTransfer::INIT_SPACE,seeds=[AuthorityTransfer::SEED],bump", i64 0, i64 0)), !dbg !564
  %8 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([18 x i8], [18 x i8]* @authority_transfer, i64 0, i64 0), i8* getelementptr inbounds ([37 x i8], [37 x i8]* @"Box<Account<'info,AuthorityTransfer>>", i64 0, i64 0)), !dbg !565
  %9 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @system_program, i64 0, i64 0), i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"Program<'info,System>", i64 0, i64 0)), !dbg !566
  ret i8* %0, !dbg !558
}

define i8* @sol.model.struct.anchor.CancelAuthorityTransfer(i8* %0) !dbg !567 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !568
  %3 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @mut, i64 0, i64 0)), !dbg !570
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @"Signer<'info>", i64 0, i64 0)), !dbg !571
  %5 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([37 x i8], [37 x i8]* @"seeds=[Config::SEED],bump=config.bump", i64 0, i64 0)), !dbg !572
  %6 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @config, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Box<Account<'info,Config>>", i64 0, i64 0)), !dbg !573
  %7 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([80 x i8], [80 x i8]* @"mut,close=authority,seeds=[AuthorityTransfer::SEED],bump=authority_transfer.bump", i64 0, i64 0)), !dbg !574
  %8 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([18 x i8], [18 x i8]* @authority_transfer, i64 0, i64 0), i8* getelementptr inbounds ([37 x i8], [37 x i8]* @"Box<Account<'info,AuthorityTransfer>>", i64 0, i64 0)), !dbg !575
  ret i8* %0, !dbg !568
}

define i8* @sol.model.struct.anchor.AcceptAuthorityTransfer(i8* %0) !dbg !576 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !577
  %3 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @mut, i64 0, i64 0)), !dbg !579
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @new_authority, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @"Signer<'info>", i64 0, i64 0)), !dbg !580
  %5 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([41 x i8], [41 x i8]* @"mut,seeds=[Config::SEED],bump=config.bump", i64 0, i64 0)), !dbg !581
  %6 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @config, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Box<Account<'info,Config>>", i64 0, i64 0)), !dbg !582
  %7 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([84 x i8], [84 x i8]* @"mut,close=new_authority,seeds=[AuthorityTransfer::SEED],bump=authority_transfer.bump", i64 0, i64 0)), !dbg !583
  %8 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([18 x i8], [18 x i8]* @authority_transfer, i64 0, i64 0), i8* getelementptr inbounds ([37 x i8], [37 x i8]* @"Box<Account<'info,AuthorityTransfer>>", i64 0, i64 0)), !dbg !584
  ret i8* %0, !dbg !577
}

define i8* @sol.model.struct.anchor.CreateMarket(i8* %0) !dbg !585 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !586
  %3 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @mut, i64 0, i64 0)), !dbg !588
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @payer, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @"Signer<'info>", i64 0, i64 0)), !dbg !589
  %5 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([90 x i8], [90 x i8]* @"init,payer=payer,space=8+Market::INIT_SPACE,seeds=[Market::SEED,market_uuid.as_ref()],bump", i64 0, i64 0)), !dbg !590
  %6 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @market, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Box<Account<'info,Market>>", i64 0, i64 0)), !dbg !591
  %7 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([124 x i8], [124 x i8]* @"init_if_needed,payer=payer,space=8+UserMarketCreation::INIT_SPACE,seeds=[UserMarketCreation::SEED,payer.key().as_ref()],bump", i64 0, i64 0)), !dbg !592
  %8 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([20 x i8], [20 x i8]* @user_market_creation, i64 0, i64 0), i8* getelementptr inbounds ([38 x i8], [38 x i8]* @"Box<Account<'info,UserMarketCreation>>", i64 0, i64 0)), !dbg !593
  %9 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([37 x i8], [37 x i8]* @"seeds=[Config::SEED],bump=config.bump", i64 0, i64 0)), !dbg !594
  %10 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @config, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Box<Account<'info,Config>>", i64 0, i64 0)), !dbg !595
  %11 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @system_program, i64 0, i64 0), i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"Program<'info,System>", i64 0, i64 0)), !dbg !596
  ret i8* %0, !dbg !586
}

define i8* @sol.model.struct.anchor.Deposit(i8* %0) !dbg !597 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !598
  %3 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @mut, i64 0, i64 0)), !dbg !600
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @user, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @"Signer<'info>", i64 0, i64 0)), !dbg !601
  %5 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([37 x i8], [37 x i8]* @"seeds=[Config::SEED],bump=config.bump", i64 0, i64 0)), !dbg !602
  %6 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @config, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Box<Account<'info,Config>>", i64 0, i64 0)), !dbg !603
  %7 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([69 x i8], [69 x i8]* @"constraint=usdc_mint.key()==config.usdc_mint@VaultError::MintMismatch", i64 0, i64 0)), !dbg !604
  %8 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @usdc_mint, i64 0, i64 0), i8* getelementptr inbounds ([24 x i8], [24 x i8]* @"Box<Account<'info,Mint>>", i64 0, i64 0)), !dbg !605
  %9 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([104 x i8], [104 x i8]* @"init_if_needed,payer=user,space=8+UserVault::INIT_SPACE,seeds=[UserVault::SEED,user.key().as_ref()],bump", i64 0, i64 0)), !dbg !606
  %10 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @user_vault, i64 0, i64 0), i8* getelementptr inbounds ([29 x i8], [29 x i8]* @"Box<Account<'info,UserVault>>", i64 0, i64 0)), !dbg !607
  %11 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([70 x i8], [70 x i8]* @"mut,associated_token::mint=usdc_mint,associated_token::authority=user,", i64 0, i64 0)), !dbg !608
  %12 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @user_usdc_ata, i64 0, i64 0), i8* getelementptr inbounds ([32 x i8], [32 x i8]* @"Box<Account<'info,TokenAccount>>", i64 0, i64 0)), !dbg !609
  %13 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([150 x i8], [150 x i8]* @"mut,associated_token::mint=usdc_mint,associated_token::authority=config,constraint=vault_usdc_ata.key()!=user_usdc_ata.key()@VaultError::InvalidAmount", i64 0, i64 0)), !dbg !610
  %14 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @vault_usdc_ata, i64 0, i64 0), i8* getelementptr inbounds ([32 x i8], [32 x i8]* @"Box<Account<'info,TokenAccount>>", i64 0, i64 0)), !dbg !611
  %15 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @token_program, i64 0, i64 0), i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"Program<'info,Token>", i64 0, i64 0)), !dbg !612
  %16 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([24 x i8], [24 x i8]* @associated_token_program, i64 0, i64 0), i8* getelementptr inbounds ([30 x i8], [30 x i8]* @"Program<'info,AssociatedToken>", i64 0, i64 0)), !dbg !613
  %17 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @system_program, i64 0, i64 0), i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"Program<'info,System>", i64 0, i64 0)), !dbg !614
  ret i8* %0, !dbg !598
}

define i8* @sol.model.struct.anchor.Withdraw(i8* %0) !dbg !615 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !616
  %3 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @mut, i64 0, i64 0)), !dbg !618
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @user, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @"Signer<'info>", i64 0, i64 0)), !dbg !619
  %5 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([37 x i8], [37 x i8]* @"seeds=[Config::SEED],bump=config.bump", i64 0, i64 0)), !dbg !620
  %6 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @config, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Box<Account<'info,Config>>", i64 0, i64 0)), !dbg !621
  %7 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([69 x i8], [69 x i8]* @"constraint=usdc_mint.key()==config.usdc_mint@VaultError::MintMismatch", i64 0, i64 0)), !dbg !622
  %8 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @usdc_mint, i64 0, i64 0), i8* getelementptr inbounds ([24 x i8], [24 x i8]* @"Box<Account<'info,Mint>>", i64 0, i64 0)), !dbg !623
  %9 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([133 x i8], [133 x i8]* @"mut,seeds=[UserVault::SEED,user.key().as_ref()],bump=user_vault.bump,constraint=user_vault.user==user.key()@VaultError::NotAuthorized", i64 0, i64 0)), !dbg !624
  %10 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @user_vault, i64 0, i64 0), i8* getelementptr inbounds ([29 x i8], [29 x i8]* @"Box<Account<'info,UserVault>>", i64 0, i64 0)), !dbg !625
  %11 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([70 x i8], [70 x i8]* @"mut,associated_token::mint=usdc_mint,associated_token::authority=user,", i64 0, i64 0)), !dbg !626
  %12 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @user_usdc_ata, i64 0, i64 0), i8* getelementptr inbounds ([32 x i8], [32 x i8]* @"Box<Account<'info,TokenAccount>>", i64 0, i64 0)), !dbg !627
  %13 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([150 x i8], [150 x i8]* @"mut,associated_token::mint=usdc_mint,associated_token::authority=config,constraint=vault_usdc_ata.key()!=user_usdc_ata.key()@VaultError::InvalidAmount", i64 0, i64 0)), !dbg !628
  %14 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @vault_usdc_ata, i64 0, i64 0), i8* getelementptr inbounds ([32 x i8], [32 x i8]* @"Box<Account<'info,TokenAccount>>", i64 0, i64 0)), !dbg !629
  %15 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @token_program, i64 0, i64 0), i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"Program<'info,Token>", i64 0, i64 0)), !dbg !630
  ret i8* %0, !dbg !616
}

define i8* @sol.model.struct.anchor.PlaceBet(i8* %0) !dbg !631 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !632
  %3 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @mut, i64 0, i64 0)), !dbg !634
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @user, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @"Signer<'info>", i64 0, i64 0)), !dbg !635
  %5 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @quote_authority, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @"Signer<'info>", i64 0, i64 0)), !dbg !636
  %6 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([37 x i8], [37 x i8]* @"seeds=[Config::SEED],bump=config.bump", i64 0, i64 0)), !dbg !637
  %7 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @config, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Box<Account<'info,Config>>", i64 0, i64 0)), !dbg !638
  %8 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([62 x i8], [62 x i8]* @"mut,seeds=[Market::SEED,market.uuid.as_ref()],bump=market.bump", i64 0, i64 0)), !dbg !639
  %9 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @market, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Box<Account<'info,Market>>", i64 0, i64 0)), !dbg !640
  %10 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([124 x i8], [124 x i8]* @"init_if_needed,payer=user,space=8+Position::INIT_SPACE,seeds=[Position::SEED,market.key().as_ref(),user.key().as_ref()],bump", i64 0, i64 0)), !dbg !641
  %11 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([8 x i8], [8 x i8]* @position, i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"Box<Account<'info,Position>>", i64 0, i64 0)), !dbg !642
  %12 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([69 x i8], [69 x i8]* @"constraint=usdc_mint.key()==config.usdc_mint@VaultError::MintMismatch", i64 0, i64 0)), !dbg !643
  %13 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @usdc_mint, i64 0, i64 0), i8* getelementptr inbounds ([24 x i8], [24 x i8]* @"Box<Account<'info,Mint>>", i64 0, i64 0)), !dbg !644
  %14 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([70 x i8], [70 x i8]* @"mut,associated_token::mint=usdc_mint,associated_token::authority=user,", i64 0, i64 0)), !dbg !645
  %15 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @user_usdc_ata, i64 0, i64 0), i8* getelementptr inbounds ([32 x i8], [32 x i8]* @"Box<Account<'info,TokenAccount>>", i64 0, i64 0)), !dbg !646
  %16 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([152 x i8], [152 x i8]* @"mut,associated_token::mint=usdc_mint,associated_token::authority=market,constraint=market_vault_ata.key()!=user_usdc_ata.key()@VaultError::InvalidAmount", i64 0, i64 0)), !dbg !647
  %17 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @market_vault_ata, i64 0, i64 0), i8* getelementptr inbounds ([32 x i8], [32 x i8]* @"Box<Account<'info,TokenAccount>>", i64 0, i64 0)), !dbg !648
  %18 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @token_program, i64 0, i64 0), i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"Program<'info,Token>", i64 0, i64 0)), !dbg !649
  %19 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([24 x i8], [24 x i8]* @associated_token_program, i64 0, i64 0), i8* getelementptr inbounds ([30 x i8], [30 x i8]* @"Program<'info,AssociatedToken>", i64 0, i64 0)), !dbg !650
  %20 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @system_program, i64 0, i64 0), i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"Program<'info,System>", i64 0, i64 0)), !dbg !651
  ret i8* %0, !dbg !632
}

define i8* @sol.model.struct.anchor.SellPosition(i8* %0) !dbg !652 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !653
  %3 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @mut, i64 0, i64 0)), !dbg !655
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @user, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @"Signer<'info>", i64 0, i64 0)), !dbg !656
  %5 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @quote_authority, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @"Signer<'info>", i64 0, i64 0)), !dbg !657
  %6 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([37 x i8], [37 x i8]* @"seeds=[Config::SEED],bump=config.bump", i64 0, i64 0)), !dbg !658
  %7 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @config, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Box<Account<'info,Config>>", i64 0, i64 0)), !dbg !659
  %8 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([62 x i8], [62 x i8]* @"mut,seeds=[Market::SEED,market.uuid.as_ref()],bump=market.bump", i64 0, i64 0)), !dbg !660
  %9 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @market, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Box<Account<'info,Market>>", i64 0, i64 0)), !dbg !661
  %10 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([150 x i8], [150 x i8]* @"mut,seeds=[Position::SEED,market.key().as_ref(),user.key().as_ref()],bump=position.bump,constraint=position.user==user.key()@VaultError::NotAuthorized", i64 0, i64 0)), !dbg !662
  %11 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([8 x i8], [8 x i8]* @position, i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"Box<Account<'info,Position>>", i64 0, i64 0)), !dbg !663
  %12 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([69 x i8], [69 x i8]* @"constraint=usdc_mint.key()==config.usdc_mint@VaultError::MintMismatch", i64 0, i64 0)), !dbg !664
  %13 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @usdc_mint, i64 0, i64 0), i8* getelementptr inbounds ([24 x i8], [24 x i8]* @"Box<Account<'info,Mint>>", i64 0, i64 0)), !dbg !665
  %14 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([70 x i8], [70 x i8]* @"mut,associated_token::mint=usdc_mint,associated_token::authority=user,", i64 0, i64 0)), !dbg !666
  %15 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @user_usdc_ata, i64 0, i64 0), i8* getelementptr inbounds ([32 x i8], [32 x i8]* @"Box<Account<'info,TokenAccount>>", i64 0, i64 0)), !dbg !667
  %16 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([152 x i8], [152 x i8]* @"mut,associated_token::mint=usdc_mint,associated_token::authority=market,constraint=market_vault_ata.key()!=user_usdc_ata.key()@VaultError::InvalidAmount", i64 0, i64 0)), !dbg !668
  %17 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @market_vault_ata, i64 0, i64 0), i8* getelementptr inbounds ([32 x i8], [32 x i8]* @"Box<Account<'info,TokenAccount>>", i64 0, i64 0)), !dbg !669
  %18 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @token_program, i64 0, i64 0), i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"Program<'info,Token>", i64 0, i64 0)), !dbg !670
  ret i8* %0, !dbg !653
}

define i8* @sol.model.struct.anchor.ResolveMarket(i8* %0) !dbg !671 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !672
  %3 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @"Signer<'info>", i64 0, i64 0)), !dbg !674
  %4 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([37 x i8], [37 x i8]* @"seeds=[Config::SEED],bump=config.bump", i64 0, i64 0)), !dbg !675
  %5 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @config, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Box<Account<'info,Config>>", i64 0, i64 0)), !dbg !676
  %6 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([62 x i8], [62 x i8]* @"mut,seeds=[Market::SEED,market.uuid.as_ref()],bump=market.bump", i64 0, i64 0)), !dbg !677
  %7 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @market, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Box<Account<'info,Market>>", i64 0, i64 0)), !dbg !678
  ret i8* %0, !dbg !672
}

define i8* @sol.model.struct.anchor.ClaimWinnings(i8* %0) !dbg !679 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !680
  %3 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @mut, i64 0, i64 0)), !dbg !682
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @user, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @"Signer<'info>", i64 0, i64 0)), !dbg !683
  %5 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([37 x i8], [37 x i8]* @"seeds=[Config::SEED],bump=config.bump", i64 0, i64 0)), !dbg !684
  %6 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @config, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Box<Account<'info,Config>>", i64 0, i64 0)), !dbg !685
  %7 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([62 x i8], [62 x i8]* @"mut,seeds=[Market::SEED,market.uuid.as_ref()],bump=market.bump", i64 0, i64 0)), !dbg !686
  %8 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @market, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Box<Account<'info,Market>>", i64 0, i64 0)), !dbg !687
  %9 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([150 x i8], [150 x i8]* @"mut,seeds=[Position::SEED,market.key().as_ref(),user.key().as_ref()],bump=position.bump,constraint=position.user==user.key()@VaultError::NotAuthorized", i64 0, i64 0)), !dbg !688
  %10 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([8 x i8], [8 x i8]* @position, i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"Box<Account<'info,Position>>", i64 0, i64 0)), !dbg !689
  %11 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([69 x i8], [69 x i8]* @"constraint=usdc_mint.key()==config.usdc_mint@VaultError::MintMismatch", i64 0, i64 0)), !dbg !690
  %12 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @usdc_mint, i64 0, i64 0), i8* getelementptr inbounds ([24 x i8], [24 x i8]* @"Box<Account<'info,Mint>>", i64 0, i64 0)), !dbg !691
  %13 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([70 x i8], [70 x i8]* @"mut,associated_token::mint=usdc_mint,associated_token::authority=user,", i64 0, i64 0)), !dbg !692
  %14 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @user_usdc_ata, i64 0, i64 0), i8* getelementptr inbounds ([32 x i8], [32 x i8]* @"Box<Account<'info,TokenAccount>>", i64 0, i64 0)), !dbg !693
  %15 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([152 x i8], [152 x i8]* @"mut,associated_token::mint=usdc_mint,associated_token::authority=market,constraint=market_vault_ata.key()!=user_usdc_ata.key()@VaultError::InvalidAmount", i64 0, i64 0)), !dbg !694
  %16 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @market_vault_ata, i64 0, i64 0), i8* getelementptr inbounds ([32 x i8], [32 x i8]* @"Box<Account<'info,TokenAccount>>", i64 0, i64 0)), !dbg !695
  %17 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @token_program, i64 0, i64 0), i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"Program<'info,Token>", i64 0, i64 0)), !dbg !696
  ret i8* %0, !dbg !680
}

define i8* @sol.model.struct.anchor.CollectFees(i8* %0) !dbg !697 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !698
  %3 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @mut, i64 0, i64 0)), !dbg !700
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @"Signer<'info>", i64 0, i64 0)), !dbg !701
  %5 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([37 x i8], [37 x i8]* @"seeds=[Config::SEED],bump=config.bump", i64 0, i64 0)), !dbg !702
  %6 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @config, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Box<Account<'info,Config>>", i64 0, i64 0)), !dbg !703
  %7 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([62 x i8], [62 x i8]* @"mut,seeds=[Market::SEED,market.uuid.as_ref()],bump=market.bump", i64 0, i64 0)), !dbg !704
  %8 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @market, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Box<Account<'info,Market>>", i64 0, i64 0)), !dbg !705
  %9 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([74 x i8], [74 x i8]* @"constraint=fee_recipient.key()==config.authority@VaultError::NotAuthorized", i64 0, i64 0)), !dbg !706
  %10 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @fee_recipient, i64 0, i64 0), i8* getelementptr inbounds ([23 x i8], [23 x i8]* @"UncheckedAccount<'info>", i64 0, i64 0)), !dbg !707
  %11 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([69 x i8], [69 x i8]* @"constraint=usdc_mint.key()==config.usdc_mint@VaultError::MintMismatch", i64 0, i64 0)), !dbg !708
  %12 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @usdc_mint, i64 0, i64 0), i8* getelementptr inbounds ([24 x i8], [24 x i8]* @"Box<Account<'info,Mint>>", i64 0, i64 0)), !dbg !709
  %13 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([72 x i8], [72 x i8]* @"mut,associated_token::mint=usdc_mint,associated_token::authority=market,", i64 0, i64 0)), !dbg !710
  %14 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @market_vault_ata, i64 0, i64 0), i8* getelementptr inbounds ([32 x i8], [32 x i8]* @"Box<Account<'info,TokenAccount>>", i64 0, i64 0)), !dbg !711
  %15 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([163 x i8], [163 x i8]* @"mut,associated_token::mint=usdc_mint,associated_token::authority=fee_recipient,constraint=fee_recipient_ata.key()!=market_vault_ata.key()@VaultError::InvalidAmount", i64 0, i64 0)), !dbg !712
  %16 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @fee_recipient_ata, i64 0, i64 0), i8* getelementptr inbounds ([32 x i8], [32 x i8]* @"Box<Account<'info,TokenAccount>>", i64 0, i64 0)), !dbg !713
  %17 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @token_program, i64 0, i64 0), i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"Program<'info,Token>", i64 0, i64 0)), !dbg !714
  %18 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([24 x i8], [24 x i8]* @associated_token_program, i64 0, i64 0), i8* getelementptr inbounds ([30 x i8], [30 x i8]* @"Program<'info,AssociatedToken>", i64 0, i64 0)), !dbg !715
  %19 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @system_program, i64 0, i64 0), i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"Program<'info,System>", i64 0, i64 0)), !dbg !716
  ret i8* %0, !dbg !698
}

define i8* @sol.model.struct.anchor.RefundCancelled(i8* %0) !dbg !717 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !718
  %3 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @mut, i64 0, i64 0)), !dbg !720
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @user, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @"Signer<'info>", i64 0, i64 0)), !dbg !721
  %5 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([37 x i8], [37 x i8]* @"seeds=[Config::SEED],bump=config.bump", i64 0, i64 0)), !dbg !722
  %6 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @config, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Box<Account<'info,Config>>", i64 0, i64 0)), !dbg !723
  %7 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([62 x i8], [62 x i8]* @"mut,seeds=[Market::SEED,market.uuid.as_ref()],bump=market.bump", i64 0, i64 0)), !dbg !724
  %8 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @market, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Box<Account<'info,Market>>", i64 0, i64 0)), !dbg !725
  %9 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([150 x i8], [150 x i8]* @"mut,seeds=[Position::SEED,market.key().as_ref(),user.key().as_ref()],bump=position.bump,constraint=position.user==user.key()@VaultError::NotAuthorized", i64 0, i64 0)), !dbg !726
  %10 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([8 x i8], [8 x i8]* @position, i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"Box<Account<'info,Position>>", i64 0, i64 0)), !dbg !727
  %11 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([69 x i8], [69 x i8]* @"constraint=usdc_mint.key()==config.usdc_mint@VaultError::MintMismatch", i64 0, i64 0)), !dbg !728
  %12 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @usdc_mint, i64 0, i64 0), i8* getelementptr inbounds ([24 x i8], [24 x i8]* @"Box<Account<'info,Mint>>", i64 0, i64 0)), !dbg !729
  %13 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([70 x i8], [70 x i8]* @"mut,associated_token::mint=usdc_mint,associated_token::authority=user,", i64 0, i64 0)), !dbg !730
  %14 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @user_usdc_ata, i64 0, i64 0), i8* getelementptr inbounds ([32 x i8], [32 x i8]* @"Box<Account<'info,TokenAccount>>", i64 0, i64 0)), !dbg !731
  %15 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([152 x i8], [152 x i8]* @"mut,associated_token::mint=usdc_mint,associated_token::authority=market,constraint=market_vault_ata.key()!=user_usdc_ata.key()@VaultError::InvalidAmount", i64 0, i64 0)), !dbg !732
  %16 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @market_vault_ata, i64 0, i64 0), i8* getelementptr inbounds ([32 x i8], [32 x i8]* @"Box<Account<'info,TokenAccount>>", i64 0, i64 0)), !dbg !733
  %17 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @token_program, i64 0, i64 0), i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"Program<'info,Token>", i64 0, i64 0)), !dbg !734
  ret i8* %0, !dbg !718
}

define i8* @sol.model.struct.anchor.ClosePosition(i8* %0) !dbg !735 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !736
  %3 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @mut, i64 0, i64 0)), !dbg !738
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @user, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @"Signer<'info>", i64 0, i64 0)), !dbg !739
  %5 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([164 x i8], [164 x i8]* @"mut,close=user,seeds=[Position::SEED,position.market.as_ref(),user.key().as_ref()],bump=position.bump,constraint=position.user==user.key()@VaultError::NotAuthorized", i64 0, i64 0)), !dbg !740
  %6 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([8 x i8], [8 x i8]* @position, i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"Box<Account<'info,Position>>", i64 0, i64 0)), !dbg !741
  ret i8* %0, !dbg !736
}

!llvm.dbg.cu = !{!0}
!llvm.module.flags = !{!2}

!0 = distinct !DICompileUnit(language: DW_LANG_C, file: !1, producer: "mlir", isOptimized: true, runtimeVersion: 0, emissionKind: FullDebug)
!1 = !DIFile(filename: "LLVMDialectModule", directory: "/")
!2 = !{i32 2, !"Debug Info Version", i32 3}
!3 = distinct !DISubprogram(name: "sol.model.cargo.toml", linkageName: "sol.model.cargo.toml", scope: null, file: !4, type: !5, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!4 = !DIFile(filename: "programs/prediction_market_vault/Cargo.toml", directory: "/workspace")
!5 = !DISubroutineType(types: !6)
!6 = !{}
!7 = !DILocation(line: 0, scope: !8)
!8 = !DILexicalBlockFile(scope: !3, file: !9, discriminator: 0)
!9 = !DIFile(filename: "Cargo.toml", directory: "/workspace")
!10 = !DILocation(line: 0, scope: !11)
!11 = !DILexicalBlockFile(scope: !3, file: !4, discriminator: 0)
!12 = distinct !DISubprogram(name: "sol.model.declare_id.address", linkageName: "sol.model.declare_id.address", scope: null, file: !4, type: !5, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!13 = !DILocation(line: 0, scope: !14)
!14 = !DILexicalBlockFile(scope: !12, file: !15, discriminator: 0)
!15 = !DIFile(filename: "lib.rs", directory: "/workspace")
!16 = !DILocation(line: 0, scope: !17)
!17 = !DILexicalBlockFile(scope: !12, file: !4, discriminator: 0)
!18 = distinct !DISubprogram(name: "sol.model.struct.anchor.Config", linkageName: "sol.model.struct.anchor.Config", scope: null, file: !19, line: 29, type: !5, scopeLine: 29, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!19 = !DIFile(filename: "programs/prediction_market_vault/src/lib.rs", directory: "/workspace")
!20 = !DILocation(line: 29, column: 4, scope: !21)
!21 = !DILexicalBlockFile(scope: !18, file: !19, discriminator: 0)
!22 = !DILocation(line: 31, column: 8, scope: !21)
!23 = !DILocation(line: 33, column: 8, scope: !21)
!24 = !DILocation(line: 35, column: 8, scope: !21)
!25 = !DILocation(line: 36, column: 8, scope: !21)
!26 = distinct !DISubprogram(name: "sol.model.struct.Config", linkageName: "sol.model.struct.Config", scope: null, file: !19, line: 29, type: !5, scopeLine: 29, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!27 = !DILocation(line: 29, column: 4, scope: !28)
!28 = !DILexicalBlockFile(scope: !26, file: !19, discriminator: 0)
!29 = !DILocation(line: 31, column: 8, scope: !28)
!30 = !DILocation(line: 33, column: 8, scope: !28)
!31 = !DILocation(line: 35, column: 8, scope: !28)
!32 = !DILocation(line: 36, column: 8, scope: !28)
!33 = distinct !DISubprogram(name: "sol.model.struct.anchor.AuthorityTransfer", linkageName: "sol.model.struct.anchor.AuthorityTransfer", scope: null, file: !19, line: 45, type: !5, scopeLine: 45, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!34 = !DILocation(line: 45, column: 4, scope: !35)
!35 = !DILexicalBlockFile(scope: !33, file: !19, discriminator: 0)
!36 = !DILocation(line: 47, column: 8, scope: !35)
!37 = !DILocation(line: 49, column: 8, scope: !35)
!38 = !DILocation(line: 50, column: 8, scope: !35)
!39 = distinct !DISubprogram(name: "sol.model.struct.AuthorityTransfer", linkageName: "sol.model.struct.AuthorityTransfer", scope: null, file: !19, line: 45, type: !5, scopeLine: 45, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!40 = !DILocation(line: 45, column: 4, scope: !41)
!41 = !DILexicalBlockFile(scope: !39, file: !19, discriminator: 0)
!42 = !DILocation(line: 47, column: 8, scope: !41)
!43 = !DILocation(line: 49, column: 8, scope: !41)
!44 = !DILocation(line: 50, column: 8, scope: !41)
!45 = distinct !DISubprogram(name: "sol.model.struct.anchor.UserVault", linkageName: "sol.model.struct.anchor.UserVault", scope: null, file: !19, line: 62, type: !5, scopeLine: 62, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!46 = !DILocation(line: 62, column: 4, scope: !47)
!47 = !DILexicalBlockFile(scope: !45, file: !19, discriminator: 0)
!48 = !DILocation(line: 63, column: 8, scope: !47)
!49 = !DILocation(line: 65, column: 8, scope: !47)
!50 = !DILocation(line: 66, column: 8, scope: !47)
!51 = distinct !DISubprogram(name: "sol.model.struct.UserVault", linkageName: "sol.model.struct.UserVault", scope: null, file: !19, line: 62, type: !5, scopeLine: 62, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!52 = !DILocation(line: 62, column: 4, scope: !53)
!53 = !DILexicalBlockFile(scope: !51, file: !19, discriminator: 0)
!54 = !DILocation(line: 63, column: 8, scope: !53)
!55 = !DILocation(line: 65, column: 8, scope: !53)
!56 = !DILocation(line: 66, column: 8, scope: !53)
!57 = distinct !DISubprogram(name: "sol.model.struct.anchor.UserMarketCreation", linkageName: "sol.model.struct.anchor.UserMarketCreation", scope: null, file: !19, line: 75, type: !5, scopeLine: 75, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!58 = !DILocation(line: 75, column: 4, scope: !59)
!59 = !DILexicalBlockFile(scope: !57, file: !19, discriminator: 0)
!60 = !DILocation(line: 76, column: 8, scope: !59)
!61 = !DILocation(line: 81, column: 8, scope: !59)
!62 = !DILocation(line: 82, column: 8, scope: !59)
!63 = distinct !DISubprogram(name: "sol.model.struct.UserMarketCreation", linkageName: "sol.model.struct.UserMarketCreation", scope: null, file: !19, line: 75, type: !5, scopeLine: 75, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!64 = !DILocation(line: 75, column: 4, scope: !65)
!65 = !DILexicalBlockFile(scope: !63, file: !19, discriminator: 0)
!66 = !DILocation(line: 76, column: 8, scope: !65)
!67 = !DILocation(line: 81, column: 8, scope: !65)
!68 = !DILocation(line: 82, column: 8, scope: !65)
!69 = distinct !DISubprogram(name: "sol.model.struct.anchor.Market", linkageName: "sol.model.struct.anchor.Market", scope: null, file: !19, line: 91, type: !5, scopeLine: 91, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!70 = !DILocation(line: 91, column: 4, scope: !71)
!71 = !DILexicalBlockFile(scope: !69, file: !19, discriminator: 0)
!72 = !DILocation(line: 93, column: 8, scope: !71)
!73 = !DILocation(line: 95, column: 8, scope: !71)
!74 = !DILocation(line: 97, column: 8, scope: !71)
!75 = !DILocation(line: 99, column: 8, scope: !71)
!76 = !DILocation(line: 101, column: 8, scope: !71)
!77 = !DILocation(line: 103, column: 8, scope: !71)
!78 = !DILocation(line: 104, column: 8, scope: !71)
!79 = distinct !DISubprogram(name: "sol.model.struct.Market", linkageName: "sol.model.struct.Market", scope: null, file: !19, line: 91, type: !5, scopeLine: 91, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!80 = !DILocation(line: 91, column: 4, scope: !81)
!81 = !DILexicalBlockFile(scope: !79, file: !19, discriminator: 0)
!82 = !DILocation(line: 93, column: 8, scope: !81)
!83 = !DILocation(line: 95, column: 8, scope: !81)
!84 = !DILocation(line: 97, column: 8, scope: !81)
!85 = !DILocation(line: 99, column: 8, scope: !81)
!86 = !DILocation(line: 101, column: 8, scope: !81)
!87 = !DILocation(line: 103, column: 8, scope: !81)
!88 = !DILocation(line: 104, column: 8, scope: !81)
!89 = distinct !DISubprogram(name: "sol.model.struct.anchor.Position", linkageName: "sol.model.struct.anchor.Position", scope: null, file: !19, line: 113, type: !5, scopeLine: 113, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!90 = !DILocation(line: 113, column: 4, scope: !91)
!91 = !DILexicalBlockFile(scope: !89, file: !19, discriminator: 0)
!92 = !DILocation(line: 114, column: 8, scope: !91)
!93 = !DILocation(line: 115, column: 8, scope: !91)
!94 = !DILocation(line: 116, column: 8, scope: !91)
!95 = !DILocation(line: 117, column: 8, scope: !91)
!96 = !DILocation(line: 118, column: 8, scope: !91)
!97 = distinct !DISubprogram(name: "sol.model.struct.Position", linkageName: "sol.model.struct.Position", scope: null, file: !19, line: 113, type: !5, scopeLine: 113, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!98 = !DILocation(line: 113, column: 4, scope: !99)
!99 = !DILexicalBlockFile(scope: !97, file: !19, discriminator: 0)
!100 = !DILocation(line: 114, column: 8, scope: !99)
!101 = !DILocation(line: 115, column: 8, scope: !99)
!102 = !DILocation(line: 116, column: 8, scope: !99)
!103 = !DILocation(line: 117, column: 8, scope: !99)
!104 = !DILocation(line: 118, column: 8, scope: !99)
!105 = distinct !DISubprogram(name: "lib::initialize_config.2", linkageName: "lib::initialize_config.2", scope: null, file: !19, line: 239, type: !5, scopeLine: 239, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!106 = !DILocation(line: 239, column: 8, scope: !107)
!107 = !DILexicalBlockFile(scope: !105, file: !19, discriminator: 0)
!108 = !DILocation(line: 243, column: 8, scope: !107)
!109 = !DILocation(line: 250, column: 8, scope: !107)
!110 = !DILocation(line: 254, column: 8, scope: !107)
!111 = !DILocation(line: 255, column: 47, scope: !107)
!112 = !DILocation(line: 255, column: 8, scope: !107)
!113 = !DILocation(line: 256, column: 8, scope: !107)
!114 = !DILocation(line: 257, column: 47, scope: !107)
!115 = !DILocation(line: 257, column: 8, scope: !107)
!116 = !DILocation(line: 258, column: 8, scope: !107)
!117 = !DILocation(line: 259, column: 8, scope: !107)
!118 = distinct !DISubprogram(name: "lib::set_pending_authority.2", linkageName: "lib::set_pending_authority.2", scope: null, file: !19, line: 263, type: !5, scopeLine: 263, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!119 = !DILocation(line: 263, column: 8, scope: !120)
!120 = !DILexicalBlockFile(scope: !118, file: !19, discriminator: 0)
!121 = !DILocation(line: 267, column: 8, scope: !120)
!122 = !DILocation(line: 271, column: 8, scope: !120)
!123 = !DILocation(line: 273, column: 8, scope: !120)
!124 = !DILocation(line: 274, column: 8, scope: !120)
!125 = !DILocation(line: 275, column: 8, scope: !120)
!126 = !DILocation(line: 276, column: 8, scope: !120)
!127 = !DILocation(line: 277, column: 8, scope: !120)
!128 = distinct !DISubprogram(name: "lib::cancel_authority_transfer.1", linkageName: "lib::cancel_authority_transfer.1", scope: null, file: !19, line: 281, type: !5, scopeLine: 281, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!129 = !DILocation(line: 281, column: 8, scope: !130)
!130 = !DILexicalBlockFile(scope: !128, file: !19, discriminator: 0)
!131 = !DILocation(line: 282, column: 8, scope: !130)
!132 = !DILocation(line: 286, column: 8, scope: !130)
!133 = distinct !DISubprogram(name: "lib::accept_authority_transfer.1", linkageName: "lib::accept_authority_transfer.1", scope: null, file: !19, line: 290, type: !5, scopeLine: 290, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!134 = !DILocation(line: 290, column: 8, scope: !135)
!135 = !DILexicalBlockFile(scope: !133, file: !19, discriminator: 0)
!136 = !DILocation(line: 291, column: 8, scope: !135)
!137 = !DILocation(line: 295, column: 8, scope: !135)
!138 = !DILocation(line: 300, column: 13, scope: !135)
!139 = !DILocation(line: 301, column: 13, scope: !135)
!140 = !DILocation(line: 296, column: 8, scope: !135)
!141 = !DILocation(line: 302, column: 8, scope: !135)
!142 = !DILocation(line: 303, column: 67, scope: !135)
!143 = !DILocation(line: 303, column: 8, scope: !135)
!144 = !DILocation(line: 304, column: 8, scope: !135)
!145 = distinct !DISubprogram(name: "lib::create_market.anon.1", linkageName: "lib::create_market.anon.1", scope: null, file: !19, line: 314, type: !5, scopeLine: 314, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!146 = !DILocation(line: 314, column: 83, scope: !147)
!147 = !DILexicalBlockFile(scope: !145, file: !19, discriminator: 0)
!148 = !DILocation(line: 317, column: 17, scope: !147)
!149 = !DILocation(line: 318, column: 17, scope: !147)
!150 = !DILocation(line: 315, column: 12, scope: !147)
!151 = distinct !DISubprogram(name: "lib::create_market.anon.2", linkageName: "lib::create_market.anon.2", scope: null, file: !19, line: 320, type: !5, scopeLine: 320, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!152 = !DILocation(line: 320, column: 43, scope: !153)
!153 = !DILexicalBlockFile(scope: !151, file: !19, discriminator: 0)
!154 = distinct !DISubprogram(name: "lib::create_market.anon.3", linkageName: "lib::create_market.anon.3", scope: null, file: !19, line: 323, type: !5, scopeLine: 323, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!155 = !DILocation(line: 323, column: 15, scope: !156)
!156 = !DILexicalBlockFile(scope: !154, file: !19, discriminator: 0)
!157 = distinct !DISubprogram(name: "lib::create_market.anon.4", linkageName: "lib::create_market.anon.4", scope: null, file: !19, line: 328, type: !5, scopeLine: 328, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!158 = !DILocation(line: 328, column: 36, scope: !159)
!159 = !DILexicalBlockFile(scope: !157, file: !19, discriminator: 0)
!160 = !DILocation(line: 329, column: 12, scope: !159)
!161 = !DILocation(line: 330, column: 12, scope: !159)
!162 = distinct !DISubprogram(name: "lib::create_market.anon.5", linkageName: "lib::create_market.anon.5", scope: null, file: !19, line: 333, type: !5, scopeLine: 333, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!163 = !DILocation(line: 333, column: 94, scope: !164)
!164 = !DILexicalBlockFile(scope: !162, file: !19, discriminator: 0)
!165 = !DILocation(line: 334, column: 12, scope: !164)
!166 = !DILocation(line: 335, column: 12, scope: !164)
!167 = distinct !DISubprogram(name: "lib::create_market.anon.6", linkageName: "lib::create_market.anon.6", scope: null, file: !19, line: 343, type: !5, scopeLine: 343, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!168 = !DILocation(line: 343, column: 32, scope: !169)
!169 = !DILexicalBlockFile(scope: !167, file: !19, discriminator: 0)
!170 = !DILocation(line: 344, column: 12, scope: !169)
!171 = distinct !DISubprogram(name: "lib::create_market.2", linkageName: "lib::create_market.2", scope: null, file: !19, line: 309, type: !5, scopeLine: 309, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!172 = !DILocation(line: 309, column: 8, scope: !173)
!173 = !DILexicalBlockFile(scope: !171, file: !19, discriminator: 0)
!174 = !DILocation(line: 310, column: 8, scope: !173)
!175 = !DILocation(line: 311, column: 8, scope: !173)
!176 = !DILocation(line: 314, column: 58, scope: !173)
!177 = !DILocation(line: 314, column: 55, scope: !173)
!178 = !DILocation(line: 314, column: 83, scope: !173)
!179 = !DILocation(line: 320, column: 18, scope: !173)
!180 = !DILocation(line: 320, column: 15, scope: !173)
!181 = !DILocation(line: 320, column: 43, scope: !173)
!182 = !DILocation(line: 323, column: 15, scope: !173)
!183 = !DILocation(line: 314, column: 8, scope: !173)
!184 = !DILocation(line: 328, column: 11, scope: !173)
!185 = !DILocation(line: 328, column: 8, scope: !173)
!186 = !DILocation(line: 328, column: 36, scope: !173)
!187 = !DILocation(line: 333, column: 11, scope: !173)
!188 = !DILocation(line: 333, column: 35, scope: !173)
!189 = !DILocation(line: 333, column: 8, scope: !173)
!190 = !DILocation(line: 333, column: 94, scope: !173)
!191 = !DILocation(line: 338, column: 8, scope: !173)
!192 = !DILocation(line: 343, column: 11, scope: !173)
!193 = !DILocation(line: 343, column: 8, scope: !173)
!194 = !DILocation(line: 343, column: 32, scope: !173)
!195 = !DILocation(line: 347, column: 13, scope: !173)
!196 = !DILocation(line: 348, column: 13, scope: !173)
!197 = !DILocation(line: 346, column: 8, scope: !173)
!198 = !DILocation(line: 351, column: 13, scope: !173)
!199 = !DILocation(line: 352, column: 28, scope: !173)
!200 = !DILocation(line: 352, column: 13, scope: !173)
!201 = !DILocation(line: 353, column: 28, scope: !173)
!202 = !DILocation(line: 353, column: 13, scope: !173)
!203 = !DILocation(line: 354, column: 13, scope: !173)
!204 = !DILocation(line: 350, column: 8, scope: !173)
!205 = !DILocation(line: 356, column: 39, scope: !173)
!206 = !DILocation(line: 356, column: 8, scope: !173)
!207 = !DILocation(line: 357, column: 8, scope: !173)
!208 = !DILocation(line: 358, column: 8, scope: !173)
!209 = !DILocation(line: 360, column: 8, scope: !173)
!210 = !DILocation(line: 361, column: 8, scope: !173)
!211 = !DILocation(line: 362, column: 8, scope: !173)
!212 = !DILocation(line: 363, column: 8, scope: !173)
!213 = !DILocation(line: 364, column: 8, scope: !173)
!214 = !DILocation(line: 365, column: 8, scope: !173)
!215 = !DILocation(line: 366, column: 8, scope: !173)
!216 = !DILocation(line: 367, column: 8, scope: !173)
!217 = !DILocation(line: 368, column: 8, scope: !173)
!218 = distinct !DISubprogram(name: "lib::deposit.2", linkageName: "lib::deposit.2", scope: null, file: !19, line: 375, type: !5, scopeLine: 375, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!219 = !DILocation(line: 375, column: 8, scope: !220)
!220 = !DILexicalBlockFile(scope: !218, file: !19, discriminator: 0)
!221 = !DILocation(line: 376, column: 8, scope: !220)
!222 = !DILocation(line: 380, column: 45, scope: !220)
!223 = !DILocation(line: 380, column: 12, scope: !220)
!224 = !DILocation(line: 381, column: 44, scope: !220)
!225 = !DILocation(line: 381, column: 12, scope: !220)
!226 = !DILocation(line: 382, column: 41, scope: !220)
!227 = !DILocation(line: 382, column: 12, scope: !220)
!228 = !DILocation(line: 383, column: 41, scope: !220)
!229 = !DILocation(line: 383, column: 12, scope: !220)
!230 = !DILocation(line: 379, column: 27, scope: !220)
!231 = !DILocation(line: 379, column: 8, scope: !220)
!232 = !DILocation(line: 385, column: 65, scope: !220)
!233 = !DILocation(line: 385, column: 22, scope: !220)
!234 = !DILocation(line: 385, column: 8, scope: !220)
!235 = !DILocation(line: 386, column: 8, scope: !220)
!236 = !DILocation(line: 388, column: 8, scope: !220)
!237 = !DILocation(line: 389, column: 36, scope: !220)
!238 = !DILocation(line: 389, column: 8, scope: !220)
!239 = !DILocation(line: 390, column: 8, scope: !220)
!240 = !DILocation(line: 393, column: 13, scope: !220)
!241 = !DILocation(line: 394, column: 13, scope: !220)
!242 = !DILocation(line: 391, column: 8, scope: !220)
!243 = !DILocation(line: 396, column: 8, scope: !220)
!244 = !DILocation(line: 397, column: 8, scope: !220)
!245 = !DILocation(line: 403, column: 8, scope: !220)
!246 = distinct !DISubprogram(name: "lib::withdraw.2", linkageName: "lib::withdraw.2", scope: null, file: !19, line: 410, type: !5, scopeLine: 410, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!247 = !DILocation(line: 410, column: 8, scope: !248)
!248 = !DILexicalBlockFile(scope: !246, file: !19, discriminator: 0)
!249 = !DILocation(line: 411, column: 8, scope: !248)
!250 = !DILocation(line: 413, column: 8, scope: !248)
!251 = !DILocation(line: 414, column: 8, scope: !248)
!252 = !DILocation(line: 417, column: 13, scope: !248)
!253 = !DILocation(line: 418, column: 13, scope: !248)
!254 = !DILocation(line: 415, column: 8, scope: !248)
!255 = !DILocation(line: 421, column: 8, scope: !248)
!256 = !DILocation(line: 423, column: 46, scope: !248)
!257 = !DILocation(line: 423, column: 12, scope: !248)
!258 = !DILocation(line: 424, column: 43, scope: !248)
!259 = !DILocation(line: 424, column: 12, scope: !248)
!260 = !DILocation(line: 425, column: 43, scope: !248)
!261 = !DILocation(line: 425, column: 12, scope: !248)
!262 = !DILocation(line: 426, column: 41, scope: !248)
!263 = !DILocation(line: 426, column: 12, scope: !248)
!264 = !DILocation(line: 422, column: 27, scope: !248)
!265 = !DILocation(line: 422, column: 8, scope: !248)
!266 = !DILocation(line: 429, column: 39, scope: !248)
!267 = !DILocation(line: 428, column: 22, scope: !248)
!268 = !DILocation(line: 428, column: 8, scope: !248)
!269 = !DILocation(line: 433, column: 8, scope: !248)
!270 = !DILocation(line: 435, column: 8, scope: !248)
!271 = !DILocation(line: 436, column: 8, scope: !248)
!272 = !DILocation(line: 442, column: 8, scope: !248)
!273 = distinct !DISubprogram(name: "lib::place_bet.anon.1", linkageName: "lib::place_bet.anon.1", scope: null, file: !19, line: 481, type: !5, scopeLine: 481, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!274 = !DILocation(line: 481, column: 24, scope: !275)
!275 = !DILexicalBlockFile(scope: !273, file: !19, discriminator: 0)
!276 = !DILocation(line: 484, column: 17, scope: !275)
!277 = !DILocation(line: 485, column: 17, scope: !275)
!278 = !DILocation(line: 482, column: 12, scope: !275)
!279 = !DILocation(line: 490, column: 17, scope: !275)
!280 = !DILocation(line: 491, column: 17, scope: !275)
!281 = !DILocation(line: 486, column: 12, scope: !275)
!282 = distinct !DISubprogram(name: "lib::place_bet.anon.2", linkageName: "lib::place_bet.anon.2", scope: null, file: !19, line: 492, type: !5, scopeLine: 492, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!283 = !DILocation(line: 492, column: 15, scope: !284)
!284 = !DILexicalBlockFile(scope: !282, file: !19, discriminator: 0)
!285 = !DILocation(line: 495, column: 17, scope: !284)
!286 = !DILocation(line: 496, column: 17, scope: !284)
!287 = !DILocation(line: 493, column: 12, scope: !284)
!288 = !DILocation(line: 501, column: 17, scope: !284)
!289 = !DILocation(line: 502, column: 17, scope: !284)
!290 = !DILocation(line: 497, column: 12, scope: !284)
!291 = distinct !DISubprogram(name: "lib::place_bet.6", linkageName: "lib::place_bet.6", scope: null, file: !19, line: 453, type: !5, scopeLine: 453, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!292 = !DILocation(line: 453, column: 8, scope: !293)
!293 = !DILexicalBlockFile(scope: !291, file: !19, discriminator: 0)
!294 = !DILocation(line: 461, column: 8, scope: !293)
!295 = !DILocation(line: 462, column: 8, scope: !293)
!296 = !DILocation(line: 463, column: 8, scope: !293)
!297 = !DILocation(line: 464, column: 8, scope: !293)
!298 = !DILocation(line: 468, column: 8, scope: !293)
!299 = !DILocation(line: 469, column: 8, scope: !293)
!300 = !DILocation(line: 470, column: 8, scope: !293)
!301 = !DILocation(line: 476, column: 8, scope: !293)
!302 = !DILocation(line: 477, column: 41, scope: !293)
!303 = !DILocation(line: 477, column: 8, scope: !293)
!304 = !DILocation(line: 478, column: 37, scope: !293)
!305 = !DILocation(line: 478, column: 8, scope: !293)
!306 = !DILocation(line: 479, column: 8, scope: !293)
!307 = !DILocation(line: 481, column: 11, scope: !293)
!308 = !DILocation(line: 481, column: 8, scope: !293)
!309 = !DILocation(line: 481, column: 24, scope: !293)
!310 = !DILocation(line: 492, column: 15, scope: !293)
!311 = !DILocation(line: 507, column: 45, scope: !293)
!312 = !DILocation(line: 507, column: 12, scope: !293)
!313 = !DILocation(line: 508, column: 46, scope: !293)
!314 = !DILocation(line: 508, column: 12, scope: !293)
!315 = !DILocation(line: 509, column: 41, scope: !293)
!316 = !DILocation(line: 509, column: 12, scope: !293)
!317 = !DILocation(line: 510, column: 41, scope: !293)
!318 = !DILocation(line: 510, column: 12, scope: !293)
!319 = !DILocation(line: 506, column: 27, scope: !293)
!320 = !DILocation(line: 506, column: 8, scope: !293)
!321 = !DILocation(line: 512, column: 65, scope: !293)
!322 = !DILocation(line: 512, column: 22, scope: !293)
!323 = !DILocation(line: 512, column: 8, scope: !293)
!324 = !DILocation(line: 513, column: 8, scope: !293)
!325 = !DILocation(line: 515, column: 8, scope: !293)
!326 = !DILocation(line: 523, column: 8, scope: !293)
!327 = distinct !DISubprogram(name: "lib::sell_position.anon.1", linkageName: "lib::sell_position.anon.1", scope: null, file: !19, line: 555, type: !5, scopeLine: 555, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!328 = !DILocation(line: 555, column: 24, scope: !329)
!329 = !DILexicalBlockFile(scope: !327, file: !19, discriminator: 0)
!330 = !DILocation(line: 556, column: 12, scope: !329)
!331 = !DILocation(line: 559, column: 17, scope: !329)
!332 = !DILocation(line: 560, column: 17, scope: !329)
!333 = !DILocation(line: 557, column: 12, scope: !329)
!334 = !DILocation(line: 565, column: 17, scope: !329)
!335 = !DILocation(line: 566, column: 17, scope: !329)
!336 = !DILocation(line: 561, column: 12, scope: !329)
!337 = distinct !DISubprogram(name: "lib::sell_position.anon.2", linkageName: "lib::sell_position.anon.2", scope: null, file: !19, line: 567, type: !5, scopeLine: 567, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!338 = !DILocation(line: 567, column: 15, scope: !339)
!339 = !DILexicalBlockFile(scope: !337, file: !19, discriminator: 0)
!340 = !DILocation(line: 568, column: 12, scope: !339)
!341 = !DILocation(line: 571, column: 17, scope: !339)
!342 = !DILocation(line: 572, column: 17, scope: !339)
!343 = !DILocation(line: 569, column: 12, scope: !339)
!344 = !DILocation(line: 577, column: 17, scope: !339)
!345 = !DILocation(line: 578, column: 17, scope: !339)
!346 = !DILocation(line: 573, column: 12, scope: !339)
!347 = distinct !DISubprogram(name: "lib::sell_position.6", linkageName: "lib::sell_position.6", scope: null, file: !19, line: 534, type: !5, scopeLine: 534, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!348 = !DILocation(line: 534, column: 8, scope: !349)
!349 = !DILexicalBlockFile(scope: !347, file: !19, discriminator: 0)
!350 = !DILocation(line: 542, column: 8, scope: !349)
!351 = !DILocation(line: 543, column: 8, scope: !349)
!352 = !DILocation(line: 544, column: 8, scope: !349)
!353 = !DILocation(line: 545, column: 8, scope: !349)
!354 = !DILocation(line: 546, column: 8, scope: !349)
!355 = !DILocation(line: 547, column: 8, scope: !349)
!356 = !DILocation(line: 548, column: 8, scope: !349)
!357 = !DILocation(line: 554, column: 8, scope: !349)
!358 = !DILocation(line: 555, column: 11, scope: !349)
!359 = !DILocation(line: 555, column: 8, scope: !349)
!360 = !DILocation(line: 555, column: 24, scope: !349)
!361 = !DILocation(line: 567, column: 15, scope: !349)
!362 = !DILocation(line: 582, column: 8, scope: !349)
!363 = !DILocation(line: 588, column: 48, scope: !349)
!364 = !DILocation(line: 588, column: 12, scope: !349)
!365 = !DILocation(line: 589, column: 43, scope: !349)
!366 = !DILocation(line: 589, column: 12, scope: !349)
!367 = !DILocation(line: 590, column: 43, scope: !349)
!368 = !DILocation(line: 590, column: 12, scope: !349)
!369 = !DILocation(line: 591, column: 41, scope: !349)
!370 = !DILocation(line: 591, column: 12, scope: !349)
!371 = !DILocation(line: 587, column: 27, scope: !349)
!372 = !DILocation(line: 587, column: 8, scope: !349)
!373 = !DILocation(line: 594, column: 39, scope: !349)
!374 = !DILocation(line: 593, column: 22, scope: !349)
!375 = !DILocation(line: 593, column: 8, scope: !349)
!376 = !DILocation(line: 598, column: 8, scope: !349)
!377 = !DILocation(line: 600, column: 8, scope: !349)
!378 = !DILocation(line: 608, column: 8, scope: !349)
!379 = distinct !DISubprogram(name: "lib::resolve_market.2", linkageName: "lib::resolve_market.2", scope: null, file: !19, line: 615, type: !5, scopeLine: 615, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!380 = !DILocation(line: 615, column: 8, scope: !381)
!381 = !DILexicalBlockFile(scope: !379, file: !19, discriminator: 0)
!382 = !DILocation(line: 616, column: 8, scope: !381)
!383 = !DILocation(line: 620, column: 8, scope: !381)
!384 = !DILocation(line: 624, column: 8, scope: !381)
!385 = !DILocation(line: 626, column: 8, scope: !381)
!386 = !DILocation(line: 628, column: 8, scope: !381)
!387 = !DILocation(line: 629, column: 8, scope: !381)
!388 = !DILocation(line: 634, column: 8, scope: !381)
!389 = distinct !DISubprogram(name: "lib::claim_winnings.anon.1", linkageName: "lib::claim_winnings.anon.1", scope: null, file: !19, line: 647, type: !5, scopeLine: 647, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!390 = !DILocation(line: 647, column: 43, scope: !391)
!391 = !DILexicalBlockFile(scope: !389, file: !19, discriminator: 0)
!392 = !DILocation(line: 648, column: 12, scope: !391)
!393 = !DILocation(line: 649, column: 12, scope: !391)
!394 = !DILocation(line: 650, column: 12, scope: !391)
!395 = distinct !DISubprogram(name: "lib::claim_winnings.anon.2", linkageName: "lib::claim_winnings.anon.2", scope: null, file: !19, line: 652, type: !5, scopeLine: 652, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!396 = !DILocation(line: 652, column: 15, scope: !397)
!397 = !DILexicalBlockFile(scope: !395, file: !19, discriminator: 0)
!398 = !DILocation(line: 653, column: 12, scope: !397)
!399 = !DILocation(line: 654, column: 12, scope: !397)
!400 = !DILocation(line: 655, column: 12, scope: !397)
!401 = distinct !DISubprogram(name: "lib::claim_winnings.2", linkageName: "lib::claim_winnings.2", scope: null, file: !19, line: 642, type: !5, scopeLine: 642, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!402 = !DILocation(line: 642, column: 8, scope: !403)
!403 = !DILexicalBlockFile(scope: !401, file: !19, discriminator: 0)
!404 = !DILocation(line: 643, column: 8, scope: !403)
!405 = !DILocation(line: 644, column: 8, scope: !403)
!406 = !DILocation(line: 646, column: 8, scope: !403)
!407 = !DILocation(line: 647, column: 30, scope: !403)
!408 = !DILocation(line: 647, column: 27, scope: !403)
!409 = !DILocation(line: 647, column: 43, scope: !403)
!410 = !DILocation(line: 652, column: 15, scope: !403)
!411 = !DILocation(line: 647, column: 8, scope: !403)
!412 = !DILocation(line: 660, column: 8, scope: !403)
!413 = !DILocation(line: 661, column: 8, scope: !403)
!414 = !DILocation(line: 667, column: 13, scope: !403)
!415 = !DILocation(line: 668, column: 13, scope: !403)
!416 = !DILocation(line: 663, column: 8, scope: !403)
!417 = !DILocation(line: 671, column: 8, scope: !403)
!418 = !DILocation(line: 677, column: 48, scope: !403)
!419 = !DILocation(line: 677, column: 12, scope: !403)
!420 = !DILocation(line: 678, column: 43, scope: !403)
!421 = !DILocation(line: 678, column: 12, scope: !403)
!422 = !DILocation(line: 679, column: 43, scope: !403)
!423 = !DILocation(line: 679, column: 12, scope: !403)
!424 = !DILocation(line: 680, column: 41, scope: !403)
!425 = !DILocation(line: 680, column: 12, scope: !403)
!426 = !DILocation(line: 676, column: 27, scope: !403)
!427 = !DILocation(line: 676, column: 8, scope: !403)
!428 = !DILocation(line: 683, column: 39, scope: !403)
!429 = !DILocation(line: 682, column: 22, scope: !403)
!430 = !DILocation(line: 682, column: 8, scope: !403)
!431 = !DILocation(line: 687, column: 8, scope: !403)
!432 = !DILocation(line: 689, column: 8, scope: !403)
!433 = !DILocation(line: 690, column: 8, scope: !403)
!434 = !DILocation(line: 698, column: 8, scope: !403)
!435 = distinct !DISubprogram(name: "lib::collect_fees.anon.1", linkageName: "lib::collect_fees.anon.1", scope: null, file: !19, line: 715, type: !5, scopeLine: 715, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!436 = !DILocation(line: 715, column: 47, scope: !437)
!437 = !DILexicalBlockFile(scope: !435, file: !19, discriminator: 0)
!438 = distinct !DISubprogram(name: "lib::collect_fees.anon.2", linkageName: "lib::collect_fees.anon.2", scope: null, file: !19, line: 717, type: !5, scopeLine: 717, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!439 = !DILocation(line: 717, column: 31, scope: !440)
!440 = !DILexicalBlockFile(scope: !438, file: !19, discriminator: 0)
!441 = distinct !DISubprogram(name: "lib::collect_fees.anon.3", linkageName: "lib::collect_fees.anon.3", scope: null, file: !19, line: 719, type: !5, scopeLine: 719, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!442 = !DILocation(line: 719, column: 15, scope: !443)
!443 = !DILexicalBlockFile(scope: !441, file: !19, discriminator: 0)
!444 = !DILocation(line: 723, column: 17, scope: !443)
!445 = !DILocation(line: 724, column: 17, scope: !443)
!446 = distinct !DISubprogram(name: "lib::collect_fees.2", linkageName: "lib::collect_fees.2", scope: null, file: !19, line: 705, type: !5, scopeLine: 705, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!447 = !DILocation(line: 705, column: 8, scope: !448)
!448 = !DILexicalBlockFile(scope: !446, file: !19, discriminator: 0)
!449 = !DILocation(line: 706, column: 8, scope: !448)
!450 = !DILocation(line: 707, column: 8, scope: !448)
!451 = !DILocation(line: 712, column: 8, scope: !448)
!452 = !DILocation(line: 713, column: 8, scope: !448)
!453 = !DILocation(line: 715, column: 34, scope: !448)
!454 = !DILocation(line: 715, column: 31, scope: !448)
!455 = !DILocation(line: 715, column: 47, scope: !448)
!456 = !DILocation(line: 717, column: 18, scope: !448)
!457 = !DILocation(line: 717, column: 15, scope: !448)
!458 = !DILocation(line: 717, column: 31, scope: !448)
!459 = !DILocation(line: 719, column: 15, scope: !448)
!460 = !DILocation(line: 715, column: 8, scope: !448)
!461 = !DILocation(line: 727, column: 13, scope: !448)
!462 = !DILocation(line: 728, column: 13, scope: !448)
!463 = !DILocation(line: 726, column: 8, scope: !448)
!464 = !DILocation(line: 729, column: 8, scope: !448)
!465 = !DILocation(line: 734, column: 13, scope: !448)
!466 = !DILocation(line: 735, column: 13, scope: !448)
!467 = !DILocation(line: 730, column: 8, scope: !448)
!468 = !DILocation(line: 736, column: 8, scope: !448)
!469 = !DILocation(line: 739, column: 8, scope: !448)
!470 = !DILocation(line: 745, column: 48, scope: !448)
!471 = !DILocation(line: 745, column: 12, scope: !448)
!472 = !DILocation(line: 746, column: 47, scope: !448)
!473 = !DILocation(line: 746, column: 12, scope: !448)
!474 = !DILocation(line: 747, column: 43, scope: !448)
!475 = !DILocation(line: 747, column: 12, scope: !448)
!476 = !DILocation(line: 748, column: 41, scope: !448)
!477 = !DILocation(line: 748, column: 12, scope: !448)
!478 = !DILocation(line: 744, column: 27, scope: !448)
!479 = !DILocation(line: 744, column: 8, scope: !448)
!480 = !DILocation(line: 751, column: 39, scope: !448)
!481 = !DILocation(line: 750, column: 22, scope: !448)
!482 = !DILocation(line: 750, column: 8, scope: !448)
!483 = !DILocation(line: 755, column: 8, scope: !448)
!484 = !DILocation(line: 757, column: 8, scope: !448)
!485 = !DILocation(line: 758, column: 8, scope: !448)
!486 = !DILocation(line: 764, column: 8, scope: !448)
!487 = distinct !DISubprogram(name: "lib::refund_cancelled.2", linkageName: "lib::refund_cancelled.2", scope: null, file: !19, line: 769, type: !5, scopeLine: 769, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!488 = !DILocation(line: 769, column: 8, scope: !489)
!489 = !DILexicalBlockFile(scope: !487, file: !19, discriminator: 0)
!490 = !DILocation(line: 770, column: 8, scope: !489)
!491 = !DILocation(line: 772, column: 8, scope: !489)
!492 = !DILocation(line: 775, column: 13, scope: !489)
!493 = !DILocation(line: 776, column: 13, scope: !489)
!494 = !DILocation(line: 773, column: 8, scope: !489)
!495 = !DILocation(line: 777, column: 8, scope: !489)
!496 = !DILocation(line: 780, column: 8, scope: !489)
!497 = !DILocation(line: 781, column: 8, scope: !489)
!498 = !DILocation(line: 783, column: 8, scope: !489)
!499 = !DILocation(line: 784, column: 8, scope: !489)
!500 = !DILocation(line: 790, column: 13, scope: !489)
!501 = !DILocation(line: 791, column: 13, scope: !489)
!502 = !DILocation(line: 786, column: 8, scope: !489)
!503 = !DILocation(line: 794, column: 8, scope: !489)
!504 = !DILocation(line: 800, column: 48, scope: !489)
!505 = !DILocation(line: 800, column: 12, scope: !489)
!506 = !DILocation(line: 801, column: 43, scope: !489)
!507 = !DILocation(line: 801, column: 12, scope: !489)
!508 = !DILocation(line: 802, column: 43, scope: !489)
!509 = !DILocation(line: 802, column: 12, scope: !489)
!510 = !DILocation(line: 803, column: 41, scope: !489)
!511 = !DILocation(line: 803, column: 12, scope: !489)
!512 = !DILocation(line: 799, column: 27, scope: !489)
!513 = !DILocation(line: 799, column: 8, scope: !489)
!514 = !DILocation(line: 806, column: 39, scope: !489)
!515 = !DILocation(line: 805, column: 22, scope: !489)
!516 = !DILocation(line: 805, column: 8, scope: !489)
!517 = !DILocation(line: 810, column: 8, scope: !489)
!518 = !DILocation(line: 812, column: 8, scope: !489)
!519 = distinct !DISubprogram(name: "lib::close_position.1", linkageName: "lib::close_position.1", scope: null, file: !19, line: 816, type: !5, scopeLine: 816, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!520 = !DILocation(line: 816, column: 8, scope: !521)
!521 = !DILexicalBlockFile(scope: !519, file: !19, discriminator: 0)
!522 = !DILocation(line: 817, column: 8, scope: !521)
!523 = !DILocation(line: 818, column: 8, scope: !521)
!524 = !DILocation(line: 822, column: 8, scope: !521)
!525 = distinct !DISubprogram(name: "sol.model.anchor.program.prediction_market_vault", linkageName: "sol.model.anchor.program.prediction_market_vault", scope: null, file: !19, line: 234, type: !5, scopeLine: 234, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!526 = !DILocation(line: 234, scope: !527)
!527 = !DILexicalBlockFile(scope: !525, file: !19, discriminator: 0)
!528 = !DILocation(line: 239, column: 4, scope: !527)
!529 = !DILocation(line: 263, column: 4, scope: !527)
!530 = !DILocation(line: 281, column: 4, scope: !527)
!531 = !DILocation(line: 290, column: 4, scope: !527)
!532 = !DILocation(line: 309, column: 4, scope: !527)
!533 = !DILocation(line: 375, column: 4, scope: !527)
!534 = !DILocation(line: 410, column: 4, scope: !527)
!535 = !DILocation(line: 453, column: 4, scope: !527)
!536 = !DILocation(line: 534, column: 4, scope: !527)
!537 = !DILocation(line: 615, column: 4, scope: !527)
!538 = !DILocation(line: 642, column: 4, scope: !527)
!539 = !DILocation(line: 705, column: 4, scope: !527)
!540 = !DILocation(line: 769, column: 4, scope: !527)
!541 = !DILocation(line: 816, column: 4, scope: !527)
!542 = distinct !DISubprogram(name: "main", linkageName: "main", scope: null, file: !19, line: 234, type: !5, scopeLine: 234, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!543 = !DILocation(line: 234, scope: !544)
!544 = !DILexicalBlockFile(scope: !542, file: !19, discriminator: 0)
!545 = distinct !DISubprogram(name: "sol.model.struct.anchor.InitializeConfig", linkageName: "sol.model.struct.anchor.InitializeConfig", scope: null, file: !19, line: 831, type: !5, scopeLine: 831, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!546 = !DILocation(line: 831, column: 4, scope: !547)
!547 = !DILexicalBlockFile(scope: !545, file: !19, discriminator: 0)
!548 = !DILocation(line: 832, column: 6, scope: !547)
!549 = !DILocation(line: 833, column: 8, scope: !547)
!550 = !DILocation(line: 835, column: 6, scope: !547)
!551 = !DILocation(line: 838, column: 8, scope: !547)
!552 = !DILocation(line: 839, column: 8, scope: !547)
!553 = !DILocation(line: 841, column: 6, scope: !547)
!554 = !DILocation(line: 848, column: 8, scope: !547)
!555 = !DILocation(line: 851, column: 8, scope: !547)
!556 = !DILocation(line: 853, column: 8, scope: !547)
!557 = distinct !DISubprogram(name: "sol.model.struct.anchor.SetPendingAuthority", linkageName: "sol.model.struct.anchor.SetPendingAuthority", scope: null, file: !19, line: 857, type: !5, scopeLine: 857, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!558 = !DILocation(line: 857, column: 4, scope: !559)
!559 = !DILexicalBlockFile(scope: !557, file: !19, discriminator: 0)
!560 = !DILocation(line: 858, column: 6, scope: !559)
!561 = !DILocation(line: 859, column: 8, scope: !559)
!562 = !DILocation(line: 861, column: 6, scope: !559)
!563 = !DILocation(line: 865, column: 8, scope: !559)
!564 = !DILocation(line: 867, column: 6, scope: !559)
!565 = !DILocation(line: 874, column: 8, scope: !559)
!566 = !DILocation(line: 876, column: 8, scope: !559)
!567 = distinct !DISubprogram(name: "sol.model.struct.anchor.CancelAuthorityTransfer", linkageName: "sol.model.struct.anchor.CancelAuthorityTransfer", scope: null, file: !19, line: 880, type: !5, scopeLine: 880, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!568 = !DILocation(line: 880, column: 4, scope: !569)
!569 = !DILexicalBlockFile(scope: !567, file: !19, discriminator: 0)
!570 = !DILocation(line: 881, column: 6, scope: !569)
!571 = !DILocation(line: 882, column: 8, scope: !569)
!572 = !DILocation(line: 884, column: 6, scope: !569)
!573 = !DILocation(line: 888, column: 8, scope: !569)
!574 = !DILocation(line: 890, column: 6, scope: !569)
!575 = !DILocation(line: 896, column: 8, scope: !569)
!576 = distinct !DISubprogram(name: "sol.model.struct.anchor.AcceptAuthorityTransfer", linkageName: "sol.model.struct.anchor.AcceptAuthorityTransfer", scope: null, file: !19, line: 900, type: !5, scopeLine: 900, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!577 = !DILocation(line: 900, column: 4, scope: !578)
!578 = !DILexicalBlockFile(scope: !576, file: !19, discriminator: 0)
!579 = !DILocation(line: 901, column: 6, scope: !578)
!580 = !DILocation(line: 902, column: 8, scope: !578)
!581 = !DILocation(line: 904, column: 6, scope: !578)
!582 = !DILocation(line: 909, column: 8, scope: !578)
!583 = !DILocation(line: 911, column: 6, scope: !578)
!584 = !DILocation(line: 917, column: 8, scope: !578)
!585 = distinct !DISubprogram(name: "sol.model.struct.anchor.CreateMarket", linkageName: "sol.model.struct.anchor.CreateMarket", scope: null, file: !19, line: 922, type: !5, scopeLine: 922, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!586 = !DILocation(line: 922, column: 4, scope: !587)
!587 = !DILexicalBlockFile(scope: !585, file: !19, discriminator: 0)
!588 = !DILocation(line: 923, column: 6, scope: !587)
!589 = !DILocation(line: 924, column: 8, scope: !587)
!590 = !DILocation(line: 926, column: 6, scope: !587)
!591 = !DILocation(line: 933, column: 8, scope: !587)
!592 = !DILocation(line: 935, column: 6, scope: !587)
!593 = !DILocation(line: 942, column: 8, scope: !587)
!594 = !DILocation(line: 944, column: 6, scope: !587)
!595 = !DILocation(line: 948, column: 8, scope: !587)
!596 = !DILocation(line: 950, column: 8, scope: !587)
!597 = distinct !DISubprogram(name: "sol.model.struct.anchor.Deposit", linkageName: "sol.model.struct.anchor.Deposit", scope: null, file: !19, line: 955, type: !5, scopeLine: 955, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!598 = !DILocation(line: 955, column: 4, scope: !599)
!599 = !DILexicalBlockFile(scope: !597, file: !19, discriminator: 0)
!600 = !DILocation(line: 956, column: 6, scope: !599)
!601 = !DILocation(line: 957, column: 8, scope: !599)
!602 = !DILocation(line: 959, column: 6, scope: !599)
!603 = !DILocation(line: 963, column: 8, scope: !599)
!604 = !DILocation(line: 966, column: 6, scope: !599)
!605 = !DILocation(line: 969, column: 8, scope: !599)
!606 = !DILocation(line: 971, column: 6, scope: !599)
!607 = !DILocation(line: 978, column: 8, scope: !599)
!608 = !DILocation(line: 981, column: 6, scope: !599)
!609 = !DILocation(line: 986, column: 8, scope: !599)
!610 = !DILocation(line: 989, column: 6, scope: !599)
!611 = !DILocation(line: 995, column: 8, scope: !599)
!612 = !DILocation(line: 997, column: 8, scope: !599)
!613 = !DILocation(line: 998, column: 8, scope: !599)
!614 = !DILocation(line: 999, column: 8, scope: !599)
!615 = distinct !DISubprogram(name: "sol.model.struct.anchor.Withdraw", linkageName: "sol.model.struct.anchor.Withdraw", scope: null, file: !19, line: 1004, type: !5, scopeLine: 1004, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!616 = !DILocation(line: 1004, column: 4, scope: !617)
!617 = !DILexicalBlockFile(scope: !615, file: !19, discriminator: 0)
!618 = !DILocation(line: 1005, column: 6, scope: !617)
!619 = !DILocation(line: 1006, column: 8, scope: !617)
!620 = !DILocation(line: 1008, column: 6, scope: !617)
!621 = !DILocation(line: 1012, column: 8, scope: !617)
!622 = !DILocation(line: 1015, column: 6, scope: !617)
!623 = !DILocation(line: 1018, column: 8, scope: !617)
!624 = !DILocation(line: 1020, column: 6, scope: !617)
!625 = !DILocation(line: 1026, column: 8, scope: !617)
!626 = !DILocation(line: 1029, column: 6, scope: !617)
!627 = !DILocation(line: 1034, column: 8, scope: !617)
!628 = !DILocation(line: 1037, column: 6, scope: !617)
!629 = !DILocation(line: 1043, column: 8, scope: !617)
!630 = !DILocation(line: 1045, column: 8, scope: !617)
!631 = distinct !DISubprogram(name: "sol.model.struct.anchor.PlaceBet", linkageName: "sol.model.struct.anchor.PlaceBet", scope: null, file: !19, line: 1049, type: !5, scopeLine: 1049, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!632 = !DILocation(line: 1049, column: 4, scope: !633)
!633 = !DILexicalBlockFile(scope: !631, file: !19, discriminator: 0)
!634 = !DILocation(line: 1050, column: 6, scope: !633)
!635 = !DILocation(line: 1051, column: 8, scope: !633)
!636 = !DILocation(line: 1054, column: 8, scope: !633)
!637 = !DILocation(line: 1056, column: 6, scope: !633)
!638 = !DILocation(line: 1060, column: 8, scope: !633)
!639 = !DILocation(line: 1062, column: 6, scope: !633)
!640 = !DILocation(line: 1067, column: 8, scope: !633)
!641 = !DILocation(line: 1069, column: 6, scope: !633)
!642 = !DILocation(line: 1076, column: 8, scope: !633)
!643 = !DILocation(line: 1079, column: 6, scope: !633)
!644 = !DILocation(line: 1082, column: 8, scope: !633)
!645 = !DILocation(line: 1085, column: 6, scope: !633)
!646 = !DILocation(line: 1090, column: 8, scope: !633)
!647 = !DILocation(line: 1093, column: 6, scope: !633)
!648 = !DILocation(line: 1099, column: 8, scope: !633)
!649 = !DILocation(line: 1101, column: 8, scope: !633)
!650 = !DILocation(line: 1102, column: 8, scope: !633)
!651 = !DILocation(line: 1103, column: 8, scope: !633)
!652 = distinct !DISubprogram(name: "sol.model.struct.anchor.SellPosition", linkageName: "sol.model.struct.anchor.SellPosition", scope: null, file: !19, line: 1107, type: !5, scopeLine: 1107, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!653 = !DILocation(line: 1107, column: 4, scope: !654)
!654 = !DILexicalBlockFile(scope: !652, file: !19, discriminator: 0)
!655 = !DILocation(line: 1108, column: 6, scope: !654)
!656 = !DILocation(line: 1109, column: 8, scope: !654)
!657 = !DILocation(line: 1112, column: 8, scope: !654)
!658 = !DILocation(line: 1114, column: 6, scope: !654)
!659 = !DILocation(line: 1118, column: 8, scope: !654)
!660 = !DILocation(line: 1120, column: 6, scope: !654)
!661 = !DILocation(line: 1125, column: 8, scope: !654)
!662 = !DILocation(line: 1127, column: 6, scope: !654)
!663 = !DILocation(line: 1133, column: 8, scope: !654)
!664 = !DILocation(line: 1136, column: 6, scope: !654)
!665 = !DILocation(line: 1139, column: 8, scope: !654)
!666 = !DILocation(line: 1142, column: 6, scope: !654)
!667 = !DILocation(line: 1147, column: 8, scope: !654)
!668 = !DILocation(line: 1150, column: 6, scope: !654)
!669 = !DILocation(line: 1156, column: 8, scope: !654)
!670 = !DILocation(line: 1158, column: 8, scope: !654)
!671 = distinct !DISubprogram(name: "sol.model.struct.anchor.ResolveMarket", linkageName: "sol.model.struct.anchor.ResolveMarket", scope: null, file: !19, line: 1162, type: !5, scopeLine: 1162, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!672 = !DILocation(line: 1162, column: 4, scope: !673)
!673 = !DILexicalBlockFile(scope: !671, file: !19, discriminator: 0)
!674 = !DILocation(line: 1163, column: 8, scope: !673)
!675 = !DILocation(line: 1165, column: 6, scope: !673)
!676 = !DILocation(line: 1169, column: 8, scope: !673)
!677 = !DILocation(line: 1171, column: 6, scope: !673)
!678 = !DILocation(line: 1176, column: 8, scope: !673)
!679 = distinct !DISubprogram(name: "sol.model.struct.anchor.ClaimWinnings", linkageName: "sol.model.struct.anchor.ClaimWinnings", scope: null, file: !19, line: 1180, type: !5, scopeLine: 1180, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!680 = !DILocation(line: 1180, column: 4, scope: !681)
!681 = !DILexicalBlockFile(scope: !679, file: !19, discriminator: 0)
!682 = !DILocation(line: 1181, column: 6, scope: !681)
!683 = !DILocation(line: 1182, column: 8, scope: !681)
!684 = !DILocation(line: 1184, column: 6, scope: !681)
!685 = !DILocation(line: 1188, column: 8, scope: !681)
!686 = !DILocation(line: 1190, column: 6, scope: !681)
!687 = !DILocation(line: 1195, column: 8, scope: !681)
!688 = !DILocation(line: 1197, column: 6, scope: !681)
!689 = !DILocation(line: 1203, column: 8, scope: !681)
!690 = !DILocation(line: 1206, column: 6, scope: !681)
!691 = !DILocation(line: 1209, column: 8, scope: !681)
!692 = !DILocation(line: 1212, column: 6, scope: !681)
!693 = !DILocation(line: 1217, column: 8, scope: !681)
!694 = !DILocation(line: 1220, column: 6, scope: !681)
!695 = !DILocation(line: 1226, column: 8, scope: !681)
!696 = !DILocation(line: 1228, column: 8, scope: !681)
!697 = distinct !DISubprogram(name: "sol.model.struct.anchor.CollectFees", linkageName: "sol.model.struct.anchor.CollectFees", scope: null, file: !19, line: 1232, type: !5, scopeLine: 1232, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!698 = !DILocation(line: 1232, column: 4, scope: !699)
!699 = !DILexicalBlockFile(scope: !697, file: !19, discriminator: 0)
!700 = !DILocation(line: 1233, column: 6, scope: !699)
!701 = !DILocation(line: 1234, column: 8, scope: !699)
!702 = !DILocation(line: 1236, column: 6, scope: !699)
!703 = !DILocation(line: 1240, column: 8, scope: !699)
!704 = !DILocation(line: 1242, column: 6, scope: !699)
!705 = !DILocation(line: 1247, column: 8, scope: !699)
!706 = !DILocation(line: 1251, column: 6, scope: !699)
!707 = !DILocation(line: 1254, column: 8, scope: !699)
!708 = !DILocation(line: 1257, column: 6, scope: !699)
!709 = !DILocation(line: 1260, column: 8, scope: !699)
!710 = !DILocation(line: 1263, column: 6, scope: !699)
!711 = !DILocation(line: 1268, column: 8, scope: !699)
!712 = !DILocation(line: 1271, column: 6, scope: !699)
!713 = !DILocation(line: 1277, column: 8, scope: !699)
!714 = !DILocation(line: 1279, column: 8, scope: !699)
!715 = !DILocation(line: 1280, column: 8, scope: !699)
!716 = !DILocation(line: 1281, column: 8, scope: !699)
!717 = distinct !DISubprogram(name: "sol.model.struct.anchor.RefundCancelled", linkageName: "sol.model.struct.anchor.RefundCancelled", scope: null, file: !19, line: 1285, type: !5, scopeLine: 1285, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!718 = !DILocation(line: 1285, column: 4, scope: !719)
!719 = !DILexicalBlockFile(scope: !717, file: !19, discriminator: 0)
!720 = !DILocation(line: 1286, column: 6, scope: !719)
!721 = !DILocation(line: 1287, column: 8, scope: !719)
!722 = !DILocation(line: 1289, column: 6, scope: !719)
!723 = !DILocation(line: 1293, column: 8, scope: !719)
!724 = !DILocation(line: 1295, column: 6, scope: !719)
!725 = !DILocation(line: 1300, column: 8, scope: !719)
!726 = !DILocation(line: 1302, column: 6, scope: !719)
!727 = !DILocation(line: 1308, column: 8, scope: !719)
!728 = !DILocation(line: 1311, column: 6, scope: !719)
!729 = !DILocation(line: 1314, column: 8, scope: !719)
!730 = !DILocation(line: 1317, column: 6, scope: !719)
!731 = !DILocation(line: 1322, column: 8, scope: !719)
!732 = !DILocation(line: 1325, column: 6, scope: !719)
!733 = !DILocation(line: 1331, column: 8, scope: !719)
!734 = !DILocation(line: 1333, column: 8, scope: !719)
!735 = distinct !DISubprogram(name: "sol.model.struct.anchor.ClosePosition", linkageName: "sol.model.struct.anchor.ClosePosition", scope: null, file: !19, line: 1337, type: !5, scopeLine: 1337, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!736 = !DILocation(line: 1337, column: 4, scope: !737)
!737 = !DILexicalBlockFile(scope: !735, file: !19, discriminator: 0)
!738 = !DILocation(line: 1338, column: 6, scope: !737)
!739 = !DILocation(line: 1339, column: 8, scope: !737)
!740 = !DILocation(line: 1341, column: 6, scope: !737)
!741 = !DILocation(line: 1348, column: 8, scope: !737)
