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
}

run()
