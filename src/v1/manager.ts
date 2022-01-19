import algosdk from "algosdk"
import { getGlobalState } from "./utils"
import { RewardsProgram } from "./rewardsProgram"

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

  
}
