import algosdk, { Algodv2, SuggestedParams, Transaction } from "algosdk"
import { orderedOracleAppIds, orderedSupportedMarketAppIds } from "./config"
import {
  managerStrings,
  marketStrings
} from "./contractStrings"

/**
 * Function that returns standard transaction parameters
 * 
 * @param {Algodv2} algodClient
 * 
 * @return params
 */
export async function getParams(algodClient: Algodv2): Promise<SuggestedParams> {
  let params = await algodClient.getTransactionParams().do()
  params.fee = 1000
  params.flatFee = true
  return params
}

/**
 * Helper function to wait for a transaction to be completed
 *
 * @param   {Algodv2}   algofClient
 * @param   {string}    txid
 * 
 * @return  {none}
 */
export async function waitForConfirmation(algodClient:Algodv2, txId:string):Promise<void> {
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

// TODO rename to getPreambleTxs
/**
 * Function to generate preamble transactions
 *
 * @param   {Algodv2}}  algodclient
 * @param   {string}    senderAccount         - user account address
 * @param   {string}    dataAccount           - user storage account address
 * @param   {int}       managerAppId
 * 
 * @return  {Transaction[]}     preamble transaction array
 */
export async function getLeadingTxs(
  algodClient:Algodv2, 
  senderAccount:string, 
  dataAccount:string,
  managerAppId: number,
):Promise<Transaction[]> {
  // get default params
  let params = await getParams(algodClient)

  // initialize text encoder
  const enc = new TextEncoder()
  
  // fetch market variables transaction
  const applTx00 = algosdk.makeApplicationNoOpTxnFromObject({
    from: senderAccount,
    appIndex: managerAppId,
    foreignApps: orderedSupportedMarketAppIds,
    appArgs: [enc.encode(managerStrings.fetch_market_variables)],
    suggestedParams: params,
    note: enc.encode("Fetch Variables"),
    accounts: undefined,
    foreignAssets: undefined,
    rekeyTo: undefined,
  })
  
  // update prices
  // TODO why do we need these extra fees?
  params.fee = 2000
  const applTx01 = algosdk.makeApplicationNoOpTxnFromObject({
    from: senderAccount,
    appIndex: managerAppId,
    foreignApps: orderedOracleAppIds,
    appArgs: [enc.encode(managerStrings.update_prices)],
    suggestedParams: params,
    note: enc.encode("Update Prices"),
    accounts: undefined,
    foreignAssets: undefined,
    rekeyTo: undefined,
  })
  
  // update protocol
  params.fee = 1000
  const applTx02 = algosdk.makeApplicationNoOpTxnFromObject({
    from: senderAccount,
    appIndex: managerAppId,
    foreignApps: orderedSupportedMarketAppIds,
    appArgs: [enc.encode(managerStrings.update_protocol_data)],
    accounts: [dataAccount],
    suggestedParams: params,
    note: enc.encode("Update Protocol"),
    foreignAssets: undefined,
    rekeyTo: undefined,
  })
  
  // dummy transaction one
  const applTx03 = algosdk.makeApplicationNoOpTxnFromObject({
    from: senderAccount,
    appIndex: managerAppId,
    foreignApps: orderedSupportedMarketAppIds,
    appArgs: [enc.encode("dummy_one")],
    suggestedParams: params,
    note: enc.encode("First Dummy Txn"),
    accounts: undefined,
    foreignAssets: undefined,
    rekeyTo: undefined,
  })
  
  // dummy transaction two
  const applTx04 = algosdk.makeApplicationNoOpTxnFromObject({
    from: senderAccount,
    appIndex: managerAppId,
    foreignApps: orderedSupportedMarketAppIds,
    appArgs: [enc.encode("dummy_two")],
    suggestedParams: params,
    note: enc.encode("Second Dummy Txn"),
    accounts: undefined,
    foreignAssets: undefined,
    rekeyTo: undefined,
  })
  
  // dummy transaction three
  const applTx05 = algosdk.makeApplicationNoOpTxnFromObject({
    from: senderAccount,
    appIndex: managerAppId,
    foreignApps: orderedSupportedMarketAppIds,
    appArgs: [enc.encode("dummy_three")],
    suggestedParams: params,
    note: enc.encode("Third Dummy Txn"),
    accounts: undefined,
    foreignAssets: undefined,
    rekeyTo: undefined,
  })
  
  // dummy transaction four
  const applTx06 = algosdk.makeApplicationNoOpTxnFromObject({
    from: senderAccount,
    appIndex: managerAppId,
    foreignApps: orderedSupportedMarketAppIds,
    appArgs: [enc.encode("dummy_four")],
    suggestedParams: params,
    note: enc.encode("Fourth Dummy Txn"),
    accounts: undefined,
    foreignAssets: undefined,
    rekeyTo: undefined,
  })
  
  // dummy transaction five
  const applTx07 = algosdk.makeApplicationNoOpTxnFromObject({
    from: senderAccount,
    appIndex: managerAppId,
    foreignApps: orderedSupportedMarketAppIds,
    appArgs: [enc.encode("dummy_five")],
    suggestedParams: params,
    note: enc.encode("Fifth Dummy Txn"),
    accounts: undefined,
    foreignAssets: undefined,
    rekeyTo: undefined,
  })
  
  // dummy transaction six
  const applTx08 = algosdk.makeApplicationNoOpTxnFromObject({
    from: senderAccount,
    appIndex: managerAppId,
    foreignApps: orderedSupportedMarketAppIds,
    appArgs: [enc.encode("dummy_six")],
    suggestedParams: params,
    note: enc.encode("Sixth Dummy Txn"),
    accounts: undefined,
    foreignAssets: undefined,
    rekeyTo: undefined,
  })
  
  // dummy transaction seven
  const applTx09 = algosdk.makeApplicationNoOpTxnFromObject({
    from: senderAccount,
    appIndex: managerAppId,
    foreignApps: orderedSupportedMarketAppIds,
    appArgs: [enc.encode("dummy_seven")],
    suggestedParams: params,
    note: enc.encode("Seventh Dummy Txn"),
    accounts: undefined,
    foreignAssets: undefined,
    rekeyTo: undefined,
  })
  
  // dummy transaction eight
  const applTx10 = algosdk.makeApplicationNoOpTxnFromObject({
    from: senderAccount,
    appIndex: managerAppId,
    foreignApps: orderedSupportedMarketAppIds,
    appArgs: [enc.encode("dummy_eight")],
    suggestedParams: params,
    note: enc.encode("Eighth Dummy Txn"),
    accounts: undefined,
    foreignAssets: undefined,
    rekeyTo: undefined,
  })
  
  // dummy transaction nine
  const applTx11 = algosdk.makeApplicationNoOpTxnFromObject({
    from: senderAccount,
    appIndex: managerAppId,
    foreignApps: orderedSupportedMarketAppIds,
    appArgs: [enc.encode("dummy_nine")],
    suggestedParams: params,
    note: enc.encode("Nineth Dummy Txn"),
    accounts: undefined,
    foreignAssets: undefined,
    rekeyTo: undefined,
  })
  
  // send transaction array
  return [applTx00, applTx01, applTx02, applTx03, applTx04, applTx05, applTx06, applTx07, applTx08, applTx09, applTx10, applTx11]
}

/**
 * Function to get generic function transactions to the manager and market less any needed payment transactions
 *
 * @param   {Algodv2}   algodClient
 * @param   {string}    senderAccount
 * @param   {string}    dataAccount
 * @param   {int}       marketAppId
 * @param   {int}       managerAppId
 * @param   {int}       foreignAssetId
 * @param   {string}    functionString        - contract psuedo-function string
 * @param   {[]}        extraCallArgs         - additional application arguments for the manager transaction
 * 
 * @return  {Transaction[]}                   - array of primary pseudo-function stransactions
 */
async function getStackGroup(
  algodClient: Algodv2,
  senderAccount: string,
  dataAccount: string,
  marketAppId:number,
  managerAppId: number,
  foreignAssetId:number,
  functionString:string,
  extraCallArgs = null
):Promise<Transaction[]> {
  // initialize generic params
  const params = await getParams(algodClient)
  
  // initialize encoder
  const enc = new TextEncoder()

  // construct manager app args
  let managerAppArgs = []
  managerAppArgs.push(enc.encode(functionString))
  if (extraCallArgs) {
    managerAppArgs.push(extraCallArgs)
  }
  
  // construct manager pseudo-function transaction
  const applTx0 = algosdk.makeApplicationNoOpTxnFromObject({
    from: senderAccount,
    appIndex: managerAppId,
    appArgs: managerAppArgs,
    suggestedParams: params,
    note: enc.encode("Manager: " + functionString),
    accounts: undefined,
    foreignApps: undefined,
    foreignAssets: undefined,
    rekeyTo: undefined,
  })

  // constructmarket pseudo-function transaction
  const applTx1 = algosdk.makeApplicationNoOpTxnFromObject({
    from: senderAccount,
    appIndex: marketAppId,
    foreignApps: [managerAppId],
    appArgs: [enc.encode(functionString)],
    foreignAssets: [foreignAssetId],
    accounts: [dataAccount],
    suggestedParams: params,
    note: enc.encode("Market: " + functionString),
    rekeyTo: undefined,
  })
  return [applTx0, applTx1]
}

/**
 * Function to get payment transaction to indicated market
 *
 * @param   {Algodv2}   algodClient
 * @param   {string}    senderAccount
 * @param   {string}    marketAddres
 * @param   {int}       assetId
 * @param   {int}       amount
 * 
 * @return  {Payment Transaction}
 */
async function getPaymentTxn(
  algodClient:Algodv2,
  senderAccount:string,
  marketAddress:string,
  assetId:number,
  amount:number
):Promise<Transaction> {
  // initialize generic params
  const params = await getParams(algodClient)
  
  if (assetId == 1) { // send algos
    const algoPayment = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: senderAccount,
        to: marketAddress,
        amount: amount,
        suggestedParams: params,
        rekeyTo: undefined,
    })
    return algoPayment

  } else {
    const asaPayment = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: senderAccount,
        to: marketAddress,
        amount: amount,
        assetIndex: assetId,
        suggestedParams: params,
        rekeyTo: undefined,
        revocationTarget: undefined
    })
    return asaPayment
  }
}

