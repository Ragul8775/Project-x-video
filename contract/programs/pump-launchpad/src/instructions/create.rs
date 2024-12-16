use crate::{
    constants::{GLOBAL_SEED, LAUNCH_SEED, WRAPPED_SOL_MINT},
    error::PumpLaunchpadError,
    state::{Global, Launch},
};
use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Mint, Token, TokenAccount},
};

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct CreateArgs {
    pub name: String,
    pub symbol: String,
    pub uri: String,
}

#[derive(Accounts)]
pub struct Create<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        mut,
        seeds = [GLOBAL_SEED],
        bump = global.bump,
    )]
    pub global: Box<Account<'info, Global>>,
    #[account(
        init,
        seeds = [
            LAUNCH_SEED,
            (global.tokens + 1).to_le_bytes().as_ref()
        ],
        payer = user,
        space = 8 + Launch::INIT_SPACE,
        bump,
    )]
    pub launch: Box<Account<'info, Launch>>,
    #[account(address = WRAPPED_SOL_MINT)]
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

pub fn create_handler(ctx: Context<Create>, args: CreateArgs) -> Result<()> {
    let global = &mut ctx.accounts.global;
    require!(global.initialized, PumpLaunchpadError::GlobalNotInitialized);

    global.tokens += 1;

    let launch = &mut ctx.accounts.launch;
    launch.id = global.tokens;
    launch.creator = ctx.accounts.user.key();
    launch.name = args.name;
    launch.symbol = args.symbol;
    launch.uri = args.uri;
    launch.max_supply = global.max_supply;
    launch.price = global.price;
    launch.bump = ctx.bumps.launch;

    Ok(())
}
