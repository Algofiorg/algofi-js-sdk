import {
  makeAssetTransferTxnWithSuggestedParams,
  SuggestedParams,
  Transaction,
  makeApplicationNoOpTxn,
  makePaymentTxnWithSuggestedParams
} from "algosdk"
import { TransactionGroup, Transactions } from "./utils"
import { managerStrings } from "./contractStrings"
import { getInitTxns } from "./prepend"

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
  borrowAssetId: number = null
): TransactionGroup {
  console.log("PREPARE LIQUIDATE TRANSACTIONS IN LIQUIDATE.TS\n")
  let prefixTransactions = getInitTxns(
    Transactions.LIQUIDATE,
    sender,
    suggestedParams,
    managerAppId,
    supportedMarketAppIds,
    supportedOracleAppIds,
    liquidateeStorageAccount
  )
  let txn0 = makeApplicationNoOpTxn(
    sender,
    suggestedParams,
    managerAppId,
    [enc.encode(managerStrings.liquidate)],
    undefined,
    supportedMarketAppIds
  )

  let txn1 = makeApplicationNoOpTxn(
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
  } else {
    txn2 = makePaymentTxnWithSuggestedParams(sender, borrowMarketAddress, amount, undefined, undefined, suggestedParams)
  }

  let txn3 = makeApplicationNoOpTxn(
    sender,
    suggestedParams,
    collateralMarketAppId,
    [enc.encode(managerStrings.liquidate)],
    [liquidateeStorageAccount, storageAccount],
    [managerAppId, borrowMarketAppId],
    [collateralBankAssetId]
  )

  return new TransactionGroup([...prefixTransactions, txn0, txn1, txn2, txn3])
}
