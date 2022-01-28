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
    let asset = new Asset(
      algodClient,
      underlyingAssetId,
      bankAssetId,
      oracleAppId,
      oraclePriceField,
      oraclePriceScaleFactor
    )
    asset.underlyingAssetInfo =
    underlyingAssetId != 1 ? (await asset.algod.getAssetByID(underlyingAssetId).do())["params"] : { "decimals": 6 }
    asset.bankAssetInfo = (await asset.algod.getAssetByID(bankAssetId).do())["params"]
    return asset
  }

  getUnderlyingAssetId(): number {
    return this.underlyingAssetId
  }

  getUnderlyingAssetInfo(): {} {
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
    // console.log("THIS.ORACLE PRICE FIELD", this.oraclePriceField)
    // console.log(await getGlobalState(this.algod, this.oracleAppId))
    // getGlobalState seems to be woroking correctly
    // for some reason this.oraclePriceField is in base64 still
    return (await getGlobalState(this.algod, this.oracleAppId))[Buffer.from(this.oraclePriceField, "base64").toString()]
  }

  getUnderlyingDecimals(): number {
    return this.underlyingAssetInfo["decimals"]
  }

  async getPrice(): Promise<number> {
    // oracleAppId is being returned correctly
    if (this.oracleAppId == null) {
      throw Error("no oracle app id for asset")
    }
    const raw_price = await this.getRawPrice()
    // console.log("RAW PRICE", raw_price)
    // console.log("UNDERLYING DECIMALS", this.getUnderlyingDecimals()) 
    // console.log("ORACLE PRICE SCALE FACTOR", this.getOraclePriceScaleFactor())
    // both underlying deicmals and oracle price scale factor return things that seeem correct
    return (raw_price * 10 ** this.getUnderlyingDecimals()) / (this.getOraclePriceScaleFactor() * 1e3)
  }

  async toUSD(amount: number): Promise<number> {
    //price is incorrect, amount is passed in correctly
    const price = await this.getPrice()
    return (amount * price) / 10 ** this.getUnderlyingDecimals()
  }
}
