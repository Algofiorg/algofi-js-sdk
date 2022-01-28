import {
  SuggestedParams,
  Transaction,
  makeApplicationNoOpTxn,
  makeAssetTransferTxnWithSuggestedParams,
  makePaymentTxnWithSuggestedParams
} from "algosdk"
import { TransactionGroup, Transactions } from "./utils"
import { managerStrings } from "./contractStrings"
import { getInitTxns } from "./prepend"

const enc = new TextEncoder()

export function prepareMintToCollateralTransactions(
  sender: string,
  suggestedParams: SuggestedParams,
  storageAccount: string,
  amount: number,
  managerAppId: number,
  marketAppId: number,
  marketAddress: string,
  supportedMarketAppIds: number[],
  supportedOracleAppIds: number[],
  assetId: number = null
): TransactionGroup {
  let prefixTransactions = getInitTxns(
    Transactions.MINT_TO_COLLATERAL,
    sender,
    suggestedParams,
    managerAppId,
    supportedMarketAppIds,
    supportedOracleAppIds,
    storageAccount
  )

  let txn0 = makeApplicationNoOpTxn(sender, suggestedParams, managerAppId, [
    enc.encode(managerStrings.mint_to_collateral)
  ])

  let txn1 = makeApplicationNoOpTxn(
    sender,
    suggestedParams,
    marketAppId,
    [enc.encode(managerStrings.mint_to_collateral)],
    [storageAccount],
    [managerAppId]
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

  return new TransactionGroup([...prefixTransactions, txn0, txn1, txn2])
}
