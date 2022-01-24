import { Algodv2, Indexer } from "algosdk"
import { getInitRound, getOrderedSymbols, getManagerAppId, getMarketAppId, getStakingContracts, get } from "./utils"
import { Manager } from "./manager"
import { Market } from "./market"
import { StakingContract } from "./stakingContract"
import { prepareManagerAppOptinTransactions } from "./optin"
import { prepareAddCollateralTransactions } from "./addCollateral"
import { prepareLiquidateTransactions } from "./liquidate"

const a = 2;

export interface Markets {
  [key: string] : Market;
}

export interface StringToNum {
  [key : string]: number;
}

export interface StakingContractInfo {
  [key : string]: StringToNum;
}

export interface StakingContracts {
  [key : string]: StakingContract;
}

export class Client {
  SCALE_FACTOR: number
  BORROW_SHARES_INIT: number
  PARAMETER_SCALE_FACTOR: number
  algodClient: Algodv2
  indexerClient: any
  historicalIndexerClient: any
  chain: string
  userAddress: string
  initRound: number
  activeOrderedSymbols: string[]
  maxOrderedSymbols: string[]
  maxAtomicOptInOrderedSymbols: string[]
  manager: Manager
  markets: Markets
  stakingContractInfo: StakingContractInfo
  stakingContracts: StakingContracts

  constructor(algodClient : Algodv2, indexerClient : Indexer, historicalIndexerClient : Indexer, userAddress : string, chain : string) {
    // constants
    this.SCALE_FACTOR = 1e9;
    this.BORROW_SHARES_INIT = 1e3;
    this.PARAMETER_SCALE_FACTOR = 1e3;

    // clients info
    this.algodClient = algodClient;
    this.indexerClient = indexerClient;
    this.historicalIndexerClient = historicalIndexerClient;
    this.chain = chain;

    // user info
    this.userAddress = userAddress;

    this.initRound = getInitRound(this.chain);
    this.activeOrderedSymbols = getOrderedSymbols(this.chain);
    this.maxOrderedSymbols = getOrderedSymbols(this.chain, true);
    this.maxAtomicOptInOrderedSymbols = getOrderedSymbols(this.chain, _, true);

    // manager info
    this.manager = new Manager(this.algodClient, getManagerAppId(this.chain)); 

    // market info
    this.markets = {};
    for (let symbol of this.maxOrderedSymbols) {
      this.markets[symbol] = new Market(this.algodClient, this.historicalIndexerClient, getMarketAppId(this.chain, symbol));
    }

    // staking contract info
    this.stakingContractInfo = getStakingContracts(this.chain);
    this.stakingContracts = {};
    for (let [nam, _] of Object.entries(this.stakingContractInfo)) {
      //Need to figure out what stakingcontractinfo is really supposed to look like
      //this.stakingContracts[nam] = new StakingContract(this.algodClient, this.historicalIndexerClient, this.stakingContractInfo["mainnet"][nam]);
    }

    // this.staking_contracts = {name : StakingContract(this.algodClient, this.historicalIndexerClient, this.staking_contract_info[name]) for name in this.staking_contract_info.keys()}
  }

  // It seems as though this function may be unecessary, usualy for suggest parameters we have to pass them in but for the 
  // js sdk it seems like there are built in transactions that use suggest parameters, for example: makeAssetConfigTxnWithSuggestedParams, etc.
  getDefaultParams = async () => {
    let params = await this.algodClient.getTransactionParams().do();
    params.fee = 1000;
    params.flatFee = true;
    return params
  }

  getUserInfo = async (address : string = undefined) => {
    if (!address){ 
      address = this.userAddress;
    }
    if (address){
      return await this.algodClient.accountInformation(address).do();
    }
    else{
      throw new Error("user_address has not been specified");
    }
  }

  isOptedIntoApp = async (appId : number, address : string = undefined) => {
    if (!address) {
      address = this.userAddress;
    }
    let userInfo = await this.getUserInfo(address);
    let appsLocalState = [];
    for (let x of userInfo["apps-local-state"]){
      appsLocalState.push(x["id"])
    }
    return appsLocalState.includes(appId)
  }

  isOptedIntoAsset = async (assetId : number, address : string = undefined) => {
    if (!address){
      address = this.userAddress;
    }
    let userInfo = await this.getUserInfo(address);
    let assets = [];
    for (let x of userInfo["assets"]){
      assets.push(x["asset-id"]);
    }
    return assets.includes(assetId);
  }

