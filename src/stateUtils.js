const algosdk = require("algosdk")
import {
  orderedAssets,
  managerAppId,
  assetDictionary,
  SECONDS_PER_YEAR,
  RESERVE_RATIO,
  SCALE_FACTOR,
} from "./config.js"
import { Base64Encoder } from "./encoder.js"

export async function getStorageAddress(accountInfo) {
  let storageAccount = null

  let localManager = accountInfo["apps-local-state"].filter((x) => {
    return x.id === managerAppId && x["key-value"]
  })
  if (localManager && localManager.length > 0) {
    let storageAccountBytes = localManager[0]["key-value"].filter((x) => {
      return x.key == "dXNlcl9zdG9yYWdlX2FkZHJlc3M="
    })[0].value.bytes
    storageAccount = algosdk.encodeAddress(Buffer.from(storageAccountBytes, "base64"))
  }
  return storageAccount
}

export async function getPriceInfo(algodClient) {
  let prices = {}
  for (const assetName of orderedAssets) {
    let response = await algodClient.getApplicationByID(assetDictionary[assetName]["oracleAppId"]).do()
    for (const y of response.params["global-state"]) {
      let decodedKey = Base64Encoder.decode(y.key)
      if (decodedKey === "price") {
        prices[assetName] = y.value.uint
      }
    }
  }
  return prices
}

export async function getBalanceInfo(algodClient, address) {
  let accountInfo = await algodClient.accountInformation(address).do()
  //console.log("accountInfo=", accountInfo)
  let balanceInfo = {}
  balanceInfo["ALGO"] = accountInfo["amount"]
  //console.log("balanceInfo before=", balanceInfo)

  for (const assetName of orderedAssets) {
    if (assetName != "ALGO") {
      balanceInfo[assetName] = 0
    }
    balanceInfo["b" + assetName] = 0
  }
  for (const asset of accountInfo.assets) {
    for (const assetName of orderedAssets) {
      if (assetName != "ALGO" && asset["asset-id"] === assetDictionary[assetName]["underlyingAssetId"]) {
        balanceInfo[assetName] = Number(asset["amount"])
      } else if (asset["asset-id"] === assetDictionary[assetName]["bankAssetId"]) {
        balanceInfo["b" + assetName] = Number(asset["amount"])
      }
    }
  }
  //console.log("balanceInfo after=", balanceInfo)

  return balanceInfo
}

export async function getUserMarketData(accountInfo, assetName) {
  let results = {}
  let marketData = accountInfo["apps-local-state"].filter((x) => {
    return x.id === assetDictionary[assetName]["marketAppId"] && x["key-value"]
  })[0]
  console.log("assetName =", assetName)
  console.log("marketData=", marketData)
  if (marketData) {
    marketData["key-value"].forEach((y) => {
      let decodedKey = Base64Encoder.decode(y.key)
      console.log("decodedKey=", decodedKey)
      if (decodedKey === "user_borrowed_amount") {
        results["borrowed"] = y.value.uint
      } else if (decodedKey === "user_active_collateral_amount") {
        results["collateral"] = y.value.uint
      } else if (decodedKey === "user_bank_minted") {
        results["minted"] = Number(y.value.uint)
      } else if (decodedKey === "user_borrow_index_initial") {
        results["initial_index"] = Number(y.value.uint)
      }
    })
  }
  return results
}

export async function getGlobalMarketInfo(algodClient, marketId) {
  let response = await algodClient.getApplicationByID(marketId).do()
  let results = {}
  response.params["global-state"].forEach((x) => {
    let decodedKey = Base64Encoder.decode(x.key)
    results[decodedKey] = x.value.uint
  })
  return results
}

