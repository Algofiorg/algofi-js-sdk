import { RewardsProgram } from "./rewardsProgram"
import { Algodv2, Indexer } from "algosdk"
import { StringToNum } from "./client"
import { Manager } from "./manager"
import { Market } from "./market"
import { Asset } from "./asset"

export class StakingContract {
  algodClient: Algodv2
  historicalIndexerClient: Indexer
  manager: Manager
  market: Market

  constructor(algodClient: Algodv2, historicalIndexerClient: Indexer, stakingContractInfo: StringToNum) {
    this.algodClient = algodClient
    this.historicalIndexerClient = historicalIndexerClient
    this.manager = new Manager(this.algodClient, stakingContractInfo["managerAppId"])
  }

  static async init(
    algodClient: Algodv2,
    historicalIndexerClient: Indexer,
    stakingContractInfo: StringToNum
  ): Promise<StakingContract> {
    let stakingContract = new StakingContract(algodClient, historicalIndexerClient, stakingContractInfo)
    stakingContract.market = await Market.init(algodClient, historicalIndexerClient, stakingContractInfo["marketAppId"])
    await stakingContract.updateGlobalState()
    return stakingContract
  }

  async updateGlobalState(): Promise<void> {
    await this.getManager().updateGlobalState()
    await this.getMarket().updateGlobalState()
  }

  getManager(): Manager {
    return this.manager
  }

  getMarket(): Market {
    return this.market
  }

  getAsset(): Asset {
    return this.getMarket().getAsset()
  }

  getManagerAppId(): number {
    return this.getManager().getManagerAppId()
  }

  getManagerAddress(): string {
    return this.getManager().getManagerAddress()
  }

  getMarketAppId(): number {
    return this.getMarket().getMarketAppId()
  }

  getMarketAddress(): string {
    return this.getMarket().getMarketAddress()
  }

  getOracleAppId(): number {
    return this.getMarket()
      .getAsset()
      .getOracleAppId()
  }

  getStaked(): number {
    return this.getMarket().getActiveCollateral()
  }

  getRewardsProgram(): RewardsProgram {
    return this.getManager().getRewardsProgram()
  }

  async getStorageAddress(address: string): Promise<string> {
    return await this.getManager().getStorageAddress(address)
  }

  async getUserState(address: string): Promise<{}> {
    let storageAddress = await this.getStorageAddress(address)
    if (!storageAddress) {
      throw new Error("no storage address found")
    }
    return await this.getStorageState(storageAddress)
  }

  async getStorageState(storageAddress: string): Promise<{}> {
    let result = {}
    let unrealizedRewards: number
    let secondaryUnrealizedRewards: number
    ;[
      unrealizedRewards,
      secondaryUnrealizedRewards
    ] = await this.getManager().getStorageUnrealizedRewards(storageAddress, [this.getMarket()])

    result["unrealized_rewards"] = unrealizedRewards
    result["secondary_unrealized_rewards"] = secondaryUnrealizedRewards

    let userMarketState = await this.getMarket().getStorageState(storageAddress)
    result["staked_bank"] = userMarketState["active_collateral_bank"]
    result["stake_underlying"] = userMarketState["active_collateral_underlying"]

    return result
  }
}
