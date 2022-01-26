import { AlgofiMainnetClient, AlgofiTestnetClient } from "../v1/client"
import { Algodv2, mnemonicToSecretKey } from "algosdk"
import { printMarketState, printUserState } from "./exampleUtils"

export async function mintExample(
  mnemonic: string = "still exist rifle milk magic fog raw senior grunt claw female talent giggle fatigue truly guard region wife razor put delay arrow napkin ability demise"
) {
  let user = mnemonicToSecretKey(mnemonic)
  let sender = user.addr
  let key = user.sk

  const buffer = "----------------------------------------------------------------------------------------------------"

  // # IS_MAINNET
  // currently hardcoding a test account
  const IS_MAINNET = false
  const client = IS_MAINNET
    ? await AlgofiMainnetClient(undefined, undefined, sender)
    : await AlgofiTestnetClient(undefined, undefined, sender)

  const symbol = client.getActiveOrderedSymbols()[0]

  console.log(buffer)
  console.log("Initial State")
  console.log(buffer)
  console.log(client.markets)

  printMarketState(client.getMarket(symbol))
  printUserState(client, symbol, sender)
  const assetBalance = await client.getUserBalance(
    client
      .getMarket(symbol)
      .getAsset()
      .getUnderlyingAssetId()
  )
  if (assetBalance === 0) {
    throw new Error("User has no balance of asset " + symbol)
  }

  console.log(buffer)
  console.log("Processing add_collateral transaction")
  console.log(buffer)

  let txn = await client.prepareMintTransactions(symbol, assetBalance * 0.1, sender)
  txn.signWithPrivateKey(key)
  await txn.submit(client.algodClient, true)

  console.log(buffer)
  console.log("Final State")
  console.log(buffer)
  printMarketState(client.getMarket(symbol))
  printUserState(client, symbol, sender)
}
