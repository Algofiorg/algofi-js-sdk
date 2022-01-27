import { Algodv2, Indexer, SuggestedParams, Transaction, waitForConfirmation } from "algosdk"
import {
  getInitRound,
  getOrderedSymbols,
  getManagerAppId,
  getMarketAppId,
  getStakingContracts,
  get,
  TransactionGroup
} from "./utils"
import { Manager } from "./manager"
import { Market } from "./market"
import { StakingContract } from "./stakingContract"
import { prepareManagerAppOptinTransactions } from "./optin"
import { prepareAddCollateralTransactions } from "./addCollateral"
import { prepareLiquidateTransactions } from "./liquidate"
import { Asset } from "./asset"
import { prepareClaimStakingRewardsTransactions, prepareStakeTransactions, prepareUnstakeTransactions } from "./staking"
import { prepareBorrowTransactions } from "./borrow"
import { prepareBurnTransactions } from "./burn"
import { prepareClaimRewardsTransactions } from "./claimRewards"
import { prepareMintTransactions } from "./mint"
import { prepareMintToCollateralTransactions } from "./mintToCollateral"
import { prepareRemoveCollateralUnderlyingTransactions } from "./removeCollateralUnderlying"
import { prepareRemoveCollateralTransactions } from "./removeCollateral"
import { prepareRepayBorrowTransactions } from "./repayBorrow"

export interface Markets {
  [key: string]: Market
}

export interface StringToNum {
  [key: string]: number
}

export interface StakingContracts {
  [key: string]: StakingContract
}

export class Client {
  SCALE_FACTOR: number
  BORROW_SHARES_INIT: number
  PARAMETER_SCALE_FACTOR: number
  algod: Algodv2
  indexerClient: Indexer
  historicalIndexer: Indexer
  chain: string
  userAddress: string
  initRound: number
  activeOrderedSymbols: string[]
  maxOrderedSymbols: string[]
  maxAtomicOptInOrderedSymbols: string[]
  manager: Manager
  markets: Markets
  stakingContractInfo: { [key: string]: StringToNum }
  stakingContracts: StakingContracts

  constructor(
    algodClient: Algodv2,
    indexerClient: Indexer,
    historicalIndexerClient: Indexer,
    userAddress: string,
    chain: string
  ) {
    // constants
    this.SCALE_FACTOR = 1e9
    this.BORROW_SHARES_INIT = 1e3
    this.PARAMETER_SCALE_FACTOR = 1e3

    // clients info
    this.algod = algodClient
    this.indexerClient = indexerClient
    this.historicalIndexer = historicalIndexerClient
    this.chain = chain

    // user info
    this.userAddress = userAddress

    this.initRound = getInitRound(this.chain)
    this.activeOrderedSymbols = getOrderedSymbols(this.chain)
    this.maxOrderedSymbols = getOrderedSymbols(this.chain, true)
    this.maxAtomicOptInOrderedSymbols = getOrderedSymbols(this.chain, undefined, true)

    // manager info
    this.manager = new Manager(this.algod, getManagerAppId(this.chain))

    // staking contract info
    this.stakingContractInfo = getStakingContracts(this.chain)
    this.stakingContracts = {}
    for (let _name of Object.keys(this.stakingContractInfo)) {
      //the keys are stbl and stbl-usdc-lp-v2
      this.stakingContracts[_name] = new StakingContract(
        this.algod,
        this.historicalIndexer,
        this.stakingContractInfo[_name]
      )
    }
  }

  static async init(
    algodClient: Algodv2,
    indexerClient: Indexer,
    historicalIndexerClient: Indexer,
    userAddress: string,
    chain: string
  ): Promise<Client> {
    console.log("CONSTRUCTOR IN CLIENT.TS\n")
    let client = new Client(algodClient, indexerClient, historicalIndexerClient, userAddress, chain)
    client.markets = {}
    for (let symbol of client.maxOrderedSymbols) {
      client.markets[symbol] = await Market.init(
        algodClient,
        historicalIndexerClient,
        getMarketAppId(client.chain, symbol)
      )
    }
    console.log("constructor in client.ts finished and returned", client, "\n")
    return client
  }

