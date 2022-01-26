import { Algodv2, encodeAddress, getApplicationAddress } from "algosdk"
import { getGlobalState, readLocalState, get } from "./utils"
import { managerStrings } from "./contractStrings"
import { RewardsProgram } from "./rewardsProgram"
import { Market } from "./market"

export class Manager {
  algod: Algodv2
  managerAppId: number
  managerAddress: string
  rewardsProgram: RewardsProgram

  constructor(algodClient: Algodv2, managerAppId: number) {
    console.log("CONSTRUCTOR IN MANAGER.TS\n")
    this.algod = algodClient
    this.managerAppId = managerAppId
    this.managerAddress = getApplicationAddress(this.managerAppId)
    this.updateGlobalState()
  }

  updateGlobalState() {
    console.log("UPDATE GLOBAL STATE IN MANAGER.TS\n")
    let managerState = getGlobalState(this.algod, this.managerAppId)
    this.rewardsProgram = new RewardsProgram(this.algod, managerState)
  }

  getManagerAppId() {
    console.log("GET MANAGER APP ID IN MANAGER.TS\n")
    return this.managerAppId
  }

  getManagerAddress() {
    console.log("GET MANAGER ADDRESS IN MANAGER.TS\n")
    return this.managerAddress
  }

  getRewardsProgram() {
    console.log("GET REWARDS PROGRAM IN MANAGER.TS\n")
    return this.rewardsProgram
  }

  async getStorageAddress(address: string) {
    console.log("GET STORAGE ADDRESS MANAGER.TS\n")
    let userManagerState = await readLocalState(this.algod, address, this.managerAppId)
    console.log(userManagerState)
    let rawStorageAddress = get(userManagerState, managerStrings.user_storage_address, undefined)
    console.log(userManagerState, managerStrings.user_storage_address)
    if (!rawStorageAddress) {
      throw new Error("No storage address found")
    }
    //Need to figure out if this is correct
    return encodeAddress(Buffer.from(rawStorageAddress.trim(), "base64"))
  }

  async getUserState(address: string) {
    console.log("\nGET USER STATE IN MANAGER.TS\n")
    return this.getStorageState(await this.getStorageAddress(address))
  }

  async getStorageState(storageAddress: string): Promise<{}> {
    console.log("GET STORAGE STATE IN MANAGER.TS\n")
    let result = {}
    let userState = await readLocalState(this.algod, storageAddress, this.managerAppId)
    result["user_global_max_borrow_in_dollars"] = get(userState, managerStrings.user_global_max_borrow_in_dollars, 0)
    result["user_global_borrowed_in_dollars"] = get(userState, managerStrings.user_global_borrowed_in_dollars, 0)
    return result
  }

  async getUserUnrealizedRewards(address: string, markets: Market[]) {
    console.log("GET USER UNREALIZED REWARDS IN MANAGER.TS\n")
    return this.getStorageUnrealizedRewards(await this.getStorageAddress(address), markets)
  }

  getStorageUnrealizedRewards(storageAddress: string, markets: Market[]) {
    console.log("GET STORAGE UNREALIZED REWARDS IN MANAGER.TS\n")
    return this.getRewardsProgram().getStorageUnrealizedRewards(storageAddress, this, markets)
  }
}
