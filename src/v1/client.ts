import { Algodv2, Indexer, SuggestedParams, waitForConfirmation } from "algosdk"
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
    let client = new Client(algodClient, indexerClient, historicalIndexerClient, userAddress, chain)
    client.markets = {}
    for (let symbol of client.maxOrderedSymbols) {
      client.markets[symbol] = await Market.init(
        algodClient,
        historicalIndexerClient,
        getMarketAppId(client.chain, symbol)
      )
    }
    return client
  }

  async getDefaultParams(): Promise<SuggestedParams> {
    let params = await this.algod.getTransactionParams().do()
    params.flatFee = true
    params.fee = 1000
    return params
  }

  async getUserInfo(address: string = null): Promise<{}> {
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
    if (!address) {
      address = this.userAddress
    }
    let userInfo = await this.getUserInfo(address)
    let optedInIds = []
    for (let app of userInfo["apps-local-state"]) {
      optedInIds.push(app["id"])
    }
    return optedInIds.includes(appId)
  }

  async isOptedIntoAsset(assetId: number, address: string = null): Promise<boolean> {
    if (!address) {
      address = this.userAddress
    }
    let userInfo = await this.getUserInfo(address)
    let assets = []
    for (let asset of userInfo["assets"]) {
      assets.push(asset["asset-id"])
    }
    return assets.includes(assetId)
  }

  async getUserBalances(address: string = null): Promise<{}> {
    if (!address) {
      address = this.userAddress
    }
    let userInfo = await this.getUserInfo(address)
    let balances = {}
    for (let asset of userInfo["assets"]) {
      balances[asset["asset-id"]] = asset["amount"]
    }
    balances[1] = userInfo["amount"]
    return balances
  }

  async getUserBalance(assetId: number = 1, address: string = null): Promise<number> {
    if (!address) {
      address = this.userAddress
    }
    let userBalances = await this.getUserBalances(address)
    return get(userBalances, assetId, 0)
  }

  async getUserState(address: string = null): Promise<{}> {
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
    return result
  }

  async getStorageState(storageAddress: string = null): Promise<{}> {
    let result = {}
    if (!storageAddress) {
      storageAddress = await this.manager.getStorageAddress(this.userAddress)
    }
    result["manager"] = this.manager.getStorageState(storageAddress)
    for (let symbol of this.activeOrderedSymbols) {
      result[symbol] = this.markets[symbol].getStorageState(storageAddress)
    }
    return result
  }

  async getUserStakingContractState(stakingContractName: string, address: string = null): Promise<{}> {
    if (!address) {
      address = this.userAddress
    }
    return await this.stakingContracts[stakingContractName].getUserState(address)
  }

  // GETTERS

  getManager(): Manager {
    return this.manager
  }

  getMarket(symbol: string): Market {
    return this.markets[symbol]
  }

  getActiveMarkets(): Markets {
    let activeMarkets = {}
    for (let [key, value] of Object.entries(this.markets)) {
      if (this.activeOrderedSymbols.includes(key)) {
        activeMarkets[key] = value
      }
    }
    return activeMarkets
  }

  getStakingContract(_name: string): StakingContract {
    return this.stakingContracts[_name]
  }

  getStakingContracts(): StakingContracts {
    return this.stakingContracts
  }

  getAsset(symbol: string): Asset {
    if (!this.activeOrderedSymbols.includes(symbol)) {
      throw new Error("Unsupported asset")
    }
    return this.markets[symbol].getAsset()
  }

  getMaxAtomicOptInMarketAppIds(): number[] {
    let MaxOptInMarketAppIds = []
    for (let symbol of this.maxAtomicOptInOrderedSymbols) {
      MaxOptInMarketAppIds.push(this.markets[symbol].getMarketAppId())
    }
    return MaxOptInMarketAppIds
  }

  getActiveAssets(): { [key: string]: Asset } {
    let activeAssets = {}
    for (let [symbol, market] of Object.entries(this.getActiveMarkets())) {
      activeAssets[symbol] = market.getAsset()
    }
    return activeAssets
  }

  getActiveAssetIds(): number[] {
    let activeAssetIds = []
    for (let asset of Object.values(this.getActiveAssets())) {
      activeAssetIds.push(asset.getUnderlyingAssetId())
    }
    return activeAssetIds
  }

  getActiveBankAssetIds(): number[] {
    let activeBankAssetIds = []
    for (let asset of Object.values(this.getActiveAssets())) {
      activeBankAssetIds.push(asset.getBankAssetId())
    }
    return activeBankAssetIds
  }

  getActiveOrderedSymbols(): string[] {
    return this.activeOrderedSymbols
  }

  getRawPrices(): {} {
    //Errors will be fixed once we figure out getActiveMarkets
    let rawPrices = {}
    for (let [symbol, market] of Object.entries(this.getActiveMarkets())) {
      rawPrices[symbol] = market.getAsset().getRawPrice()
    }
    return rawPrices
  }

  getPrices(): {} {
    let prices = {}
    for (let [symbol, market] of Object.entries(this.getActiveMarkets())) {
      prices[symbol] = market.getAsset().getPrice()
    }
    return prices
  }

  // INDEXER HELPERS
  async getStorageAccounts(stakingContractName: string = null): Promise<any[]> {
    let nextPage = ""
    let accounts = []
    let appId: number
    if (stakingContractName === null) {
      appId = Object.values(this.getActiveMarkets())[0].getMarketAppId()
    } else {
      appId = this.getStakingContract(stakingContractName).getManagerAppId()
    }
    while (nextPage !== null) {
      console.log(nextPage)
      let accountData = await this.indexerClient
        .searchAccounts()
        .applicationID(appId)
        .nextToken(nextPage)
        .do()
      for (let account of accountData["accounts"]) {
        accounts.push(account)
      }
      if (accountData.includes("next-token")) {
        nextPage = accountData["next-token"]
      } else {
        nextPage = null
      }
    }
    return accounts
  }

  getActiveOracleAppIds(): number[] {
    let activeOracleAppIds = []
    for (let market of Object.values(this.getActiveMarkets())) {
      activeOracleAppIds.push(market.getAsset().getOracleAppId())
    }
    return activeOracleAppIds
  }

  getActiveMarketAppIds(): number[] {
    let activeMarketAppIds = []
    for (let market of Object.values(this.getActiveMarkets())) {
      activeMarketAppIds.push(market.getMarketAppId())
    }
    return activeMarketAppIds
  }

  getActiveMarketAddresses(): string[] {
    let activeMarketAddresses = []
    for (let market of Object.values(this.getActiveMarkets())) {
      activeMarketAddresses.push(market.getMarketAddress())
    }
    return activeMarketAddresses
  }

  //TRANSACTION BUILDERS
  async prepareOptinTransactions(storageAddress: string, address: string = null): Promise<TransactionGroup> {
    if (!address) {
      address = this.userAddress
    }
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
    if (!address) {
      address = this.userAddress
    }
    let market = this.getMarket(symbol)
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
    if (!address) {
      address = this.userAddress
    }
    let market = this.getMarket(symbol)
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
    if (!address) {
      address = this.userAddress
    }
    let market = this.getMarket(symbol)
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
    if (!address) {
      address = this.userAddress
    }
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
    if (!address) {
      address = this.userAddress
    }
    let borrowMarket = this.getMarket(borrowSymbol)
    let collateralMarket = this.getMarket(collateralSymbol)
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
    if (!address) {
      address = this.userAddress
    }
    let market = this.getMarket(symbol)
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
    if (!address) {
      address = this.userAddress
    }
    let market = this.getMarket(symbol)
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
    if (!address) {
      address = this.userAddress
    }
    let market = this.getMarket(symbol)
    return prepareRemoveCollateralTransactions(
      address,
      await this.getDefaultParams(),
      await this.manager.getStorageAddress(address),
      amount,
      market.getAsset().getBankAssetId(),
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
    if (!address) {
      address = this.userAddress
    }
    let market = this.getMarket(symbol)
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
    if (!address) {
      address = this.userAddress
    }
    let market = this.getMarket(symbol)
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
    if (!address) {
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

  async prepareStakeTransactions(
    stakingContractName: string,
    amount: number,
    address: string = null
  ): Promise<TransactionGroup> {
    if (!address) {
      address = this.userAddress
    }
    let stakingContract = this.getStakingContract(stakingContractName)
    let assetId = stakingContract.getAsset().getUnderlyingAssetId()
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
    if (!address) {
      address = this.userAddress
    }
    let stakingContract = this.getStakingContract(stakingContractName)
    let assetId = stakingContract.getAsset().getUnderlyingAssetId()
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
    if (!address) {
      address = this.userAddress
    }
    let stakingContract = this.getStakingContract(stakingContractName)
    let assetId = stakingContract.getAsset().getUnderlyingAssetId()
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
    let txid: string
    try {
      txid = await this.algod.sendRawTransaction(transactionGroup).do()
    } catch (AlgodHTTPError) {}
    if (wait) {
      //not sure about wait rounds (last parameter)
      return waitForConfirmation(this.algod, txid, 10)
    }
    return { txid: txid }
  }
}

export async function newAlgofiTestnetClient(
  algodClient: Algodv2 = null,
  indexerClient: Indexer = null,
  userAddress: string = null
): Promise<Client> {
  let historicalIndexerClient = new Indexer("", "https://indexer.testnet.algoexplorerapi.io/", "")
  if (algodClient === null) {
    algodClient = new Algodv2("", "https://api.testnet.algoexplorer.io", "")
  }
  if (indexerClient === null) {
    indexerClient = new Indexer("", "https://algoindexer.testnet.algoexplorerapi.io/", "")
  }
  return await Client.init(algodClient, indexerClient, historicalIndexerClient, userAddress, "testnet")
}

export async function newAlgofiMainnetClient(
  algodClient: Algodv2 = null,
  indexerClient: Indexer = null,
  userAddress: string = null
): Promise<Client> {
  let historicalIndexerClient = new Indexer("", "https://indexer.algoexplorerapi.io/", "")
  if (algodClient === null) {
    algodClient = new Algodv2("", "https://algoexplorerapi.io", "")
  }
  if (indexerClient === null) {
    indexerClient = new Indexer("", "https://algoindexer.algoexplorerapi.io", "")
  }
  return await Client.init(algodClient, indexerClient, historicalIndexerClient, userAddress, "mainnet")
}
