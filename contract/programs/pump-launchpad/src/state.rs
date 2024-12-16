use anchor_lang::prelude::*;

#[account]
#[derive(Debug, InitSpace)]
pub struct Global {
    pub initialized: bool,
    pub authority: Pubkey,
    pub fee_recipient: Pubkey,
    pub fee_basis_points: u16,
    pub tokens: u32,
    pub max_supply: u64,
    pub creator_supply: u64,
    pub price: u64,
    pub bump: u8,
}

#[account]
#[derive(Debug, InitSpace)]
pub struct Launch {
    pub id: u32,
    pub mint: Pubkey,
    pub creator: Pubkey,
    #[max_len(32)]
    pub name: String,
    #[max_len(16)]
    pub symbol: String,
    #[max_len(256)]
    pub uri: String,
    pub max_supply: u64,
    pub sold_supply: u64,
    pub price: u64,
    pub fee_collected: u64,
    pub completed: bool,
    pub withdrawn: bool,
    pub deposited: bool,
    pub bump: u8,
}

#[account]
#[derive(Debug, InitSpace)]
pub struct Allocation {
    pub initialized: bool,
    pub id: u32,
    pub user: Pubkey,
    pub token_amount: u64,
    pub claimed: bool,
    pub bump: u8,
}