  async getDefaultParams(): Promise<SuggestedParams> {
    console.log("GET DEFAULT PARAMS IN CLIENT.TS\n")
    let params = await this.algod.getTransactionParams().do()
    params.flatFee = true
    params.fee = 1000
    console.log("get default params in client.ts finished and returned", params, "\n")
    return params
  }

  async getUserInfo(address: string = null): Promise<{}> {
    console.log("GET USER INFO IN CLIENT.TS\n")
    if (!address) {
      address = this.userAddress
    }
    if (address) {
      return await this.algod.accountInformation(address).do()
    } else {
      throw new Error("user_address has not been specified")
    }
  }

  async isOptedIntoApp(appId: number, address: string = null): Promise<boolean> {
    console.log("IS OPTED INTO APP IN CLIENT.TS\n")
    if (!address) {
      address = this.userAddress
    }
    let userInfo = await this.getUserInfo(address)
    let optedInIds = []
    for (let app of userInfo["apps-local-state"]) {
      optedInIds.push(app["id"])
    }
    console.log("is opted into app in client.ts finished and returned", optedInIds.includes(appId), "\n")
    return optedInIds.includes(appId)
  }

  async isOptedIntoAsset(assetId: number, address: string = null): Promise<boolean> {
    console.log("IS OPTED INTO ASSET IN CLIENT.TS\n")
    if (!address) {
      address = this.userAddress
    }
    let userInfo = await this.getUserInfo(address)
    let assets = []
    for (let asset of userInfo["assets"]) {
      assets.push(asset["asset-id"])
    }
    console.log("is opted into asset in client.ts finished and returned", assets.includes(assetId), "\n")
    return assets.includes(assetId)
  }

  async getUserBalances(address: string = null): Promise<{}> {
    console.log("GET USER BALANCES IN CLIENT.TS\n")
    if (!address) {
      address = this.userAddress
    }
    let userInfo = await this.getUserInfo(address)
    let balances = {}
    for (let asset of userInfo["assets"]) {
      balances[asset["asset-id"]] = asset["amount"]
    }
    balances[1] = userInfo["amount"]
    console.log("get user balances in client.ts finished and returned", balances, "\n")
    return balances
  }

  async getUserBalance(assetId: number = 1, address: string = null): Promise<number> {
    console.log("GET USER BALANCE IN CLIENT.TS\n")
    if (!address) {
      address = this.userAddress
    }
    let userBalances = await this.getUserBalances(address)
    console.log("get user balance in client.ts finished and returned", get(userBalances, assetId, 0), "\n")
    return get(userBalances, assetId, 0)
  }

  async getUserState(address: string = null): Promise<{}> {
    console.log("GET USER STATE IN CLIENT.TS\n")
    //Address XLHCUMHYRPZJ6NXGP4XAMZKHF2HE67Q7MXLP7IGOIZIAEBNUVQ3FEGPCWQ
    let result = {}
    if (!address) {
      address = this.userAddress
    }
    result["manager"] = await this.manager.getUserState(address)
    let storageAddress = await this.manager.getStorageAddress(address)

    for (let symbol of this.activeOrderedSymbols) {
      result[symbol] = this.markets[symbol].getStorageState(storageAddress)
    }
    console.log("get user state in client.ts finished and returned", result, "\n")
    return result
  }

  async getStorageState(storageAddress: string = null): Promise<{}> {
    console.log("GET STORAGE STATE IN CLIENT.TS\n")
    let result = {}
    if (!storageAddress) {
      storageAddress = await this.manager.getStorageAddress(this.userAddress)
    }
    result["manager"] = this.manager.getStorageState(storageAddress)
    for (let symbol of this.activeOrderedSymbols) {
      result[symbol] = this.markets[symbol].getStorageState(storageAddress)
    }
    console.log("get storage state in client.ts finished and returned", result, "\n")
    return result
  }

  async getUserStakingContractState(stakingContractName: string, address: string = null): Promise<{}> {
    console.log("GET USER STAKING CONTRACT STATE IN CLIENT.TS\n")
    if (!address) {
      address = this.userAddress
    }
    return await this.stakingContracts[stakingContractName].getUserState(address)
  }

  // GETTERS

  getManager(): Manager {
    console.log("GET MANAGER IN CLIENT.TS\n")
    console.log("get manager in client.ts finished and returned", this.manager, "\n")
    return this.manager
  }

