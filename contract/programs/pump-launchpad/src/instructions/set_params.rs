use crate::{
    constants::{DEV_PUBKEY, GLOBAL_SEED},
    error::PumpLaunchpadError,
    state::Global,
};
use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct SetParamsArgs {
    pub authority: Pubkey,
    pub fee_recipient: Pubkey,
    pub fee_basis_points: u16,
    pub max_supply: u64,
    pub creator_supply: u64,
    pub price: u64,
    pub initialized: bool,
}

#[derive(Accounts)]
pub struct SetParams<'info> {
    #[account(
        mut,
        seeds = [GLOBAL_SEED],
        bump = global.bump,
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

pub fn set_params_handler(ctx: Context<SetParams>, args: SetParamsArgs) -> Result<()> {
    let global = &mut ctx.accounts.global;
    global.authority = args.authority;
    global.fee_recipient = args.fee_recipient;
    global.fee_basis_points = args.fee_basis_points;
    global.max_supply = args.max_supply;
    global.creator_supply = args.creator_supply;
    global.price = args.price;
    global.initialized = args.initialized;

    Ok(())
}
