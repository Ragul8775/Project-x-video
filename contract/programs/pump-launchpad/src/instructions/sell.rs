use crate::{
    constants::{ALLOCATION_SEED, GLOBAL_SEED, LAUNCH_SEED, WRAPPED_SOL_MINT},
    error::PumpLaunchpadError,
    events::TokenTraded,
    state::{Allocation, Global, Launch},
};
use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{transfer, Mint, Token, TokenAccount, Transfer},
};

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct SellArgs {
    pub token_amount: u64,
}

#[derive(Accounts)]
pub struct Sell<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        mut,
        seeds = [
            ALLOCATION_SEED,
            user.key().as_ref(),
            launch.id.to_le_bytes().as_ref()
        ],
        bump = allocation.bump,
    )]
    pub allocation: Box<Account<'info, Allocation>>,
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
    #[account(
        mut,
        address = global.fee_recipient
        @PumpLaunchpadError::InvalidFeeRecipient,
    )]
    pub fee_recipient: SystemAccount<'info>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn sell_handler(ctx: Context<Sell>, args: SellArgs) -> Result<()> {
    let global = &mut ctx.accounts.global;
    require!(global.initialized, PumpLaunchpadError::GlobalNotInitialized);

    let launch = &mut ctx.accounts.launch;
    require!(!launch.completed, PumpLaunchpadError::LaunchCompleted);

    launch.sold_supply -= args.token_amount;

    let sol_amount =
        (((args.token_amount as f64) / (10u64.pow(6) as f64)) * (launch.price as f64)) as u64;

    let id_seed: [u8; 4] = launch.id.to_le_bytes();
    let signer_seed = &[LAUNCH_SEED, id_seed.as_ref(), &[launch.bump]];

    let allocation = &mut ctx.accounts.allocation;

    require!(
        allocation.token_amount >= args.token_amount,
        PumpLaunchpadError::InsufficientFunds
    );

    allocation.token_amount -= args.token_amount;

    transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.associated_launch.to_account_info(),
                to: ctx.accounts.associated_user.to_account_info(),
                authority: launch.to_account_info(),
            },
            &[signer_seed],
        ),
        sol_amount,
    )?;

    let fee_amount = sol_amount
        .checked_mul(global.fee_basis_points as u64)
        .and_then(|fee| fee.checked_div(10000))
        .ok_or(PumpLaunchpadError::ArithmeticError)?;

    launch.fee_collected += fee_amount;

    anchor_lang::system_program::transfer(
        CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            anchor_lang::system_program::Transfer {
                from: ctx.accounts.user.to_account_info(),
                to: ctx.accounts.fee_recipient.to_account_info(),
            },
        ),
        fee_amount,
    )?;

    emit!(TokenTraded {
        is_buy: true,
        id: launch.id,
        user: ctx.accounts.user.key(),
        token_amount: args.token_amount,
        sold_supply: launch.sold_supply,
    });

    Ok(())
}
