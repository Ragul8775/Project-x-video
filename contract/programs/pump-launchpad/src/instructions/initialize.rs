use crate::{
    constants::{DEV_PUBKEY, GLOBAL_SEED},
    error::PumpLaunchpadError,
    state::Global,
};
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        seeds = [GLOBAL_SEED],
        payer = user,
        space = 8 + Global::INIT_SPACE,
        bump,
    )]
    pub global: Box<Account<'info, Global>>,
    #[account(
        mut,
        address = DEV_PUBKEY
        @PumpLaunchpadError::InvalidUser,
    )]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn initialize_handler(ctx: Context<Initialize>) -> Result<()> {
    ctx.accounts.global.bump = ctx.bumps.global;

    Ok(())
}
