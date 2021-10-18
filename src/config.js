export const orderedAssets = ["ALGO", "USDC", "YLDY", "BANK", "WETH", "WBTC"]
export const managerAppId = 38718695
export const assetDictionary = {
  ALGO: {
    underlyingAssetId: 1,
    decimals: 6,
    oracleAppId: 38718644,
    marketAppId: 38718718,
    marketAddress: "SKEKBGTEMVBKEFENYT4OX3URRW5HVNGNMM6HMVGMDIVOUK2HQU53EQQTCQ",
    bankAssetId: 38718858
  },
  USDC: {
    underlyingAssetId: 38718614,
    decimals: 6,
    oracleAppId: 38718645,
    marketAppId: 38718720,
    marketAddress: "7VRGT4WDRVULSHB6HIGISYL4REDQKHOAQB6463K5NN53GOFDX3NRFXCIG4",
    bankAssetId: 38718859
  },
  YLDY: {
    underlyingAssetId: 38718615,
    decimals: 6,
    oracleAppId: 38718646,
    marketAppId: 38718723,
    marketAddress: "OYM6CZGA3QKAJYYB7ELN7JAV4FULOAJ4TJ32W7MX5DSE67KYX52SOON63Q",
    bankAssetId: 38718860
  },
  BANK: {
    underlyingAssetId: 38718616,
    decimals: 6,
    oracleAppId: 38718647,
    marketAppId: 38718725,
    marketAddress: "XZ7LTG3WYWI26O6GGOK3VNBFGP3N3GO4I2KDAZUCBUBWITMCDLFF45JC64",
    bankAssetId: 38718861
  },
  WETH: {
    underlyingAssetId: 38718617,
    decimals: 6,
    oracleAppId: 38718648,
    marketAppId: 38718727,
    marketAddress: "6SUPX4KNBQHUZXAAPPRC55WTBZC5EZJUZHFTRYLCVF6H3337EEDJNT7T5Y",
    bankAssetId: 38718862
  },
  WBTC: {
    underlyingAssetId: 38718618,
    decimals: 6,
    oracleAppId: 38718649,
    marketAppId: 38718729,
    marketAddress: "E5IW6CBYCP3AUN6XHY3KDVNYYUEYOU6QFZYHPSOIYRVPC4WCU5E347MJPI",
    bankAssetId: 38718863
  }
}
export const SECONDS_PER_YEAR = 60 * 60 * 24 * 365
export const RESERVE_RATIO = 0.05
export const SCALE_FACTOR = 1e9
export const CREATOR_ADDRESS = "36R4DNOR4DRD3QHK5SD7I2HV6TLTXTHYDZ54NRSEI6AF67APGQBBUGF3FY"

let orderedOracleAppIds = []
let orderedMarketAppIds = []
for (const assetName of orderedAssets) {
  orderedOracleAppIds.push(assetDictionary[assetName]["oracleAppId"])
  orderedMarketAppIds.push(assetDictionary[assetName]["marketAppId"])
}
export { orderedOracleAppIds, orderedMarketAppIds }
