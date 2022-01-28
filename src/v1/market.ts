import { getGlobalState, readLocalState, searchGlobalState, get } from "./utils"
import { Algodv2, Indexer, getApplicationAddress } from "algosdk"
import { PARAMETER_SCALE_FACTOR, SCALE_FACTOR } from "../v0"
import { marketStrings } from "./contractStrings"
import { Asset } from "./asset"

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
  asset: Asset
  historicalIndexer: Indexer

  constructor(algodClient: Algodv2, historicalIndexerClient: Indexer, marketAppId: number) {
    this.algod = algodClient
    this.historicalIndexer = historicalIndexerClient

    this.marketAppId = marketAppId
    //possibly incorrect but I feel like i've tested this before
    this.marketAddress = getApplicationAddress(this.marketAppId)
  }

  static async init(algodClient: Algodv2, historicalIndexerClient: Indexer, marketAppId: number): Promise<Market> {
    let market = new Market(algodClient, historicalIndexerClient, marketAppId)
    // I'm not sure if I was looking at a different file or something but this seems to be the right way to do it
    // await market.initializeMarketState()
    await market.updateGlobalState()
    return market
  }

  async updateGlobalState(): Promise<void> {
    let marketState = await getGlobalState(this.algod, this.marketAppId)

    this.marketCounter = marketState[marketStrings.manager_market_counter_var]

    // market asset info
    this.underlyingAssetId = get(marketState, marketStrings.asset_id, null)
    this.bankAssetId = get(marketState, marketStrings.bank_asset_id, null)

    // market parameters
    this.oracleAppId = get(marketState, marketStrings.oracle_app_id, null)
    this.oraclePriceField = get(marketState, marketStrings.oracle_price_field, null)
    this.oraclePriceScaleFactor = get(marketState, marketStrings.oracle_price_scale_factor, null)
    this.collateralFactor = get(marketState, marketStrings.collateral_factor, null)
    this.liquidationIncentive = get(marketState, marketStrings.liquidation_incentive, null)
    this.reserveFactor = get(marketState, marketStrings.reserve_factor, null)
    this.baseInterestRate = get(marketState, marketStrings.base_interest_rate, null)
    this.slope1 = get(marketState, marketStrings.slope_1, null)
    this.slope2 = get(marketState, marketStrings.slope_2, null)
    this.utilizationOptimal = get(marketState, marketStrings.utilization_optimal, null)
    this.marketSupplyCapInDollars = get(marketState, marketStrings.market_supply_cap_in_dollars, null)
    this.marketBorrowCapInDollars = get(marketState, marketStrings.market_borrow_cap_in_dollars, null)

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
      ? await Asset.init(
          this.algod,
          this.underlyingAssetId,
          this.bankAssetId,
          this.oracleAppId,
          this.oraclePriceField,
          this.oraclePriceScaleFactor
        )
      : null
  }

  getMarketAppId(): number {
    return this.marketAppId
  }

  getMarketAddress(): string {
    return this.marketAddress
  }

  getMarketCounter(): number {
    return this.marketCounter
  }

  getAsset(): Asset {
    return this.asset
  }

  getActiveCollateral(): number {
    return this.activeCollateral
  }

  getBankCirculation(): number {
    return this.bankCirculation
  }

  getBankToUnderlyingExchange(): number {
    return this.bankToUnderlyingExchange
  }

  //need to figure out the js equivalent of historical_indexer.applications
  async getUnderlyingBorrowed(block: number = null): Promise<number> {
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
  getOutstandingBorrowShares(): number {
    return this.outstandingBorrowShares
  }
  async getUnderlyingCash(block = null): Promise<number> {
    if (block) {
      try {
        let data = await this.historicalIndexer.lookupApplications(this.marketAppId).do()
        data = data["application"]["params"]["global-state"]
        return searchGlobalState(data, marketStrings.underlying_cash)
      } catch (e) {
        throw new Error("Issue getting data")
      }
    } else {
      return this.underlyingCash
    }
  }
  async getUnderlyingReserves(block = null): Promise<number> {
    if (block) {
      try {
        let data = await this.historicalIndexer.lookupApplications(this.marketAppId).do()
        data = data["application"]["params"]["global-state"]
        return searchGlobalState(data, marketStrings.underlying_reserves)
      } catch (e) {
        throw new Error("Issue getting data")
      }
    } else {
      return this.underlyingReserves
    }
  }

  async getTotalBorrowInterestRate(block = null): Promise<number> {
    if (block) {
      try {
        let data = await this.historicalIndexer.lookupApplications(this.marketAppId).do()
        data = data["application"]["params"]["global-state"]
        return searchGlobalState(data, marketStrings.total_borrow_interest_rate)
      } catch (e) {
        throw new Error("Issue getting data")
      }
    } else {
      return this.totalBorrowInterestRate
    }
  }
  getCollateralFactor(): number {
    return this.collateralFactor
  }
  getLiquidationIncentive(): number {
    return this.liquidationIncentive
  }

  // User functions
  async getStorageState(storageAddress: string): Promise<{}> {
    let result = {}
    let userState = await readLocalState(this.algod, storageAddress, this.marketAppId)
    // console.log("USER STATE", userState)
    // userState is being returned correctly
    let asset = this.getAsset()
    result["active_collateral_bank"] = get(userState, marketStrings.user_active_collateral, 0)
    result["active_collateral_underlying"] =
      Math.floor((result["active_collateral_bank"] * this.bankToUnderlyingExchange) / SCALE_FACTOR)

    // console.log("RESULT", result)
    // result so far is correct
    result["active_collateral_usd"] = await asset.toUSD(result["active_collateral_underlying"])

    result["active_collateral_max_borrow_usd"] =
      (result["active_collateral_usd"] * this.collateralFactor) / PARAMETER_SCALE_FACTOR
    result["borrow_shares"] = get(userState, marketStrings.user_borrow_shares, 0)
    result["borrow_underlying"] = Math.floor((this.underlyingBorrowed * result["borrow_shares"]) / this.outstandingBorrowShares)

    result["borrow_usd"] = await asset.toUSD(result["borrow_underlying"])

    return result
  }
}
