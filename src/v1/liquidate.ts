import algosdk, { makeAssetTransferTxnWithSuggestedParams, SuggestedParams, Transaction } from "algosdk"
import { getInitTxns } from "./prepend"
import { TransactionGroup, Transactions } from "./utils"
import { managerStrings } from "./contractStrings"

const enc = new TextEncoder()

export function prepareLiquidateTransactions(
  sender: string,
  suggestedParams: SuggestedParams,
  storageAccount: string,
  liquidateeStorageAccount: string,
  amount: number,
  managerAppId: number,
  borrowMarketAppId: number,
  borrowMarketAddress: string,
  collateralMarketAppId: number,
  supportedMarketAppIds: number[],
  supportedOracleAppIds: number[],
  collateralBankAssetId: number,
  borrowAssetId: number = undefined
): TransactionGroup {
  console.log("PREPARE LIQUIDATE TRANSACTIONS IN LIQUIDATE.TS\n")
  let prefixTransactions = getInitTxns(
    Transactions.LIQUIDATE,
    sender,
    suggestedParams,
    managerAppId,
    supportedMarketAppIds,
    supportedOracleAppIds,
    storageAccount
  )
  let txn0 = algosdk.makeApplicationNoOpTxn(
    sender,
    suggestedParams,
    managerAppId,
    [enc.encode(managerStrings.liquidate)],
    undefined,
    supportedMarketAppIds
  )

  let txn1 = algosdk.makeApplicationNoOpTxn(
    sender,
    suggestedParams,
    borrowMarketAppId,
    [enc.encode(managerStrings.liquidate)],
    [liquidateeStorageAccount],
    [managerAppId, collateralMarketAppId]
  )

  let txn2: Transaction
  if (borrowAssetId) {
    txn2 = makeAssetTransferTxnWithSuggestedParams(
      sender,
      borrowMarketAddress,
      undefined,
      undefined,
      amount,
      undefined,
      borrowAssetId,
      suggestedParams
    )
  }

  let txn3 = makeAssetTransferTxnWithSuggestedParams(
    sender,
    borrowMarketAddress,
    undefined,
    undefined,
    amount,
    undefined,
    undefined,
    suggestedParams
  )

  let temp = [...prefixTransactions]
  temp.push(txn0)
  temp.push(txn1)
  temp.push(txn2)
  temp.push(txn3)
  return new TransactionGroup(temp)
}
