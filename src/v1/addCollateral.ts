import { Transactions, TransactionGroup } from "./utils"
import { SuggestedParams, makeApplicationNoOpTxn, makeAssetTransferTxnWithSuggestedParams } from "algosdk"
import { managerStrings } from "./contractStrings"
import { getInitTxns } from "./prepend"

const enc = new TextEncoder()

export function prepareAddCollateralTransactions(
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
): TransactionGroup {
  console.log("PREPARE ADD COLLATERAL TRANSACTIONS IN ADDCOLLATERAL.TS\n")
  let prefixTransactions = getInitTxns(
    Transactions.ADD_COLLATERAL,
    sender,
    suggestedParams,
    managerAppId,
    supportedMarketAppIds,
    supportedOracleAppIds,
    storageAccount
  )

  let txn0 = makeApplicationNoOpTxn(sender, suggestedParams, managerAppId, [enc.encode(managerStrings.add_collateral)])

  let txn1 = makeApplicationNoOpTxn(
    sender,
    suggestedParams,
    marketAppId,
    [enc.encode(managerStrings.add_collateral)],
    [storageAccount],
    [managerAppId]
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
  let temp = [...prefixTransactions]
  temp.push(txn0)
  temp.push(txn1)
  temp.push(txn2)

  let txnGroup = new TransactionGroup(temp)
  return txnGroup
}
