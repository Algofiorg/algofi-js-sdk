import algosdk, { Algodv2 } from "algosdk"
import { Asset } from "./asset"
import { getGlobalState, searchGlobalState } from "./utils"
import { marketStrings } from "./contractStrings"

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

  constructor(algodClient, marketAppId) {
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
    return
  }
  getUnderlyingCash = () => {
    return
  }
  getUnderlyingReserves = () => {
    return
  }
  getTotalBorrowInterestRate = () => {
    return
  }
  getCollateralFactor = () => {
    return
  }
  getLiquidationIncentive = () => {
    return
  }
  getStorageState = (address : string) => {
    return
  }
}
