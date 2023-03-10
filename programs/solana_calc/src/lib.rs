use anchor_lang::prelude::*;

declare_id!("4QSy8gYQMHYGCCazUAqgMqgni9Rm8YmkQASoUtMbLH7f");

#[program]
pub mod solana_calc {
    use super::*;

    pub fn create(ctx: Context<Create>, init_message: String) -> Result<()> {
        if init_message.chars().count() > 50{
            Err(error!(OpErrors::MessageOverflow))
        }else {
            let calculator = &mut ctx.accounts.calculator;
            calculator.greeting = init_message;
            Ok(())            
        }
    }

    pub fn add(ctx: Context<Operation>, num1: i64, num2: i64) -> Result<()> {
        let tmp_sum = num1.checked_add(num2);
        if tmp_sum.is_some(){
            let calculator = &mut ctx.accounts.calculator;
            calculator.result = tmp_sum.unwrap();    
            Ok(())
        }else {
            Err(error!(OpErrors::Overflow))
        }
    }

    pub fn subtract(ctx: Context<Operation>, num1: i64, num2: i64) -> Result<()> {
        let tmp_sum = num1.checked_sub(num2);
        if tmp_sum.is_some(){
            let calculator = &mut ctx.accounts.calculator;
            calculator.result = tmp_sum.unwrap();    
            Ok(())
        }else {
            Err(error!(OpErrors::Overflow))
        }
    }

    pub fn multiply(ctx: Context<Operation>, num1: i64, num2: i64) -> Result<()> {
        let tmp_sum = num1.checked_mul(num2);
        if tmp_sum.is_some(){
            let calculator = &mut ctx.accounts.calculator;
            calculator.result = tmp_sum.unwrap();    
            Ok(())
        }else {
            Err(error!(OpErrors::Overflow))
        }
    }

    pub fn divide(ctx: Context<Operation>, num1: i64, num2: i64) -> Result<()> {
        let tmp_sum = num1.checked_div(num2);
        if tmp_sum.is_some(){
            let calculator = &mut ctx.accounts.calculator;
            calculator.result = tmp_sum.unwrap();    
            Ok(())
        }else {
            if num2 == 0 {
                Err(error!(OpErrors::ZeroDivision))
            }else {
                Err(error!(OpErrors::Overflow))
            }
        }
    }

    pub fn modulo(ctx: Context<Operation>, num1: i64, num2: i64) -> Result<()> {
        let tmp_sum = num1.checked_rem_euclid(num2);
        if tmp_sum.is_some(){
            let calculator = &mut ctx.accounts.calculator;
            calculator.result = tmp_sum.unwrap();    
            Ok(())
        }else {
            if num2 == 0 {
                Err(error!(OpErrors::ZeroDivision))
            }else {
                Err(error!(OpErrors::Overflow))
            }
        }
        
    }
    pub fn power(ctx: Context<Operation>, num1: i64, num2: u32) -> Result<()> {
        let tmp_sum = num1.checked_pow(num2);
        if tmp_sum.is_some(){
            let calculator = &mut ctx.accounts.calculator;
            calculator.result = tmp_sum.unwrap();    
            Ok(())
        }else {
            Err(error!(OpErrors::Overflow))
        }
        
    }

    pub fn abs(ctx: Context<Operation>, num1: i64) -> Result<()> {
        let tmp_sum = num1.checked_abs();
        if tmp_sum.is_some(){
            let calculator = &mut ctx.accounts.calculator;
            calculator.result = tmp_sum.unwrap();    
            Ok(())
        }else {
            Err(error!(OpErrors::AbsError))
        }
        
    }

    pub fn reminder(ctx: Context<Operation>, num1: i64, num2: i64) -> Result<()> {
        let tmp_sum = num1.checked_rem(num2);
        if tmp_sum.is_some(){
            let calculator = &mut ctx.accounts.calculator;
            calculator.result = tmp_sum.unwrap();    
            Ok(())
        }else {
            if num2 == 0 {
                Err(error!(OpErrors::ZeroDivision))
            }else {
                Err(error!(OpErrors::Overflow))
            }
        }
        
    }
}


#[derive(Accounts)]
pub struct Create<'info>{
    #[account(init, payer=user, space=Calculator::LEN)]
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


// https://book.anchor-lang.com/anchor_references/space.html
const DISCRIMINATOR_LENGTH: usize = 8;
const PUBLIC_KEY_LENGTH: usize = 32;
const RESULT_LENGTH: usize = 8;
const STRING_LENGTH_PREFIX: usize = 4;
const MAX_GREETING_LENGTH: usize = 50 * 4;



impl Calculator{
    const LEN: usize = DISCRIMINATOR_LENGTH +
    PUBLIC_KEY_LENGTH +
    RESULT_LENGTH +
    STRING_LENGTH_PREFIX + MAX_GREETING_LENGTH;
}

#[error_code]
pub enum OpErrors {
    #[msg("Division by zero")]
    ZeroDivision,
    #[msg("Overflow occured")]
    Overflow,
    #[msg("Abs error")]
    AbsError,
    #[msg("Init Message too long")]
    MessageOverflow,
}