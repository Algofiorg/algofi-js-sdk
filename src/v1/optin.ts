import {
  SuggestedParams,
  makeApplicationOptInTxn,
  makePaymentTxnWithSuggestedParams,
  getApplicationAddress,
  makeAssetTransferTxnWithSuggestedParams
} from "algosdk"
import { TransactionGroup, getRandomInt, intToBytes } from "./utils"
const OPT_IN_MIN_BALANCE = 3.5695

export function prepareManagerAppOptinTransactions(
  managerAppId: number,
  getMaxAtomicOptInMarketAppIds: number[],
  sender: string,
  storageAddress: string,
  suggestedParams: SuggestedParams
): TransactionGroup {
  //have to convert opt_in_min_balance * 1e6 to an integer
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

  //need to make sure getApplicationAddress is ok and similar to python implementation
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
  return new TransactionGroup([txnPayment, ...marketOptinTransactions, txnUserOptinManager, txnStorageOptinManager])
}

//Do I really have to add a random note here?
export function prepareMarketAppOptinTransactions(
  marketAppId: number,
  sender: string,
  suggestedParams: SuggestedParams
): TransactionGroup {
  return new TransactionGroup([
    makeApplicationOptInTxn(sender, suggestedParams, marketAppId, [intToBytes(getRandomInt(1000000))])
  ])
}

//not sure if there is a built in asset opt in transaction for js
// export function prepareAssetOptinTransactions(
//   assetId: number,
//   sender: string,
//   suggestedParams: SuggestedParams
// ): TransactionGroup {
//   return new TransactionGroup([makeAssetTransferTxnWithSuggestedParams(sender)])
// }
