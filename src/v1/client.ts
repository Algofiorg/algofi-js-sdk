import { Algodv2, Indexer, waitForConfirmation } from "algosdk"
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

export interface StakingContractInfo {
  [key: string]: StringToNum
}

export interface StakingContracts {
  [key: string]: StakingContract
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

  constructor(
    algodClient: Algodv2,
    indexerClient: Indexer,
    historicalIndexerClient: Indexer,
    userAddress: string,
    chain: string
  ) {
    console.log("CONSTRUCTOR IN CLIENT.TS\n")
    // constants
    this.SCALE_FACTOR = 1e9
    this.BORROW_SHARES_INIT = 1e3
    this.PARAMETER_SCALE_FACTOR = 1e3

    // clients info
    this.algodClient = algodClient
    this.indexerClient = indexerClient
    this.historicalIndexerClient = historicalIndexerClient
    this.chain = chain

    // user info
    this.userAddress = userAddress

    this.initRound = getInitRound(this.chain)
    this.activeOrderedSymbols = getOrderedSymbols(this.chain)
    this.maxOrderedSymbols = getOrderedSymbols(this.chain, true)
    this.maxAtomicOptInOrderedSymbols = getOrderedSymbols(this.chain, undefined, true)

    // manager info
    this.manager = new Manager(this.algodClient, getManagerAppId(this.chain))

    // staking contract info
    this.stakingContractInfo = getStakingContracts(this.chain)
    this.stakingContracts = {}
    for (let nam of Object.keys(this.stakingContractInfo)) {
      //Need to figure out what stakingcontractinfo is really supposed to look like
      //this.stakingContracts[nam] = new StakingContract(this.algodClient, this.historicalIndexerClient, this.stakingContractInfo["mainnet"][nam]);
    }

    // this.staking_contracts = {name : StakingContract(this.algodClient, this.historicalIndexerClient, this.staking_contract_info[name]) for name in this.staking_contract_info.keys()}
  }

