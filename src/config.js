export const orderedAssets = ["ALGO", "USDC", "YLDY", "BANK", "WETH", "WBTC"]
export const managerAppId = 37073714
export const assetDictionary = {
  ALGO: {
    underlyingAssetId: 1,
    decimals: 6,
    oracleAppId: 37073659,
    marketAppId: 37073753,
    marketAddress: "Q77ZVOZN7OSYWNQ3QN6KHKRW2MSMZVXMTPZLUPSRP6BRP4YMGBCPKBLNLM",
    bankAssetId: 37074015
  },
  USDC: {
    underlyingAssetId: 37073601,
    decimals: 6,
    oracleAppId: 37073660,
    marketAppId: 37073756,
    marketAddress: "H53ZK4PYSXOIUMZXWA2MEYQTBDUNJ7DFAK77QH72R3ATFBIP32ZHH5JJQU",
    bankAssetId: 37074016
  },
  YLDY: {
    underlyingAssetId: 37073602,
    decimals: 6,
    oracleAppId: 37073661,
    marketAppId: 37073759,
    marketAddress: "GRD2UOF35B3MC2GZ7LTMA2RVQVGCWOOJNF7HHWYIGARXNAKTVDSB7EUW5I",
    bankAssetId: 37074017
  },
  BANK: {
    underlyingAssetId: 37073603,
    decimals: 6,
    oracleAppId: 37073662,
    marketAppId: 37073769,
    marketAddress: "AYU5ESYEO2IE2POMS64J5YX7XSJZDPQQRUUXFMADWQPELVNPXG3LEL3OIY",
    bankAssetId: 37074018
  },
  WETH: {
    underlyingAssetId: 37073604,
    decimals: 6,
    oracleAppId: 37073663,
    marketAppId: 37073771,
    marketAddress: "52GHS3LH6HADAWMPDQM673CTFQYU5DOMKCTJG7X57VXEWILQRANNRS42CQ",
    bankAssetId: 37074019
  },
  WBTC: {
    underlyingAssetId: 37073605,
    decimals: 6,
    oracleAppId: 37073665,
    marketAppId: 37073773,
    marketAddress: "H4WFAPE2MM6DLM7PEMXXYKNOC2XWJLMCTRLEQSM55Z2JW24Q7CB6YGE6MU",
    bankAssetId: 37074020
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
