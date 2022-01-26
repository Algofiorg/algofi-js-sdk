import {
  makeApplicationNoOpTxn,
  makeAssetTransferTxnWithSuggestedParams,
  makePaymentTxnWithSuggestedParams,
  SuggestedParams,
  Transaction
} from "algosdk"
import { getInitTxns } from "./prepend"
import { TransactionGroup, Transactions } from "./utils"
import { managerStrings } from "./contractStrings"

let enc = new TextEncoder()

export function prepareMintTransactions(
  sender: string,
  suggestedParams: SuggestedParams,
  storageAccount: string,
  amount: number,
  bankAssetId: number,
  managerAppId: number,
  marketAppId: number,
  marketAddress: string,
  supportedMarketAppIds: number[],
  supportedOracleAppIds: number[],
  assetId: number = undefined
): TransactionGroup {
  console.log("PREPARE MINT TRANSACTIONS IN MINT.TS\n")
  let prefixTransactions = getInitTxns(
    Transactions.MINT,
    sender,
    suggestedParams,
    managerAppId,
    supportedMarketAppIds,
    supportedOracleAppIds,
    storageAccount
  )

  let txn0 = makeApplicationNoOpTxn(sender, suggestedParams, managerAppId, [enc.encode(managerStrings.mint)])

  let txn1 = makeApplicationNoOpTxn(
    sender,
    suggestedParams,
    marketAppId,
    [enc.encode(managerStrings.mint)],
    [storageAccount],
    [managerAppId],
    [bankAssetId]
  )

  let txn2: Transaction
  if (assetId) {
    txn2 = makeAssetTransferTxnWithSuggestedParams(
      sender,
      marketAddress,
      undefined,
      undefined,
      amount,
      undefined,
      assetId,
      suggestedParams
    )
  } else {
    txn2 = makePaymentTxnWithSuggestedParams(sender, marketAddress, amount, undefined, undefined, suggestedParams)
  }
  let temp = [...prefixTransactions]
  temp.push(txn0)
  temp.push(txn1)
  temp.push(txn2)
  return new TransactionGroup(temp)
}
