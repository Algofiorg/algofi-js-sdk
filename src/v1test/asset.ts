import { Algodv2 } from "algosdk"
import { getGlobalState } from "./utils"

export class Asset {
  algodClient: Algodv2
  underlyingAssetId: number
  underlyingAssetInfo: any
  bankAssetId: number
  bankAssetInfo: any
  oracleAppId: number
  oraclePriceField: string
  oraclePriceScaleFactor: number

  constructor(
    algodClient,
    underlyingAssetId,
    bankAssetId,
    oracleAppId = null,
    oraclePriceField = null,
    oraclePriceScaleFactor = null
  ) {
    const asyncReturn: any = async () => {
      this.algodClient = algodClient

      // asset info
      this.underlyingAssetId = underlyingAssetId
      this.underlyingAssetInfo =
        underlyingAssetId != 1
          ? (await this.algodClient.getAssetByID(underlyingAssetId).do())["params"]
          : { decimals: 6 }
      this.bankAssetId = bankAssetId
      this.bankAssetInfo = (await this.algodClient.getAssetByID(bankAssetId).do())["params"]

      // oracle info
      if (oracleAppId != null) {
        if (oraclePriceField == null) {
          throw Error("oracle price field must be specified")
        } else if (oraclePriceScaleFactor == null) {
          throw Error("oracle price scale factor must be specified")
        }
      }
      this.oracleAppId = oracleAppId
      this.oraclePriceField = oraclePriceField
      this.oraclePriceScaleFactor = oraclePriceScaleFactor
      return this
    }
    return asyncReturn()
  }

  getUnderlyingAssetId = () => {
    return this.underlyingAssetId
  }

  getUnderlyingAssetInfo = () => {
    return this.underlyingAssetInfo
  }

  getBankAssetId = () => {
    return this.bankAssetId
  }

  getBankAssetInfo = () => {
    return this.bankAssetInfo
  }

  getOracleAppId = () => {
    return this.oracleAppId
  }

  getOraclePriceField = () => {
    return this.oraclePriceField
  }

  getOraclePriceScaleFactor = () => {
    return this.oraclePriceScaleFactor
  }

  getRawPrice = async () => {
    if (this.oracleAppId == null) {
      throw Error("no oracle app id for asset")
    }
    const stateDict = await getGlobalState(this.algodClient, this.oracleAppId)
    return stateDict[this.oraclePriceField]
  }

  getUnderlyingDecimals = () => {
    return this.underlyingAssetInfo["decimals"]
  }

  getPrice = async () => {
    if (this.oracleAppId == null) {
      throw Error("no oracle app id for asset")
    }
    const raw_price = await this.getRawPrice()
    return (raw_price * 10 ** this.getUnderlyingDecimals()) / (this.getOraclePriceScaleFactor() * 1e3)
  }

  toUSD = async amount => {
    const price = await this.getPrice()
    return (amount * price) / 10 ** this.getUnderlyingDecimals()
  }
}
