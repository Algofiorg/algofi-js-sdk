import algosdk, { encodeAddress, SuggestedParams, Transaction } from "algosdk"
import { getInitTxns } from "./prepend"
import { Transactions, intToBytes } from "./utils"
import { managerStrings } from "./contractStrings"
import { getJSDocReturnType } from "typescript"

let OPT_IN_MIN_BALANCE = 0.65

let enc = new TextEncoder()

export function prepareStakingContractOptinTransactions(
  managerAppId: number,
  marketAppId: number,
  sender: string,
  storageAddress: string,
  suggestedParams: SuggestedParams
): Transaction[] {
  console.log("PREPARE STAKING CONTRACT OPT IN TRANSACDTIONS IN STAKING.TS\n")
  let txnPayment = algosdk.makePaymentTxnWithSuggestedParams(
    sender,
    storageAddress,
    1000000 * OPT_IN_MIN_BALANCE,
    undefined,
    undefined,
    suggestedParams
  )

  let txnMarket = algosdk.makeApplicationOptInTxn(sender, suggestedParams, marketAppId)

  let txnUserOptInManager = algosdk.makeApplicationOptInTxn(sender, suggestedParams, managerAppId)

  let appAddress = algosdk.getApplicationAddress(managerAppId)

  //Figure out how to get this cleaner
  let txnStorageOptInManager = algosdk.makeApplicationOptInTxn(
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

  let temp = []
  temp.push(txnPayment)
  temp.push(txnMarket)
  temp.push(txnUserOptInManager)
  temp.push(txnStorageOptInManager)
  return temp
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
  assetId: number = undefined
): Transaction[] {
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
  let enc = new TextEncoder()
  let txn0 = algosdk.makeApplicationNoOpTxn(sender, suggestedParams, managerAppId, [
    enc.encode(managerStrings.mint_to_collateral)
  ])
  let txn1 = algosdk.makeApplicationNoOpTxn(
    sender,
    suggestedParams,
    marketAppId,
    [enc.encode(managerStrings.mint_to_collateral)],
    [storageAccount],
    [managerAppId]
  )

  let txn2: Transaction
  if (assetId) {
    txn2 = algosdk.makeAssetTransferTxnWithSuggestedParams(
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
    txn2 = algosdk.makePaymentTxnWithSuggestedParams(
      sender,
      marketAddress,
      amount,
      undefined,
      undefined,
      suggestedParams
    )
  }

  let temp = []
  temp.push(prefixTransactions)
  temp.push(txn0)
  temp.push(txn1)
  temp.push(txn2)
  return temp
}

export function prepareUnstakeTransactions(
  sender: string,
  suggestedParams: SuggestedParams,
  storageAccount: string,
  amount: number,
  managerAppId: number,
  marketAppId: number,
  oracleAppId: number,
  assetId: number = undefined
): Transaction[] {
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
  let txn0 = algosdk.makeApplicationNoOpTxn(sender, suggestedParams, managerAppId, [
    enc.encode(managerStrings.remove_collateral_underlying),
    intToBytes(amount)
  ])
  let txn1: Transaction
  if (assetId) {
    let txn1 = algosdk.makeApplicationNoOpTxn(
      sender,
      suggestedParams,
      marketAppId,
      [enc.encode(managerStrings.remove_collateral_underlying)],
      [storageAccount],
      [managerAppId],
      [assetId]
    )
  } else {
    let txn1 = algosdk.makeApplicationNoOpTxn(
      sender,
      suggestedParams,
      marketAppId,
      [enc.encode(managerStrings.remove_collateral_underlying)],
      [storageAccount],
      [managerAppId]
    )
  }
  let txnGroup = []
  for (let txn of prefixTransactions) {
    txnGroup.push(txn)
  }
  txnGroup.push(txn0)
  txnGroup.push(txn1)
  return txnGroup
}

export function prepareClaimStakingRewardsTransactions(
  sender: string,
  suggestedParams: SuggestedParams,
  storageAccount: string,
  managerAppId: number,
  marketAppId: number,
  oracleAppId: number,
  foreignAssets: number[]
) {
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
  let txn0 = algosdk.makeApplicationNoOpTxn(
    sender,
    suggestedParams,
    managerAppId,
    [enc.encode(managerStrings.claim_rewards)],
    [storageAccount],
    undefined,
    foreignAssets
  )
}
