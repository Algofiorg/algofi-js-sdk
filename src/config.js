export const orderedAssets = ["ALGO", "USDC", "YLDY", "BANK", "WETH", "WBTC"]
export const managerAppId = 37057174
export const assetDictionary = {
  ALGO: {
    underlyingAssetId: 1,
    oracleAppId: 37057120,
    marketAppId: 37057197,
    marketAddress: "ZDQ2DD2P3TXTIX6WQ3D24KQHAGS7O4CBQEIGRNGW5TBL7LEPTMPURLYKKQ",
    bankAssetId: 37057364
  },
  USDC: {
    underlyingAssetId: 37057080,
    decimals: 6,
    oracleAppId: 37057121,
    marketAppId: 37057199,
    marketAddress: "GCDLWDSCU3N55RZVPVT3LHO6MEORGFTNBPYJX5V4DDP4LKH7HDBFQL7BCI",
    bankAssetId: 37057365
  },
  YLDY: {
    underlyingAssetId: 37057081,
    decimals: 6,
    oracleAppId: 37057122,
    marketAppId: 37057201,
    marketAddress: "ONASVVJJMOF4GHYET2SJH2VJUASAGQMI7UVFRPSIRHBUYFBEX6LKTHJLC4",
    bankAssetId: 37057366
  },
  BANK: {
    underlyingAssetId: 37057082,
    decimals: 6,
    oracleAppId: 37057123,
    marketAppId: 37057203,
    marketAddress: "TRHVCQ4CTCKXAVGLV3CWAS6CVQKOHRZLFGJ7DSJ2TH67KJR555IBZPBPFM",
    bankAssetId: 37057367
  },
  WETH: {
    underlyingAssetId: 37057083,
    decimals: 6,
    oracleAppId: 37057124,
    marketAppId: 37057205,
    marketAddress: "DZIV2FMZXZI72PLP7CKC7GT2HDPWWVTSRCWVWRZUSMKPLRVMPP3CB675H4",
    bankAssetId: 37057368
  },
  WBTC: {
    underlyingAssetId: 37057084,
    decimals: 6,
    oracleAppId: 37057125,
    marketAppId: 37057207,
    marketAddress: "FVLAIXGB7FESWW2HOGLK526AMRYGDHXR4SHKL2PHQUXBDBYFLELYUAX3VA",
    bankAssetId: 37057369
  }
}
export const SECONDS_PER_YEAR = 60 * 60 * 24 * 365
export const RESERVE_RATIO = 0.05
export const SCALE_FACTOR = 1e9
export const CREATOR_ADDRESS = "GT63XMSGCZLIBY6MKEYSBIQPA5YLJUWVOJYC4R7TV5KM4P4VRWPFPV7LGU"

let orderedOracleAppIds = []
let orderedMarketAppIds = []
for (const assetName of orderedAssets) {
  orderedOracleAppIds.push(assetDictionary[assetName]["oracleAppId"])
  orderedMarketAppIds.push(assetDictionary[assetName]["marketAppId"])
}
export { orderedOracleAppIds, orderedMarketAppIds }
