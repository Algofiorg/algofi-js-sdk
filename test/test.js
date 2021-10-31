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

  let accountInfo = await algodClient.accountInformation(primaryAccount.addr).do()

  // opt in stoarge account to markets
  let marketOptInTxns = await algofi.optInMarkets(algodClient, storageAccount.addr)
  await submitSignedTxns(algodClient, marketOptInTxns.map((txn) => { return txn.signTxn(storageAccount.sk)}))

  // opt in to manager
  let managerOptInTxns = await algofi.optInManager(algodClient, primaryAccount.addr, storageAccount.addr)
  await submitSignedTxns(algodClient, managerOptInTxns.map((txn) => { return txn.signTxn(primaryAccount.sk)}))

  // opt in to manager
  let assetOptInTxns = await algofi.optInAssets(algodClient, primaryAccount.addr)
  await submitSignedTxns(algodClient, assetOptInTxns.map((txn) => { return txn.signTxn(primaryAccount.sk)}))

  // mint
  let mintTxns = await algofi.mint(algodClient, primaryAccount.addr, storageAccount.addr, 1000000, "ALGO")
  await submitSignedTxns(algodClient, mintTxns.map((txn) => { return txn.signTxn(primaryAccount.sk)}))

  // mint_to_collateral
  let mintToCollateralTxns = await algofi.mintToCollateral(algodClient, primaryAccount.addr, storageAccount.addr, 1000000, "ALGO")
  await submitSignedTxns(algodClient, mintToCollateralTxns.map((txn) => { return txn.signTxn(primaryAccount.sk)}))

  // add_collateral
  let addCollateralTxns = await algofi.addCollateral(algodClient, primaryAccount.addr, storageAccount.addr, 1000000, "ALGO")
  await submitSignedTxns(algodClient, addCollateralTxns.map((txn) => { return txn.signTxn(primaryAccount.sk)}))

  // remove_collateral
  let removeCollateralTxns = await algofi.removeCollateral(algodClient, primaryAccount.addr, storageAccount.addr, 1000000, "ALGO")
  await submitSignedTxns(algodClient, removeCollateralTxns.map((txn) => { return txn.signTxn(primaryAccount.sk)}))

  // burn
  let burnTxns = await algofi.burn(algodClient, primaryAccount.addr, storageAccount.addr, 1000000, "ALGO")
  await submitSignedTxns(algodClient, burnTxns.map((txn) => { return txn.signTxn(primaryAccount.sk)}))

  // remove_collateral_underlying
  let removeCollateralUnderlyingTxns = await algofi.removeCollateralUnderlying(algodClient, primaryAccount.addr, storageAccount.addr, 1000000, "ALGO")
  await submitSignedTxns(algodClient, removeCollateralUnderlyingTxns.map((txn) => { return txn.signTxn(primaryAccount.sk)}))

  // borrow
  let borrowTxns = await algofi.borrow(algodClient, primaryAccount.addr, storageAccount.addr, 1000000, "ALGO")
  await submitSignedTxns(algodClient, borrowTxns.map((txn) => { return txn.signTxn(primaryAccount.sk)}))

  // repay_borrow
  let repayBorrowTxns = await algofi.repayBorrow(algodClient, primaryAccount.addr, storageAccount.addr, 1000000, "ALGO")
  await submitSignedTxns(algodClient, repayBorrowTxns.map((txn) => { return txn.signTxn(primaryAccount.sk)}))

  // claim_rewards
  let claimRewardsTxns = await algofi.claimRewards(algodClient, primaryAccount.addr, storageAccount.addr, "ALGO", "ALGO")
  await submitSignedTxns(algodClient, claimRewardsTxns.map((txn) => { return txn.signTxn(primaryAccount.sk)}))

  // get state
  let userAndProtocolData = await algofi.getUserAndProtocolData(algodClient, primaryAccount.addr)
  console.log(userAndProtocolData)
}

run()