export async function extrapolateMarketData(globalData) {
  let extrapolatedData = {}
  let currentUnixTime = Date.now()
  currentUnixTime = Math.floor(currentUnixTime / 1000)
  //console.log("globalData=", globalData)
  //console.log("total_borrow_interest_rate=", globalData["total_borrow_interest_rate"])
  //console.log("underlying_borrowed=", globalData["underlying_borrowed"])
  //console.log("underlying_cash=", globalData["underlying_cash"])
  if (!globalData["total_borrow_interest_rate"]) {
    globalData["total_borrow_interest_rate"] = 0
  }
  globalData["total_lend_interest_rate_earned"] =
    globalData["underlying_borrowed"] > 0
      ? (globalData["total_borrow_interest_rate"] * globalData["underlying_borrowed"]) /
        (globalData["underlying_borrowed"] + globalData["underlying_cash"])
      : 0
  extrapolatedData["total_borrow_interest_rate_paid"] =
    globalData["underlying_borrowed"] + globalData["underlying_cash"] > 0
      ? (globalData["total_borrow_interest_rate"] * globalData["underlying_borrowed"]) /
        (globalData["underlying_borrowed"] + globalData["underlying_cash"])
      : 0
  extrapolatedData["borrow_index"] = Math.floor(
    globalData["borrow_index"] *
      (1 +
        ((globalData["total_borrow_interest_rate"] / 1e9) * (currentUnixTime - globalData["latest_time"])) /
          SECONDS_PER_YEAR)
  )
  extrapolatedData["underlying_borrowed"] =
    extrapolatedData["borrow_index"] > 0
      ? (globalData["underlying_borrowed"] * extrapolatedData["borrow_index"]) / globalData["borrow_index"]
      : globalData["underlying_borrowed"]
  extrapolatedData["underlying_cash"] =
    extrapolatedData["underlying_borrowed"] > 0
      ? (globalData["underlying_cash"] * globalData["bank_to_underlying_exchange"]) / SCALE_FACTOR
      : globalData["underlying_cash"]
  extrapolatedData["underlying_reserves"] =
    extrapolatedData["underlying_borrowed"] > 0
      ? (extrapolatedData["underlying_borrowed"] - globalData["underlying_borrowed"]) * RESERVE_RATIO +
        globalData["underlying_reserves"]
      : globalData["underlying_reserves"]
  extrapolatedData["bank_to_underlying_exchange"] =
    extrapolatedData["underlying_borrowed"] > 0
      ? ((extrapolatedData["underlying_borrowed"] -
          extrapolatedData["underlying_reserves"] +
          extrapolatedData["underlying_cash"]) /
          globalData["bank_circulation"]) *
        SCALE_FACTOR
      : globalData["bank_to_underlying_exchange"]
  //console.log("globalData[collateral]=", globalData["collateral"])
  //console.log("extrapolatedData[bank_to_underlying_exchange]=", extrapolatedData["bank_to_underlying_exchange"])
  extrapolatedData["underlying_supplied"] =
    extrapolatedData["underlying_cash"] + extrapolatedData["underlying_borrowed"]
  //console.log("extrapolatedData=", extrapolatedData)
  return extrapolatedData
}

export async function extrapolateUserData(userData, globalData) {
  let extrapolatedData = {}
  console.log(
    "userData[collateral] * globalData[bank_to_underlying_exchange]=",
    userData["collateral"] * globalData["bank_to_underlying_exchange"]
  )
  console.log(
    "collateral_underlying=",
    (userData["collateral"] * globalData["bank_to_underlying_exchange"]) / SCALE_FACTOR
  )
  extrapolatedData["borrowed"] =
    userData["borrowed"] && globalData["borrow_index"]
      ? (userData["borrowed"] * globalData["borrow_index"]) / userData["initial_index"]
      : 0
  extrapolatedData["supplied_underlying"] =
    userData["minted"] && globalData["bank_to_underlying_exchange"]
      ? (userData["minted"] * globalData["bank_to_underlying_exchange"]) / SCALE_FACTOR
      : 0
  extrapolatedData["collateral_underlying"] =
    userData["collateral"] && globalData["bank_to_underlying_exchange"]
      ? (userData["collateral"] * globalData["bank_to_underlying_exchange"]) / SCALE_FACTOR
      : 0
  return extrapolatedData
}

export async function calculateUserData(userData, globalData, assetName) {
  console.log("assetName=", assetName)
  console.log("borrowUSD+=", userData[assetName]["borrowed"] * (globalData[assetName]["price"] / SCALE_FACTOR))
  console.log(
    "suppliedUSD+=",
    userData[assetName]["supplied_underlying"] * (globalData[assetName]["price"] / SCALE_FACTOR)
  )
  console.log(
    "suppliedUSD+=",
    userData[assetName]["supplied_underlying"] * (globalData[assetName]["price"] / SCALE_FACTOR)
  )
  console.log(
    "collateralUSD+=",
    userData[assetName]["collateral_underlying"] * (globalData[assetName]["price"] / SCALE_FACTOR)
  )
  console.log(
    "maxBorrowUSD+=",
    userData[assetName]["collateral_underlying"] *
      (globalData[assetName]["coll_factor"] / 1000) *
      (globalData[assetName]["price"] / SCALE_FACTOR)
  )

  userData["borrowUSD"] +=
    userData[assetName]["borrowed"] *
    (globalData[assetName]["price"] / SCALE_FACTOR) *
    (1 / 10 ** assetDictionary[assetName]["decimals"])
  userData["suppliedUSD"] +=
    userData[assetName]["supplied_underlying"] *
    (globalData[assetName]["price"] / SCALE_FACTOR) *
    (1 / 10 ** assetDictionary[assetName]["decimals"])
  userData["collateralUSD"] +=
    userData[assetName]["collateral_underlying"] *
    (globalData[assetName]["price"] / SCALE_FACTOR) *
    (1 / 10 ** assetDictionary[assetName]["decimals"])
  userData["maxBorrowUSD"] +=
    userData[assetName]["collateral_underlying"] *
    (globalData[assetName]["coll_factor"] / 1000) *
    (globalData[assetName]["price"] / SCALE_FACTOR) *
    (1 / 10 ** assetDictionary[assetName]["decimals"])
  return userData
}
