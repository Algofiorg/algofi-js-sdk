import { Algodv2 } from "algosdk"
import { getGlobalState } from "./utils"

export class Asset {
  algod: Algodv2
  underlyingAssetId: number
  bankAssetId: number
  oracleAppId: number
  oraclePriceField: string
  oraclePriceScaleFactor: number
  underlyingAssetInfo: any
  bankAssetInfo: any

  constructor(
    algodClient: Algodv2,
    underlyingAssetId: number,
    bankAssetId: number,
    oracleAppId: number = undefined,
    oraclePriceField: string = undefined,
    oraclePriceScaleFactor: number = undefined
  ) {
    this.algod = algodClient

    // asset info
    this.underlyingAssetId = underlyingAssetId
    this.bankAssetId = bankAssetId

    // oracle info
    if (oracleAppId != undefined) {
      if (oraclePriceField == undefined) {
        throw Error("oracle price field must be specified")
      } else if (oraclePriceScaleFactor == undefined) {
        throw Error("oracle price scale factor must be specified")
      }
    }
    this.oracleAppId = oracleAppId
    this.oraclePriceField = oraclePriceField
    this.oraclePriceScaleFactor = oraclePriceScaleFactor
  }
  static async init(
    algodClient: Algodv2,
    underlyingAssetId: number,
    bankAssetId: number,
    oracleAppId: number = undefined,
    oraclePriceField: string = undefined
  ) {
    console.log("INIT IN ASSET.TS")
    let asset = new Asset(algodClient, underlyingAssetId, bankAssetId, oracleAppId, oraclePriceField)
    asset.underlyingAssetInfo =
      underlyingAssetId != 1 ? (await asset.algod.getAssetByID(underlyingAssetId).do())["params"] : { decimals: 6 }
    asset.bankAssetId = bankAssetId
    asset.bankAssetInfo = (await asset.algod.getAssetByID(bankAssetId).do())["params"]
    return asset
  }

  getUnderlyingAssetId() {
    return this.underlyingAssetId
  }

  getUnderlyingAssetInfo() {
    return this.underlyingAssetInfo
  }

  getBankAssetId() {
    return this.bankAssetId
  }

  getBankAssetInfo() {
    return this.bankAssetInfo
  }

  getOracleAppId() {
    return this.oracleAppId
  }

  getOraclePriceField() {
    return this.oraclePriceField
  }

  getOraclePriceScaleFactor() {
    return this.oraclePriceScaleFactor
  }

  async getRawPrice() {
    if (this.oracleAppId == undefined) {
      throw Error("no oracle app id for asset")
    }
    return (await getGlobalState(this.algod, this.oracleAppId))[this.oraclePriceField]
  }

  getUnderlyingDecimals() {
    return this.underlyingAssetInfo["decimals"]
  }

  async getPrice() {
    if (this.oracleAppId == undefined) {
      throw Error("no oracle app id for asset")
    }
    const raw_price = await this.getRawPrice()
    return (raw_price * 10 ** this.getUnderlyingDecimals()) / (this.getOraclePriceScaleFactor() * 1e3)
  }

  async toUSD(amount: number) {
    const price = await this.getPrice()
    return (amount * price) / 10 ** this.getUnderlyingDecimals()
  }
}
