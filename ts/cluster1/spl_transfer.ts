import {
  Commitment,
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
} from "@solana/web3.js";
import wallet from "../turbin3-wallet.json";
import {
  createTransferCheckedInstruction,
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";

const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

const mint = new PublicKey("AtDmZ4pVMjpURNCycRaYLLCsDUF4ZrskVEC4wHHEutoy");

const to = new PublicKey("ExHn7rWHes2EDHtKvrYP8uhEjRkb4uM2WnoK41LHDd3E");

(async () => {
  try {
    const fromAta = new PublicKey(
      "C2CqDhFp72dM46iVWpggbngdejJW2zqiSV6tJWZLhfuF"
    );

    // token account of the recipient address
    const toAta = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      to
    );

    console.log(`recipient ata: ${toAta.address.toBase58()}`);

    const transaction = new Transaction();

    transaction.add(
      createTransferCheckedInstruction(
        fromAta,
        mint,
        toAta.address,
        keypair.publicKey,
        1_000_000,
        6
      )
    );

    transaction.recentBlockhash = (
      await connection.getLatestBlockhash("confirmed")
    ).blockhash;

    transaction.feePayer = keypair.publicKey;

    const signature = await sendAndConfirmTransaction(connection, transaction, [
      keypair,
    ]);

    console.log(`transaction signature is: ${signature}`);
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();
