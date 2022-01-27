import { getGlobalState } from "./utils"
import { Algodv2 } from "algosdk"

export class Asset {
  algod: Algodv2
  underlyingAssetId: number
  bankAssetId: number
  oracleAppId: number
  oraclePriceField: string
  oraclePriceScaleFactor: number
  underlyingAssetInfo: {}
  bankAssetInfo: {}

  constructor(
    algodClient: Algodv2,
    underlyingAssetId: number,
    bankAssetId: number,
    oracleAppId: number = null,
    oraclePriceField: string = null,
    oraclePriceScaleFactor: number = null
  ) {
    this.algod = algodClient

    // asset info
    this.underlyingAssetId = underlyingAssetId

    //underlying asset id info is initialized later in init
    this.bankAssetId = bankAssetId

    // oracle info
    if (oracleAppId !== null) {
      if (oraclePriceField === null) {
        throw Error("oracle price field must be specified")
      } else if (oraclePriceScaleFactor === null) {
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
    oracleAppId: number = null,
    oraclePriceField: string = null,
    oraclePriceScaleFactor: number = null
  ): Promise<Asset> {
    console.log("INIT IN ASSET.TS")
    let asset = new Asset(
      algodClient,
      underlyingAssetId,
      bankAssetId,
      oracleAppId,
      oraclePriceField,
      oraclePriceScaleFactor
    )
    // it should be {"decimals":6} not {decimals:6}
    asset.underlyingAssetInfo =
      underlyingAssetId != 1 ? (await asset.algod.getAssetByID(underlyingAssetId).do())["params"] : { decimals: 6 }
    asset.bankAssetInfo = (await asset.algod.getAssetByID(bankAssetId).do())["params"]
    return asset
  }

  getUnderlyingAssetId(): number {
    console.log("GET UNDERLYING ASSET ID IN ASSET.TS\n")
    console.log("get underlying asset id in asset.ts finished and returned", this.underlyingAssetId, "\n")
    return this.underlyingAssetId
  }

  getUnderlyingAssetInfo(): {} {
    console.log("GET UNDERLYING ASSET info IN ASSET.TS\n")
    console.log("get underlying asset info in asset.ts finished and returned", this.underlyingAssetInfo, "\n")
    return this.underlyingAssetInfo
  }

  getBankAssetId(): number {
    return this.bankAssetId
  }

  getBankAssetInfo(): {} {
    return this.bankAssetInfo
  }

  getOracleAppId(): number {
    return this.oracleAppId
  }

  getOraclePriceField(): string {
    return this.oraclePriceField
  }

  getOraclePriceScaleFactor(): number {
    return this.oraclePriceScaleFactor
  }

  async getRawPrice(): Promise<number> {
    if (this.oracleAppId === null) {
      throw Error("no oracle app id for asset")
    }
    return (await getGlobalState(this.algod, this.oracleAppId))[this.oraclePriceField]
  }

  getUnderlyingDecimals(): number {
    return this.underlyingAssetInfo["decimals"]
  }

  async getPrice(): Promise<number> {
    if (this.oracleAppId == null) {
      throw Error("no oracle app id for asset")
    }
    const raw_price = await this.getRawPrice()
    return (raw_price * 10 ** this.getUnderlyingDecimals()) / (this.getOraclePriceScaleFactor() * 1e3)
  }

  async toUSD(amount: number): Promise<number> {
    const price = await this.getPrice()
    return (amount * price) / 10 ** this.getUnderlyingDecimals()
  }
}
