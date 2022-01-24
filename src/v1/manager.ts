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

  updateGlobalState() {
    let managerState = getGlobalState(this.algod, this.managerAppId)
    this.rewardsProgram = new RewardsProgram(this.algod, managerState)
  }

  getManagerAppId() {
    return this.managerAppId
  }

  getManagerAddress() {
    return this.managerAddress
  }

  getRewardsProgram() {
    return this.rewardsProgram
  }

  getStorageAddress(address: string) {
    let userManagerState = readLocalState(this.algod, address, this.managerAppId)
    let rawStorageAddress = get(userManagerState, managerStrings.user_storage_address, undefined)
    if (!rawStorageAddress) {
      throw new Error("No storage address found")
    }
    //Need to figure out if this is correct
    return encodeAddress(Buffer.from(rawStorageAddress.trim(), "base64"))
  }

  getUserState(address: string) {
    return this.getStorageState(this.getStorageAddress(address))
  }

  async getStorageState(storageAddress: string): Promise<{}> {
    let result = {}
    let userState = await readLocalState(this.algod, storageAddress, this.managerAppId)
    result["user_global_max_borrow_in_dollars"] = get(userState, managerStrings.user_global_max_borrow_in_dollars, 0)
    result["user_global_borrowed_in_dollars"] = get(userState, managerStrings.user_global_borrowed_in_dollars, 0)
    return result
  }

  getUserUnrealizedRewards(address: string, markets: Market[]) {
    return this.getStorageUnrealizedRewards(this.getStorageAddress(address), markets)
  }

  getStorageUnrealizedRewards(storageAddress: string, markets: Market[]) {
    return this.getRewardsProgram().getStorageUnrealizedRewards(storageAddress, this, markets)
  }
}
