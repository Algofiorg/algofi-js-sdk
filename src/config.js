export const orderedAssets = ["ALGO", "USDC", "YLDY", "BANK", "WETH", "WBTC"]
export const managerAppId = 37723374
export const assetDictionary = {
  ALGO: {
    underlyingAssetId: 1,
    decimals: 6,
    oracleAppId: 37723291,
    marketAppId: 37723403,
    marketAddress: "TFAOXPGAR4Y6BMT2JR6PYD6QJMLUIQCOHK4JATEEPPDRVKIO523P26POVQ",
    bankAssetId: 37723825
  },
  USDC: {
    underlyingAssetId: 37723192,
    decimals: 6,
    oracleAppId: 37723292,
    marketAppId: 37723406,
    marketAddress: "6CA6CGMBUDPTXANWEWUP5A2GC75NDDAB7XVEOF4KAY6SYKDB7ZWEACEO24",
    bankAssetId: 37723826
  },
  YLDY: {
    underlyingAssetId: 37723193,
    decimals: 6,
    oracleAppId: 37723293,
    marketAppId: 37723412,
    marketAddress: "N2LJ4O4FC5WRMIWEBJP6TEPOZHXDSTTCAHO5Y2FGP6QN7LOXMMO3L7CWXQ",
    bankAssetId: 37723827
  },
  BANK: {
    underlyingAssetId: 37723194,
    decimals: 6,
    oracleAppId: 37723294,
    marketAppId: 37723422,
    marketAddress: "DZEDBTCFNOESFXQTTPY4WGU3ZTKVT5QORRN6MDMBFPX7VMIJUGIXB5QI4A",
    bankAssetId: 37723828
  },
  WETH: {
    underlyingAssetId: 37723195,
    decimals: 6,
    oracleAppId: 37723295,
    marketAppId: 37723432,
    marketAddress: "L4R3L2P5S65SWI4FLDG47O7CFEMSWXODJNXU3W36HAUXLCR6GPHPVOM5CE",
    bankAssetId: 37723829
  },
  WBTC: {
    underlyingAssetId: 37723196,
    decimals: 6,
    oracleAppId: 37723296,
    marketAppId: 37723442,
    marketAddress: "RZLVPK4H2U4P5UUKAWSDOVRNKOVEDHQHW3SR5BSDDVLNCI47OH3DYRLBRU",
    bankAssetId: 37723830
  }
}
export const SECONDS_PER_YEAR = 60 * 60 * 24 * 365
export const RESERVE_RATIO = 0.05
export const SCALE_FACTOR = 1e9
export const CREATOR_ADDRESS = "XK3NSDANA6S3Q7GFPITUMTC5GUWT5NX5VQL34MR3X2NYDBSOTEFOVOE3YE"

let orderedOracleAppIds = []
let orderedMarketAppIds = []
for (const assetName of orderedAssets) {
  orderedOracleAppIds.push(assetDictionary[assetName]["oracleAppId"])
  orderedMarketAppIds.push(assetDictionary[assetName]["marketAppId"])
}
export { orderedOracleAppIds, orderedMarketAppIds }
