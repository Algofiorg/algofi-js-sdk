const algosdk = require("algosdk")
const algofi = require("@algofi/v0")
require("dotenv").config()

async function submitSignedTxns(algodClient, signedTxns) {
  try {
    const txnPrimaryAssets = await algodClient.sendRawTransaction(signedTxns).do()
    await algofi.waitForConfirmation(algodClient, txnPrimaryAssets.txId)
    console.log("SUCCESS")
  } catch (err) {
    if (err.response) {
      console.log("err=", err.response.text)
    } else {
      console.log("err=", err)
    }
  }
}

const AMOUNT_TO_BORROW = 2
const SYMBOL_TO_BORROW = "USDC"

async function run() {
  const algodToken = {
    "X-API-Key": process.env.algodSecret,
  }
  // not all node providers require a token, please check w/ yours
  const algodClient = new algosdk.Algodv2(algodToken, process.env.algodServer, process.env.algodPort)
  let primaryAccount = algosdk.mnemonicToSecretKey(process.env.primaryPass)
  let storageAccount = algosdk.mnemonicToSecretKey(process.env.storagePass)
  console.log("PRIMARY ACCOUNT ADDRESS=", primaryAccount.addr)
  console.log("STORAGE ACCOUNT ADDRESS=", storageAccount.addr)

  console.log("BORROWING")
  let mintTxns = await algofi.borrow(
    algodClient,
    primaryAccount.addr,
    storageAccount.addr,
    AMOUNT_TO_BORROW,
    SYMBOL_TO_BORROW
  )
  await submitSignedTxns(
    algodClient,
    mintTxns.map((txn) => {
      return txn.signTxn(primaryAccount.sk)
    })
  )
}

run()
