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

async function rekeyAtoB(algodClient, addressA, addressB) {
  let rekeyTo = addressB
  let amount = 0
  let params = await algofi.getParams(algodClient)
  params.fee = 1000
  params.flatFee = true

  let txn0 = algosdk.makePaymentTxnWithSuggestedParams(
    addressA,
    addressA,
    amount,
    undefined,
    undefined,
    params,
    rekeyTo
  )
  return txn0
}

const AMOUNT_TO_MINT = 10
const SYMBOL_TO_MINT = "USDC"
const AMOUNT_TO_BURN = 1
const SYMBOL_TO_BURN = "USDC"
const AMOUNT_TO_ADD = 1
const SYMBOL_TO_ADD = "USDC"
const AMOUNT_TO_MINT_TO_COLLATERAL = 10
const SYMBOL_TO_MINT_TO_COLLATERAL = "USDC"
const AMOUNT_TO_REMOVE = 1
const SYMBOL_TO_REMOVE = "USDC"
const AMOUNT_TO_REMOVE_TO_UNDERLYING = 1
const SYMBOL_TO_REMOVE_TO_UNDERLYING = "USDC"
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

  console.log("OPTING PRIMARY ACCOUNT INTO MARKETS")
  let optInPrimaryMarketsTxns = await algofi.optInMarkets(algodClient, primaryAccount.addr)
  await submitSignedTxns(
    algodClient,
    optInPrimaryMarketsTxns.map((txn) => {
      return txn.signTxn(primaryAccount.sk)
    })
  )

  console.log("OPTING STORAGE ACCOUNT INTO MARKETS")
  let optInStorageMarketsTxns = await algofi.optInMarkets(algodClient, storageAccount.addr)
  await submitSignedTxns(
    algodClient,
    optInStorageMarketsTxns.map((txn) => {
      return txn.signTxn(primaryAccount.sk)
    })
  )

  console.log("OPTING PRIMARY ACCOUNT INTO ASSETS")
  let optInPrimaryAssetsTxns = await algofi.optInAssets(algodClient, primaryAccount.addr)
  await submitSignedTxns(
    algodClient,
    optInPrimaryAssetsTxns.map((txn) => {
      return txn.signTxn(primaryAccount.sk)
    })
  )

  console.log("REKEYING STORAGE ACCOUNT")
  let rekeyTxn = await rekeyAtoB(algodClient, storageAccount.addr, primaryAccount.addr)
  await submitSignedTxns(algodClient, [rekeyTxn.signTxn(storageAccount.sk)])

  console.log("OPTING IN PRIMARY ACCOUNT")
  let optInManagerTxns = await algofi.optInManager(algodClient, primaryAccount.addr, storageAccount.addr)
  await submitSignedTxns(
    algodClient,
    optInManagerTxns.map((txn) => {
      return txn.signTxn(primaryAccount.sk)
    })
  )

  console.log("MINTING")
  let mintTxns = await algofi.mint(
    algodClient,
    primaryAccount.addr,
    storageAccount.addr,
    AMOUNT_TO_MINT,
    SYMBOL_TO_MINT
  )
  await submitSignedTxns(
    algodClient,
    mintTxns.map((txn) => {
      return txn.signTxn(primaryAccount.sk)
    })
  )

  console.log("BURNING")
  let burnTxns = await algofi.burn(
    algodClient,
    primaryAccount.addr,
    storageAccount.addr,
    AMOUNT_TO_BURN,
    SYMBOL_TO_BURN
  )
  await submitSignedTxns(
    algodClient,
    burnTxns.map((txn) => {
      return txn.signTxn(primaryAccount.sk)
    })
  )

  console.log("ADDING COLLATERAL")
  let addTxns = await algofi.addCollateral(
    algodClient,
    primaryAccount.addr,
    storageAccount.addr,
    AMOUNT_TO_ADD,
    SYMBOL_TO_ADD
  )
  await submitSignedTxns(
    algodClient,
    addTxns.map((txn) => {
      return txn.signTxn(primaryAccount.sk)
    })
  )

  console.log("MINTING TO COLLATERAL")
  let addToCollTxns = await algofi.mintToCollateral(
    algodClient,
    primaryAccount.addr,
    storageAccount.addr,
    AMOUNT_TO_MINT_TO_COLLATERAL,
    SYMBOL_TO_MINT_TO_COLLATERAL
  )
  await submitSignedTxns(
    algodClient,
    addToCollTxns.map((txn) => {
      return txn.signTxn(primaryAccount.sk)
    })
  )

  console.log("REMOVING COLLATERAL")
  let removeTxns = await algofi.removeCollateral(
    algodClient,
    primaryAccount.addr,
    storageAccount.addr,
    AMOUNT_TO_REMOVE,
    SYMBOL_TO_REMOVE
  )
  await submitSignedTxns(
    algodClient,
    removeTxns.map((txn) => {
      return txn.signTxn(primaryAccount.sk)
    })
  )
  /*
  console.log("REMOVING COLLATERAL TO UNDERLYING")
  let removeToUnderlyingTxns = await algofi.remove_collateral_underlying(
    algodClient,
    primaryAccount.addr,
    storageAccount.addr,
    AMOUNT_TO_REMOVE_TO_UNDERLYING,
    SYMBOL_TO_REMOVE_TO_UNDERLYING
  )
  await submitSignedTxns(
    algodClient,
    removeToUnderlyingTxns.map((txn) => {
      return txn.signTxn(primaryAccount.sk)
    })
  )
  */
  console.log("BORROWING")
  let borrowTxns = await algofi.borrow(
    algodClient,
    primaryAccount.addr,
    storageAccount.addr,
    AMOUNT_TO_BORROW,
    SYMBOL_TO_BORROW
  )
  await submitSignedTxns(
    algodClient,
    borrowTxns.map((txn) => {
      return txn.signTxn(primaryAccount.sk)
    })
  )
}

run()
