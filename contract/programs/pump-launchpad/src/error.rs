use anchor_lang::prelude::*;

#[error_code]
pub enum PumpLaunchpadError {
    #[msg("Invalid user")]
    InvalidUser,
    #[msg("Global not initialized")]
    GlobalNotInitialized,
    #[msg("Max supply exceeded")]
    MaxSupplyExceeded,
    #[msg("Arithmetic error")]
    ArithmeticError,
    #[msg("Insufficient funds")]
    InsufficientFunds,
    #[msg("Launch is completed")]
    LaunchCompleted,
    #[msg("Launch is not completed")]
    LaunchNotCompleted,
    #[msg("Launch is withdrawn")]
    LaunchWithdrawn,
    #[msg("Launch not withdrawn")]
    LaunchNotWithdrawn,
    #[msg("Launch is deposited")]
    LaunchDeposited,
    #[msg("Launch is not deposited")]
    LaunchNotDeposited,
    #[msg("Invalid fee receipient")]
    InvalidFeeRecipient,
}
