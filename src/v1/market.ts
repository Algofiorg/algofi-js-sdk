import algosdk, { Algodv2, Indexer } from "algosdk"
import { Asset } from "./asset"
import { getGlobalState, readLocalState, searchGlobalState } from "./utils"
import { marketStrings } from "./contractStrings"
import { getStorageAddress, PARAMETER_SCALE_FACTOR, SCALE_FACTOR } from "../v0"
import { get } from "./utils"

export class Market {
  algod: Algodv2
  marketAppId: number
  marketAddress: string
  marketCounter: number
  underlyingAssetId: number
  bankAssetId: number
  oracleAppId: number
  oraclePriceField: string
  oraclePriceScaleFactor: number
  collateralFactor: number
  liquidationIncentive: number
  reserveFactor: number
  baseInterestRate: number
  slope1: number
  slope2: number
  utilizationOptimal: number
  marketSupplyCapInDollars: number
  marketBorrowCapInDollars: number
  activeCollateral: number
  bankCirculation: number
  bankToUnderlyingExchange: number
  underlyingBorrowed: number
  outstandingBorrowShares: number
  underlyingCash: number
  underlyingReserves: number
  totalBorrowInterestRate: number
  asset: any
  historicalIndexer: Indexer

  constructor(algodClient: Algodv2, historicalIndexerClient: Indexer, marketAppId: number) {
    console.log("CONSTRUCTOR IN MARKET.TS\n")
    this.algod = algodClient

    this.marketAppId = marketAppId
    this.marketAddress = algosdk.getApplicationAddress(this.marketAppId)

    this.historicalIndexer = historicalIndexerClient

    this.asset = this.underlyingAssetId
      ? new Asset(
          this.algod,
          this.underlyingAssetId,
          this.bankAssetId,
          this.oracleAppId,
          this.oraclePriceField,
          this.oraclePriceScaleFactor
        )
      : null
  }

  static async init(algodClient: Algodv2, historicalIndexerClient: Indexer, marketAppId: number) {
    console.log("INIT IN MARKET.TS\n")
    let market = new Market(algodClient, historicalIndexerClient, marketAppId)
    await market.initializeMarketState()
    return market
  }

  async initializeMarketState() {
    console.log("INITIALIZE MARKET STATE IN MARKET.TS\n")
    const marketState = await getGlobalState(this.algod, this.marketAppId)
    this.marketCounter = marketState[marketStrings.manager_market_counter_var]

    this.underlyingAssetId = marketState[marketStrings.asset_id]
    this.bankAssetId = marketState[marketStrings.bank_asset_id]

    this.oracleAppId = marketState[marketStrings.oracle_app_id]
    this.oraclePriceField = marketState[marketStrings.oracle_price_field]
    this.oraclePriceScaleFactor = marketState[marketStrings.oracle_price_scale_factor]
    this.collateralFactor = marketState[marketStrings.collateral_factor]
    this.liquidationIncentive = marketState[marketStrings.liquidation_incentive]
    this.reserveFactor = marketState[marketStrings.reserve_factor]
    this.baseInterestRate = marketState[marketStrings.base_interest_rate]
    this.slope1 = marketState[marketStrings.slope_1]
    this.slope2 = marketState[marketStrings.slope_2]
    this.utilizationOptimal = marketState[marketStrings.utilization_optimal]
    this.marketSupplyCapInDollars = marketState[marketStrings.market_supply_cap_in_dollars]
    this.marketBorrowCapInDollars = marketState[marketStrings.market_borrow_cap_in_dollars]

    this.activeCollateral = marketState[marketStrings.active_collateral]
    this.bankCirculation = marketState[marketStrings.bank_circulation]
    this.bankToUnderlyingExchange = marketState[marketStrings.bank_to_underlying_exchange]
    this.underlyingBorrowed = marketState[marketStrings.underlying_borrowed]
    this.outstandingBorrowShares = marketState[marketStrings.outstanding_borrow_shares]
    this.underlyingCash = marketState[marketStrings.underlying_cash]
    this.underlyingReserves = marketState[marketStrings.underlying_reserves]
    this.totalBorrowInterestRate = marketState[marketStrings.total_borrow_interest_rate]
  }

  async updateGlobalState() {
    console.log("UPDATE GLOBAL STATE IN MARKET.TS\n")
    let marketState = await getGlobalState(this.algod, this.marketAppId)

    this.marketCounter = marketState[marketStrings.manager_market_counter_var]

    // market asset info
    this.underlyingAssetId = get(marketState, marketStrings.asset_id, undefined)
    this.bankAssetId = get(marketState, marketStrings.bank_asset_id, undefined)

    // market parameters
    this.oracleAppId = get(marketState, marketStrings.oracle_app_id, undefined)
    this.oraclePriceField = get(marketState, marketStrings.oracle_price_field, undefined)
    this.oraclePriceScaleFactor = get(marketState, marketStrings.oracle_price_scale_factor, undefined)
    this.collateralFactor = get(marketState, marketStrings.collateral_factor, undefined)
    this.liquidationIncentive = get(marketState, marketStrings.liquidation_incentive, undefined)
    this.reserveFactor = get(marketState, marketStrings.reserve_factor, undefined)
    this.baseInterestRate = get(marketState, marketStrings.base_interest_rate, undefined)
    this.slope1 = get(marketState, marketStrings.slope_1, undefined)
    this.slope2 = get(marketState, marketStrings.slope_2, undefined)
    this.utilizationOptimal = get(marketState, marketStrings.utilization_optimal, undefined)
    this.marketSupplyCapInDollars = get(marketState, marketStrings.market_supply_cap_in_dollars, undefined)
    this.marketBorrowCapInDollars = get(marketState, marketStrings.market_borrow_cap_in_dollars, undefined)

    // balance info
    this.activeCollateral = get(marketState, marketStrings.active_collateral, 0)
    this.bankCirculation = get(marketState, marketStrings.bank_circulation, 0)
    this.bankToUnderlyingExchange = get(marketState, marketStrings.bank_to_underlying_exchange, 0)
    this.underlyingBorrowed = get(marketState, marketStrings.underlying_borrowed, 0)
    this.outstandingBorrowShares = get(marketState, marketStrings.outstanding_borrow_shares, 0)
    this.underlyingCash = get(marketState, marketStrings.underlying_cash, 0)
    this.underlyingReserves = get(marketState, marketStrings.underlying_reserves, 0)
    this.totalBorrowInterestRate = get(marketState, marketStrings.total_borrow_interest_rate, 0)

    this.asset = this.underlyingAssetId
      ? new Asset(
          this.algod,
          this.underlyingAssetId,
          this.bankAssetId,
          this.oracleAppId,
          this.oraclePriceField,
          this.oraclePriceScaleFactor
        )
      : undefined
  }

