const OPT_IN_MIN_BALANCE = 3.5695
import algosdk, { SuggestedParams } from "algosdk"

//Not sure whether to keep suggested params or not
export const prepareManagerAppOptinTransactions = (
  managerAppId: number,
  getMaxAtomicOptInMarketAppIds: number[],
  sender: string,
  storageAddress: string,
  suggestedParams: SuggestedParams
) => {
  //need to figure out how to get OPT_INT... * 1000000 to work without getting typescript error for using parseInt
  let txns = []
  //payment txn
  txns.push(
    algosdk.makePaymentTxnWithSuggestedParams(
      sender,
      storageAddress,
      OPT_IN_MIN_BALANCE * 1000000,
      _,
      _,
      suggestedParams
    )
  )
  //opt in market app ids transaction
  for (let marketAppId of getMaxAtomicOptInMarketAppIds) {
    let txn = algosdk.makeApplicationOptInTxn(storageAddress, suggestedParams, marketAppId)
    txns.push(txn)
  }
  //manager op in transaction
  txns.push(algosdk.makeApplicationOptInTxn(sender, suggestedParams, managerAppId))
  let appAddress = algosdk.getApplicationAddress(managerAppId)
  //storage opt in manager transaction
  txns.push(
    algosdk.makeApplicationOptInTxn(storageAddress, suggestedParams, managerAppId, _, _, _, _, _, _, appAddress)
  )

  //Do we have to make this into a transaction group object like in the python sdk? It seems like in the javascript sdk the type of a transaction group is just an
  //array of transactions.
  return txns
}

export const prepareMarketAppOptinTransactions = (
  marketAppId: number,
  sender: string,
  suggestedParams: SuggestedParams
) => {
  //in the python sdk they put  a random note, i'm not sure why but i'm also not sure if i have to implement this as well
  let txn = algosdk.makeApplicationOptInTxn(sender, suggestedParams, marketAppId)
  return [txn]
}

export const prepareAssetOptinTransactions = (assetId: number, sender: string, suggestedParams: SuggestedParams) => {
  //not sure if there is a built in asset opt in function for the js sdk
  ///let txn = algosdk.makeAssetTransferTxnWithSuggestedParams(sender, _+);;;
}
