import { makeApplicationNoOpTxn, SuggestedParams } from "algosdk"
import { TransactionGroup, Transactions } from "./utils"
import { managerStrings } from "./contractStrings"
import { getInitTxns } from "./prepend"

let enc = new TextEncoder()

export function prepareRemoveCollateralTransactions(
  sender: string,
  suggestedParams: SuggestedParams,
  storageAccount: string,
  amount: number,
  bankAssetId: number,
  managerAppId: number,
  marketAppId: number,
  supportedMarketAppIds: number[],
  supportedOracleAppIds: number[]
): TransactionGroup {
  let prefixTransactions = getInitTxns(
    Transactions.REMOVE_COLLATERAL,
    sender,
    suggestedParams,
    managerAppId,
    supportedMarketAppIds,
    supportedOracleAppIds,
    storageAccount
  )
  //figure out int_to_bytes
  let txn0 = makeApplicationNoOpTxn(sender, suggestedParams, managerAppId, [
    enc.encode(managerStrings.remove_collateral),
    inToBytes(amount)
  ])
  let txn1 = makeApplicationNoOpTxn(
    sender,
    suggestedParams,
    marketAppId,
    [enc.encode(managerStrings.remove_collateral)],
    [storageAccount],
    [managerAppId],
    [bankAssetId]
  )
  let temp = [...prefixTransactions]
  temp.push(txn0)
  temp.push(txn1)
  return new TransactionGroup(temp)
}
