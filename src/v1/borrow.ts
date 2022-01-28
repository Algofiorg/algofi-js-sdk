import { SuggestedParams, makeApplicationNoOpTxn } from "algosdk"
import { Transactions, intToBytes } from "./utils"
import { managerStrings } from "./contractStrings"
import { TransactionGroup } from "./utils"
import { getInitTxns } from "./prepend"

let enc = new TextEncoder()

export function prepareBorrowTransactions(
  sender: string,
  suggestedParams: SuggestedParams,
  storageAccount: string,
  amount: number,
  assetId: number,
  managerAppId: number,
  marketAppId: number,
  supportedMarketAppIds: number[],
  supportedOracleAppIds: number[]
): TransactionGroup {
  console.log("PREPARE BORROW TRANSACTIONS IN BORROW.TS\n")
  let prefixTransactions = getInitTxns(
    Transactions.BORROW,
    sender,
    suggestedParams,
    managerAppId,
    supportedMarketAppIds,
    supportedOracleAppIds,
    storageAccount
  )
  let txn0 = makeApplicationNoOpTxn(sender, suggestedParams, managerAppId, [
    enc.encode(managerStrings.borrow),
    intToBytes(amount)
  ])

  let txn1 = makeApplicationNoOpTxn(
    sender,
    suggestedParams,
    marketAppId,
    [enc.encode(managerStrings.borrow)],
    [storageAccount],
    [managerAppId],
    [assetId]
  )
  console.log("prepare borrow transactions in borrow.ts finished and returned something")
  return new TransactionGroup([...prefixTransactions, txn0, txn1])
}
