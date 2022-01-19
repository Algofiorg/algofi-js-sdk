import algosdk from "algosdk"
import { marketStrings, managerStrings} from "./contractStrings"
import { getGlobalState } from "./utils";

function get(object: any, key:any, default_value:any) {
    var result = object[key];
    return (typeof result !== "undefined") ? result : default_value;
}

export class RewardsProgram{
    algod: any;
    latestRewardsTime: any;
    rewardsProgramNumber: any;
    rewardsAmount: any;
    rewardsPerSecond: any;
    rewardsAssetId: any;
    rewardsSecondaryRatio: any;
    rewardsSecondaryAssetId: any;
    
    constructor(algodClient: any, managerState: any){
        this.algod = algodClient
        this.latestRewardsTime = get(managerState, managerStrings.latest_rewards_time, 0)
        this.rewardsProgramNumber = get(managerState, managerStrings.n_rewards_programs, 0)
        this.rewardsAmount = get(managerState, managerStrings.rewards_amount, 0)
        this.rewardsPerSecond = get(managerState, managerStrings.rewards_per_second, 0)
        this.rewardsAssetId = get(managerState, managerStrings.rewards_asset_id, 0)
        this.rewardsSecondaryRatio = get(managerState, managerStrings.rewards_secondary_ratio, 0)
        this.rewardsSecondaryAssetId = get(managerState, managerStrings.rewards_secondary_asset_id, 0)
    }

    //Getters

    getRewardsAssetIds = () => {
        const result = [];
        if (this.rewardsAssetId > 1){
            result.push(this.rewardsAssetId);
        }
        if (this.rewardsSecondaryAssetId > 1){
            result.push(this.rewardsSecondaryAssetId)
        }
        return result
    }
    getLatestRewardsTime = () => {
        return this.latestRewardsTime
    }
    getRewardsProgramNumber = () => {
        return this.rewardsProgramNumber
    }
    getRewardsAmount = () => {
        return this.rewardsAmount
    }
    getRewardsPerSecond = () => {
        return this.rewardsPerSecond
    }
    getRewardsAssetId = () => {
        return this.rewardsAssetId
    }
    getRewardsSecondaryRatio = () => {
        return this.rewardsSecondaryRatio
    }
    getRewardsSecondaryAssetId = () => {
        return this.rewardsSecondaryAssetId
    }

    getStorageUnrealizedRewards = (storageAddress: string, manager: any, markets: any) => {
        const managerState = getGlobalState(this.algod, manager.getManagerAppId()); 
        const managerStorageState = 

    }




}