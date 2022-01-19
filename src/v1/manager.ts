import algosdk from "algosdk"

export class Manager {
  algodClient: any; 
  managerAppId: number;
  managerAddress: string;
  constructor(algodClient: any, managerAppId: number) {
    this.algodClient = algodClient;
    this.managerAppId = managerAppId;
    this.managerAddress = "hello";
  }
}
