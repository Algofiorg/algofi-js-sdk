import algosdk from "algosdk"
import { managerAppId, orderedOracleAppIds, orderedMarketAppIds } from "./config.js"

export async function getParams(algodClient) {
  let params = await algodClient.getTransactionParams().do()
  params.fee = 1000
  params.flatFee = true
  return params
}

export async function waitForConfirmation(algodClient, txId) {
  const response = await algodClient.status().do()
  let lastround = response["last-round"]
  while (true) {
    const pendingInfo = await algodClient.pendingTransactionInformation(txId).do()
    if (pendingInfo["confirmed-round"] !== null && pendingInfo["confirmed-round"] > 0) {
      //Got the completed Transaction
      console.log("Transaction " + txId + " confirmed in round " + pendingInfo["confirmed-round"])
      break
    }
    lastround++
    await algodClient.statusAfterBlock(lastround).do()
  }
}

async function getLeadingTxs(algodClient, senderAccount, dataAccount) {
  let params = await getParams(algodClient)
  params.fee = 2000
  const enc = new TextEncoder()
  const applTx0 = algosdk.makeApplicationNoOpTxnFromObject({
    from: senderAccount,
    appIndex: managerAppId,
    foreignApps: orderedOracleAppIds,
    appArgs: [enc.encode("update_prices")],
    suggestedParams: params,
    note: enc.encode("Update Prices")
  })
  params.fee = 1000
  const applTx1 = algosdk.makeApplicationNoOpTxnFromObject({
    from: senderAccount,
    appIndex: managerAppId,
    foreignApps: orderedMarketAppIds,
    appArgs: [enc.encode("update_protocol_data")],
    accounts: [dataAccount],
    suggestedParams: params,
    note: enc.encode("Update Protocol")
  })
  const applTx2 = algosdk.makeApplicationNoOpTxnFromObject({
    from: senderAccount,
    appIndex: managerAppId,
    foreignApps: orderedMarketAppIds,
    appArgs: [enc.encode("dummy_one")],
    suggestedParams: params,
    note: enc.encode("First Dummy Txn")
  })
  const applTx3 = algosdk.makeApplicationNoOpTxnFromObject({
    from: senderAccount,
    appIndex: managerAppId,
    foreignApps: orderedMarketAppIds,
    appArgs: [enc.encode("dummy_two")],
    suggestedParams: params,
    note: enc.encode("Second Dummy Txn")
  })
  const applTx4 = algosdk.makeApplicationNoOpTxnFromObject({
    from: senderAccount,
    appIndex: managerAppId,
    foreignApps: orderedMarketAppIds,
    appArgs: [enc.encode("dummy_three")],
    suggestedParams: params,
    note: enc.encode("Third Dummy Txn")
  })
  const applTx5 = algosdk.makeApplicationNoOpTxnFromObject({
    from: senderAccount,
    appIndex: managerAppId,
    foreignApps: orderedMarketAppIds,
    appArgs: [enc.encode("dummy_four")],
    suggestedParams: params,
    note: enc.encode("Fourth Dummy Txn")
  })
  const applTx6 = algosdk.makeApplicationNoOpTxnFromObject({
    from: senderAccount,
    appIndex: managerAppId,
    foreignApps: orderedMarketAppIds,
    appArgs: [enc.encode("dummy_five")],
    suggestedParams: params,
    note: enc.encode("Fifth Dummy Txn")
  })
  return [applTx0, applTx1, applTx2, applTx3, applTx4, applTx5, applTx6]
}

async function getStackGroup(
  algodClient,
  senderAccount,
  dataAccount,
  marketAppId,
  foreignAssetId,
  functionString,
  extraCallArgs = null
) {
  const params = await getParams(algodClient)
  const enc = new TextEncoder()
  let managerAppArgs = []
  managerAppArgs.push(enc.encode(functionString))
  if (extraCallArgs) {
    managerAppArgs.push(extraCallArgs)
  }
  const applTx0 = algosdk.makeApplicationNoOpTxnFromObject({
    from: senderAccount,
    appIndex: managerAppId,
    appArgs: managerAppArgs,
    suggestedParams: params,
    note: enc.encode("Manager: " + functionString)
  })
  const applTx1 = algosdk.makeApplicationNoOpTxnFromObject({
    from: senderAccount,
    appIndex: marketAppId,
    foreignApps: [managerAppId],
    appArgs: [enc.encode(functionString)],
    foreignAssets: [foreignAssetId],
    accounts: [dataAccount],
    suggestedParams: params,
    note: enc.encode("Market: " + functionString)
  })
  return [applTx0, applTx1]
}

export async function getCore(
  algodClient,
  senderAccount,
  dataAccount,
  marketAppId,
  foreignAssetId,
  functionString,
  extraCallArgs = null
) {
  let txns = []
  let leadingTxs = await getLeadingTxs(algodClient, senderAccount, dataAccount)
  leadingTxs.forEach(txn => {
    txns.push(txn)
  })
  let followingTxs = await getStackGroup(
    algodClient,
    senderAccount,
    dataAccount,
    marketAppId,
    foreignAssetId,
    functionString,
    extraCallArgs
  )
  followingTxs.forEach(txn => {
    txns.push(txn)
  })
  return txns
}