  getMarket(symbol: string): Market {
    console.log("GET MARKET IN CLIENT.TS\n")
    console.log("get market in client.ts finished and returned", this.markets[symbol], "\n")
    return this.markets[symbol]
  }

  getActiveMarkets(): Markets {
    console.log("GET ACTIVE MARKETS IN CLIENT.TS\n")
    let activeMarkets = {}
    for (let [key, value] of Object.entries(this.markets)) {
      if (this.activeOrderedSymbols.includes(key)) {
        activeMarkets[key] = value
      }
    }
    console.log("get active markets in client.ts finished and returned", activeMarkets, "\n")
    return activeMarkets
  }

  getStakingContract(_name: string): StakingContract {
    console.log("GET STAKING CONTRACT IN CLIENT.TS\n")
    console.log("get staking contract in client.ts finished and returned", this.stakingContracts[_name], "\n")
    return this.stakingContracts[_name]
  }

  getStakingContracts(): StakingContracts {
    console.log("GET STAKING CONTRACTS IN CLIENT.TS\n")
    console.log("get staking contracts in client.ts finished and returned", this.stakingContracts, "\n")
    return this.stakingContracts
  }

  getAsset(symbol: string): Asset {
    console.log("GET ASSET IN CLIENT.TS\n")
    if (!this.activeOrderedSymbols.includes(symbol)) {
      throw new Error("Unsupported asset")
    }
    console.log("get asset in client.ts finished and returned", this.markets[symbol].getAsset(), "\n")
    return this.markets[symbol].getAsset()
  }

  getMaxAtomicOptInMarketAppIds(): number[] {
    console.log("GET MAX ATOMIC OPT IN MARKET APP IDS IN CLIENT.TS\n")
    let MaxOptInMarketAppIds = []
    for (let symbol of this.maxAtomicOptInOrderedSymbols) {
      MaxOptInMarketAppIds.push(this.markets[symbol].getMarketAppId())
    }
    console.log("get max atomic opt in market app ids finished and returned", MaxOptInMarketAppIds, "\n")
    return MaxOptInMarketAppIds
  }

  getActiveAssets(): { [key: string]: Asset } {
    console.log("GET ACTIVE ASSETS IN CLIENT.TS\n")
    let activeAssets = {}
    for (let [symbol, market] of Object.entries(this.getActiveMarkets())) {
      activeAssets[symbol] = market.getAsset()
    }
    console.log("get active assets in client.ts finished and returned", activeAssets, "\n")
    return activeAssets
  }

  getActiveAssetIds(): number[] {
    console.log("GET ACTIVE ASSET IDS IN CLIENT.TS\n")
    let activeAssetIds = []
    for (let asset of Object.values(this.getActiveAssets())) {
      activeAssetIds.push(asset.getUnderlyingAssetId())
    }
    console.log("get active asset ids in client.ts finished and returned", activeAssetIds, "\n")
    return activeAssetIds
  }

  getActiveBankAssetIds(): number[] {
    console.log("GET ACTIVE BANK ASSET IDS IN CLIENT.TS\n")
    let activeBankAssetIds = []
    for (let asset of Object.values(this.getActiveAssets())) {
      activeBankAssetIds.push(asset.getBankAssetId())
    }
    console.log("get active bank asset ids in client.ts finished and returned", activeBankAssetIds, "\n")
    return activeBankAssetIds
  }

  getActiveOrderedSymbols(): string[] {
    console.log("GET ACTIVE ORDERED SYMBOLS IN CLIENT.TS\n")
    console.log("get active ordered symbols in client.ts finished and returned", this.activeOrderedSymbols, "\n")
    return this.activeOrderedSymbols
  }

  getRawPrices(): {} {
    console.log("GET RAW PRICES IN CLIENT.TS\n")
    //Errors will be fixed once we figure out getActiveMarkets
    let rawPrices = {}
    for (let [symbol, market] of Object.entries(this.getActiveMarkets())) {
      rawPrices[symbol] = market.getAsset().getRawPrice()
    }
    console.log("get raw prices in client.ts finished and returned", rawPrices, "\n")
    return rawPrices
  }

