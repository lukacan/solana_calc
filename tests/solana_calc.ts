import * as anchor from "@project-serum/anchor";
import { AnchorError,Program } from "@project-serum/anchor";
import { SolanaCalc } from "../target/types/solana_calc";
import { expect } from 'chai';
import * as assert from "assert";

describe("solana_calc", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());


  const program = anchor.workspace.SolanaCalc as Program<SolanaCalc>;
  const programProvider = program.provider as anchor.AnchorProvider;

  const calculatorPair = anchor.web3.Keypair.generate();

  const text = "Summer School Of Solana"

  //Creating a test block
  it("Creating Calculator Instance", async () => {
    //Calling create instance - Set our calculator keypair as a signer
    await program.methods.create(text).accounts(
      {
          calculator: calculatorPair.publicKey,
          user: programProvider.wallet.publicKey,
          systemProgram: anchor.web3.programId,
      }
  ).signers([calculatorPair]).rpc()

  //We fecth the account and read if the string is actually in the account
  const account = await program.account.calculator.fetch(calculatorPair.publicKey)
  expect(account.greeting).to.eql(text)
  });

  //Another test step - test out addition
  it('Addition',async () => {
      await program.methods.add(new anchor.BN(2), new anchor.BN(3))
      .accounts({
          calculator: calculatorPair.publicKey,
      })
      .rpc()
      const account = await program.account.calculator.fetch(calculatorPair.publicKey)
      expect(account.result).to.eql(new anchor.BN(5))
  });

  it('Subtraction',async () => {
    await program.methods.subtract(new anchor.BN(2), new anchor.BN(3))
    .accounts({
        calculator: calculatorPair.publicKey,
    })
    .rpc()
    const account = await program.account.calculator.fetch(calculatorPair.publicKey)
    expect(account.result).to.eql(new anchor.BN(-1))
  });

  it('Multiply',async () => {
    await program.methods.multiply(new anchor.BN(2), new anchor.BN(3))
    .accounts({
        calculator: calculatorPair.publicKey,
    })
    .rpc()
    const account = await program.account.calculator.fetch(calculatorPair.publicKey)
    expect(account.result).to.eql(new anchor.BN(6))
  });


  it('Divide',async () => {
    await program.methods.divide(new anchor.BN(20), new anchor.BN(4))
    .accounts({
        calculator: calculatorPair.publicKey,
    })
    .rpc()
    const account = await program.account.calculator.fetch(calculatorPair.publicKey)
    expect(account.result).to.eql(new anchor.BN(5))
  });

  it('Modulo',async () => {
    await program.methods.modulo(new anchor.BN(20), new anchor.BN(3))
    .accounts({
        calculator: calculatorPair.publicKey,
    })
    .rpc()
    const account = await program.account.calculator.fetch(calculatorPair.publicKey)
    expect(account.result).to.eql(new anchor.BN(2))
  });


  it('Zero division',async () => {
    try {
      await program.methods.divide(new anchor.BN(20), new anchor.BN(0))
      .accounts({
          calculator: calculatorPair.publicKey,
      })
      .rpc()      
    } catch (_err) {
      assert.ok(_err instanceof AnchorError);
      assert.equal((_err as AnchorError)
      .error.errorCode.code, 'ZeroDivision');
    }

  });

  it('Modulo zero',async () => {
    try {
      await program.methods.modulo(new anchor.BN(20), new anchor.BN(0))
      .accounts({
          calculator: calculatorPair.publicKey,
      })
      .rpc()
    } catch (_err) {
      assert.ok(_err instanceof AnchorError);
      assert.equal((_err as AnchorError)
      .error.errorCode.code, 'ZeroDivision');
    }

  });

  it('Power',async () => {
    await program.methods.power(new anchor.BN(2), new anchor.BN(10))
    .accounts({
        calculator: calculatorPair.publicKey,
    })
    .rpc()
    const account = await program.account.calculator.fetch(calculatorPair.publicKey)
    expect(account.result).to.eql(new anchor.BN(1024))
  });


  it('ABS',async () => {
    await program.methods.abs(new anchor.BN(-20))
    .accounts({
        calculator: calculatorPair.publicKey,
    })
    .rpc()
    const account = await program.account.calculator.fetch(calculatorPair.publicKey)
    expect(account.result).to.eql(new anchor.BN(20))
  });

  it('Reminder',async () => {
    await program.methods.reminder(new anchor.BN(-21), new anchor.BN(4))
    .accounts({
        calculator: calculatorPair.publicKey,
    })
    .rpc()
    const account = await program.account.calculator.fetch(calculatorPair.publicKey)
    expect(account.result).to.eql(new anchor.BN(-1))
  });



  


});