  getUserBalances = async (address : string = undefined) {
    if (!address) {
      address  = this.userAddress;
    }
    let userInfo = await this.getUserInfo(address);
    let balances = {};
    for (let asset of userInfo["assets"]){
      balances[asset["asset-id"]] = asset["amount"];
    }
    balances[1] = userInfo["amount"];
    return balances;
  }

  getUserBalance = async (assetId : number = 1, address : string = undefined) => {
    if (!address) {
      address = this.userAddress
    }
    let userBalances = await this.getUserBalances(address)
    return get(userBalances, assetId, 0);
  }

  getUserState = (address : string = undefined) => {
    let result = {};
    if (!address) {
      address = this.userAddress;
    }
    result["manager"] = this.manager.getUserState(address);
    let storageAddress = this.manager.getStorageAddress(address);

    for (let symbol in this.activeOrderedSymbols){
      result[symbol] = this.markets[symbol].getStorageState(storageAddress);
    }
    return result;
  }

  getStorageState = async (storageAddress : string = undefined) => {
    let result = {};
    if (!storageAddress){
      storageAddress = this.manager.getStorageAddress(this.userAddress);
    }
    result["manager"] = this.manager.getStorageState(storageAddress);
    for (let symbol of this.activeOrderedSymbols){
      result[symbol] = this.markets[symbol].getStorageState(storageAddress);
    }
    return result;
  }

  getUserStakingContractState = async (stakingContractName : string, address : string = undefined) => {
    let result = {};
    if (!address) {
      address = this.userAddress
    }
    return this.stakingContracts[stakingContractName].getUserState(address);
  }

  // GETTERS

  getManager = () => {
    return this.manager;
  }

  getMarket = (symbol : string) => {
    return this.markets[symbol];
  }

  //TODO come back to this after refreshing on labmda notation in python
  getActiveMarkets = () => {
    return;
  }

  getStakingContract = (nam : string) => {
    return this.stakingContracts[nam];
  }

  getStakingContracts = () => {
    return this.stakingContracts;
  }

  getAsset = (symbol : string) => {
    if (! this.activeOrderedSymbols.includes(symbol)) {
      throw new Error("Unsupported asset")
    }
    return this.markets[symbol].getAsset();
  }

  getMaxAtomicOptInMarketAppIds = () => {
    let temp = [];
    for (let symbol of this.maxAtomicOptInOrderedSymbols) {
      temp.push(this.markets[symbol].getMarketAppId());
    }
    return temp;
  }

  getActiveAssets = () => {
    let temp = {};
    // Errors will be fixed once we figure out getActiveMarkets lambad notation
    for (let [symbol, market] of Object.entries(this.getActiveMarkets())){
      temp[symbol] = market.getAsset();
    }
    return temp;
  }

  getActiveAssetIds = () => {
    let temp = [];
    // Errors will be fixed once we figure out getActiveMarkets
    for (let [_, asset] of Object.entries(this.getActiveAssets())) {
      temp.push(asset.getUnderlyingAssetId());
    }
    return temp;
  }

  getActiveBankAssetIds = () => {
    let temp = [];
    for (let [_, asset] of Object.entries(this.getActiveAssets())){
      temp.push(asset.getBankAssetId());
    }
    return temp;
  }

  getActiveOrderedSymbols = () => {
    return this.activeOrderedSymbols;
  }

  getRawPrices = () => {
    //Errors will be fixed once we figure out getActiveMarkets
    let temp = {};
    for (let [symbol, market] of Object.entries(this.getActiveMarkets())){
      temp[symbol] = market.getAsset().getRawPrices();
    }
  }

  getPrices = () => {
    let temp = {};
    //Errors will be fixed once we figure out getActiveMarkets
    for (let [symbol, market] of Object.entries(this.getActiveMarkets())){
      temp[symbol] = market.getAsset().getPrice();
    }
  }

  // INDEXER HELPERS
  getStorageAccounts = async (stakingContractName : string = undefined) => {
    let nextPage = "";
    let accounts = [];
    let appId;
    if (stakingContractName === undefined) {
      // This error will be fixed when we figure out getActiveMarkets
      appId = Object.values(this.getActiveMarkets())[0];
    }
    else {
      appId = this.getStakingContract(stakingContractName).getManagerAppId()
    }
    while (nextPage !== undefined) {
      console.log(nextPage);
      //make sure this is the js analog to indexer.accounts, we are just assuming at this point
      let accountData = await this.indexerClient.searchAccounts().do();
      for (let account of accountData["accounts"]){
        accounts.push(account);
      }
      if (accountData.includes("next-token")){
        nextPage = accountData["next-token"];
      }
      else {
        nextPage = undefined;
      }
    }
    return accounts;
  }