  getPrices(): {} {
    console.log("GET PRICES IN CLIENT.TS\n")
    let prices = {}
    for (let [symbol, market] of Object.entries(this.getActiveMarkets())) {
      prices[symbol] = market.getAsset().getPrice()
    }
    console.log("get prices in client.ts finished and returned", prices, "\n")
    return prices
  }

  // INDEXER HELPERS
  async getStorageAccounts(stakingContractName: string = null) {
    console.log("GET STORAGE ACCOUNTS IN CLIENT.TS\n")
    let nextPage = ""
    let accounts = []
    let appId
    if (stakingContractName === null) {
      appId = Object.values(this.getActiveMarkets())[0].getMarketAppId()
    } else {
      appId = this.getStakingContract(stakingContractName).getManagerAppId()
    }
    while (nextPage !== null) {
      console.log(nextPage)
      //make sure this is the js analog to indexer.accounts, we are just assuming at this point
      let accountData = await this.indexerClient.searchAccounts().do()
      for (let account of accountData["accounts"]) {
        accounts.push(account)
      }
      if (accountData.includes("next-token")) {
        nextPage = accountData["next-token"]
      } else {
        nextPage = undefined
      }
    }
    console.log("get storage accounts in client.ts finished and returned", accounts, "\n")
    return accounts
  }

  getActiveOracleAppIds(): number[] {
    console.log("GET ACTIVE ORACLE APP IDS IN CLIENT.TS\n")
    let activeOracleAppIds = []
    for (let market of Object.values(this.getActiveMarkets())) {
      activeOracleAppIds.push(market.getAsset().getOracleAppId())
    }
    console.log("get active oracle app ids in client.ts finished and returned", activeOracleAppIds, "\n")
    return activeOracleAppIds
  }

  getActiveMarketAppIds(): number[] {
    console.log("GET ACTIVE MARKET IDS IN CLIENT.TS\n")
    let activeMarketAppIds = []
    for (let market of Object.values(this.getActiveMarkets())) {
      activeMarketAppIds.push(market.getMarketAppId())
    }
    console.log("get active market app ids in client.ts finished and returned", activeMarketAppIds, "\n")
    return activeMarketAppIds
  }

  getActiveMarketAddresses(): string[] {
    console.log("GET ACTIVE MARKET ADDRESSES IN CLIENT.TS\n")
    let activeMarketAddresses = []
    for (let market of Object.values(this.getActiveMarkets())) {
      activeMarketAddresses.push(market.getMarketAddress())
    }
    console.log("get active market addresses in client.ts finished and returned", activeMarketAddresses, "\n")
    return activeMarketAddresses
  }

  //TRANSACTION BUILDERS
  async prepareOptinTransactions(storageAddress: string, address: string = null): Promise<TransactionGroup> {
    console.log("PREPARE OPT IN TRANSACTIONS IN CLIENT.TS\n")
    if (!address) {
      address = this.userAddress
    }
    console.log("prepare opt in transactions in client.ts finished and returned something\n")
    return prepareManagerAppOptinTransactions(
      this.manager.getManagerAppId(),
      this.getMaxAtomicOptInMarketAppIds(),
      address,
      storageAddress,
      await this.getDefaultParams()
    )
  }

  async prepareAddCollateralTransactions(
    symbol: string,
    amount: number,
    address: string = null
  ): Promise<TransactionGroup> {
    console.log("PREPARE ADD COLLATERAL TRANSACTIONS IN CLIENT.TS\n")
    if (!address) {
      address = this.userAddress
    }
    let market = this.getMarket(symbol)
    console.log("prepare add collateral transactions in client.ts finished and returned something\n")
    return prepareAddCollateralTransactions(
      address,
      await this.getDefaultParams(),
      await this.manager.getStorageAddress(address),
      amount,
      market.getAsset().getBankAssetId(),
      this.manager.getManagerAppId(),
      market.getMarketAppId(),
      market.getMarketAddress(),
      this.getActiveMarketAppIds(),
      this.getActiveOracleAppIds()
    )
  }

