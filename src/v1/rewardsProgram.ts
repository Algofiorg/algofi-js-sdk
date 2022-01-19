import algosdk from "algosdk"
import { marketStrings, managerStrings} from "./contractStrings"
import { getGlobalState, readLocalState } from "./utils";
import { Market } from "./market"
import { Manager } from "./manager"
import { PARAMETER_SCALE_FACTOR, REWARDS_SCALE_FACTOR, SCALE_FACTOR } from "./config"

function get(object: any, key:any, default_value:any) {
    var result = object[key];
    return (typeof result !== "undefined") ? result : default_value;
}

export class RewardsProgram{
    algod: algosdk.Algodv2;
    latestRewardsTime: any;
    rewardsProgramNumber: any;
    rewardsAmount: number;
    rewardsPerSecond: any;
    rewardsAssetId: any;
    rewardsSecondaryRatio: any;
    rewardsSecondaryAssetId: any;
    
    constructor(algodClient: algosdk.Algodv2, managerState: any){
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

    getStorageUnrealizedRewards = async (storageAddress: string, manager: Manager, markets: Market[]) => {
        let managerState = getGlobalState(this.algod, manager.getManagerAppId()); 
        let managerStorageState = readLocalState(this.algod, storageAddress, manager.getManagerAppId());
        let onCurrentProgram = this.getRewardsProgramNumber === get(managerStorageState, managerStrings.user_rewards_program_number, 0);
        let totalUnrealizedRewards = onCurrentProgram ? get(managerStorageState, managerStrings.user_pending_rewards, 0) : 0;
        let totalSecondaryUnrealizedRewards = onCurrentProgram ? get(managerStorageState, managerStrings.user_secondary_pending_rewards, 0) : 0;

        // Loop through to get total TVL
        let totalBorrowUsd = 0;
        for (let market of markets){
            totalBorrowUsd += market.getAsset().toUSD(market.getUnderlyingBorrowed())
        }
        // FIGURE OUT TIME
        let timeElapsed : number;
        let rewardsIssued = this.getRewardsAmount() > 0 ? timeElapsed * this.getRewardsPerSecond() : 0;
        let projectedLatestRewardsCoefficient = Number(rewardsIssued * REWARDS_SCALE_FACTOR);

        for (let market of markets){
            // Get coefficients
            // Figure out bytes
            let marketCounterPrefix : string; //market.get_market_counter().to_bytes(8, byteorder = "big").decode('utf-8')
            let coefficient = get(managerState, marketCounterPrefix + managerStrings.counter_indexed_rewards_coefficient, 0);

            // Ask about defuault value for get function here
            let userCoefficient : number = onCurrentProgram ? get(managerStorageState, marketCounterPrefix + managerStrings.counter_to_user_rewards_coefficient_initial, 0): 0;
            let underlyingBorrowed = await market.getUnderlyingBorrowed();
            let marketUnderlyingTvl = underlyingBorrowed + (market.getActiveCollateral() * market.getBankToUnderlyingExchange() / SCALE_FACTOR);

            let projectedCoefficient : number = coefficient + Number(rewardsIssued * REWARDS_SCALE_FACTOR * market.getAsset().toUSD(market.getUnderlyingBorrowed()) / (totalBorrowUsd * marketUnderlyingTvl));

            let marketStorageState = market.getStorageState(storageAddress);

            let unrealizedRewards = Number((projectedCoefficient - userCoefficient) * (marketStorageState['active_collateral_underlying'] + marketStorageState['borrow_underlying']) / REWARDS_SCALE_FACTOR);
            let secondaryUnrealizedRewards = Number(unrealizedRewards * this.getRewardsSecondaryRatio() / PARAMETER_SCALE_FACTOR);

            totalUnrealizedRewards += unrealizedRewards;
            totalSecondaryUnrealizedRewards += secondaryUnrealizedRewards;
        }
        return [totalUnrealizedRewards, totalSecondaryUnrealizedRewards];
    }
}