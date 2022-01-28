import { makeApplicationNoOpTxn, makeAssetTransferTxnWithSuggestedParams, SuggestedParams } from "algosdk"
import { TransactionGroup, Transactions } from "./utils"
import { managerStrings } from "./contractStrings"
import { getInitTxns } from "./prepend"

const enc = new TextEncoder()

export function prepareBurnTransactions(
  sender: string,
  suggestedParams: SuggestedParams,
  storageAccount: string,
  amount: number,
  assetId: number,
  bankAssetId: number,
  managerAppId: number,
  marketAppId: number,
  marketAddress: string,
  supportedMarketAppIds: number[],
  supportedOracleAppIds: number[]
): TransactionGroup {
  let prefixTransactions = getInitTxns(
    Transactions.BURN,
    sender,
    suggestedParams,
    managerAppId,
    supportedMarketAppIds,
    supportedOracleAppIds,
    storageAccount
  )
  let txn0 = makeApplicationNoOpTxn(sender, suggestedParams, managerAppId, [enc.encode(managerStrings.burn)])
  let txn1 = makeApplicationNoOpTxn(
    sender,
    suggestedParams,
    marketAppId,
    [enc.encode(managerStrings.burn)],
    [storageAccount],
    [managerAppId],
    [assetId]
  )
  let txn2 = makeAssetTransferTxnWithSuggestedParams(
    sender,
    marketAddress,
    undefined,
    undefined,
    amount,
    undefined,
    bankAssetId,
    suggestedParams
  )
  return new TransactionGroup([...prefixTransactions, txn0, txn1, txn2])
}
