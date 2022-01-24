import { Transactions, TransactionGroup } from "./utils"
import algosdk, { SuggestedParams } from "algosdk"
import { managerStrings } from "./contractStrings"
import { getInitTxns } from "./prepend"

let enc = new TextEncoder()

export async function prepareAddCollateralTransactions(
  sender: string,
  suggestedParams: SuggestedParams,
  storageAccount: string,
  amount: number,
  bankAssetId: number,
  managerAppId: number,
  marketAppId: number,
  marketAddress: string,
  supportedMarketAppIds: number[],
  supportedOracleAppIds: number[]
): Promise<TransactionGroup> {
  let prefixTransactions = getInitTxns(
    Transactions.ADD_COLLATERAL,
    sender,
    suggestedParams,
    managerAppId,
    supportedMarketAppIds,
    supportedOracleAppIds,
    storageAccount
  )

  let txn0 = algosdk.makeApplicationNoOpTxn(sender, suggestedParams, managerAppId, [
    enc.encode(managerStrings.add_collateral)
  ])

  let txn1 = algosdk.makeApplicationNoOpTxn(
    sender,
    suggestedParams,
    marketAppId,
    [enc.encode(managerStrings.add_collateral)],
    [storageAccount],
    [managerAppId]
  )

  let txn2 = algosdk.makeAssetTransferTxnWithSuggestedParams(
    sender,
    marketAddress,
    undefined,
    undefined,
    amount,
    undefined,
    bankAssetId,
    suggestedParams
  )
  let temp = []
  for (let txn of prefixTransactions) {
    temp.push(txn)
  }
  temp.push(txn0)
  temp.push(txn1)
  temp.push(txn2)

  let txnGroup = new TransactionGroup(temp)
  return txnGroup
}
