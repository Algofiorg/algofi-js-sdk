import {
  SuggestedParams,
  makeApplicationOptInTxn,
  makePaymentTxnWithSuggestedParams,
  getApplicationAddress,
  makeAssetTransferTxnWithSuggestedParams
} from "algosdk"
import { TransactionGroup } from "./utils"
const OPT_IN_MIN_BALANCE = 3.5695

export function prepareManagerAppOptinTransactions(
  managerAppId: number,
  getMaxAtomicOptInMarketAppIds: number[],
  sender: string,
  storageAddress: string,
  suggestedParams: SuggestedParams
): TransactionGroup {
  console.log("PREPARE MANAGER APP OPTIN TRANSACTIONS IN OPTIN.TS\n")
  let txnPayment = makePaymentTxnWithSuggestedParams(
    sender,
    storageAddress,
    OPT_IN_MIN_BALANCE * 1e6,
    undefined,
    undefined,
    suggestedParams
  )

  let marketOptinTransactions = []
  for (let marketAppId of getMaxAtomicOptInMarketAppIds) {
    marketOptinTransactions.push(makeApplicationOptInTxn(sender, suggestedParams, marketAppId))
  }

  let txnUserOptinManager = makeApplicationOptInTxn(sender, suggestedParams, managerAppId)
  let appAddress = getApplicationAddress(managerAppId)
  let txnStorageOptinManager = makeApplicationOptInTxn(
    storageAddress,
    suggestedParams,
    managerAppId,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    appAddress
  )
  let temp = [txnPayment]
  for (let txn of marketOptinTransactions) {
    temp.push(txn)
  }
  temp.push(txnUserOptinManager)
  temp.push(txnStorageOptinManager)
  return new TransactionGroup(temp)
}

//Do I really have to add a random note here?
export function prepareMarketAppOptinTransactions(
  marketAppId: number,
  sender: string,
  suggestedParams: SuggestedParams
): TransactionGroup {
  return new TransactionGroup([makeApplicationOptInTxn(sender, suggestedParams, marketAppId)])
}

//not sure if there is a built in asset opt in transaction for js
// export function prepareAssetOptinTransactions(
//   assetId: number,
//   sender: string,
//   suggestedParams: SuggestedParams
// ): TransactionGroup {
//   return new TransactionGroup([makeAssetTransferTxnWithSuggestedParams(sender)])
// }
