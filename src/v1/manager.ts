import algosdk, { encodeAddress } from "algosdk"
import { getGlobalState, readLocalState } from "./utils"
import { RewardsProgram } from "./rewardsProgram"
import { managerStrings} from "./contractStrings"
import { Market } from "./market"

function get(object: any, key:any, default_value:any) {
  var result = object[key];
  return (typeof result !== "undefined") ? result : default_value;
}

export class Manager {
  algod: algosdk.Algodv2; 
  managerAppId: number;
  managerAddress: string;
  rewardsProgram: RewardsProgram;

  constructor(algodClient: algosdk.Algodv2, managerAppId: number) {
    this.algod = algodClient;
    this.managerAppId = managerAppId;
    this.managerAddress = algosdk.getApplicationAddress(this.managerAppId);
  }

  updateGlobalState = () => {
    const managerState = getGlobalState(this.algod, this.managerAppId)
    this.rewardsProgram = new RewardsProgram(this.algod, managerState)
  }

  getManagerAppId = () => {
    return this.managerAppId
  }

  getManagerAddress = () => {
    return this.managerAddress
  }

  getRewardsProgram = () => {
    return this.rewardsProgram
  }

  getStorageAddress = (address: string) => {
    let userManagerState = readLocalState(this.algod, address, this.managerAppId);
    let rawStorageAddress = get(userManagerState, managerStrings.user_storage_address, undefined);
    if (!rawStorageAddress){
      throw "No storage address found"
    }
    // Need to figure out b64 decode and raw_storage_address.strip()
    // return encodeAddress(base64.b)
    return "placeholder";
  }

  getUserState = (address: string) => {
    let storageAddress = this.getStorageAddress(address);
    return this.getStorageState(storageAddress);
  }

  getStorageState = (storageAddress) => {
    let result = {};
    let userState = readLocalState(this.algod, storageAddress, this.managerAppId);
    result["user_global_max_borrow_in_dollars"] = get(userState, managerStrings.user_global_max_borrow_in_dollars, 0);
    result["user_global_borrowed_in_dollars"] = get(userState, managerStrings.user_global_borrowed_in_dollars, 0);
    return result;
  }

  // Error here will be fixed after implementing getStorageAddress properly
  getUserUnrealizedRewards = (address: string, markets: Market[]) => {
    let storageAddress = this.getStorageAddress(address);
    return this.getStorageUnrealizedRewards(storageAddress, markets);
  }

  getStorageUnrealizedRewards = (storageAddress: string, markets: Market[]) => {
    return this.getRewardsProgram().getStorageUnrealizedRewards(storageAddress, this, markets);
  }
}
