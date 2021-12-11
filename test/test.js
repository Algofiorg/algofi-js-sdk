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
    "X-API-Key": process.env.algodSecret
  }
  // not all node providers require a token, please check w/ yours
  const algodClient = new algosdk.Algodv2(algodToken, process.env.algodServer, process.env.algodPort)
  let primaryAccount = algosdk.mnemonicToSecretKey(process.env.primaryPass)
  let storageAccount = algosdk.mnemonicToSecretKey(process.env.storagePass)
  console.log("PRIMARY ACCOUNT ADDRESS=", primaryAccount.addr)
  console.log("STORAGE ACCOUNT ADDRESS=", storageAccount.addr)
  /*
  let accountInfo = await algodClient.accountInformation(primaryAccount.addr).do()

  // opt in storage account to markets
  try {
    let marketOptInTxns = await algofi.optInMarkets(algodClient, storageAccount.addr)
    await submitSignedTxns(
      algodClient,
      marketOptInTxns.map(txn => {
        return txn.signTxn(storageAccount.sk)
      })
    )
  } catch (err) {
    console.log("Opt-In to market failed with err=", err)
  }

  try {
    let managerOptInTxns = await algofi.optInManager(algodClient, primaryAccount.addr, storageAccount.addr)
    // opt in to manager
    await submitSignedTxns(
      algodClient,
      managerOptInTxns.map(txn => {
        return txn.signTxn(primaryAccount.sk)
      })
    )
    // opt in to manager
    let assetOptInTxns = await algofi.optInAssets(algodClient, primaryAccount.addr)
    await submitSignedTxns(
      algodClient,
      assetOptInTxns.map(txn => {
        return txn.signTxn(primaryAccount.sk)
      })
    )
  } catch (err) {
    console.log("Opt-In to market failed with err=", err)
  }
  try {
    // mint
    let mintTxns = await algofi.mint(algodClient, primaryAccount.addr, storageAccount.addr, 1000000, "ALGO")
    await submitSignedTxns(
      algodClient,
      mintTxns.map(txn => {
        return txn.signTxn(primaryAccount.sk)
      })
    )
    console.log("MINT TRANSACTION SUCCESS")
  } catch (err) {
    console.log("Mint failed with err=", err)
  }
  try {
    // mint_to_collateral
    let mintToCollateralTxns = await algofi.mintToCollateral(
      algodClient,
      primaryAccount.addr,
      storageAccount.addr,
      1000000,
      "ALGO"
    )
    await submitSignedTxns(
      algodClient,
      mintToCollateralTxns.map(txn => {
        return txn.signTxn(primaryAccount.sk)
      })
    )
    console.log("MINT TO COLLATERAL TRANSACTION SUCCESS")
  } catch (err) {
    console.log("Mint failed with err=", err)
  }

  try {
    // add_collateral
    let addCollateralTxns = await algofi.addCollateral(
      algodClient,
      primaryAccount.addr,
      storageAccount.addr,
      1000000,
      "ALGO"
    )
    await submitSignedTxns(
      algodClient,
      addCollateralTxns.map(txn => {
        return txn.signTxn(primaryAccount.sk)
      })
    )
    console.log("ADD TO COLLATERAL TRANSACTION SUCCESS")
  } catch (err) {
    console.log("Mint failed with err=", err)
  }
  try {
    // remove_collateral
    let removeCollateralTxns = await algofi.removeCollateral(
      algodClient,
      primaryAccount.addr,
      storageAccount.addr,
      1000000,
      "ALGO"
    )
    await submitSignedTxns(
      algodClient,
      removeCollateralTxns.map(txn => {
        return txn.signTxn(primaryAccount.sk)
      })
    )
    console.log("REMOVE COLLATERAL TRANSACTION SUCCESS")
  } catch (err) {
    console.log("Mint failed with err=", err)
  }
  try {
    // burn
    let burnTxns = await algofi.burn(algodClient, primaryAccount.addr, storageAccount.addr, 1000000, "ALGO")
    await submitSignedTxns(
      algodClient,
      burnTxns.map(txn => {
        return txn.signTxn(primaryAccount.sk)
      })
    )
    console.log("BURN TRANSACTION SUCCESS")
  } catch (err) {
    console.log("Mint failed with err=", err)
  }

  try {
    // remove_collateral_underlying
    let removeCollateralUnderlyingTxns = await algofi.removeCollateralUnderlying(
      algodClient,
      primaryAccount.addr,
      storageAccount.addr,
      1000000,
      "ALGO"
    )
    await submitSignedTxns(
      algodClient,
      removeCollateralUnderlyingTxns.map(txn => {
        return txn.signTxn(primaryAccount.sk)
      })
    )
    console.log("Remove Collateral TRANSACTION SUCCESS")
  } catch (err) {
    console.log("Remove Collateral failed with err=", err)
  }

  try {
    // borrow
    let borrowTxns = await algofi.borrow(algodClient, primaryAccount.addr, storageAccount.addr, 1000000, "ALGO")
    await submitSignedTxns(
      algodClient,
      borrowTxns.map(txn => {
        return txn.signTxn(primaryAccount.sk)
      })
    )
    console.log("BORROW TRANSACTION SUCCESS")
  } catch (err) {
    console.log("Borrow failed with err=", err)
  }
  try {
    // repay_borrow
    let repayBorrowTxns = await algofi.repayBorrow(
      algodClient,
      primaryAccount.addr,
      storageAccount.addr,
      1000000,
      "ALGO"
    )
    await submitSignedTxns(
      algodClient,
      repayBorrowTxns.map(txn => {
        return txn.signTxn(primaryAccount.sk)
      })
    )
    console.log("REPAY BORROW TRANSACTION SUCCESS")
  } catch (err) {
    console.log("Repay Borrow failed with err=", err)
  }
  try {
    // claim_rewards
    let claimRewardsTxns = await algofi.claimRewards(
      algodClient,
      primaryAccount.addr,
      storageAccount.addr,
      "ALGO",
      "ALGO"
    )
    await submitSignedTxns(
      algodClient,
      claimRewardsTxns.map(txn => {
        return txn.signTxn(primaryAccount.sk)
      })
    )
    console.log("CLAIM REWARDS TRANSACTION SUCCESS")
  } catch (err) {
    console.log("Claim Rewards failed with err=", err)
  }
  try {
    // get state
    let userAndProtocolData = await algofi.getUserAndProtocolData(algodClient, primaryAccount.addr)
    console.log("SUCCESSFULY FETCHED STATE DATA ")
    console.log(userAndProtocolData)
  } catch (err) {
    console.log("User and Protocol data fetch failed with err=", err)
  }*/
  try {
    // get state
    let userAndProtocolData = await algofi.getUserAndProtocolData(algodClient, "A4CNKHAKHUVE5CPVS24OMPSKBBYOD7HFG5RVY3GZ7I2XDF7MNOL4PHPLXA")
    console.log("SUCCESSFULY FETCHED STATE DATA ")
    //console.log(userAndProtocolData[1])
    //console.log(userAndProtocolData[1]['ALGO'])
  } catch (err) {
    console.log("User and Protocol data fetch failed with err=", err)
  }
}

run()
