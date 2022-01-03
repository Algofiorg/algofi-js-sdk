
export const orderedAssets = ["ALGO", "USDC", "goBTC", "goETH", "STBL"]
export const extraAssets = ["BANK"]
export const orderedAssetsAndPlaceholders = ["ALGO", "USDC", "goBTC", "goETH", "STBL", "STBL-ALGO-LP", "STBL-USDC-LP", "STBL-USDC-LP-V2", "STBL-YLDY-LP"]
export const protocolManagerAppId = 465818260;
export const managerAddress = "2SGUKZCOBEVGN3HPKSXPS6DTCXZ7LSP6G3BQF6KVUIUREBBY2QTGSON7WQ";
export const assetDictionary = {
    "ALGO": {
        "decimals": 6,
        "marketCounter": 1,
        "marketAppId": 465814065,
        "marketAddress": "TY5N6G67JWHSMWFFFZ252FXWKLRO5UZLBEJ4LGV7TPR5PVSKPLDWH3YRXU",
        "managerAppId" : 465818260,
        "bankAssetId": 465818547,
        "bankAssetDecimals": 6,
        "underlyingAssetId": 1,
        "oracleAppId": 451324964,
        "oracleFieldName": "latest_twap_price"
    },
    "USDC": {
        "decimals": 6,
        "marketCounter": 2,
        "marketAppId": 465814103,
        "marketAddress": "ABQHZLNGGPWWZVA5SOQO3HBEECVJSE3OHYLKACOTC7TC4BS52ZHREPF7QY",
        "managerAppId" : 465818260,
        "bankAssetId": 465818553,
        "bankAssetDecimals": 6,
        "underlyingAssetId": 31566704,
        "oracleAppId": 451327550,
        "oracleFieldName": "price"
    },
    "goBTC": {
        "decimals": 8,
        "marketCounter": 3,
        "marketAppId": 465814149,
        "marketAddress": "W5UCMHDSTGKWBOV6YVLDVPJGPE4L4ISTU6TGXC7WRF63Y7GOVFOBUNJB5Q",
        "managerAppId" : 465818260,
        "bankAssetId": 465818554,
        "bankAssetDecimals": 8,
        "underlyingAssetId": 386192725,
        "oracleAppId": 451325630,
        "oracleFieldName": "latest_twap_price"
    },
    "goETH": {
        "decimals": 8,
        "marketCounter": 4,
        "marketAppId": 465814222,
        "marketAddress": "KATD43XBJJIDXB3U5UCPIFUDU3CZ3YQNVWA5PDDMZVGKSR4E3QWPJX67CY",
        "managerAppId" : 465818260,
        "bankAssetId": 465818555,
        "bankAssetDecimals": 8,
        "underlyingAssetId": 386195940,
        "oracleAppId": 451326395,
        "oracleFieldName": "latest_twap_price"
    },
    "STBL": {
        "decimals": 6,
        "marketCounter": 5,
        "marketAppId": 465814278,
        "marketAddress": "OPY7XNB5LVMECF3PHJGQV2U33LZPM5FBUXA3JJPHANAG5B7GEYUPZJVYRE",
        "managerAppId" : 465818260,
        "bankAssetId": 465818563,
        "bankAssetDecimals": 6,
        "underlyingAssetId": 465865291,
        "oracleAppId": 451327550,
        "oracleFieldName": "price"
    },
    "STBL-STAKE": {
        "decimals": 6,
        "marketCounter": 5,
        "marketAppId": 482608867,
        "managerAppId": 482625868,
        "marketAddress": "DYLJJES76YQCOUK6D4RALIPJ76U5QT7L6A2KP6QTOH63OBLFKLTER2J6IA",
        "bankAssetId": 465818563,
        "bankAssetDecimals": 6,
        "underlyingAssetId": 465865291,
        "oracleAppId": 451327550,
        "oracleFieldName": "price"
    },
    "STBL-ALGO-LP": {
        "decimals": 6,
        "managerAppId" : 514458901,
        "managerAddress" : "JZYVXQLRZ2TEI6XMIQN5KEHEVA5EA3LQVZUS24SGKLVIBQZTRSP3PTCRJQ",
        "marketAppId" : 514439598,
        "marketAddress" : "UMTL7D6YMN463FSG3JN572CFD6VTKRKNSK5KSQYIUK67N7CR3XLDFM42Y4",
        "underlyingAssetId" : 468634109,
        "bankAssetId" : 514473977,
        "oracleAppId": 451327550,
        "bankAssetDecimals": 6,
        "oracleFieldName": "price"
    },
    "STBL-USDC-LP": {
        "decimals": 6,
        "marketAppId": 485244022,
        "managerAppId": 485247444,
        "managerAddress": "IG3KDYTH7IB46DC5K4ME4Z3R46VJEFXFPHRHVV3KKBTULW5ODHPJL7ZFU4",
        "marketAddress": "Z3GWRL5HGCJQYIXP4MINCRWCKWDHZ5VSYJHDLIDLEIOARIZWJX6GLAWWEI",
        "creatorAddress": "TFONT6HASLUUWDRE3MEEC4GS5PIMLEKNCE7Z2JMGNBFIHVZZ2QEJ7MODZE",
        "oracleAppId": 451327550,
        "bankAssetId": 485254141,
        "bankAssetDecimals": 6,
        "underlyingAssetId": 467020179,
        "oracleFieldName": "price"
    },
    "STBL-USDC-LP-V2": {
        "decimals": 6,
        "managerAppId" : 514599129,
        "managerAddress" : "SFSV2PM3724DUZGIQVLZ5XOUKSQBDALYI7UZ23YLGYFDLM3WH2AMWHBNTE",
        "marketAppId" : 514596716,
        "marketAddress" : "RLXSNIDRFIDMKJILBMDKHACY7YFEV2N65T6D3YGKKM2LAKHNK4XCOEVYIQ",
        "underlyingAssetId" : 467020179,
        "bankAssetId" : 514619644,
        "creatorAddress": "TFONT6HASLUUWDRE3MEEC4GS5PIMLEKNCE7Z2JMGNBFIHVZZ2QEJ7MODZE",
        "oracleAppId": 451327550,
        "bankAssetDecimals": 6,
        "oracleFieldName": "price"
    },

    "STBL-YLDY-LP": {
        "decimals": 6,
        "managerAppId" : 514601080,
        "managerAddress" : "S53YDCHH3JGJKZWLNLUFDAQKSUZCAWOVNYHWAGMVCOFK2NNROS7NCLDK64",
        "marketAppId" : 514599409,
        "marketAddress" : "3VNLTSYGAMVBRSCSAF7PP7KSBAV5AQQIUM2TJXIDVOXX573AW7LMH6RARY",
        "underlyingAssetId" : 468695586,
        "bankAssetId" : 514624374,
        "bankAssetDecimals": 6,
        "oracleFieldName": "price"
    },
    "BANK": {
        "decimals": 6,
        "underlyingAssetId": 51642940
    }
}
export const foreignAppIds = [465814065, 465814103, 465814149, 465814222, 465814278]

