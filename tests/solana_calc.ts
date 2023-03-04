import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { SolanaCalc } from "../target/types/solana_calc";
import { expect } from 'chai';

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
});
