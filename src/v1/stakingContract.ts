import { Algodv2, Indexer } from "algosdk"
import { StakingContractInfo } from "./client"
import { Manager } from "./manager"
import { Market } from "./market"
import { get } from "./utils"


export class StakingContract {
    algodClient: Algodv2
    historicalIndexerClient: Indexer
    stakingContractInfo: StakingContractInfo
    manager: Manager
    market: Market

    constructor(algodClient : Algodv2, historicalIndexerClient: Indexer, stakingContractInfo: StakingContractInfo){
        this.algodClient = algodClient;
        this.historicalIndexerClient = historicalIndexerClient;
        //Have to ask about this, seems like I'm missing something about type checking with stakingContractInfo
        //Setting the network to mainnet for now
        this.manager = new Manager(this.algodClient, stakingContractInfo["mainnet"]["managerAppId"]);
        this.market = new Market(this.algodClient, this.historicalIndexerClient, stakingContractInfo["mainnet"]["marketAppId"])
        this.updateGlobalState()

    }

    updateGlobalState = () => {
        this.getManager().updateGlobalState();
        this.getMarket().updateGlobalState();
    }

    getManager = () => {
        return this.manager;
    }

    getMarket = () => {
        return this.market;
    }

    getAsset = () => {
        return this.getMarket().getAsset();
    }

    getManagerAppId = () => {
        return this.getManager().getManagerAppId();
    }

    getManagerAddress = () => {
        return this.getManager().getManagerAddress();
    }

    getMarketAppId = () => {
        return this.getMarket().getMarketAppId();
    }

    getMarketAddress = () => {
        return this.getMarket().getMarketAddress();
    }

    getOracleAppId = () => {
        return this.getMarket().getAsset().getOracleAppId();
    }

    getStaked = () => {
        return this.getMarket().getActiveCollateral();
    }

    getRewardsProgram = () => {
        return this.getManager().getRewardsProgram();
    }

    getStorageAddress = (address : string) => {
        return this.getManager().getStorageAddress(address);
    }

    getUserState = (address : string) => {
        let storageAddress = this.getStorageAddress(address);
        if (!storageAddress) {
            throw new Error("no storage address found")
        }
        return this.getStorageState(storageAddress);
    }

    getStorageState = async (storageAddress : string) => {
        let result = {};
        let unrealizedRewards : number;
        let secondaryUnrealizedRewards : number;
        [unrealizedRewards, secondaryUnrealizedRewards] = await this.getManager().getStorageUnrealizedRewards(storageAddress, [this.getMarket()]);
        
        result["unrealized_rewards"] = unrealizedRewards;
        result["secondary_unrealized_rewards"] = secondaryUnrealizedRewards;

        let userMarketState = this.getMarket().getStorageState(storageAddress);
        result["staked_bank"] = userMarketState["active_collateral_bank"];
        result["stake_underlying"] = userMarketState["active_collateral_underlying"]

        return result;
    }

}