const algosdk = require("algosdk")
import {
  orderedAssets,
  managerAppId,
  assetDictionary,
  SECONDS_PER_YEAR,
  RESERVE_RATIO,
  SCALE_FACTOR
} from "./config.js"
import { Base64Encoder } from "./encoder.js"

// CONSTANTS
const MIN_BALANCE_PER_ACCOUNT = BigInt(100000);
const MIN_BALANCE_PER_ASSET = BigInt(100000);
const MIN_BALANCE_PER_APP = BigInt(100000);
const MIN_BALANCE_PER_APP_BYTESLICE = BigInt(25000+25000);
const MIN_BALANCE_PER_APP_UINT = BigInt(25000+3500);
const MIN_BALANCE_PER_APP_EXTRA_PAGE = BigInt(100000);

/**
 * Function to get the storage address for an algofi user. This address is stored in the users local state.
 * If the user clears their local state, their storage contract is irrecoverable.
 * 
 * @param   {accountInformation}  accountInfo   - Address of user
 * 
 * @return  {string}              storageAccont - Storage address of user
 */
export async function getStorageAddress(accountInfo) {
  let storageAccount = null

  let localManager = accountInfo["apps-local-state"].filter(x => {
    return x.id === managerAppId && x["key-value"]
  })
  if (localManager && localManager.length > 0) {
    let storageAccountBytes = localManager[0]["key-value"].filter(x => {
      return x.key == "dXNlcl9zdG9yYWdlX2FkZHJlc3M=" // user_storage_address
    })[0].value.bytes
    storageAccount = algosdk.encodeAddress(Buffer.from(storageAccountBytes, "base64"))
  }
  return storageAccount
}

// TODO - we should drive this off of the market oracle and price field
/**
 * Function to get oracle price info
 * 
 * @param   {Algodv2} algodClient
 * 
 * @return  {int[]}   prices        - array of price values
 */
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

/**
 * Get balance info for a given address
 * 
 * @param   {Algodv2}           algodClient
 * @param   {string}            address
 * 
 * @return  {dict<string,int>}  balanceInfo   - dictionary of asset names to balances
 */
export async function getBalanceInfo(algodClient, address) {
  let accountInfo = await algodClient.accountInformation(address).do()
  let balanceInfo = {}
  balanceInfo["ALGO"] = accountInfo["amount"]

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

  return balanceInfo
}

/**
 * Function to get manager global state
 *
 * @param   {Algodv2}           algodClient
 *
 * @return  {dict<string,int>}  results       - dictionary of global state for this market
 */
export async function getGlobalManagerInfo(algodClient, marketId) {
  let response = await algodClient.getApplicationByID(managerAppId).do()
  let results = {}
  response.params["global-state"].forEach(x => {
    let decodedKey = Base64Encoder.decode(x.key)
    results[decodedKey] = x.value.uint
  })
  return results
}

/**
 * Function to get a users local state in a given market
 *
 * @param   {accountInfo}       accountInfo
 * @param   {string}            assetName
 * 
 * @return  {dict<string,int>}  results       - dictionary of user market local state
 */
