use crate::{
    constants::{GLOBAL_SEED, LAUNCH_SEED, WRAPPED_SOL_MINT},
    error::PumpLaunchpadError,
    state::{Global, Launch},
};
use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{transfer, Mint, Token, TokenAccount, Transfer},
};

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut, address = global.authority)]
    pub user: Signer<'info>,
    #[account(
        mut,
        seeds = [GLOBAL_SEED],
        bump = global.bump,
    )]
    pub global: Box<Account<'info, Global>>,
    #[account(
        init_if_needed,
        associated_token::mint = token_mint,
        associated_token::authority = user,
        payer = user,
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
    #[account(address = WRAPPED_SOL_MINT)]
    pub token_mint: Box<Account<'info, Mint>>,
    #[account(
        mut,
        associated_token::mint = token_mint,
        associated_token::authority = launch,
    )]
    pub associated_launch: Box<Account<'info, TokenAccount>>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn withdraw_handler(ctx: Context<Withdraw>) -> Result<()> {
    let global = &mut ctx.accounts.global;
    require!(global.initialized, PumpLaunchpadError::GlobalNotInitialized);

    let launch = &mut ctx.accounts.launch;

    require!(launch.completed, PumpLaunchpadError::LaunchNotCompleted);
    require!(!launch.withdrawn, PumpLaunchpadError::LaunchWithdrawn);

    launch.withdrawn = true;

    let id_seed: [u8; 4] = launch.id.to_le_bytes();
    let signer_seed = &[LAUNCH_SEED, id_seed.as_ref(), &[launch.bump]];

    let sol_amount =
        (((launch.max_supply as f64) / (10u64.pow(6) as f64)) * (launch.price as f64)) as u64;

    transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.associated_launch.to_account_info(),
                to: ctx.accounts.associated_user.to_account_info(),
                authority: ctx.accounts.launch.to_account_info(),
            },
            &[signer_seed],
        ),
        sol_amount,
    )?;

    Ok(())
}
