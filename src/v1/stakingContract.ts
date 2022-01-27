import { Algodv2, Indexer } from "algosdk"
import { StakingContractInfo, StringToNum } from "./client"
import { Manager } from "./manager"
import { Market } from "./market"
import { get } from "./utils"

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
    this.market = new Market(this.algodClient, this.historicalIndexerClient, stakingContractInfo["marketAppId"])
    this.updateGlobalState()
  }

  updateGlobalState = () => {
    console.log("UPDATE GLOBAL STATE IN STAKINGCONTRACT.TS\n")
    this.getManager().updateGlobalState()
    this.getMarket().updateGlobalState()
  }

  getManager = () => {
    console.log("GET MANAGER IN STAKINGCONTRACT.TS\n")
    return this.manager
  }

  getMarket = () => {
    console.log("GET MARKET IN STAKINGCONTRACT.TS\n")
    return this.market
  }

  getAsset = () => {
    console.log("GET ASSET IN STAKINGCONTRACT.TS\n")
    return this.getMarket().getAsset()
  }

  getManagerAppId = () => {
    console.log("GET MANAGER APP ID IN STAKINGCONTRACT.TS\n")
    return this.getManager().getManagerAppId()
  }

  getManagerAddress = () => {
    console.log("GET MANAGER ADDRESS IN STAKINGCONTRACT.TS\n")
    return this.getManager().getManagerAddress()
  }

  getMarketAppId = () => {
    console.log("GET MARKET APP ID IN STAKINGCONTRACT.TS\n")
    return this.getMarket().getMarketAppId()
  }

  getMarketAddress = () => {
    console.log("GET MARKET ADDRESS IN STAKINGCONTRACT.TS\n")
    return this.getMarket().getMarketAddress()
  }

  getOracleAppId = () => {
    console.log("GET ORACLE APP ID IN STAKINGCONTRACT.TS\n")
    return this.getMarket()
      .getAsset()
      .getOracleAppId()
  }

  getStaked = () => {
    console.log("GET STAKED IN STAKINGCONTRACT.TS\n")
    return this.getMarket().getActiveCollateral()
  }

  getRewardsProgram = () => {
    console.log("GET REWARDS PROIGRAM IN STAKINGCONTRACT.TS\n")
    return this.getManager().getRewardsProgram()
  }

  getStorageAddress = (address: string) => {
    console.log("GET STORAGE ADDRESS IN STAKINGCONTRACT.TS\n")
    return this.getManager().getStorageAddress(address)
  }

  async getUserState(address: string) {
    console.log("GET USER SETATE IN STAKINGCONTRACT.TS\n")
    let storageAddress = await this.getStorageAddress(address)
    if (!storageAddress) {
      throw new Error("no storage address found")
    }
    return this.getStorageState(storageAddress)
  }

  getStorageState = async (storageAddress: string) => {
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

    let userMarketState = this.getMarket().getStorageState(storageAddress)
    result["staked_bank"] = userMarketState["active_collateral_bank"]
    result["stake_underlying"] = userMarketState["active_collateral_underlying"]

    return result
  }
}
