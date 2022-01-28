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
    this.algod = algodClient
    this.managerAppId = managerAppId
    this.managerAddress = getApplicationAddress(this.managerAppId)
    this.updateGlobalState()
  }

  async updateGlobalState(): Promise<void> {
    let managerState = await getGlobalState(this.algod, this.managerAppId)
    this.rewardsProgram = new RewardsProgram(this.algod, managerState)
  }

  getManagerAppId(): number {
    return this.managerAppId
  }

  getManagerAddress(): string {
    return this.managerAddress
  }

  getRewardsProgram(): RewardsProgram {
    return this.rewardsProgram
  }

  async getStorageAddress(address: string): Promise<string> {
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
    console.log(rawStorageAddress)
    return encodeAddress(Buffer.from(rawStorageAddress.trim(), "base64"))
  }

  async getUserState(address: string): Promise<{}> {
    //Address XLHCUMHYRPZJ6NXGP4XAMZKHF2HE67Q7MXLP7IGOIZIAEBNUVQ3FEGPCWQ
    console.log(
      "get user state in manager.ts finished and returned",
      await this.getStorageState(await this.getStorageAddress(address)),
      "\n"
    )
    return await this.getStorageState(await this.getStorageAddress(address))
  }

  async getStorageState(storageAddress): Promise<{}> {
    let result = {}
    let userState = readLocalState(this.algod, storageAddress, this.managerAppId)
    result["user_global_max_borrow_in_dollars"] = get(userState, managerStrings.user_global_max_borrow_in_dollars, 0)
    result["user_global_borrowed_in_dollars"] = get(userState, managerStrings.user_global_borrowed_in_dollars, 0)
    return result
  }

  //fix the type of the return of this function later
  async getUserUnrealizedRewards(address: string, markets: Market[]): Promise<any[]> {
    return this.getStorageUnrealizedRewards(await this.getStorageAddress(address), markets)
  }

  //make sure that this is async still
  async getStorageUnrealizedRewards(storageAddress: string, markets: Market[]): Promise<any[]> {
    return await this.getRewardsProgram().getStorageUnrealizedRewards(storageAddress, this, markets)
  }
}
