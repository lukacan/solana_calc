use anchor_lang::prelude::*;
use anchor_lang::solana_program::entrypoint::ProgramResult;

declare_id!("4QSy8gYQMHYGCCazUAqgMqgni9Rm8YmkQASoUtMbLH7f");

#[program]
pub mod solana_calc {
    use super::*;

    pub fn create(ctx: Context<Create>, init_message: String) -> ProgramResult {
        let calculator = &mut ctx.accounts.calculator;
        calculator.greeting = init_message;
        Ok({})
    }

    pub fn add(ctx: Context<Operation>, num1: i64, num2: i64) -> ProgramResult {
        let calculator = &mut ctx.accounts.calculator;
        calculator.result = num1 + num2;
        Ok(())
    }

    pub fn subtract(ctx: Context<Operation>, num1: i64, num2: i64) -> ProgramResult {
        let calculator = &mut ctx.accounts.calculator;
        calculator.result = num1 - num2;
        Ok(())
    }

    pub fn multiply(ctx: Context<Operation>, num1: i64, num2: i64) -> ProgramResult {
        let calculator = &mut ctx.accounts.calculator;
        calculator.result = num1 * num2;
        Ok(())
    }

    pub fn devide(ctx: Context<Operation>, num1: i64, num2: i64) -> ProgramResult {
        let calculator = &mut ctx.accounts.calculator;
        calculator.result = num1 / num2;
        Ok(())
    }


}

#[derive(Accounts)]
pub struct Create<'info>{
    #[account(init, payer=user, space=264)]
    pub calculator: Account<'info, Calculator>,

    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct Operation<'info>{
    #[account(mut)]
    pub calculator: Account<'info, Calculator>,
}

#[account]
pub struct Calculator{
    result: i64,
    greeting: String,
}