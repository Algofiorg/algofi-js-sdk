
export const orderedAssets = ["ALGO", "USDC", "goBTC", "goETH", "STBL"]
export const orderedAssetsAndPlaceholders = ["ALGO", "USDC", "goBTC", "goETH", "STBL", "SIIX", "SEVN", "EGHT", "NINE", "TENN", "ELVN" ,"TWLV", "TRTN", "FRTN", "FVTN" , "SXTN"]

export const managerAppId = 51422788;
export const assetDictionary = {
    "ALGO": {
        "decimals": 6,
        "marketCounter": 1,
        "marketAppId": 51422140,
        "marketAddress": "ZBKXCEKDSHXQDKZIDC7NOV5H6LRW4YD252DBNVUI5BOR4DO624LSDKIPNM",
        "bankAssetId": 51422936,
        "bankAssetDecimals": 6,
        "underlyingAssetId": 1,
        "oracleAppId": 48649676,
        "oracleFieldName": "latest_twap_price"
    },
    "USDC": {
        "decimals": 6,
        "marketCounter": 2,
        "marketAppId": 51422142,
        "marketAddress": "SPEZVO3RHLOPQVBXXYK5UJRGZXYG6FTH4EML4QEPTHAGMEV7LFZVSCSQOA",
        "bankAssetId": 51422937,
        "bankAssetDecimals": 6,
        "underlyingAssetId": 51435943,
        "oracleAppId": 48649820,
        "oracleFieldName": "price"
    },
    "goBTC": {
        "decimals": 8,
        "marketCounter": 3,
        "marketAppId": 51422146,
        "marketAddress": "O7SVUP64TIS2TX4L74KRHO5ZLFYJVWMTID2U2E5IHS2RG7CYSEXJQ4VNXY",
        "bankAssetId": 51422938,
        "bankAssetDecimals": 8,
        "underlyingAssetId": 51436723,
        "oracleAppId": 48649713,
        "oracleFieldName": "latest_twap_price"
    },
    "goETH": {
        "decimals": 8,
        "marketCounter": 4,
        "marketAppId": 51422149,
        "marketAddress": "ZBW5PTDNHI4VLBZPJQSIA6QW3BCOGXYYVNG5VHHQ63XQKHT56DP7QOCYHE",
        "bankAssetId": 51422939,
        "bankAssetDecimals": 8,
        "underlyingAssetId": 51437163,
        "oracleAppId": 48649735,
        "oracleFieldName": "latest_twap_price"
    },
    "STBL": {
        "decimals": 6,
        "marketCounter": 5,
        "marketAppId": 51422151,
        "marketAddress": "OODFAQGVZPGKZRFAYKBCCDKR62UPYF6RXV2WAUFIWXPJPMWZV3XJV3PZZQ",
        "bankAssetId": 51422940,
        "bankAssetDecimals": 6,
        "underlyingAssetId": 51437956,
        "oracleAppId": 48649820,
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
for (const assetName of orderedAssetsAndPlaceholders) {
  orderedMarketAppIds.push(assetDictionary[assetName]["marketAppId"])
}
export { orderedOracleAppIds, orderedMarketAppIds, orderedSupportedMarketAppIds, marketCounterToAssetName, assetIdToAssetName }
