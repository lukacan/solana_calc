import * as anchor from "@project-serum/anchor";
import { AnchorError,Program } from "@project-serum/anchor";
import { SolanaCalc } from "../target/types/solana_calc";
import { expect } from 'chai';
import * as assert from "assert";

describe("solana_calc", () => {
  anchor.setProvider(anchor.AnchorProvider.env());


  const program = anchor.workspace.SolanaCalc as Program<SolanaCalc>;
  const programProvider = program.provider as anchor.AnchorProvider;

  const calculatorPair = anchor.web3.Keypair.generate();

  const text = "Summer School Of Solana"

  it("Creating Calculator Instance", async () => {
      await program.methods.create(text)
      .accounts({
          calculator: calculatorPair.publicKey,
          user: programProvider.wallet.publicKey,
          systemProgram: anchor.web3.programId,
      })
      .signers([calculatorPair])
      .rpc()
      const account = await program.account.calculator
      .fetch(calculatorPair.publicKey)
      expect(account.greeting).to.eql(text)
      return
  });

  it('add',async () => {
      await program.methods.add(new anchor.BN(2), new anchor.BN(3))
      .accounts({
          calculator: calculatorPair.publicKey,
      })
      .rpc()
      const account = await program.account.calculator.fetch(calculatorPair.publicKey)
      expect(account.result).to.eql(new anchor.BN(5))
      return
  });

  it('sub',async () => {
    await program.methods.subtract(new anchor.BN(2), new anchor.BN(3))
    .accounts({
        calculator: calculatorPair.publicKey,
    })
    .rpc()
    const account = await program.account.calculator.fetch(calculatorPair.publicKey)
    expect(account.result).to.eql(new anchor.BN(-1))
    return
  });

  it('mul',async () => {
    await program.methods.multiply(new anchor.BN(2), new anchor.BN(3))
    .accounts({
        calculator: calculatorPair.publicKey,
    })
    .rpc()
    const account = await program.account.calculator.fetch(calculatorPair.publicKey)
    expect(account.result).to.eql(new anchor.BN(6))
    return
  });


  it('div',async () => {
    await program.methods.divide(new anchor.BN(20), new anchor.BN(4))
    .accounts({
        calculator: calculatorPair.publicKey,
    })
    .rpc()
    const account = await program.account.calculator.fetch(calculatorPair.publicKey)
    expect(account.result).to.eql(new anchor.BN(5))
    return
  });

  it('mod',async () => {
    await program.methods.modulo(new anchor.BN(20), new anchor.BN(3))
    .accounts({
        calculator: calculatorPair.publicKey,
    })
    .rpc()
    const account = await program.account.calculator.fetch(calculatorPair.publicKey)
    expect(account.result).to.eql(new anchor.BN(2))
    return
  });
  it('pow',async () => {
    await program.methods.power(new anchor.BN(2), new anchor.BN(10))
    .accounts({
        calculator: calculatorPair.publicKey,
    })
    .rpc()
    const account = await program.account.calculator.fetch(calculatorPair.publicKey)
    expect(account.result).to.eql(new anchor.BN(1024))
    return
  });


  it('abs',async () => {
    await program.methods.abs(new anchor.BN(-20))
    .accounts({
        calculator: calculatorPair.publicKey,
    })
    .rpc()
    const account = await program.account.calculator.fetch(calculatorPair.publicKey)
    expect(account.result).to.eql(new anchor.BN(20))
    return
  });

  it('rem',async () => {
    await program.methods.reminder(new anchor.BN(-21), new anchor.BN(4))
    .accounts({
        calculator: calculatorPair.publicKey,
    })
    .rpc()
    const account = await program.account.calculator.fetch(calculatorPair.publicKey)
    expect(account.result).to.eql(new anchor.BN(-1))
    return
  });

  it('zero div',async () => {
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
      return
    }
    assert.fail('Should throw Zero div');
  });

  it('zero rem',async () => {
    try {
      await program.methods.reminder(new anchor.BN(20), new anchor.BN(0))
      .accounts({
          calculator: calculatorPair.publicKey,
      })
      .rpc()
    } catch (_err) {
      assert.ok(_err instanceof AnchorError);
      assert.equal((_err as AnchorError)
      .error.errorCode.code, 'ZeroDivision');
      return
    }
    assert.fail('Should throw Zero div');
  });

  it('zero mod',async () => {
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
      return
    }
    assert.fail('Should throw Zero div');
  });

  it("init message too long", async () => {
    const calcPair = anchor.web3.Keypair.generate();
    const initWith51Chars = 'x'.repeat(51);
    try{
      await program.methods.create(initWith51Chars)
      .accounts({
        calculator: calcPair.publicKey,
        user: programProvider.wallet.publicKey,
        systemProgram: anchor.web3.programId,
      })
      .signers([calcPair]).rpc()
    } catch(_err){
      assert.ok(_err instanceof AnchorError);
      assert.equal((_err as AnchorError)
      .error.errorCode.code,'MessageOverflow');
      return
    }
    assert.fail('Should throw init message too long');
  });

});
