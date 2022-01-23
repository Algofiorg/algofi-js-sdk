import algosdk, { makePaymentTxnWithSuggestedParamsFromObject, SuggestedParams, Transaction } from "algosdk"
import { getInitTxns } from "./prepend"
import { Transactions } from "./utils"
import { managerStrings } from "./contractStrings"

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
) {
  let prefixTransactions = getInitTxns(
    Transactions.LIQUIDATE,
    sender,
    suggestedParams,
    managerAppId,
    supportedMarketAppIds,
    supportedOracleAppIds,
    storageAccount
  )

  const enc = new TextEncoder()
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
  //I think I may be doing something wrong here, they don't even give an option for suggested params
  //Also is there an easier way to ignore parameters?
  if (borrowAssetId) {
    txn2 = algosdk.makeAssetTransferTxn(
      sender,
      borrowMarketAddress,
      undefined,
      undefined,
      undefined,
      amount,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      borrowAssetId
    )
    //Not exactly sure what this function is trying to implement
  } else {
    txn2 = algosdk.makeAssetTransferTxn(
      sender,
      borrowMarketAddress,
      undefined,
      undefined,
      undefined,
      amount,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      borrowAssetId
    )
  }

  let txn3 = algosdk.makeApplicationNoOpTxn(
    sender,
    suggestedParams,
    collateralMarketAppId,
    [enc.encode(managerStrings.liquidate)],
    [liquidateeStorageAccount, storageAccount],
    [managerAppId, borrowMarketAppId],
    [collateralBankAssetId]
  )

  let temp = []
  for (let txn of prefixTransactions) {
    temp.push(txn)
  }
  temp.push(txn0)
  temp.push(txn1)
  temp.push(txn2)
  temp.push(txn3)
  return temp
}
