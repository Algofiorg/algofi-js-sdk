import { Algodv2, Indexer } from "algosdk"
import { RewardsProgram } from "./rewardsProgram"
import { Manager } from "./manager"
import { Market } from "./market"
import { Asset } from "./asset"

export class StakingContract {
  algodClient: Algodv2
  historicalIndexerClient: Indexer
  manager: Manager
  market: Market

  constructor(algodClient: Algodv2, historicalIndexerClient: Indexer, stakingContractInfo: { [key: string]: number }) {
    this.algodClient = algodClient
    this.historicalIndexerClient = historicalIndexerClient
  }

  static async init(
    algodClient: Algodv2,
    historicalIndexerClient: Indexer,
    stakingContractInfo: { [key: string]: number }
  ): Promise<StakingContract> {
    const stakingContract = new StakingContract(algodClient, historicalIndexerClient, stakingContractInfo)
    stakingContract.manager = await Manager.init(stakingContract.algodClient, stakingContractInfo["managerAppId"])
    stakingContract.market = await Market.init(algodClient, historicalIndexerClient, stakingContractInfo["marketAppId"])
    await stakingContract.updateGlobalState()
    return stakingContract
  }

  /**
   * Method to fetch most recent staking contract global state
   */
  async updateGlobalState(): Promise<void> {
    await this.getManager().updateGlobalState()
    await this.getMarket().updateGlobalState()
  }

  /**
   * Return staking contract manager
   *
   * @returns manager
   */
  getManager(): Manager {
    return this.manager
  }

  /**
   * Return staking contract market
   *
   * @returns market
   */
  getMarket(): Market {
    return this.market
  }

  /**
   * Return asset object for this market
   *
   * @returns asset
   */
  getAsset(): Asset {
    return this.getMarket().getAsset()
  }

  /**
   * Return manager app id
   *
   * @returns manager app id
   */
  getManagerAppId(): number {
    return this.getManager().getManagerAppId()
  }

  /**
   * Return manager address
   *
   * @returns manager address
   */
  getManagerAddress(): string {
    return this.getManager().getManagerAddress()
  }

  /**
   * Return the market app id
   *
   * @returns market app id
   */
  getMarketAppId(): number {
    return this.getMarket().getMarketAppId()
  }

  /**
   * Return the market address
   *
   * @returns market address
   */
  getMarketAddress(): string {
    return this.getMarket().getMarketAddress()
  }

  /**
   * Return oracle app id
   *
   * @returns oracle app id
   */
  getOracleAppId(): number {
    return this.getMarket()
      .getAsset()
      .getOracleAppId()
  }

  /**
   * Return staked amount
   *
   * @returns staked
   */
  getStaked(): number {
    return this.getMarket().getActiveCollateral()
  }

  /**
   * Return rewards program
   *
   * @returns rewards program
   */
  getRewardsProgram(): RewardsProgram {
    return this.getManager().getRewardsProgram()
  }

  /**
   * Return the staking contract storage address for given address or null if it does not exist
   *
   * @param address - address to get info for
   * @returns storage account address for user
   */
  async getStorageAddress(address: string): Promise<string> {
    const storageAddress = await this.getManager().getStorageAddress(address)
    return storageAddress
  }

  /**
   * Return the staking contract local state for address
   *
   * @param address - address to get info for
   * @returns staking contract local state for address
   */
  async getUserState(address: string): Promise<{}> {
    const storageAddress = await this.getStorageAddress(address)
    if (!storageAddress) {
      throw new Error("no storage address found")
    }
    const userState = await this.getStorageState(storageAddress)
    return userState
  }

  /**
   * Return the staking contract local state for storage address
   *
   * @param storageAddress -storage address to get info for
   * @returns staking contract local state for address
   */
  async getStorageState(storageAddress: string): Promise<{}> {
    const result = {}
    const [
      unrealizedRewards,
      secondaryUnrealizedRewards
    ] = await this.getManager().getStorageUnrealizedRewards(storageAddress, [this.getMarket()])

    result["unrealized_rewards"] = unrealizedRewards
    result["secondary_unrealized_rewards"] = secondaryUnrealizedRewards

    const userMarketState = await this.getMarket().getStorageState(storageAddress)
    result["staked_bank"] = userMarketState["active_collateral_bank"]
    result["stake_underlying"] = userMarketState["active_collateral_underlying"]

    return result
  }
}
