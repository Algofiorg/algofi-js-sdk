import algosdk, { Algodv2, Indexer } from "algosdk"
import { Asset } from "./asset"
import { getGlobalState, readLocalState, searchGlobalState } from "./utils"
import { marketStrings } from "./contractStrings"
import { getStorageAddress, PARAMETER_SCALE_FACTOR, SCALE_FACTOR } from "../v0"

function get(object: any, key:any, default_value:any) {
  var result = object[key];
  return (typeof result !== "undefined") ? result : default_value;
}

export class Market {
  algodClient: Algodv2
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
  historicalIndexer : Indexer

  constructor(algodClient: Algodv2, historicalIndexerClient: Indexer, marketAppId: number) {
    const asyncReturn: any = async () => {
      this.algodClient = algodClient

      this.marketAppId = marketAppId
      this.marketAddress = algosdk.getApplicationAddress(this.marketAppId)

      const marketState = await getGlobalState(this.algodClient, this.marketAppId)

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
      this.historicalIndexer = historicalIndexerClient

      this.asset = this.underlyingAssetId
        ? new Asset(
            this.algodClient,
            this.underlyingAssetId,
            this.bankAssetId,
            this.oracleAppId,
            this.oraclePriceField,
            this.oraclePriceScaleFactor
          )
        : null
      return this
    }
    return asyncReturn()
  }

  getMarketAppId = () => {
    return this.marketAppId
  }

  getMarketAddress = () => {
    return this.marketAddress
  }

  getMarketCounter = () => {
    return this.marketCounter
  }

  getAsset = () => {
    return this.asset
  }

  getActiveCollateral = () => {
    return this.activeCollateral
  }

  getBankCirculation = () => {
    return this.bankCirculation
  }

  getBankToUnderlyingExchange = () => {
    return this.bankToUnderlyingExchange
  }

  getUnderlyingBorrowed = async () => {
    try {
      let data = await this.algodClient.getApplicationByID(this.marketAppId).do()
      console.log("raw data =", data)
      data = data["params"]["global-state"]
      console.log("data =", data)
      return searchGlobalState(data, marketStrings.underlying_borrowed)
    } catch (err) {
      throw Error("Issue getting data")
    }
  }
  getOutstandingBorrowShares = () => {
    return this.outstandingBorrowShares
  }
  getUnderlyingCash = (block = undefined) => {
    // figure out what application call to make here
    if (block) {
      try {
        let data;
      }
      catch (error) {
        throw error
      }
    }
  }
  getUnderlyingReserves = (block = undefined) => {
    // still need to figure out what historical_indexer.applications translates to in js
    if (block) {
      try{
        let data;
      }
      catch (error) {
        throw error
      }
    }
  }
  getTotalBorrowInterestRate = () => {
    // same thing as above
    return
  }
  getCollateralFactor = () => {
    return this.collateralFactor;
  }
  getLiquidationIncentive = () => {
    return this.liquidationIncentive;
  }
  getStorageState = (storageAddress : string) => {
    let result = {};
    let userState = readLocalState(this.algodClient, storageAddress, this.marketAppId);
    let asset = this.getAsset()
    result["active_collateral_bank"] = get(userState, marketStrings.user_active_collateral, 0);
    result["active_collateral_underlying"] = Number(result["active_collateral_bank"] * this.bankToUnderlyingExchange / SCALE_FACTOR);
    result["active_collateral_usd"] = asset.toUSD(result["active_collateral_underlying"]);
    result["active_collateral_max_borrow_usd"] = result["active_collateral_usd"] * this.collateralFactor / PARAMETER_SCALE_FACTOR;
    result["borrow_shares"] = get(userState, marketStrings.user_borrow_shares, 0);
    result["borrow_underlying"] = Number(this.underlyingBorrowed * result["borrow_shares"] / this.outstandingBorrowShares);
    result["borrow_usd"] = asset.toUSD(result["borrow_underlying"]);

    return result;
  }
}