  async prepareBorrowTransactions(symbol: string, amount: number, address: string = null): Promise<TransactionGroup> {
    console.log("PREPARE BORROW TRANSACTIONS IN CLIENT.TS\n")
    if (!address) {
      address = this.userAddress
    }
    let market = this.getMarket(symbol)
    console.log("prepare borrow transactions in client.ts finished and returned something\n")
    return prepareBorrowTransactions(
      address,
      await this.getDefaultParams(),
      await this.manager.getStorageAddress(address),
      amount,
      market.getAsset().getUnderlyingAssetId(),
      this.manager.getManagerAppId(),
      market.getMarketAppId(),
      this.getActiveMarketAppIds(),
      this.getActiveOracleAppIds()
    )
  }

  async prepareBurnTransactions(symbol: string, amount: number, address: string = null): Promise<TransactionGroup> {
    console.log("PREPARE BURN TRANSACTIONS IN CLIENT.TS\n")
    if (!address) {
      address = this.userAddress
    }
    let market = this.getMarket(symbol)
    console.log("prepare burn transactions in client.ts finished and returned something\n")
    return prepareBurnTransactions(
      address,
      await this.getDefaultParams(),
      await this.manager.getStorageAddress(address),
      amount,
      market.getAsset().getUnderlyingAssetId(),
      market.getAsset().getBankAssetId(),
      this.manager.getManagerAppId(),
      market.getMarketAppId(),
      market.getMarketAddress(),
      this.getActiveMarketAppIds(),
      this.getActiveOracleAppIds()
    )
  }

  async prepareClaimRewardsTransactions(address: string = null): Promise<TransactionGroup> {
    console.log("PREPARE CLAIM REWARDS TRANSACTIONS IN CLIENT.TS\n")
    if (!address) {
      address = this.userAddress
    }
    console.log("prepare claim rewards transactions in client.ts finished and returned something\n")
    return prepareClaimRewardsTransactions(
      address,
      await this.getDefaultParams(),
      await this.manager.getStorageAddress(address),
      this.manager.getManagerAppId(),
      this.getActiveMarketAppIds(),
      this.getActiveOracleAppIds(),
      this.manager.getRewardsProgram().getRewardsAssetIds()
    )
  }

  async prepareLiquidateTransactions(
    targetStorageAddress: string,
    borrowSymbol: string,
    amount: number,
    collateralSymbol: string,
    address: string = null
  ): Promise<TransactionGroup> {
    console.log("PREPARE LIQUIDATE TRANSACTIONS IN CLIENT.TS\n")
    if (!address) {
      address = this.userAddress
    }
    let borrowMarket = this.getMarket(borrowSymbol)
    let collateralMarket = this.getMarket(collateralSymbol)
    console.log("prepare liquidate transactions in client.ts finished and returned something\n")
    return prepareLiquidateTransactions(
      address,
      await this.getDefaultParams(),
      await this.manager.getStorageAddress(address),
      targetStorageAddress,
      amount,
      this.manager.getManagerAppId(),
      borrowMarket.getMarketAppId(),
      borrowMarket.getMarketAddress(),
      collateralMarket.getMarketAppId(),
      this.getActiveMarketAppIds(),
      this.getActiveOracleAppIds(),
      collateralMarket.getAsset().getBankAssetId(),
      borrowSymbol !== "ALGO" ? borrowMarket.getAsset().getUnderlyingAssetId() : undefined
    )
  }

  async prepareMintTransactions(symbol: string, amount: number, address: string = null): Promise<TransactionGroup> {
    console.log("PREPARE MINT TRANSACTIONS IN CLIENT.TS\n")
    if (!address) {
      address = this.userAddress
    }
    let market = this.getMarket(symbol)
    console.log("prepare mint transactions in client.ts finished and returned something\n")
    return prepareMintTransactions(
      address,
      await this.getDefaultParams(),
      await this.manager.getStorageAddress(address),
      amount,
      market.getAsset().getBankAssetId(),
      this.manager.getManagerAppId(),
      market.getMarketAppId(),
      market.getMarketAddress(),
      this.getActiveMarketAppIds(),
      this.getActiveOracleAppIds(),
      symbol !== "ALGO" ? market.getAsset().getUnderlyingAssetId() : undefined
    )
  }

