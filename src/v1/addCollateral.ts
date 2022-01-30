import { SuggestedParams, makeApplicationNoOpTxn, makeAssetTransferTxnWithSuggestedParams } from "algosdk"
import { Transactions, TransactionGroup } from "./utils"
import { managerStrings } from "./contractStrings"
import { getInitTxns } from "./prepend"

const enc = new TextEncoder()

/**
 * Returns a :class:`TransactionGroup` object representing an add collateral group
 * transaction against the algofi protocol. Sender adds bank assets to collateral by sending 
 * them to the account address of the market application that generates the bank assets.
 *
 * @param   {string}           sender
 * @param   {SuggestedParams}  suggestedParams
 * @param   {string}           storageAccount
 * @param   {number}           amount
 * @param   {number}           bankAssetId
 * @param   {number}           managerAppId
 * @param   {number}           marketAppId
 * @param   {string}           marketAddress
 * @param   {list}             supportedMarketAppIds
 * @param   {list}             supportedOracleAppIds
 *
 * @return  {TransactionGroup}  TransactionGroup representing an add collateral group transaction
 */

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
  return new TransactionGroup([...prefixTransactions, txn0, txn1, txn2])
}
