use crate::{
    constants::{ALLOCATION_SEED, GLOBAL_SEED, LAUNCH_SEED},
    error::PumpLaunchpadError,
    state::{Allocation, Global, Launch},
};
use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{transfer, Mint, Token, TokenAccount, Transfer},
};

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut, address = global.authority)]
    pub user: Signer<'info>,
    #[account(
        init_if_needed,
        seeds = [
            ALLOCATION_SEED,
            launch.creator.key().as_ref(),
            launch.id.to_le_bytes().as_ref()
        ],
        payer = user,
        space = 8 + Allocation::INIT_SPACE,
        bump,
    )]
    pub allocation: Box<Account<'info, Allocation>>,
    #[account(
        mut,
        seeds = [GLOBAL_SEED],
        bump = global.bump,
    )]
    pub global: Box<Account<'info, Global>>,
    #[account(
        mut,
        associated_token::mint = token_mint,
        associated_token::authority = user,
    )]
    pub associated_user: Box<Account<'info, TokenAccount>>,
    #[account(
        mut,
        seeds = [
            LAUNCH_SEED,
            launch.id.to_le_bytes().as_ref()
        ],
        bump = launch.bump,
    )]
    pub launch: Box<Account<'info, Launch>>,
    pub token_mint: Box<Account<'info, Mint>>,
    #[account(
        init,
        associated_token::mint = token_mint,
        associated_token::authority = launch,
        payer = user,
    )]
    pub associated_launch: Box<Account<'info, TokenAccount>>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn deposit_handler(ctx: Context<Deposit>) -> Result<()> {
    let global = &mut ctx.accounts.global;
    require!(global.initialized, PumpLaunchpadError::GlobalNotInitialized);

    let launch = &mut ctx.accounts.launch;

    require!(launch.completed, PumpLaunchpadError::LaunchNotCompleted);
    require!(launch.withdrawn, PumpLaunchpadError::LaunchNotWithdrawn);
    require!(!launch.deposited, PumpLaunchpadError::LaunchDeposited);

    launch.deposited = true;
    launch.mint = ctx.accounts.token_mint.to_account_info().key();

    transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.associated_user.to_account_info(),
                to: ctx.accounts.associated_launch.to_account_info(),
                authority: ctx.accounts.user.to_account_info(),
            },
        ),
        launch.max_supply + global.creator_supply,
    )?;

    let allocation = &mut ctx.accounts.allocation;

    if !allocation.initialized {
        allocation.initialized = true;
        allocation.id = launch.id;
        allocation.user = *ctx.accounts.user.key;
        allocation.bump = ctx.bumps.allocation;
    }
    allocation.token_amount += global.creator_supply;

    Ok(())
}
