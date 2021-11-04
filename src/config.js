export const orderedAssets = ["ALGO", "USDC", "YLDY", "WBTC", "WETH", "BANK", "WSOL"]
export const orderedAssetsAndPlaceholders = ["ALGO", "USDC", "YLDY", "WBTC", "WETH", "BANK", "WSOL"]
export const managerAppId = 42506995
export const assetDictionary = {
  ALGO: {
    total: 1e16,
    decimals: 6,
    underlyingAssetId: 1,
    oracleAppId: 42506198,
    oracleFieldName: "price",
    marketCounter: 1,
    marketAppId: 42506234,
    marketAddress: "WYH5OUK54CYCCXCQ3LK64LZZYCYIC6V7SZJLTHG3273GXF33E5PKKTZINU",
    bankAssetId: 42507193
  },
  USDC: {
    total: 1e16,
    decimals: 6,
    underlyingAssetId: 42506117,
    oracleAppId: 42506199,
    oracleFieldName: "price",
    marketCounter: 2,
    marketAppId: 42506236,
    marketAddress: "IQKTUQGNFXL4LJTD6WTRW2LRMJ5KXA52VOMTHM2H5LQOMJA7DCS47AGDYM",
    bankAssetId: 42507194
  },
  YLDY: {
    total: 1e16,
    decimals: 6,
    underlyingAssetId: 42506118,
    oracleAppId: 42506200,
    oracleFieldName: "price",
    marketCounter: 3,
    marketAppId: 42506249,
    marketAddress: "SQ3PTCGCNXQ5I57LEVFSMUCVJ7NS47RYDCMKDI5IFHE64HUU7HZFA5RDIQ",
    bankAssetId: 42507195
  },
  WBTC: {
    total: 1e16,
    decimals: 6,
    underlyingAssetId: 42506119,
    oracleAppId: 42506201,
    oracleFieldName: "price",
    marketCounter: 4,
    marketAppId: 42506251,
    marketAddress: "2LO24Y4F2G77DRUVXFOJ7F56C5R2DYYRWQCNVWJDFLX7EG76ORUECRJXFY",
    bankAssetId: 42507196
  },
  WETH: {
    total: 1e16,
    decimals: 6,
    underlyingAssetId: 42506120,
    oracleAppId: 42506202,
    oracleFieldName: "price",
    marketCounter: 5,
    marketAppId: 42506253,
    marketAddress: "7Q7P67WXUO3T3DEKWQMBFQIUWKKKMBDPC4SVNUJ66NBIR5LV6ASROFPN7E",
    bankAssetId: 42507197
  },
  BANK: {
    total: 1000000000000000.0,
    decimals: 6,
    underlyingAssetId: 42506121,
    oracleAppId: 42506203,
    oracleFieldName: "price",
    marketCounter: 6,
    marketAppId: 42506255,
    marketAddress: "LWLJX4CY3TFZVM6HVX3WAQQT4EIFDGFVW32GJPDY6CQPMPUN55UWJWK6EU",
    bankAssetId: 42507198
  },
  WSOL: {
    total: 1e16,
    decimals: 6,
    underlyingAssetId: 42506122,
    oracleAppId: 42506204,
    oracleFieldName: "price",
    marketCounter: 7,
    marketAppId: 42506258,
    marketAddress: "IZGH7EQDKXIPKVUP7DNAMVPMS2UBXG4QVHE5UJ7X4ITBHEXEQ3465YM2CU",
    marketAppId: 42506258,
    bankAssetId: 42507199
  }
}
export const SECONDS_PER_YEAR = 60 * 60 * 24 * 365
export const SCALE_FACTOR = 1e9
export const PARAMETER_SCALE_FACTOR = 1e3

let orderedOracleAppIds = []
let orderedMarketAppIds = []
let orderedSupportedMarketAppIds = []
let marketCounterToAssetName = {}
let assetIdToAssetName = {}
for (const assetName of orderedAssets) {
  console.log("assetName=", assetName)
  orderedOracleAppIds.push(assetDictionary[assetName]["oracleAppId"])
  orderedSupportedMarketAppIds.push(assetDictionary[assetName]["marketAppId"])
  marketCounterToAssetName[assetDictionary[assetName]["marketCounter"]] = assetName
  assetIdToAssetName[assetDictionary[assetName]["underlyingAssetId"]] = assetName
  assetIdToAssetName[assetDictionary[assetName]["bankAssetId"]] = "b" + assetName
}
for (const assetName of orderedAssetsAndPlaceholders) {
  orderedMarketAppIds.push(assetDictionary[assetName]["marketAppId"])
}
export { orderedOracleAppIds, orderedMarketAppIds, orderedSupportedMarketAppIds, marketCounterToAssetName, assetIdToAssetName }
