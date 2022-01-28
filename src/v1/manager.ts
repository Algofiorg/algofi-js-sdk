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
    console.log("constructor in manager.ts finished\n")
  }

  async updateGlobalState(): Promise<void> {
    console.log("UPDATE GLOBAL STATE IN MANAGER.TS\n")
    let managerState = await getGlobalState(this.algod, this.managerAppId)
    this.rewardsProgram = new RewardsProgram(this.algod, managerState)
    console.log("update global state in manager.ts finished\n")
  }

  getManagerAppId(): number {
    console.log("GET MANAGER APP ID IN MANAGER.TS\n")
    console.log("get manager app id in manager.ts finished and returned", this.managerAppId, "\n")
    return this.managerAppId
  }

  getManagerAddress(): string {
    console.log("GET MANAGER ADDRESS IN MANAGER.TS\n")
    console.log("get manager address in manager.ts finished and returned", this.managerAddress, "\n")
    return this.managerAddress
  }

  getRewardsProgram(): RewardsProgram {
    console.log("GET REWARDS PROGRAM IN MANAGER.TS\n")
    console.log("get rewards program in manager.ts finished and returned", this.rewardsProgram, "\n")
    return this.rewardsProgram
  }

  async getStorageAddress(address: string): Promise<string> {
    console.log("GET STORAGE ADDRESS MANAGER.TS\n")
    let userManagerState = await readLocalState(this.algod, address, this.managerAppId)
    let rawStorageAddress = get(userManagerState, managerStrings.user_storage_address, null)

    if (!rawStorageAddress) {
      throw new Error("No storage address found")
    }
    //still need to figure out if this is correct
    console.log(
      "get storage address in manager.ts finished and returned:",
      encodeAddress(Buffer.from(rawStorageAddress.trim(), "base64")),
      "\n"
    )
    return encodeAddress(Buffer.from(rawStorageAddress.trim(), "base64"))
  }

  async getUserState(address: string): Promise<{}> {
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

  //fix the type of the return of this function later
  async getUserUnrealizedRewards(address: string, markets: Market[]): Promise<any[]> {
    console.log("GET USER UNREALIZED REWARDS IN MANAGER.TS\n")
    console.log("get user unrealized rewards in manager.ts finished and returned something\n")
    return this.getStorageUnrealizedRewards(await this.getStorageAddress(address), markets)
  }

  //make sure that this is async still
  async getStorageUnrealizedRewards(storageAddress: string, markets: Market[]): Promise<any[]> {
    console.log("GET STORAGE UNREALIZED REWARDS IN MANAGER.TS\n")
    console.log("get storage unrealized rewards in manager.ts finished and returned something.\n")
    return await this.getRewardsProgram().getStorageUnrealizedRewards(storageAddress, this, markets)
  }
}
