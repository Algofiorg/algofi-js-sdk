import { AlgofiMainnetClient, AlgofiTestnetClient } from "../v1/client"
import { Algodv2, mnemonicToSecretKey } from "algosdk"
import { printMarketState, printUserState } from "./exampleUtils"

export async function liquidateExample(
  mnemonic: string = "still exist rifle milk magic fog raw senior grunt claw female talent giggle fatigue truly guard region wife razor put delay arrow napkin ability demise"
) {
  let user = mnemonicToSecretKey(mnemonic)
  let sender = user.addr
  let key = user.sk
  console.log("this ran")

  const buffer = "----------------------------------------------------------------------------------------------------"

  // # IS_MAINNET
  // currently hardcoding a test account
  const IS_MAINNET = false
  const client = IS_MAINNET
    ? await AlgofiMainnetClient(undefined, undefined, sender)
    : await AlgofiTestnetClient(undefined, undefined, sender)

  const collateralSymbol = client.getActiveOrderedSymbols()[0]
  const borrowSymbol = client.getActiveOrderedSymbols()[1]

  const targetAddress = "ENTER ADRESS HERE"
  const targetStorageAddress = "ENTER STORAGE ADDRESS HERE"

  const amount = 100

  console.log(buffer)
  console.log("Initial State")
  console.log(buffer)

  printUserState(client, borrowSymbol, targetAddress)
  printUserState(client, collateralSymbol, targetAddress)
  printMarketState(client.getMarket(borrowSymbol))
  printMarketState(client.getMarket(collateralSymbol))

  const assetBalance = await client.getUserBalance(
    client
      .getMarket(borrowSymbol)
      .getAsset()
      .getUnderlyingAssetId()
  )
  if (assetBalance === 0) {
    throw new Error("User has no balance of asset " + borrowSymbol)
  }

  console.log(buffer)
  console.log("Processing liquidation transaction")
  console.log(buffer)
  console.log(`Processing transaction for borrow asset = ${borrowSymbol} and collateral asset = ${collateralSymbol}`)

  let txn = await client.prepareLiquidateTransactions(targetStorageAddress, borrowSymbol, amount, collateralSymbol)
  txn.signWithPrivateKey(key)
  await txn.submit(client.algodClient, true)

  console.log(buffer)
  console.log("Final State")
  console.log(buffer)
  printMarketState(client.getMarket(borrowSymbol))
  printUserState(client, borrowSymbol, sender)
}
