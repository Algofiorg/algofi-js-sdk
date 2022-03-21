import algosdk, { Algodv2, Transaction } from "algosdk"
import { buildUserTransaction } from "./extraUtils/submissionUtils"
import { managerStrings } from "./contractStrings"
import { assetDictionary } from "./config"

export async function prepareBurnTransactions(
  algodClient: Algodv2,
  address: string,
  storageAddress: string,
  amount: number,
  assetName: string
): Promise<Transaction[]> {
  let marketAppId = assetDictionary[assetName]["marketAppId"]
  let marketAddress = assetDictionary[assetName]["marketAddress"]
  let bankAssetId = assetDictionary[assetName]["bankAssetId"]
  let underlyingAssetId = assetDictionary[assetName]["underlyingAssetId"]
  const NO_EXTRA_ARGS = null

  let txns = await buildUserTransaction(
    algodClient,
    address,
    storageAddress,
    marketAppId,
    underlyingAssetId,
    managerStrings.burn,
    NO_EXTRA_ARGS,
    marketAddress,
    bankAssetId,
    amount,
    assetName
  )
  algosdk.assignGroupID(txns)
  return txns
}
