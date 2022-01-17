import algosdk, { Algodv2, Transaction } from "algosdk"
import { buildUserTransaction } from "./extraUtils/submissionUtils"
import { managerStrings } from "./contractStrings"
import { assetDictionary } from "./config"

export async function prepareBorrowTransactions(
  algodClient: Algodv2,
  address: string,
  storageAddress: string,
  amount: number,
  assetName: string
): Promise<Transaction[]> {
  let marketAppId = assetDictionary[assetName]["marketAppId"]
  let underlyingAssetId = assetDictionary[assetName]["underlyingAssetId"]

  let txns = await buildUserTransaction(
    algodClient,
    address,
    storageAddress,
    marketAppId,
    underlyingAssetId,
    managerStrings.borrow,
    algosdk.encodeUint64(amount),
    "",
    0,
    0,
    assetName
  )
  algosdk.assignGroupID(txns)
  return txns
}
