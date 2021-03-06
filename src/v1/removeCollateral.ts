import algosdk, { Algodv2, Transaction } from "algosdk"
import { buildUserTransaction } from "./extraUtils/submissionUtils"
import { managerStrings } from "./contractStrings"
import { assetDictionary } from "./config"

export async function prepareRemoveCollateralTransactions(
  algodClient: Algodv2,
  address: string,
  storageAddress: string,
  amount: number,
  assetName: string
): Promise<Transaction[]> {
  const marketAppId = assetDictionary[assetName]["marketAppId"]
  const bankAssetId = assetDictionary[assetName]["bankAssetId"]

  let txns = await buildUserTransaction(
    algodClient,
    address,
    storageAddress,
    marketAppId,
    bankAssetId,
    managerStrings.remove_collateral,
    algosdk.encodeUint64(amount),
    "",
    0,
    0,
    assetName
  )
  algosdk.assignGroupID(txns)
  return txns
}