export async function getUserMarketData(accountInfo, assetName) {
  let results = {}
  let marketData = accountInfo["apps-local-state"].filter(x => {
    return x.id === assetDictionary[assetName]["marketAppId"] && x["key-value"]
  })[0]
  if (marketData) {
    marketData["key-value"].forEach(y => {
      let decodedKey = Base64Encoder.decode(y.key)
      if (decodedKey === "user_borrowed_amount") {
        results["borrowed"] = y.value.uint
      } else if (decodedKey === "user_active_collateral") {
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

/**
 * Function to get market global state
 *
 * @param   {Algodv2}           algodClient
 * @param   {string}            marketId
 *
 * @return  {dict<string,int>}  results       - dictionary of global state for this market
 */
export async function getGlobalMarketInfo(algodClient, marketId) {
  let response = await algodClient.getApplicationByID(marketId).do()
  let results = {}
  response.params["global-state"].forEach(x => {
    let decodedKey = Base64Encoder.decode(x.key)
    results[decodedKey] = x.value.uint
  })
  return results
}

// TODO underlying reserves needs to be implimated here
/**
 * Function to get extrapolate additional data from market global state
 *
 * @param   {dict<string,int>}  globalData        - dictionary of market global state
 * 
 * @return  {dict<string,int}   extrapolatedData  - dictionary of market extrapolated values
 */
export async function extrapolateMarketData(globalData) {
  let extrapolatedData = {}
  let currentUnixTime = Date.now()
  currentUnixTime = Math.floor(currentUnixTime / 1000)

  // initialize total_borrow_interest_rate if unset
  if (!globalData["total_borrow_interest_rate"]) {
    globalData["total_borrow_interest_rate"] = 0
  }
  
  // total_lend_interest_rate_earned
  globalData["total_lend_interest_rate_earned"] =
    globalData["underlying_borrowed"] > 0
      ? (globalData["total_borrow_interest_rate"] * globalData["underlying_borrowed"]) /
        (globalData["underlying_borrowed"] + globalData["underlying_cash"])
      : 0

  // borrow_index_extrapolated
  extrapolatedData["borrow_index_extrapolated"] = Math.floor(
    globalData["borrow_index"] *
      (1 +
        ((globalData["total_borrow_interest_rate"] / 1e9) * (currentUnixTime - globalData["latest_time"])) /
          SECONDS_PER_YEAR)
  )
  
  // underlying_borrowed_extrapolated
  extrapolatedData["underlying_borrowed_extrapolated"] =
    extrapolatedData["borrow_index_extrapolated"] > 0
      ? (globalData["underlying_borrowed"] * extrapolatedData["borrow_index_extrapolated"]) / globalData["borrow_index"]
      : globalData["underlying_borrowed"]

  // underlying_cash_extrapolated
  extrapolatedData["underlying_cash_extrapolated"] =
    extrapolatedData["underlying_borrowed_extrapolated"] > 0
      ? (globalData["underlying_cash"] * globalData["bank_to_underlying_exchange"]) / SCALE_FACTOR
      : globalData["underlying_cash"]
  
  // underlying_reserves_extrapolated
  extrapolatedData["underlying_reserves_extrapolated"] =
    extrapolatedData["underlying_borrowed_extrapolated"] > 0
      ? (extrapolatedData["underlying_borrowed_extrapolated"] - globalData["underlying_borrowed"]) * RESERVE_RATIO +
        globalData["underlying_reserves"]
      : globalData["underlying_reserves"]

  // bank_to_underlying_exchange_extrapolated
  extrapolatedData["bank_to_underlying_exchange_extrapolated"] =
    extrapolatedData["underlying_borrowed"] > 0
      ? ((extrapolatedData["underlying_borrowed_extrapolated"] -
          extrapolatedData["underlying_reserves_extrapolated"] +
          extrapolatedData["underlying_cash_extrapolated"]) /
          globalData["bank_circulation"]) *
        SCALE_FACTOR
      : globalData["bank_to_underlying_exchange"]

  // underlying_supplied_extrapolated
  extrapolatedData["underlying_supplied_extrapolated"] =
    extrapolatedData["underlying_cash_extrapolated"] + extrapolatedData["underlying_borrowed_extrapolated"]

  // underlying_supplied
  extrapolatedData["underlying_supplied"] = globalData["underlying_cash"] + globalData["underlying_borrowed"]

  // LIST OF EXTRAPOLATED VAUES
  // borrow_index_extrapolated
  // underlying_borrowed_extrapolated
  // underlying_cash_extrapolated
  // underlying_reserves_extrapolated
  // bank_to_underlying_exchange_extrapolated
  // underlying_supplied_extrapolated
  // underlying_supplied
  return extrapolatedData
}

/**
 * Function to extrapolate data from user data
 *
 * @param   {dict<string,int>}  userData
 * @param   {dict<string,int>}  globalData
 * 
 * @return  {dict<string,int>}  extroplatedData
 */
export async function extrapolateUserData(userData, globalData) {
  let extrapolatedData = {}
  
  // borrwed_extrapolated
  extrapolatedData["borrowed_extrapolated"] =
    userData["borrowed"] && globalData["borrow_index"]
      ? (userData["borrowed"] * globalData["borrow_index"]) / userData["initial_index"]
      : 0

  // supplied_underlying
  extrapolatedData["supplied_underlying"] =
    userData["minted"] && globalData["bank_to_underlying_exchange"]
      ? (userData["minted"] * globalData["bank_to_underlying_exchange"]) / SCALE_FACTOR
      : 0

  // collateral_underlying
  extrapolatedData["collateral_underlying"] =
    userData["collateral"] && globalData["bank_to_underlying_exchange"]
      ? (userData["collateral"] * globalData["bank_to_underlying_exchange"]) / SCALE_FACTOR
      : 0

  // EXTRAPOLATED DATA
  // borrowed_extrapolated
  // supplied_underlying
  // collateral_underlying
  return extrapolatedData
}

/**
 * Function to calculate user USD data for a given asset
 *
 * @param   {dic<string,int>}   userData
 * @param   {dict<string,int>}  globalData
 * @param   {string}            assetName
 * 
 * @return  {dict<string,int>}  userData    - userData with added USD values
 */
export async function calculateUserData(userData, globalData, assetName) {
  // borrowUSD
  userData["borrowUSD"] +=
    userData[assetName]["borrowed"] *
    (globalData[assetName]["price"] / SCALE_FACTOR) *
    (1 / 10 ** assetDictionary[assetName]["decimals"])

  // suppliedUSD
  userData["suppliedUSD"] +=
    userData[assetName]["supplied_underlying"] *
    (globalData[assetName]["price"] / SCALE_FACTOR) *
    (1 / 10 ** assetDictionary[assetName]["decimals"])

  // collateralUSD
  userData["collateralUSD"] +=
    userData[assetName]["collateral_underlying"] *
    (globalData[assetName]["price"] / SCALE_FACTOR) *
    (1 / 10 ** assetDictionary[assetName]["decimals"])

  // maxBorrowUSD
  userData["maxBorrowUSD"] +=
    userData[assetName]["collateral_underlying"] *
    (globalData[assetName]["collateral_factor"] / 1000) *
    (globalData[assetName]["price"] / SCALE_FACTOR) *
    (1 / 10 ** assetDictionary[assetName]["decimals"])
    
  // USER USD DATA
  // borrowUSD
  // suppliedUSD
  // collateralUSD
  // maxBorrowUSD
  return userData
}


/**
 * Function to calculate account opt in info
 *
 * @param   {accountInfo}       accountInfo
 * 
 * @return  {dict<string,int>}  userData    - userData with added USD values
 */
export async function getAccountOptInData(accountInfo) {
  let accountOptInData = {}

  // min balance
  const totalSchema = accountInfo['apps-total-schema']
  let totalByteSlices = BigInt(0);
  let totalUints = BigInt(0);
  if (totalSchema) {
    if (totalSchema['num-byte-slice']) {
      totalByteSlices = totalSchema['num-byte-slice'];
    }
    if (totalSchema['num-uint']) {
      totalUints = totalSchema['num-uint'];
    }
  }
  
  const totalExtraPages = accountInfo['apps-total-extra-pages'] || BigInt(0);

  const localApps = accountInfo['apps-local-state'] || [];
  const createdApps = accountInfo['created-apps'] || [];
  const assets = accountInfo['assets'] || [];

  accountOptInData['min_balance'] =
    MIN_BALANCE_PER_ACCOUNT +
    MIN_BALANCE_PER_ASSET * BigInt(assets.length) +
    MIN_BALANCE_PER_APP * BigInt(createdApps.length + localApps.length) +
    MIN_BALANCE_PER_APP_UINT * totalUints +
    MIN_BALANCE_PER_APP_BYTESLICE * totalByteSlices +
    MIN_BALANCE_PER_APP_EXTRA_PAGE * totalExtraPages;
  
  // opted in applications
  accountOptInData['apps'] = localApps
  
  // opted in assets
  accountOptInData['assets'] = assets

  return accountOptInData
}