  getActiveOracleAppIds = () => {
    let temp = [];
    // Error will be fixed when we figure out getActiveMarkets
    for (let market of Object.values(this.getActiveMarkets())){
      temp.push(market.getAsset().getOracleAppId())
    }
    return temp;
  }

  getActiveMarketAppIds = () => {
    let temp = [];
    for (let market in Object.values(this.getActiveMarkets())){
      temp.push(market.getmarketAppId())
    }
    return temp;
  }

  getActiveMarketAddresses = () => {
    let temp = [];
    for (let market in Object.values(this.getActiveMarkets())){
      temp.push(market.getMarketAddress())
    }
    return temp;
  }

  prepareOptInTransactions = (storageAddress : string, address : string = undefined) => {
    if (!address){
      address = this.userAddress;
    }

  }

  prepareOptinTransactions = (storageAddress : string, address : string = undefined) => {
    if (!address) {
      address = this.userAddress;
    }
    return prepareManagerAppOptinTransactions(this.manager.getManagerAppId(), this.getMaxAtomicOptInMarketAppIds(), address, storageAddress, await this.getDefaultParams());
  }

  prepareAddCollateralTransactions = (symbol: string, amount: number, address : string = undefined) => {
    if (!address){
      address = this.userAddress;
    }
    let market = this.getMarket(symbol);
    //Need to look back at this, it seems like prepareAddCollateralTransaction was implemented idfferently in addCollateral.ts and addCollateral.py
    //return prepareAddCollateralTransactions(this.algodClient, address, this.manager.getStorageAddress(address), amount, )
  }

  prepareBorrowTransactions = (symbol : string, amount : number, address : string = undefined) => {
    //again there seems to be a difference we have to look closer at regarding this and python sdk 
    return;
  }

  prepareBurnTransactions = (symbol : string, amount : number, address : string = undefined) => {
    //again there is an issue between number of parameters passed into this and prepareBurnTransactions in burn.py vs burn.ts
  }

  prepareClaimRewardsTransactions = (address : string = undefined) => {
    //same issue above, it seems like some of the functions that were ported do not reflect exactly the specification in the python sdk 
  }

  prepareLiquidateTransaction = async (targetStorageAddress: string, borrowSymbol: string, amount: number, collateralSymbol: string, address: string = undefined) => {
    if (!address) {
      address = this.userAddress
    }
    let borrowMarket = this.getMarket(borrowSymbol)
    let collateralMarket = this.getMarket(collateralSymbol)
    return prepareLiquidateTransactions(
      address, 
      await this.getDefaultParams(), 
      this.manager.getStorageAddress(address),
      targetStorageAddress, 
      amount, 
      this.manager.getManagerAppId(),
      borrowMarket.getMarketAppId(),
      borrowMarket.getMarketAddress(),
      collateralMarket.getMarketAppId(),
      this.getActiveMarketAppIds(),
      this.getActiveOracleAppIds(),
      collateralMarket.getAsset().getBankAssetId(),
      borrowSymbol !== "ALGO" ? borrowMarket.getAsset().getUnderlyingAssetId() : undefined)
  }

  prepareMintTransactions = async (something) => {
    //again we have a similar issue as above, need to fix mint.ts to reflect mint.py
    return;
  }

  prepareMintToCollateralTransacdtions = async (something) => {
    //same as above
  }

  prepareRemoveCollateralTransactions = async (something) => {
    //same as above
  }

  prepareRemoveCollateralUnderlyingTransactions = async (something) => {
    //same as above
  }

  prepareRepayBorrowTransactions = async (something) => {
    //same as above
  }

  //Staking transactions builders

  prepareStakingContractOptinTransactions = async (stakingContractName : string, storageAddress : string, address : string = undefined) => {
    if (!address){
      address = this.userAddress
    }
    let stakingContract = this.getStakingContract(stakingContractName)
    return prepareManagerAppOptinTransactions(
      stakingContract.getManagerAppId(),
      [stakingContract.getMarketAppId()],
      address,
      storageAddress,
      await this.getDefaultParams()
    )
  }

  





 
}