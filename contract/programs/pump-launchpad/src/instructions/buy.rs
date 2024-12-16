use crate::{
    constants::{ALLOCATION_SEED, GLOBAL_SEED, LAUNCH_SEED, WRAPPED_SOL_MINT},
    error::PumpLaunchpadError,
    events::{LaunchCompleted, TokenTraded},
    state::{Allocation, Global, Launch},
};
use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{transfer, Mint, Token, TokenAccount, Transfer},
};

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct BuyArgs {
    pub token_amount: u64,
}

#[derive(Accounts)]
pub struct Buy<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        init_if_needed,
        seeds = [
            ALLOCATION_SEED,
            user.key().as_ref(),
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

pub fn buy_handler(ctx: Context<Buy>, args: BuyArgs) -> Result<()> {
    let global = &mut ctx.accounts.global;
    require!(global.initialized, PumpLaunchpadError::GlobalNotInitialized);

    let launch = &mut ctx.accounts.launch;
    require!(!launch.completed, PumpLaunchpadError::LaunchCompleted);

    launch.sold_supply += args.token_amount;

    require!(
        launch.sold_supply <= launch.max_supply,
        PumpLaunchpadError::MaxSupplyExceeded
    );

    let sol_amount =
        (((args.token_amount as f64) / (10u64.pow(6) as f64)) * (launch.price as f64)) as u64;

    let allocation = &mut ctx.accounts.allocation;
    if !allocation.initialized {
        allocation.initialized = true;
        allocation.id = launch.id;
        allocation.user = *ctx.accounts.user.key;
        allocation.bump = ctx.bumps.allocation;
    }

    allocation.token_amount += args.token_amount;

    transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.associated_user.to_account_info(),
                to: ctx.accounts.associated_launch.to_account_info(),
                authority: ctx.accounts.user.to_account_info(),
            },
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

    if launch.sold_supply == launch.max_supply {
        launch.completed = true;

        emit!(LaunchCompleted {
            id: launch.id,
            price: launch.price,
            max_supply: launch.max_supply,
            creator_supply: global.creator_supply
        });
    }

    emit!(TokenTraded {
        is_buy: true,
        id: launch.id,
        user: ctx.accounts.user.key(),
        token_amount: args.token_amount,
        sold_supply: launch.sold_supply,
    });

    Ok(())
}