export const SECONDS_PER_YEAR = 60 * 60 * 24 * 365
export const SCALE_FACTOR = 1e9
export const REWARDS_SCALE_FACTOR = 1e14
export const PARAMETER_SCALE_FACTOR = 1e3

let orderedOracleAppIds = []
let orderedMarketAppIds = []
let orderedSupportedMarketAppIds = []
let marketCounterToAssetName = {}
let assetIdToAssetName = {}
for (const assetName of orderedAssets) {
  orderedOracleAppIds.push(assetDictionary[assetName]["oracleAppId"])
  orderedSupportedMarketAppIds.push(assetDictionary[assetName]["marketAppId"])
  marketCounterToAssetName[assetDictionary[assetName]["marketCounter"]] = assetName
  assetIdToAssetName[assetDictionary[assetName]["underlyingAssetId"]] = assetName
  assetIdToAssetName[assetDictionary[assetName]["bankAssetId"]] = "b" + assetName
}
for (const assetName of extraAssets) {
  assetIdToAssetName[assetDictionary[assetName]["underlyingAssetId"]] = assetName
}

for (const assetName of orderedAssetsAndPlaceholders) {
  orderedMarketAppIds.push(assetDictionary[assetName]["marketAppId"])
}
export { orderedOracleAppIds, orderedMarketAppIds, orderedSupportedMarketAppIds, marketCounterToAssetName, assetIdToAssetName }