  async prepareMintToCollateralTransactions(
    symbol: string,
    amount: number,
    address: string = null
  ): Promise<TransactionGroup> {
    console.log("PREPARE MINT TO COLLATERAL TRANSACTIONS IN CLIENT.TS\n")
    if (!address) {
      address = this.userAddress
    }
    let market = this.getMarket(symbol)
    console.log("prepare mint to collateral transactions finished and returned something\n")
    return prepareMintToCollateralTransactions(
      address,
      await this.getDefaultParams(),
      await this.manager.getStorageAddress(address),
      amount,
      this.manager.getManagerAppId(),
      market.getMarketAppId(),
      market.getMarketAddress(),
      this.getActiveMarketAppIds(),
      this.getActiveOracleAppIds(),
      symbol !== "ALGO" ? market.getAsset().getUnderlyingAssetId() : undefined
    )
  }

  async prepareRemoveCollateralTransactions(
    symbol: string,
    amount: number,
    address: string = null
  ): Promise<TransactionGroup> {
    console.log("PREPARE REMOVE COLLATERAL TRANSACTIONS IN CLIENT.TS\n")
    if (!address) {
      address = this.userAddress
    }
    let market = this.getMarket(symbol)
    console.log("prepare remove collateral transactions finished and returned something\n")
    return prepareRemoveCollateralTransactions(
      address,
      await this.getDefaultParams(),
      await this.manager.getStorageAddress(address),
      amount,
      market.getAsset().bankAssetId(),
      this.manager.getManagerAppId(),
      market.getMarketAppId(),
      this.getActiveMarketAppIds(),
      this.getActiveOracleAppIds()
    )
  }

  async prepareRemoveCollateralUnderlyingTransactions(
    symbol: string,
    amount: number,
    address: string = null
  ): Promise<TransactionGroup> {
    console.log("PREPARE REMOVE COLLATERAL UNDERLYING TRANSACTIONS IN CLIENT.TS\n")
    if (!address) {
      address = this.userAddress
    }
    let market = this.getMarket(symbol)
    console.log("prepare remove collateral underlying transactions finished and returned something\n")
    return prepareRemoveCollateralUnderlyingTransactions(
      address,
      await this.getDefaultParams(),
      await this.manager.getStorageAddress(address),
      amount,
      market.getAsset().getUnderlyingAssetId(),
      this.manager.getManagerAppId(),
      market.getMarketAppId(),
      this.getActiveMarketAppIds(),
      this.getActiveOracleAppIds()
    )
  }

  async prepareRepayBorrowTransactions(
    symbol: string,
    amount: number,
    address: string = null
  ): Promise<TransactionGroup> {
    console.log("PREPARE REPAY BORROW TRANSACTIONS IN CLIENT.TS\n")
    if (!address) {
      address = this.userAddress
    }
    let market = this.getMarket(symbol)
    console.log("prepare repay borrow transactions finished and returned something\n")
    return prepareRepayBorrowTransactions(
      address,
      await this.getDefaultParams(),
      await this.manager.getStorageAddress(address),
      amount,
      this.manager.getManagerAppId(),
      market.getMarketAppId(),
      market.getMarketAddress(),
      this.getActiveMarketAppIds(),
      this.getActiveOracleAppIds(),
      symbol !== "ALGO" ? market.getAsset().getUnderlyingAssetId() : undefined
    )
  }

  //Staking transactions builders
  async prepareStakingContractOptinTransactions(
    stakingContractName: string,
    storageAddress: string,
    address: string = null
  ): Promise<TransactionGroup> {
    console.log("PREPARE STAKING CONTRACT OPT IN TRANSACTIONS IN CLIENT.TS\n")
    if (!address) {
      address = this.userAddress
    }
    let stakingContract = this.getStakingContract(stakingContractName)
    console.log("prepare staking contract optin transactions finished and returned something\n")
    return prepareManagerAppOptinTransactions(
      stakingContract.getManagerAppId(),
      [stakingContract.getMarketAppId()],
      address,
      storageAddress,
      await this.getDefaultParams()
    )
  }

  async prepareStakeTransactions(
    stakingContractName: string,
    amount: number,
    address: string = null
  ): Promise<TransactionGroup> {
    console.log("PREPARE STAKE TRANSACTIONS IN CLIENT.TS\n")
    if (!address) {
      address = this.userAddress
    }
    let stakingContract = this.getStakingContract(stakingContractName)
    let assetId = stakingContract.getAsset().getUnderlyingAssetId()
    console.log("prepare stake transactions in client.ts finished and returned something\n")
    return prepareStakeTransactions(
      address,
      await this.getDefaultParams(),
      await stakingContract.getStorageAddress(address),
      amount,
      stakingContract.getManagerAppId(),
      stakingContract.getMarketAppId(),
      stakingContract.getMarketAddress(),
      stakingContract.getOracleAppId(),
      assetId > 1 ? assetId : undefined
    )
  }