  getMarketAppId() {
    console.log("GET MARKET APP ID IN MARKET.TS\n")
    return this.marketAppId
  }

  getMarketAddress() {
    console.log("GET MARKET ADDRESS IN MARKET.TS\n")
    return this.marketAddress
  }

  getMarketCounter() {
    console.log("GET MARKET COUNTER IN MARKET.TS\n")
    return this.marketCounter
  }

  getAsset() {
    console.log("GET ASSET IN MARKET.TS\n")
    return this.asset
  }

  getActiveCollateral() {
    console.log("GET ACTIVE COLLATERAL IN MARKET.TS\n")
    return this.activeCollateral
  }

  getBankCirculation() {
    console.log("GET BANK CIRCULATION IN MARKET.TS\n")
    return this.bankCirculation
  }

  getBankToUnderlyingExchange() {
    console.log("GET BANK TO UNDERLYING EXCHANGE IN MARKET.TS\n")
    return this.bankToUnderlyingExchange
  }

  //need to figure out the js equivalent of historical_indexer.applications
  async getUnderlyingBorrowed(block: number = undefined) {
    console.log("GET UNDERLYING BORROWED IN MARKET.TS\n")
    if (block) {
      try {
        let data = await this.historicalIndexer.lookupApplications(this.marketAppId).do()
        data = data["application"]["params"]["global-state"]
        return searchGlobalState(data, marketStrings.underlying_borrowed)
      } catch (e) {
        throw new Error("Issue getting data")
      }
    } else {
      return this.underlyingBorrowed
    }
  }
  getOutstandingBorrowShares() {
    console.log("GET OUTSTANDING BORROW SHARES IN MARKET.TS\n")
    return this.outstandingBorrowShares
  }
  getUnderlyingCash(block = undefined) {
    console.log("GET UNDERLYING CASH IN MARKET.TS\n")
    if (block) {
      try {
        let data = this.historicalIndexer.lookupApplications(this.marketAppId)
        data = data["application"]["params"]["global-state"]
        return searchGlobalState(data, marketStrings.underlying_cash)
      } catch (e) {
        throw new Error("Issue getting data")
      }
    } else {
      return this.underlyingCash
    }
  }
  getUnderlyingReserves(block = undefined) {
    console.log("GET UNDERLYING RESERVES IN MARKET.TS\n")
    if (block) {
      try {
        let data = this.historicalIndexer.lookupApplications(this.marketAppId)
        data = data["application"]["params"]["global-state"]
        return searchGlobalState(data, marketStrings.underlying_reserves)
      } catch (e) {
        throw new Error("Issue getting data")
      }
    } else {
      return this.underlyingReserves
    }
  }

  getTotalBorrowInterestRate(block = undefined) {
    console.log("GET TOTAL BORROW INTEREST RATE IN MARKET.TS\n")
    if (block) {
      try {
        let data = this.historicalIndexer.lookupApplications(this.marketAppId)
        data = data["application"]["params"]["global-state"]
        return searchGlobalState(data, marketStrings.total_borrow_interest_rate)
      } catch (e) {
        throw new Error("Issue getting data")
      }
    } else {
      return this.totalBorrowInterestRate
    }
  }
  getCollateralFactor() {
    console.log("GET COLLATERAL FACDTOR IN MARKET.TS\n")
    return this.collateralFactor
  }
  getLiquidationIncentive() {
    console.log("GET LIQUIDATION INCENTIVE IN MARKET.TS\n")
    return this.liquidationIncentive
  }
  getStorageState(storageAddress: string) {
    console.log("GET STORAGE STATE IN MARKET.TS\n")
    let result = {}
    let userState = readLocalState(this.algod, storageAddress, this.marketAppId)
    let asset = this.getAsset()
    result["active_collateral_bank"] = get(userState, marketStrings.user_active_collateral, 0)
    result["active_collateral_underlying"] = Number(
      (result["active_collateral_bank"] * this.bankToUnderlyingExchange) / SCALE_FACTOR
    )
    result["active_collateral_usd"] = asset.toUSD(result["active_collateral_underlying"])
    result["active_collateral_max_borrow_usd"] =
      (result["active_collateral_usd"] * this.collateralFactor) / PARAMETER_SCALE_FACTOR
    result["borrow_shares"] = get(userState, marketStrings.user_borrow_shares, 0)
    result["borrow_underlying"] = Number(
      (this.underlyingBorrowed * result["borrow_shares"]) / this.outstandingBorrowShares
    )
    result["borrow_usd"] = asset.toUSD(result["borrow_underlying"])

    return result
  }
}
