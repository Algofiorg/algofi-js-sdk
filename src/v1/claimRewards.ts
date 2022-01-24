import { makeApplicationNoOpTxn, SuggestedParams } from "algosdk"
import { getInitTxns } from "./prepend"
import { TransactionGroup, Transactions } from "./utils"
import { managerStrings } from "./contractStrings"

let enc = new TextEncoder()

export function prepareClaimRewardsTransactions(
  sender: string,
  suggestedParams: SuggestedParams,
  storageAccount: string,
  managerAppId: number,
  supportedMarketAppIds: number[],
  supportedOracleAppIds: number[],
  foreignAssets: number[]
) {
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

  let temp = [...prefixTransactions]
  temp.push(txn0)
  return new TransactionGroup(temp)
}
