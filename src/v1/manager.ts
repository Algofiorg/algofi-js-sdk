import { Algodv2, encodeAddress, getApplicationAddress } from "algosdk"
import { getGlobalState, readLocalState, get } from "./utils"
import { managerStrings } from "./contractStrings"
import { RewardsProgram } from "./rewardsProgram"
import { Market } from "./market"
import { Base64Encoder } from "./encode"

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
    console.log("constructor in manager.ts finished\n")
  }

  updateGlobalState() {
    console.log("UPDATE GLOBAL STATE IN MANAGER.TS\n")
    let managerState = getGlobalState(this.algod, this.managerAppId)
    this.rewardsProgram = new RewardsProgram(this.algod, managerState)
    console.log("update global state in manager.ts finished\n")
  }

  getManagerAppId() {
    console.log("GET MANAGER APP ID IN MANAGER.TS\n")
    console.log("get manager app id in manager.ts finished and returned", this.managerAppId, "\n")
    return this.managerAppId
  }

  getManagerAddress() {
    console.log("GET MANAGER ADDRESS IN MANAGER.TS\n")
    console.log("get manager address in manager.ts finished and returned", this.managerAddress, "\n")
    return this.managerAddress
  }

  getRewardsProgram() {
    console.log("GET REWARDS PROGRAM IN MANAGER.TS\n")
    console.log("get rewards program in manager.ts finished and returned", this.rewardsProgram, "\n")
    return this.rewardsProgram
  }

  async getStorageAddress(address: string) {
    console.log("GET STORAGE ADDRESS MANAGER.TS\n")
    let userManagerState = await readLocalState(this.algod, address, this.managerAppId)
    let rawStorageAddress = get(userManagerState, managerStrings.user_storage_address, undefined)

    if (!rawStorageAddress) {
      throw new Error("No storage address found")
    }
    //Need to figure out if this is correct
    console.log(
      "get storage address in manager.ts finished and returned:",
      Base64Encoder.decode(rawStorageAddress.trim()),
      "\n"
    )
    return Base64Encoder.decode(rawStorageAddress.trim())
  }

  async getUserState(address: string) {
    console.log("GET USER STATE IN MANAGER.TS\n")
    //Address XLHCUMHYRPZJ6NXGP4XAMZKHF2HE67Q7MXLP7IGOIZIAEBNUVQ3FEGPCWQ
    console.log(
      "get user state in manager.ts finished and returned",
      await this.getStorageState(await this.getStorageAddress(address)),
      "\n"
    )
    return await this.getStorageState(await this.getStorageAddress(address))
  }

  async getStorageState(storageAddress): Promise<{}> {
    console.log("GET STORAGE STATE IN MANAGER.TS\n")
    let result = {}
    let userState = readLocalState(this.algod, storageAddress, this.managerAppId)
    result["user_global_max_borrow_in_dollars"] = get(userState, managerStrings.user_global_max_borrow_in_dollars, 0)
    result["user_global_borrowed_in_dollars"] = get(userState, managerStrings.user_global_borrowed_in_dollars, 0)
    console.log("get storage state in manager.ts finished and returned", result, "\n")
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
