import algosdk from "algosdk"
import { getGlobalState } from "./utils"

export class Manager {
  algod: any; 
  managerAppId: number;
  managerAddress: string;
  rewardsProgram: any;

  constructor(algodClient: any, managerAppId: number) {
    this.algod = algodClient;
    this.managerAppId = managerAppId;
    this.managerAddress = algosdk.getApplicationAddress(this.managerAppId);
  }

  updateGlobalState(){
    const managerState = getGlobalState(this.algod, this.managerAppId)
    this.rewardsProgram = 
  }
}
