pub mod constants;
pub mod error;
pub mod events;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;
use instructions::{
    buy::*, claim::*, create::*, deposit::*, initialize::*, sell::*, set_params::*, withdraw::*,
};

declare_id!("FZ2caJb5v1E6HfdEdstWKJzBieGXei6gfrZfqBq6dDZj");

#[program]
pub mod pump_launchpad {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        initialize_handler(ctx)?;
        Ok(())
    }

    pub fn set_params(ctx: Context<SetParams>, args: SetParamsArgs) -> Result<()> {
        set_params_handler(ctx, args)?;
        Ok(())
    }

    pub fn create(ctx: Context<Create>, args: CreateArgs) -> Result<()> {
        create_handler(ctx, args)?;
        Ok(())
    }

    pub fn buy(ctx: Context<Buy>, args: BuyArgs) -> Result<()> {
        buy_handler(ctx, args)?;
        Ok(())
    }

    pub fn sell(ctx: Context<Sell>, args: SellArgs) -> Result<()> {
        sell_handler(ctx, args)?;
        Ok(())
    }

    pub fn claim(ctx: Context<Claim>) -> Result<()> {
        claim_handler(ctx)?;
        Ok(())
    }

    pub fn withdraw(ctx: Context<Withdraw>) -> Result<()> {
        withdraw_handler(ctx)?;
        Ok(())
    }

    pub fn deposit(ctx: Context<Deposit>) -> Result<()> {
        deposit_handler(ctx)?;
        Ok(())
    }
}
