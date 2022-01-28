import {
  SuggestedParams,
  Transaction,
  makeApplicationOptInTxn,
  getApplicationAddress,
  makePaymentTxnWithSuggestedParams,
  makeApplicationNoOpTxn,
  makeAssetTransferTxnWithSuggestedParams
} from "algosdk"
import { getInitTxns } from "./prepend"
import { Transactions, intToBytes, TransactionGroup } from "./utils"
import { managerStrings } from "./contractStrings"

let OPT_IN_MIN_BALANCE = 0.65
const enc = new TextEncoder()

export function prepareStakingContractOptinTransactions(
  managerAppId: number,
  marketAppId: number,
  sender: string,
  storageAddress: string,
  suggestedParams: SuggestedParams
): TransactionGroup {
  console.log("PREPARE STAKING CONTRACT OPT IN TRANSACDTIONS IN STAKING.TS\n")
  //need to convert value to int
  let txnPayment = makePaymentTxnWithSuggestedParams(
    sender,
    storageAddress,
    1000000 * OPT_IN_MIN_BALANCE,
    undefined,
    undefined,
    suggestedParams
  )

  let txnMarket = makeApplicationOptInTxn(sender, suggestedParams, marketAppId)

  let txnUserOptInManager = makeApplicationOptInTxn(sender, suggestedParams, managerAppId)

  //make sure this is same as in python implementation
  let appAddress = getApplicationAddress(managerAppId)

  //Figure out how to get this cleaner
  let txnStorageOptInManager = makeApplicationOptInTxn(
    storageAddress,
    suggestedParams,
    managerAppId,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    appAddress
  )

  return new TransactionGroup([txnPayment, txnMarket, txnUserOptInManager, txnStorageOptInManager])
}

export function prepareStakeTransactions(
  sender: string,
  suggestedParams: SuggestedParams,
  storageAccount: string,
  amount: number,
  managerAppId: number,
  marketAppId: number,
  marketAddress: string,
  oracleAppId: number,
  assetId: number = null
): TransactionGroup {
  let supportedOracleAppIds = [oracleAppId]
  let supportedMarketAppIds = [marketAppId]
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

export function prepareUnstakeTransactions(
  sender: string,
  suggestedParams: SuggestedParams,
  storageAccount: string,
  amount: number,
  managerAppId: number,
  marketAppId: number,
  oracleAppId: number,
  assetId: number = null
): TransactionGroup {
  console.log("PREPARE UNSTAKE TRANSACTIONS IN STAKING.TS\n")
  let supportedMarketAppIds = [marketAppId]
  let supportedOracleAppIds = [oracleAppId]
  let prefixTransactions = getInitTxns(
    Transactions.REMOVE_COLLATERAL_UNDERLYING,
    sender,
    suggestedParams,
    managerAppId,
    supportedMarketAppIds,
    supportedOracleAppIds,
    storageAccount
  )
  let txn0 = makeApplicationNoOpTxn(sender, suggestedParams, managerAppId, [
    enc.encode(managerStrings.remove_collateral_underlying),
    intToBytes(amount)
  ])
  let txn1: Transaction
  if (assetId) {
    txn1 = makeApplicationNoOpTxn(
      sender,
      suggestedParams,
      marketAppId,
      [enc.encode(managerStrings.remove_collateral_underlying)],
      [storageAccount],
      [managerAppId],
      [assetId]
    )
  } else {
    txn1 = makeApplicationNoOpTxn(
      sender,
      suggestedParams,
      marketAppId,
      [enc.encode(managerStrings.remove_collateral_underlying)],
      [storageAccount],
      [managerAppId]
    )
  }

  return new TransactionGroup([...prefixTransactions, txn0, txn1])
}

export function prepareClaimStakingRewardsTransactions(
  sender: string,
  suggestedParams: SuggestedParams,
  storageAccount: string,
  managerAppId: number,
  marketAppId: number,
  oracleAppId: number,
  foreignAssets: number[]
): TransactionGroup {
  console.log("PREPARE CLAIM STAKING REWARDS TRANSACTIONS IN STAKING.TS\n")
  let supportedMarketAppIds = [marketAppId]
  let supportedOracleAppIds = [oracleAppId]
  let prefixTransactions = getInitTxns(
    Transactions.CLAIM_REWARDS,
    sender,
    suggestedParams,
    managerAppId,
    supportedMarketAppIds,
    supportedOracleAppIds,
    storageAccount
  )
  let txn0 = makeApplicationNoOpTxn(
    sender,
    suggestedParams,
    managerAppId,
    [enc.encode(managerStrings.claim_rewards)],
    [storageAccount],
    undefined,
    foreignAssets
  )

  return new TransactionGroup([...prefixTransactions, txn0])
}
