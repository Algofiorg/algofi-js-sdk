
export const orderedAssets = ["ALGO", "USDC", "goBTC", "goETH", "STBL"]
export const extraAssets = ["BANK"]
export const orderedAssetsAndPlaceholders = ["ALGO", "USDC", "goBTC", "goETH", "STBL", "SIIX", "SEVN", "EGHT", "NINE", "TENN", "ELVN" ,"TWLV", "TRTN", "FRTN", "FVTN" , "SXTN"]
export const managerAppId = 465818260;
export const assetDictionary = {
    "ALGO": {
        "decimals": 6,
        "marketCounter": 1,
        "marketAppId": 465814065,
        "marketAddress": "TY5N6G67JWHSMWFFFZ252FXWKLRO5UZLBEJ4LGV7TPR5PVSKPLDWH3YRXU",
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
        "bankAssetId": 465818563,
        "bankAssetDecimals": 6,
        "underlyingAssetId": 465865291,
        "oracleAppId": 451327550,
        "oracleFieldName": "price"
    },
    "SIIX": {
        "marketCounter": 6,
        "marketAppId": 51422152,
        "marketAddress": "IGTRCFMCDZ55ARBLWWQE7575MXKYUEQYQO5XJQ6NUEU66L2XM73NULIAHQ"
    },
    "SEVN": {
        "marketCounter": 7,
        "marketAppId": 51422155,
        "marketAddress": "4RXSIBGICX5GAE7RZB35VVGLTTQVAMFN2NWSOZPYGVOYZDNY37IBWJUZLU"
    },
    "EGHT": {
        "marketCounter": 8,
        "marketAppId": 51422158,
        "marketAddress": "HPWOJQPSJQZVZBBNCN53H7JEGGK3PL4LVLVZ4IFPCCKPSQGRIPTZL5L5EQ"
    },
    "NINE": {
        "marketCounter": 9,
        "marketAppId": 51422161,
        "marketAddress": "AY5ZXVYG3SNQUDWWLCVH6X64LCVDHV6LY2Z7N2TMMIM4ENM36MDIG2GGMY"
    },
    "TENN": {
        "marketCounter": 10,
        "marketAppId": 51422164,
        "marketAddress": "CROFL2FEP5ZHRDWAXPTNF2NXRDGZL2OS7RI3K7QGT6ZVSQKOGEKF6CF3E4"
    },
    "ELVN": {
        "marketCounter": 11,
        "marketAppId": 51422170,
        "marketAddress": "3DARRF6Z2WUHGQLLX2FIMDOZVMWROX7JK2CE6CGHRILMXUXKWRS7RVBXRQ"
    },
    "TWLV": {
        "marketCounter": 12,
        "marketAppId": 51422172,
        "marketAddress": "GEXK6AWIUCDORHO6NZONKCBJPNLSSI235DUQDHTMJEYMN7QE37GBUAJY5M"
    },
    "TRTN": {
        "marketCounter": 13,
        "marketAppId": 51422175,
        "marketAddress": "F7QOTS5WF23ENFJEMUHTWXJWSQIDE7AUFTIAJFUB3IIM2U7SVECMCS7Y4U"
    },
    "FRTN": {
        "marketCounter": 14,
        "marketAppId": 51422177,
        "marketAddress": "EHZ4ILW7P5GM3SKVB42FPVFBT2HAOADMW4VSWPESHUKRGX5XXJ7DMSUIKQ"
    },
    "FVTN": {
        "marketCounter": 15,
        "marketAppId": 51422179,
        "marketAddress": "HVBCCT3YCGYJ7INC2ZMBU5XNLISX7KKRZL2ISTTQQ7P56LD5TKM5U73NQU"
    },
    "SXTN": {
        "marketCounter": 16,
        "marketAppId": 51422186,
        "marketAddress": "M4KM3XMRF4RGEEGCNOSDLPZKMEBKUQGCP76WOZ66B3RYOHSUCU67HALJMU"
    },
    "BANK": {
        "decimals": 6,
        "underlyingAssetId": 51642940
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
