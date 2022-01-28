import algosdk from "algosdk"
import { marketStrings, managerStrings } from "./contractStrings"
import { getGlobalState, readLocalState } from "./utils"
import { Market } from "./market"
import { Manager } from "./manager"
import { PARAMETER_SCALE_FACTOR, REWARDS_SCALE_FACTOR, SCALE_FACTOR } from "./config"
import { get } from "./utils"

export class RewardsProgram {
  algod: algosdk.Algodv2
  latestRewardsTime: number
  rewardsProgramNumber: number
  rewardsAmount: number
  rewardsPerSecond: number
  rewardsAssetId: number
  rewardsSecondaryRatio: number
  rewardsSecondaryAssetId: number

  constructor(algodClient: algosdk.Algodv2, managerState: {}) {
    console.log("CONSTRUCTOR IN REWARDSPROGRAM.TS\n")
    this.algod = algodClient
    this.latestRewardsTime = get(managerState, managerStrings.latest_rewards_time, 0)
    this.rewardsProgramNumber = get(managerState, managerStrings.n_rewards_programs, 0)
    this.rewardsAmount = get(managerState, managerStrings.rewards_amount, 0)
    this.rewardsPerSecond = get(managerState, managerStrings.rewards_per_second, 0)
    this.rewardsAssetId = get(managerState, managerStrings.rewards_asset_id, 0)
    this.rewardsSecondaryRatio = get(managerState, managerStrings.rewards_secondary_ratio, 0)
    this.rewardsSecondaryAssetId = get(managerState, managerStrings.rewards_secondary_asset_id, 0)
  }

  //Getters

  getRewardsAssetIds(): number[] {
    console.log("GET REWARDS ASSET IDS IN REWARDSPROGRAM.TS\n")
    const result = []
    if (this.rewardsAssetId > 1) {
      result.push(this.rewardsAssetId)
    }
    if (this.rewardsSecondaryAssetId > 1) {
      result.push(this.rewardsSecondaryAssetId)
    }
    return result
  }
  getLatestRewardsTime(): number {
    console.log("GET LATEST REWARDS TIME IN REWARDSPROGRAM.TS\n")
    return this.latestRewardsTime
  }
  getRewardsProgramNumber(): number {
    console.log("GET REWARDS PROGRAM NUMBER IN REWARDSPROGRAM.TS\n")
    return this.rewardsProgramNumber
  }
  getRewardsAmount(): number {
    console.log("GET REWARDS AMOUNT IN REWARDSPROGRAM.TS\n")
    return this.rewardsAmount
  }
  getRewardsPerSecond(): number {
    console.log("GET REWARDS PER SECOND IN REWARDSPROGRAM.TS\n")
    return this.rewardsPerSecond
  }
  getRewardsAssetId(): number {
    console.log("GET REWARDS ASSET ID IN REWARDSPROGRAM.TS\n")
    return this.rewardsAssetId
  }
  getRewardsSecondaryRatio(): number {
    console.log("GET REWARDS SECONDARY RATIO IN REWARDSPROGRAM.TS\n")
    return this.rewardsSecondaryRatio
  }
  getRewardsSecondaryAssetId(): number {
    console.log("GET REWARDS SECONDARY ASSET ID IN REWARDSPROGRAM.TS\n")
    return this.rewardsSecondaryAssetId
  }

  async getStorageUnrealizedRewards(storageAddress: string, manager: Manager, markets: Market[]): Promise<number[]> {
    console.log("GET STORAGE UNREALIZED REWARDS IN REWARDSPROGRAM.TS\n")
    let managerState = await getGlobalState(this.algod, manager.getManagerAppId())
    let managerStorageState = await readLocalState(this.algod, storageAddress, manager.getManagerAppId())
    let onCurrentProgram =
      this.getRewardsProgramNumber() === get(managerStorageState, managerStrings.user_rewards_program_number, 0)
    let totalUnrealizedRewards = onCurrentProgram ? get(managerStorageState, managerStrings.user_pending_rewards, 0) : 0
    let totalSecondaryUnrealizedRewards = onCurrentProgram
      ? get(managerStorageState, managerStrings.user_secondary_pending_rewards, 0)
      : 0

    let totalBorrowUsd = 0
    for (let market of markets) {
      totalBorrowUsd += await market.getAsset().toUSD(await market.getUnderlyingBorrowed())
    }
    //need to figure out time module in javascript
    let timeElapsed: number
    let rewardsIssued = this.getRewardsAmount() > 0 ? timeElapsed * this.getRewardsPerSecond() : 0
    // Need to conver this into an integer
    let projectedLatestRewardsCoefficient = rewardsIssued * REWARDS_SCALE_FACTOR

    for (let market of markets) {
      // Get coefficients
      // Figure out bytes
      let marketCounterPrefix: string //market.get_market_counter().to_bytes(8, byteorder = "big").decode('utf-8')
      let coefficient = get(managerState, marketCounterPrefix + managerStrings.counter_indexed_rewards_coefficient, 0)

      // Ask about defuault value for get function here
      let userCoefficient: number = onCurrentProgram
        ? get(managerStorageState, marketCounterPrefix + managerStrings.counter_to_user_rewards_coefficient_initial, 0)
        : 0
      let underlyingBorrowed = await market.getUnderlyingBorrowed()
      let marketUnderlyingTvl =
        underlyingBorrowed + (market.getActiveCollateral() * market.getBankToUnderlyingExchange()) / SCALE_FACTOR

      // need to make this into an integer
      let projectedCoefficient: number =
        coefficient +
        (rewardsIssued * REWARDS_SCALE_FACTOR * (await market.getAsset().toUSD(await market.getUnderlyingBorrowed()))) /
          (totalBorrowUsd * marketUnderlyingTvl)

      let marketStorageState = await market.getStorageState(storageAddress)

      // need to make this into an integer
      let unrealizedRewards =
        ((projectedCoefficient - userCoefficient) *
          (marketStorageState["active_collateral_underlying"] + marketStorageState["borrow_underlying"])) /
        REWARDS_SCALE_FACTOR

      // need to make this into an integer
      let secondaryUnrealizedRewards = (unrealizedRewards * this.getRewardsSecondaryRatio()) / PARAMETER_SCALE_FACTOR

      totalUnrealizedRewards += unrealizedRewards
      totalSecondaryUnrealizedRewards += secondaryUnrealizedRewards
    }
    return [totalUnrealizedRewards, totalSecondaryUnrealizedRewards]
  }
}
