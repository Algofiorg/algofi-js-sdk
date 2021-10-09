export const orderedAssets = ["ALGO", "USDC", "YLDY", "BANK"]
export const managerAppId = 32889812
export const assetDictionary = {
  ALGO: {
    underlyingAssetId: 1,
    bankAssetId: 32890503,
    oracleAppId: 32889879,
    marketAppId: 32889863,
    marketAddress: "4ROAHPAWJIPEG3NNFB4GSDGVMNPYVDVS2EJWS73O6UWMX6LNM775DJVQVM",
    decimals: 6,
  },
  USDC: {
    underlyingAssetId: 32889511,
    bankAssetId: 32890504,
    oracleAppId: 32889880,
    marketAppId: 32889864,
    marketAddress: "DVFSJEHT5HN5MP6B7N7ZRRXXUC7OIDRCPGFYINTVGAIBDSCOEB6QTJEGLE",
    decimals: 6,
  },
  YLDY: {
    underlyingAssetId: 32889512,
    bankAssetId: 32890505,
    oracleAppId: 32889889,
    marketAppId: 32889873,
    marketAddress: "EIAKSOYVBXZURECDFFEUJOVXXLNNF4ST6SBABL2DAOZ6S5MHK2VGURMREY",
    decimals: 6,
  },
  BANK: {
    underlyingAssetId: 32889513,
    bankAssetId: 32890506,
    oracleAppId: 32889890,
    marketAppId: 32889878,
    marketAddress: "2UNY2X6NFLX56UU4ZGOLK5FFSXO3BMXRSAI7BBXWZIH3337LG5DSJQAUQU",
    decimals: 6,
  },
}
export const SECONDS_PER_YEAR = 60 * 60 * 24 * 365
export const RESERVE_RATIO = 0.05
export const SCALE_FACTOR = 1e9
export const CREATOR_ADDRESS = "V2XVE3NWTFH5VANFWEVIHNZGFORGGRNLXS6MZ4LMO2CKHWFGVQLTYFL674"

let orderedOracleAppIds = []
let orderedMarketAppIds = []
for (const assetName of orderedAssets) {
  orderedOracleAppIds.push(assetDictionary[assetName]["oracleAppId"])
  orderedMarketAppIds.push(assetDictionary[assetName]["marketAppId"])
}
export { orderedOracleAppIds, orderedMarketAppIds }
