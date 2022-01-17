import algosdk, { Algodv2, Transaction } from "algosdk"
import { getLeadingTxs, getParams } from "./extraUtils/submissionUtils"
import { getGlobalManagerInfo } from "./extraUtils/stateUtils"
import { managerStrings } from "./contractStrings"
import { assetDictionary } from "./config"

export async function prepareClaimRewardsTransactions(
  algodClient: Algodv2,
  asset: string,
  address: string,
  storageAddress: string
): Promise<Transaction[]> {
  let globalManagerData = await getGlobalManagerInfo(algodClient, asset)
  let primaryRewardsAsset = globalManagerData[managerStrings.rewards_asset_id]
  let secondaryRewardsAsset = globalManagerData[managerStrings.rewards_secondary_asset_id]

  // initialize encoder
  const enc = new TextEncoder()

  let txns = []
  // get preamble transactions
  let leadingTxs = await getLeadingTxs(algodClient, address, storageAddress, asset)
  leadingTxs.forEach(txn => {
    txns.push(txn)
  })

  let foreign_assets = []
  if (primaryRewardsAsset && primaryRewardsAsset != 1) {
    foreign_assets.push(primaryRewardsAsset)
  }
  if (secondaryRewardsAsset && secondaryRewardsAsset != 1) {
    foreign_assets.push(secondaryRewardsAsset)
  }

  // construct manager pseudo-function transaction
  const params = await getParams(algodClient)
  params.fee = 3000
  const claimRewardsTxn = algosdk.makeApplicationNoOpTxnFromObject({
    from: address,
    appIndex: assetDictionary[asset]["managerAppId"],
    appArgs: [enc.encode(managerStrings.claim_rewards)],
    suggestedParams: params,
    foreignAssets: foreign_assets,
    accounts: [storageAddress],
    note: enc.encode("Manager: Claim rewards"),
    foreignApps: undefined,
    rekeyTo: undefined
  })
  txns.push(claimRewardsTxn)
  algosdk.assignGroupID(txns)
  return txns
}
