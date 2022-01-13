import algosdk, { Algodv2, Transaction } from "algosdk"
import { buildUserTransaction } from "./submissionUtils"
import { managerStrings } from "./contractStrings"
import { assetDictionary } from "./config"

export async function prepareMintTransactions(
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

  let txns = await buildUserTransaction(
    algodClient,
    address,
    storageAddress,
    marketAppId,
    bankAssetId,
    managerStrings.mint,
    NO_EXTRA_ARGS,
    marketAddress,
    underlyingAssetId,
    amount,
    assetName
  )
  algosdk.assignGroupID(txns)
  return txns
}