/**
 * Function to generate core transactions for user interactions less payment transactions
 *
 * @param   {Algodv2}     algodClient
 * @param   {string}      senderAccount
 * @param   {string}      dataAccount
 * @param   {int}         marketAppId
 * @param   {int}         managerAppId
 * @param   {int}         foreignAssetId
 * @param   {string}      functionString
 * @param   {[]}          extralCallArgs
 * @param   {string}      marketAddress
 * @param   {int}         paymentAssetId
 * @param   {int}         paymentAmount
 * 
 * @return {Transaction[]}
 */
export async function buildUserTransaction(
  algodClient:Algodv2,
  senderAccount:string,
  dataAccount:string,
  marketAppId:number,
  managerAppId: number,
  foreignAssetId:number,
  functionString:string,
  extraCallArgs = null,
  marketAddress = "",
  paymentAssetId = 0,
  paymentAmout = 0
):Promise<Transaction[]> {
  let txns = []
  // get preamble transactions
  let leadingTxs = await getLeadingTxs(algodClient, senderAccount, dataAccount, managerAppId)
  leadingTxs.forEach(txn => {
    txns.push(txn)
  })
  // get function transactions
  let followingTxs = await getStackGroup(algodClient, senderAccount, dataAccount, marketAppId, managerAppId, foreignAssetId, functionString, extraCallArgs)
  followingTxs.forEach(txn => {
    txns.push(txn)
  })
  if (paymentAssetId != 0) {
    let paymentTxn = await getPaymentTxn(algodClient, senderAccount, marketAddress, paymentAssetId, paymentAmout)
    txns.push(paymentTxn)
  }

  return txns
}