  static async init(
    algodClient: Algodv2,
    indexerClient: Indexer,
    historicalIndexerClient: Indexer,
    userAddress: string,
    chain: string
  ) {
    console.log("INIT IN CLIENT.TS\n")
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

  async getDefaultParams() {
    console.log("GET DEFAULT PARAMS IN CLIENT.TS\n")
    let params = await this.algodClient.getTransactionParams().do()
    params.fee = 1000
    params.flatFee = true
    return params
  }

  async getUserInfo(address: string = undefined) {
    console.log("GET USER INFO IN CLIENT.TS\n")
    if (!address) {
      address = this.userAddress
    }
    if (address) {
      return await this.algodClient.accountInformation(address).do()
    } else {
      throw new Error("user_address has not been specified")
    }
  }

  async isOptedIntoApp(appId: number, address: string = undefined) {
    console.log("IS OPTED INTO APP IN CLIENT.TS\n")
    if (!address) {
      address = this.userAddress
    }
    let userInfo = await this.getUserInfo(address)
    let appsLocalState = []
    for (let x of userInfo["apps-local-state"]) {
      appsLocalState.push(x["id"])
    }
    return appsLocalState.includes(appId)
  }

  async isOptedIntoAsset(assetId: number, address: string = undefined) {
    console.log("IS OPTED INTO ASSET IN CLIENT.TS\n")
    if (!address) {
      address = this.userAddress
    }
    let userInfo = await this.getUserInfo(address)
    let assets = []
    for (let x of userInfo["assets"]) {
      assets.push(x["asset-id"])
    }
    return assets.includes(assetId)
  }

  async getUserBalances(address: string = undefined) {
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
    return balances
  }

  async getUserBalance(assetId: number = 1, address: string = undefined) {
    console.log("GET USER BALANCE IN CLIENT.TS\n")
    if (!address) {
      address = this.userAddress
    }
    let userBalances = await this.getUserBalances(address)
    return get(userBalances, assetId, 0)
  }

  async getUserState(address: string = undefined) {
    console.log("GET USER STATE IN CLIENT.TS\n")
    let result = {}
    if (!address) {
      address = this.userAddress
    }
    result["manager"] = await this.manager.getUserState(address)
    let storageAddress = await this.manager.getStorageAddress(address)

    for (let symbol in this.activeOrderedSymbols) {
      result[symbol] = this.markets[symbol].getStorageState(storageAddress)
    }
    return result
  }

  async getStorageState(storageAddress: string = undefined) {
    console.log("GET STORAGE STATE IN CLIENT.TS\n")
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

  async getUserStakingContractState(stakingContractName: string, address: string = undefined) {
    console.log("GET USER STAKING CONTRACT STATE IN CLIENT.TS\n")
    let result = {}
    if (!address) {
      address = this.userAddress
    }
    return this.stakingContracts[stakingContractName].getUserState(address)
  }

  // GETTERS

  getManager() {
    console.log("GET MANAGER IN CLIENT.TS\n")
    return this.manager
  }

  getMarket(symbol: string): Market {
    console.log("GET MARKET IN CLIENT.TS\n")
    return this.markets[symbol]
  }

  getActiveMarkets(): Markets {
    console.log("GET ACTIVE MARKETS IN CLIENT.TS\n")
    let temp = {}
    for (let [key, value] of Object.entries(this.markets)) {
      if (this.activeOrderedSymbols.includes(key)) {
        temp[key] = value
      }
    }
    return temp
  }

  getStakingContract(nam: string) {
    console.log("GET STAKING CONTRACT IN CLIENT.TS\n")
    return this.stakingContracts[nam]
  }

  getStakingContracts() {
    console.log("GET STAKING CONTRACTS IN CLIENT.TS\n")
    return this.stakingContracts
  }

  getAsset(symbol: string) {
    console.log("GET ASSET IN CLIENT.TS\n")
    if (!this.activeOrderedSymbols.includes(symbol)) {
      throw new Error("Unsupported asset")
    }
    return this.markets[symbol].getAsset()
  }

  getMaxAtomicOptInMarketAppIds() {
    console.log("GET MAX ATOMIC OPT IN MARKET APP IDS IN CLIENT.TS\n")
    let temp = []
    for (let symbol of this.maxAtomicOptInOrderedSymbols) {
      temp.push(this.markets[symbol].getMarketAppId())
    }
    return temp
  }

  getActiveAssets(): { [key: string]: Asset } {
    console.log("GET ACTIVE ASSETS IN CLIENT.TS\n")
    let temp = {}
    for (let [symbol, market] of Object.entries(this.getActiveMarkets())) {
      temp[symbol] = market.getAsset()
    }
    return temp
  }

  getActiveAssetIds() {
    console.log("GET ACTIVE ASSET IDS IN CLIENT.TS\n")
    let temp = []
    for (let asset of Object.values(this.getActiveAssets())) {
      temp.push(asset.getUnderlyingAssetId())
    }
    return temp
  }

  getActiveBankAssetIds() {
    console.log("GET ACTIVE BANK ASSET IDS IN CLIENT.TS\n")
    let temp = []
    for (let asset of Object.values(this.getActiveAssets())) {
      temp.push(asset.getBankAssetId())
    }
    return temp
  }

  getActiveOrderedSymbols() {
    console.log("GET ACTIVE ORDERED SYMBOLS IN CLIENT.TS\n")
    return this.activeOrderedSymbols
  }

  getRawPrices() {
    console.log("GET RAW PRICES IN CLIENT.TS\n")
    //Errors will be fixed once we figure out getActiveMarkets
    let temp = {}
    for (let [symbol, market] of Object.entries(this.getActiveMarkets())) {
      temp[symbol] = market.getAsset().getRawPrices()
    }
  }

  getPrices() {
    console.log("GET PRICES IN CLIENT.TS\n")
    let temp = {}
    //Errors will be fixed once we figure out getActiveMarkets
    for (let [symbol, market] of Object.entries(this.getActiveMarkets())) {
      temp[symbol] = market.getAsset().getPrice()
    }
  }

  // INDEXER HELPERS
  async getStorageAccounts(stakingContractName: string = undefined) {
    console.log("GET STORAGE ACCOUNTS IN CLIENT.TS\n")
    let nextPage = ""
    let accounts = []
    let appId
    if (stakingContractName === undefined) {
      // This error will be fixed when we figure out getActiveMarkets
      appId = Object.values(this.getActiveMarkets())[0]
    } else {
      appId = this.getStakingContract(stakingContractName).getManagerAppId()
    }
    while (nextPage !== undefined) {
      // console.log(nextPage)
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
    return accounts
  }

  getActiveOracleAppIds() {
    console.log("GET ACTIVE ORACLE APP IDS IN CLIENT.TS\n")
    let temp = []
    for (let market of Object.values(this.getActiveMarkets())) {
      temp.push(market.getAsset().getOracleAppId())
    }
    return temp
  }

  getActiveMarketAppIds() {
    console.log("GET ACTIVE MARKET IDS IN CLIENT.TS\n")
    let temp = []
    for (let market of Object.values(this.getActiveMarkets())) {
      temp.push(market.getMarketAppId())
    }
    return temp
  }

  getActiveMarketAddresses() {
    console.log("GET ACTIVE MARKET ADDRESSES IN CLIENT.TS\n")
    let temp = []
    for (let market of Object.values(this.getActiveMarkets())) {
      temp.push(market.getMarketAddress())
    }
    return temp
  }

  //TRANSACTION BUILDERS
  async prepareOptinTransactions(storageAddress: string, address: string = undefined) {
    console.log("PREPARE OPT IN TRANSACTIONS IN CLIENT.TS\n")
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

  async prepareAddCollateralTransactions(symbol: string, amount: number, address: string = undefined) {
    console.log("PREPARE ADD COLLATERAL TRANSACTIONS IN CLIENT.TS\n")
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

  async prepareBorrowTransactions(symbol: string, amount: number, address: string = undefined) {
    console.log("PREPARE BORROW TRANSACTIONS IN CLIENT.TS\n")
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

  async prepareBurnTransactions(symbol: string, amount: number, address: string = undefined) {
    console.log("PREPARE BURN TRANSACTIONS IN CLIENT.TS\n")
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

  async prepareClaimRewardsTransactions(address: string = undefined) {
    console.log("PREPARE CLAIM REWARDS TRANSACTIONS IN CLIENT.TS\n")
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
    address: string = undefined
  ) {
    console.log("PREPARE LIQUIDATE TRANSACTIONS IN CLIENT.TS\n")
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

  async prepareMintTransactions(symbol: string, amount: number, address: string = undefined) {
    console.log("PREPARE MINT TRANSACTIONS IN CLIENT.TS\n")
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

  async prepareMintToCollateralTransactions(symbol: string, amount: number, address: string = undefined) {
    console.log("PREPARE MINT TO COLLATERAL TRANSACTIONS IN CLIENT.TS\n")
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

  async prepareRemoveCollateralTransactions(symbol: string, amount: number, address: string = undefined) {
    console.log("PREPARE REMOVE COLLATERAL TRANSACTIONS IN CLIENT.TS\n")
    if (!address) {
      address = this.userAddress
    }
    let market = this.getMarket(symbol)
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

  async prepareRemoveCollateralUnderlyingTransactions(symbol: string, amount: number, address: string = undefined) {
    console.log("PREPARE REMOVE COLLATERAL UNDERLYING TRANSACTIONS IN CLIENT.TS\n")
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

  async prepareRepayBorrowTransactions(symbol: string, amount: number, address: string = undefined) {
    console.log("PREPARE REPAY BORROW TRANSACTIONS IN CLIENT.TS\n")
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
    address: string = undefined
  ) {
    console.log("PREPARE STAKING CONTRACT OPT IN TRANSACTIONS IN CLIENT.TS\n")
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

  async prepareStakeTransactions(stakingContractName: string, amount: number, address: string = undefined) {
    console.log("PREPARE STAKE TRANSACTIONS IN CLIENT.TS\n")
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

  async prepareUnstakeTransactions(stakingContractName: string, amount: number, address: string = undefined) {
    console.log("PREPARE UNSTAKE TRANSACTIONS IN CLIENT.TS\n")
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

  async prepareClaimStakingRewardsTransactions(stakingContractName: string, address: string = undefined) {
    console.log("PREPARE CLAIM STAKING REWARDS TRANSACTIONS IN CLIENT.TS\n")
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

  async submit(transactionGroup: Uint8Array, wait: boolean = false) {
    console.log("SUBMIT IN CLIENT.TS\n")
    let txid: string
    try {
      txid = await this.algodClient.sendRawTransaction(transactionGroup).do()
    } catch (e) {
      console.log("Error in submitting")
    }
    if (wait) {
      //not sure about wait rounds (last parameter)
      return waitForConfirmation(this.algodClient, txid, 10)
    }
    return { txid: txid }
  }
}

export async function AlgofiTestnetClient(
  algodClient: Algodv2,
  indexerClient: Indexer = undefined,
  userAddress: string = undefined
) {
  console.log("INSTANTIATING TESTNET CLIENT IN CLIENT.TS\n")
  let historicalIndexerClient = new Indexer("", "https://indexer.testnet.algoexplorerapi.io/", "")
  if (algodClient === undefined) {
    algodClient = new Algodv2(
      "ad4c18357393cb79f6ddef80b1c03ca99266ec99d55dff51b31811143f8b2dff",
      "https://node.chainvault.io/test",
      ""
    )
  }
  if (indexerClient === undefined) {
    indexerClient = new Indexer("", "https://algoindexer.testnet.algoexplorerapi.io/")
  }
  return await Client.init(algodClient, indexerClient, historicalIndexerClient, userAddress, "testnet")
}

export async function AlgofiMainnetClient(
  algodClient: Algodv2,
  indexerClient: Indexer = undefined,
  userAddress: string = undefined
) {
  console.log("INSTANTIATING MAINNET CLIENT IN CLIENT.TS\n")
  let historicalIndexerClient = new Indexer("", "https://indexer.algoexplorerapi.io/", "")
  if (algodClient === undefined) {
    algodClient = new Algodv2("", "https://algoexplorerapi.io")
  }
  if (indexerClient === undefined) {
    indexerClient = new Indexer("", "https://algoindexer.algoexplorerapi.io", 8980, { "User-Agent": "algosdk" })
  }
  return await Client.init(algodClient, indexerClient, historicalIndexerClient, userAddress, "mainnet")
}
