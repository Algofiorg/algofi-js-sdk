import algosdk, { Algodv2, Transaction } from "algosdk"
import { buildUserTransaction } from "./extraUtils/submissionUtils"
import { managerStrings } from "./contractStrings"
import { assetDictionary } from "./config"

export async function prepareRepayBorrowTransactions(
  algodClient: Algodv2,
  address: string,
  storageAddress: string,
  amount: number,
  assetName: string
): Promise<Transaction[]> {
  const marketAppId = assetDictionary[assetName]["marketAppId"]
  const marketAddress = assetDictionary[assetName]["marketAddress"]
  const underlyingAssetId = assetDictionary[assetName]["underlyingAssetId"]
  const NO_EXTRA_ARGS = null
  let txns = await buildUserTransaction(
    algodClient,
    address,
    storageAddress,
    marketAppId,
    underlyingAssetId,
    managerStrings.repay_borrow,
    NO_EXTRA_ARGS,
    marketAddress,
    underlyingAssetId,
    amount,
    assetName
  )
  algosdk.assignGroupID(txns)
  return txns
}
