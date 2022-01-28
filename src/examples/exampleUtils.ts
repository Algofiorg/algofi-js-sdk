import { Algodv2 } from "algosdk"
import { Market } from "../v1/market"
import { Client } from "../v1/client"

export async function printMarketState(market: Market) {
  console.log("PRINT MARKET STATE IN EXAMPLEUTILS.TS\n")
  market.updateGlobalState()
  console.log("underlying_cash =", await market.getUnderlyingCash())
  console.log("bank_circulation =", market.getBankCirculation())
  console.log("active_collateral =", market.getActiveCollateral())
  console.log("underlying_borrowed =", await market.getUnderlyingBorrowed())
  console.log("total_borrow_interest_rate =", await market.getTotalBorrowInterestRate())
  console.log("\nPRINT MARKET STATE FINISHED\n")
}

export async function printUserState(client: Client, symbol: string, address: string) {
  console.log("PRINT USER STATE IN EXAMPLEUTILS.TS\n")
  let userState = await client.getUserState(address)
  // for (let [key, value] of Object.entries(userState["manager"])) {
  //   console.log(key, "=", value)
  // }
  // for (let [key, value] of Object.entries(userState[symbol])) {
  //   console.log(key, "=", value)
  // }
  // let asset = client.getMarket(symbol).getAsset()
  // console.log(
  //   "user_balance_asset =",
  //   (await client.getUserBalance(asset.getUnderlyingAssetId())) / 10 ** asset.get_underlying_asset_info()["decimals"]
  // )
  // console.log(
  //   "user_balance_bank_assert =",
  //   (await client.getUserBalance(asset.getBankAssetId())) / 10 ** asset.getBankAssetInfo()["decimals"]
  // )
}

export function printStakingContractState(client: Client, stakingContractName: string, address: string) {
  let stakingContract = client.getStakingContract(stakingContractName)
  stakingContract.updateGlobalState()
  console.log("staked =", stakingContract.getStaked())
  let stakingContractUserState = stakingContract.getUserState(address)
  console.log("user_staked =", stakingContractUserState["staked"])
}
