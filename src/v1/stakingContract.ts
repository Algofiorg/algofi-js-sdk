import { Algodv2, Indexer } from "algosdk"
import { StringToNum } from "./client"
import { Manager } from "./manager"
import { Market } from "./market"
import { Asset } from "./asset"
import { RewardsProgram } from "./rewardsProgram"

export class StakingContract {
  algodClient: Algodv2
  historicalIndexerClient: Indexer
  manager: Manager
  market: Market

  constructor(algodClient: Algodv2, historicalIndexerClient: Indexer, stakingContractInfo: StringToNum) {
    console.log("CONSTRUCTOR IN STAKINGCONTRACT.TS\n")
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
    console.log("UPDATE GLOBAL STATE IN STAKINGCONTRACT.TS\n")
    await this.getManager().updateGlobalState()
    await this.getMarket().updateGlobalState()
  }

  getManager(): Manager {
    console.log("GET MANAGER IN STAKINGCONTRACT.TS\n")
    return this.manager
  }

  getMarket(): Market {
    console.log("GET MARKET IN STAKINGCONTRACT.TS\n")
    return this.market
  }

  getAsset(): Asset {
    console.log("GET ASSET IN STAKINGCONTRACT.TS\n")
    return this.getMarket().getAsset()
  }

  getManagerAppId(): number {
    console.log("GET MANAGER APP ID IN STAKINGCONTRACT.TS\n")
    return this.getManager().getManagerAppId()
  }

  getManagerAddress(): string {
    console.log("GET MANAGER ADDRESS IN STAKINGCONTRACT.TS\n")
    return this.getManager().getManagerAddress()
  }

  getMarketAppId(): number {
    console.log("GET MARKET APP ID IN STAKINGCONTRACT.TS\n")
    return this.getMarket().getMarketAppId()
  }

  getMarketAddress(): string {
    console.log("GET MARKET ADDRESS IN STAKINGCONTRACT.TS\n")
    return this.getMarket().getMarketAddress()
  }

  getOracleAppId(): number {
    console.log("GET ORACLE APP ID IN STAKINGCONTRACT.TS\n")
    return this.getMarket()
      .getAsset()
      .getOracleAppId()
  }

  getStaked(): number {
    console.log("GET STAKED IN STAKINGCONTRACT.TS\n")
    return this.getMarket().getActiveCollateral()
  }

  getRewardsProgram(): RewardsProgram {
    console.log("GET REWARDS PROIGRAM IN STAKINGCONTRACT.TS\n")
    return this.getManager().getRewardsProgram()
  }

  async getStorageAddress(address: string): Promise<string> {
    console.log("GET STORAGE ADDRESS IN STAKINGCONTRACT.TS\n")
    return await this.getManager().getStorageAddress(address)
  }

  async getUserState(address: string): Promise<{}> {
    console.log("GET USER SETATE IN STAKINGCONTRACT.TS\n")
    let storageAddress = await this.getStorageAddress(address)
    if (!storageAddress) {
      throw new Error("no storage address found")
    }
    return await this.getStorageState(storageAddress)
  }

  async getStorageState(storageAddress: string): Promise<{}> {
    console.log("GET STORAGE STATE IN STAKINGCONTRACT.TS\n")
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