  async prepareUnstakeTransactions(
    stakingContractName: string,
    amount: number,
    address: string = null
  ): Promise<TransactionGroup> {
    console.log("PREPARE UNSTAKE TRANSACTIONS IN CLIENT.TS\n")
    if (!address) {
      address = this.userAddress
    }
    let stakingContract = this.getStakingContract(stakingContractName)
    let assetId = stakingContract.getAsset().getUnderlyingAssetId()
    console.log("prepare unstake transactions in client.ts finished and returned something\n")
    return prepareUnstakeTransactions(
      address,
      await this.getDefaultParams(),
      await stakingContract.getStorageAddress(address),
      amount,
      stakingContract.getManagerAppId(),
      stakingContract.getMarketAppId(),
      stakingContract.getOracleAppId(),
      assetId > 1 ? assetId : undefined
    )
  }

  async prepareClaimStakingRewardsTransactions(
    stakingContractName: string,
    address: string = null
  ): Promise<TransactionGroup> {
    console.log("PREPARE CLAIM STAKING REWARDS TRANSACTIONS IN CLIENT.TS\n")
    if (!address) {
      address = this.userAddress
    }
    let stakingContract = this.getStakingContract(stakingContractName)
    let assetId = stakingContract.getAsset().getUnderlyingAssetId()
    console.log("prepare claim staking rewards transactions in client.ts finished and returned something\n")
    return prepareClaimStakingRewardsTransactions(
      address,
      await this.getDefaultParams(),
      await stakingContract.getStorageAddress(address),
      stakingContract.getManagerAppId(),
      stakingContract.getMarketAppId(),
      stakingContract.getOracleAppId(),
      stakingContract.getRewardsProgram().getRewardsAssetIds()
    )
  }

  async submit(transactionGroup: Uint8Array, wait: boolean = false): Promise<{}> {
    console.log("SUBMIT IN CLIENT.TS\n")
    let txid: string
    try {
      txid = await this.algod.sendRawTransaction(transactionGroup).do()
    } catch (AlgodHTTPError) {
      console.log("Error in submitting")
    }
    if (wait) {
      //not sure about wait rounds (last parameter)
      return waitForConfirmation(this.algod, txid, 10)
    }
    return { txid: txid }
  }
}

export async function newAlgofiTestnetClient(
  algodClient: Algodv2,
  indexerClient: Indexer = null,
  userAddress: string = null
): Promise<Client> {
  console.log("INSTANTIATING TESTNET CLIENT IN CLIENT.TS\n")
  let historicalIndexerClient = new Indexer("", "https://indexer.testnet.algoexplorerapi.io/", "")
  if (algodClient === null) {
    algodClient = new Algodv2(
      "ad4c18357393cb79f6ddef80b1c03ca99266ec99d55dff51b31811143f8b2dff",
      "https://node.chainvault.io/test",
      ""
    )
  }
  if (indexerClient === null) {
    indexerClient = new Indexer("", "https://algoindexer.testnet.algoexplorerapi.io/", "")
  }
  return await Client.init(algodClient, indexerClient, historicalIndexerClient, userAddress, "testnet")
}

export async function newAlgofiMainnetClient(
  algodClient: Algodv2,
  indexerClient: Indexer = null,
  userAddress: string = null
): Promise<Client> {
  console.log("INSTANTIATING MAINNET CLIENT IN CLIENT.TS\n")
  let historicalIndexerClient = new Indexer("", "https://indexer.algoexplorerapi.io/", "")
  if (algodClient === null) {
    algodClient = new Algodv2("", "https://algoexplorerapi.io", "")
  }
  if (indexerClient === null) {
    indexerClient = new Indexer("", "https://algoindexer.algoexplorerapi.io", "")
  }
  return await Client.init(algodClient, indexerClient, historicalIndexerClient, userAddress, "mainnet")
}
