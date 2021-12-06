
export const orderedAssets = ["ALGO", "USDC", "YLDY", "WBTC", "WETH", "BANK", "STBL"]
export const orderedAssetsAndPlaceholders = ["ALGO", "USDC", "YLDY", "WBTC", "WETH", "BANK", "STBL", "EGHT", "NINE", "TENN", "ELVN" ,"TWLV", "TRTN", "FRTN", "FVTN" , "SXTN"]

export const managerAppId = 43995308
export const assetDictionary = {
  ALGO: {
    total: 1e16,
    decimals: 6,
    underlyingAssetId: 1,
    oracleAppId: 43994992,
    oracleFieldName: "price",
    marketCounter: 1,
    marketAppId: 43995020,
    marketAddress: "QPVAYGJV7CZYOEYUGC3JGK4QDBVIZFRFQY6NKRIY54ZHRVHWE2UTYXNOEI",
    bankAssetId: 43995449
  },
  USDC: {
    total: 1e16,
    decimals: 6,
    underlyingAssetId: 43994922,
    oracleAppId: 43994994,
    oracleFieldName: "price",
    marketCounter: 2,
    marketAppId: 43995023,
    marketAddress: "KX2K46V6RR3AGVGOISGEOYYYEVAILA2UA4AQ777WIGAMLCUTG7RGRDI6QY",
    bankAssetId: 43995450
  },
  YLDY: {
    total: 1e16,
    decimals: 6,
    underlyingAssetId: 43994923,
    oracleAppId: 43994995,
    oracleFieldName: "price",
    marketCounter: 3,
    marketAppId: 43995025,
    marketAddress: "WSG2MT62OYZSK32QOG4FYPVY6O5GB32PTNOTPG6CI6CPOYDZZFJV5JTEXU",
    bankAssetId: 43995451
  },
  WBTC: {
    total: 1e16,
    decimals: 6,
    underlyingAssetId: 43994924,
    oracleAppId: 43994996,
    oracleFieldName: "price",
    marketCounter: 4,
    marketAppId: 43995027,
    marketAddress: "BLKVVEHNYQHFWJG67GYJJLHBUFELWNOPRR7TL6T5V2AW4BVJ2B4PDPKNBY",
    bankAssetId: 43995452
  },
  WETH: {
    total: 1e16,
    decimals: 6,
    underlyingAssetId: 43994925,
    oracleAppId: 43994997,
    oracleFieldName: "price",
    marketCounter: 5,
    marketAppId: 43995039,
    marketAddress: "EUNF25JEZYMEJNYFYGMRXIS76JXNQNK6YBAKTLLGRQ5XHRGFQTHYLX7RUU",
    bankAssetId: 43995453
  },
  BANK: {
    total: 1000000000000000.0,
    decimals: 6,
    underlyingAssetId: 43994926,
    oracleAppId: 43994998,
    oracleFieldName: "price",
    marketCounter: 6,
    marketAppId: 43995041,
    marketAddress: "BKN7NYZKJM2ZVLSJ5C5H376BSFRYZYBDSXO3R54TKIKFIUP6WPGKCZOFYA",
    bankAssetId: 43995454
  },
  STBL: {
    total: 1e16,
    decimals: 6,
    underlyingAssetId: 43994928,
    oracleAppId: 43995000,
    oracleFieldName: "price",
    marketCounter: 7,
    marketAppId: 43995043,
    marketAddress: "CC7WN6NUDP6FHA7MUKE43BFPLBZMM2D3HKY67FDKYQZIW2QN74EVIQYVZA",
    bankAssetId: 43995455
  },
  EGHT : {'underlyingAssetId': 43994929, 'decimals': 6, 'marketCounter': 8, 'marketAppId': 43995045, 'marketAddress': '5LJU6LWOKY3FZPFZZPKB3AQJBL3G6FN2BSHNR23KMPLNF64N7ZY6YKDTCI'}, 
  NINE: {'underlyingAssetId': 43994930, 'decimals': 6, 'marketCounter': 9, 'marketAppId': 43995048, 'marketAddress': '75PB65WB2NG73JXZCYAK3RCV2WJMSM5HWL7Q7IB5PEQGDJ27ZWSCRY2MFE'}, 
  TENN: {'underlyingAssetId': 43994931, 'decimals': 6, 'marketCounter': 10, 'marketAppId': 43995050, 'marketAddress': 'GDX2PLWQBYJAQN22FLU3SYBFAHKW6C3CNBDF43MLB2BSLL4ANWEJ2E5ERA'}, 
  ELVN: {'underlyingAssetId': 43994932, 'decimals': 6, 'marketCounter': 11, 'marketAppId': 43995053, 'marketAddress': '4XQSSADYXWNADDLEMX4MJIDKY5V4F3RXXP3SE667YAZQCRC2OXVB6DRW3E'}, 
  TWLV: {'underlyingAssetId': 43994933, 'decimals': 6, 'marketCounter': 12, 'marketAppId': 43995055, 'marketAddress': 'GFWQWKFZHURXY66QVLOY72HYBCK34QOS3J5EVP3LOOES5ZRI376AKEJVXY'}, 
  TRTN: {'underlyingAssetId': 43994934, 'decimals': 6, 'marketCounter': 13, 'marketAppId': 43995057, 'marketAddress': 'WJ57WYIX7FWY7TTFX6FMWAL4YUHPH26LH227SSJMMJPIWBGD5O6ZH3GPLI'}, 
  FRTN: {'underlyingAssetId': 43994935, 'decimals': 6, 'marketCounter': 14, 'marketAppId': 43995059, 'marketAddress': 'OXDFKZ34YG56DITQ42WHNT3BGVAJKWNCAQ76LNYTSCRKRDAF2JK7WYQYQM'}, 
  FVTN: {'underlyingAssetId': 43994936, 'decimals': 6, 'marketCounter': 15, 'marketAppId': 43995062, 'marketAddress': 'BNOWFU3ZMI6SC5KUGOIESQIVMGPDYE26IDC3CRZDWG5R6HF4LCTNKGYMAA'}, 
  SXTN: {'underlyingAssetId': 43994937, 'decimals': 6, 'marketCounter': 16, 'marketAppId': 43995064, 'marketAddress': 'Q5ZLTN55MBX662S3Y435UXMZCBGC6OJKRNYPYGEPMKMKYGXCQ55GXC4MNY'}
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
