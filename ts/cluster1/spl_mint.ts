import { Keypair, PublicKey, Connection, Commitment } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import wallet from "../turbin3-wallet.json";

const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

const token_decimals = 1_000_000n;

const mint = new PublicKey("AtDmZ4pVMjpURNCycRaYLLCsDUF4ZrskVEC4wHHEutoy");

(async () => {
  try {
    // ATAs are PDAs owned by the token program. They are associated with a mint account, a token account, and a user account - and using these seeds it can also be derived.
    const ata = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      keypair.publicKey
    );

    console.log(`Your ata is: ${ata.address.toBase58()}`);

    const mintTx = await mintTo(
      connection,
      keypair,
      mint,
      ata.address,
      keypair.publicKey,
      1n * token_decimals
    );

    console.log(`Your mint txid: ${mintTx}`);
  } catch (error) {
    console.log(`Oops, something went wrong: ${error}`);
  }
})();
