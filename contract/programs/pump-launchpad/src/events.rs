use anchor_lang::prelude::*;

#[event]
pub struct LaunchCompleted {
    pub id: u32,
    pub max_supply: u64,
    pub creator_supply: u64,
    pub price: u64,
}

#[event]
pub struct TokenTraded {
    pub is_buy: bool,
    pub id: u32,
    pub user: Pubkey,
    pub token_amount: u64,
    pub sold_supply: u64,
}
