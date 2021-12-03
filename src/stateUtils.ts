const algosdk = require("algosdk")
import {
  orderedAssets,
  marketCounterToAssetName,
  assetIdToAssetName,
  managerAppId,
  assetDictionary,
  SECONDS_PER_YEAR,
  PARAMETER_SCALE_FACTOR,
  SCALE_FACTOR
} from "./config"
import { Base64Encoder } from "./encoder"

// CONSTANTS
const MIN_BALANCE_PER_ACCOUNT = BigInt(100000)
const MIN_BALANCE_PER_ASSET = BigInt(100000)
const MIN_BALANCE_PER_APP = BigInt(100000)
const MIN_BALANCE_PER_APP_BYTESLICE = BigInt(25000 + 25000)
const MIN_BALANCE_PER_APP_UINT = BigInt(25000 + 3500)
const MIN_BALANCE_PER_APP_EXTRA_PAGE = BigInt(100000)
const NUMBER_OF_MARKETS = BigInt(16)
// assume we are launching with 8 assets
const NUMBER_OF_ASSETS = BigInt(8)
// local vars = user_storage_address
const BYTES_FOR_PRIMARY_MANAGER = BigInt(1)
// local vars = user_global_max_borrow_in_dollars, user_rewards_asset_id, user_pending_rewards, user_rewards_latest_time + NUMBER_OF_MARKETS (for rewards)
const UINTS_FOR_PRIMARY_MANAGER = BigInt(15) // 15 for now since we are over max, Paul will fix w/ Byteslice.
// local uints = user_active_collateral, user_borrowed_amount, user_borrow_index_initial
const UINTS_FOR_STORAGE_MARKET = BigInt(4) // 4 for now because of contract schema

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
export async function getGlobalManagerInfo(algodClient) {
  let response = await algodClient.getApplicationByID(managerAppId).do()
  let results = {}
  
  response.params["global-state"].forEach(x => {
    let decodedKey = Base64Encoder.decode(x.key)
    if (decodedKey.slice(-6) === '_price') {
      results[marketCounterToAssetName[decodedKey.charCodeAt(7)] + '_price'] = x.value.uint
    } else if (decodedKey.slice(-31) === '_counter_to_rewards_coefficient') {
      results[marketCounterToAssetName[decodedKey.charCodeAt(7)] + '_counter_to_rewards_coefficient'] = x.value.uint
    } else if (decodedKey === "rewards_asset_id") {
      results[decodedKey] = x.value.uint
      results["rewards_asset"] = assetIdToAssetName[x.value.uint]
    } else if (decodedKey === "rewards_secondary_asset_id") {
      results[decodedKey] = x.value.uint
      results["rewards_secondary_asset"] = assetIdToAssetName[x.value.uint]
    } else {
      results[decodedKey] = x.value.uint
    }
  })
  return results
}

/**
 * Function to get manager global state
 *
 * @param   {Algodv2}           algodClient
 *
 * @return  {dict<string,int>}  results       - dictionary of global state for this market
 */
export async function getUserManagerData(accountInfo) {
  let results = {}
  let managerData = accountInfo["apps-local-state"].filter(x => {
    return x.id === managerAppId && x["key-value"]
  })[0]
  if (managerData) {
    managerData["key-value"].forEach(x => {
      let decodedKey = Base64Encoder.decode(x.key)
      if (decodedKey.slice(-44) === '_counter_to_user_rewards_coefficient_initial') {
        results[marketCounterToAssetName[decodedKey.charCodeAt(7)] + '_counter_to_user_rewards_coefficient_initial'] = x.value.uint
      } else {
        results[decodedKey] = x.value.uint
      }
    })
  }
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
export async function getUserMarketData(accountInfo, globalData, assetName) {
  let results = {}
  let marketData = accountInfo["apps-local-state"].filter(x => {
    return x.id === assetDictionary[assetName]["marketAppId"] && x["key-value"]
  })[0]
  if (marketData) {
    marketData["key-value"].forEach(y => {
      let decodedKey = Base64Encoder.decode(y.key)
      if (decodedKey === "user_borrow_shares") {
        results["borrowed"] = Math.floor(y.value.uint * globalData[assetName]["underlying_borrowed_extrapolated"] / globalData[assetName]["outstanding_borrow_shares"])
      } else if (decodedKey === "user_active_collateral") {
        results["active_collateral"] = Number(y.value.uint)
      } else {
        results[decodedKey] = y.value.uint
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

/**
 * Function to get extrapolate additional data from market global state
 *
 * @param   {dict<string,int>}  globalData        - dictionary of market global state
 *
 * @return  {dict<string,int}   extrapolatedData  - dictionary of market extrapolated values
 */
export async function extrapolateMarketData(globalData, prices, assetName) {
  let extrapolatedData = {}

  // get current time
  let currentUnixTime = Date.now()
  currentUnixTime = Math.floor(currentUnixTime / 1000)

  // initialize total_borrow_interest_rate if unset
  if (!globalData["total_borrow_interest_rate"]) {
    globalData["total_borrow_interest_rate"] = 0
  }

  // get reserve mults
  let reserveMultiplier = globalData["reserve_factor"] / PARAMETER_SCALE_FACTOR
  let reserveFreeMultiplier = (PARAMETER_SCALE_FACTOR - globalData["reserve_factor"]) / PARAMETER_SCALE_FACTOR

  // borrow_index_extrapolated = last borrow index + current calculated next borrow index
  extrapolatedData["borrow_index_extrapolated"] = Math.floor(
    globalData["borrow_index"] *
      (1 +
        ((globalData["total_borrow_interest_rate"] / 1e9) * (currentUnixTime - globalData["latest_time"])) /
          SECONDS_PER_YEAR)
  )

  // underlying_borrowed_extrapolated
  extrapolatedData["underlying_borrowed_extrapolated"] =
    extrapolatedData["borrow_index_extrapolated"] > 0
      ? (globalData["underlying_borrowed"] * extrapolatedData["borrow_index_extrapolated"]) / globalData["implied_borrow_index"]
      : globalData["underlying_borrowed"]

  // underlying_reserves_extrapolated
  extrapolatedData["underlying_reserves_extrapolated"] =
    extrapolatedData["underlying_borrowed_extrapolated"] > 0
      ? (extrapolatedData["underlying_borrowed_extrapolated"] - globalData["underlying_borrowed"]) * reserveMultiplier +
        globalData["underlying_reserves"]
      : globalData["underlying_reserves"]

  // underlying_supplied
  extrapolatedData["underlying_supplied"] =
    globalData["underlying_cash"] + globalData["underlying_borrowed"] - globalData["underlying_reserves"]
  extrapolatedData["underlying_supplied_extrapolated"] =
    globalData["underlying_cash"] +
    extrapolatedData["underlying_borrowed_extrapolated"] -
    extrapolatedData["underlying_reserves_extrapolated"]

  // total_lend_interest_rate_earned = (total interest less reserve factor) / (total supply)
  extrapolatedData["total_lend_interest_rate_earned"] =
    globalData["underlying_borrowed"] > 0
      ? (globalData["total_borrow_interest_rate"] * globalData["underlying_borrowed"] * reserveFreeMultiplier) /
        extrapolatedData["underlying_supplied_extrapolated"]
      : 0

  // bank_to_underlying_exchange_extrapolated
  extrapolatedData["bank_to_underlying_exchange_extrapolated"] =
    globalData["bank_circulation"] > 0
      ? (extrapolatedData["underlying_supplied_extrapolated"] * SCALE_FACTOR) / globalData["bank_circulation"]
      : globalData["bank_to_underlying_exchange"]

  // active_collateral_extrapolated
  extrapolatedData["active_collateral_extrapolated"] = 
    globalData["active_collateral"] ?
    globalData["active_collateral"] * extrapolatedData["bank_to_underlying_exchange_extrapolated"] / SCALE_FACTOR :
    0

  // calculate USD values
  extrapolatedData["underlying_borrowed_extrapolatedUSD"] =
    extrapolatedData["underlying_borrowed_extrapolated"] *
    (prices[assetName] / SCALE_FACTOR) *
    (1 / 10 ** assetDictionary[assetName]["decimals"])

  extrapolatedData["underlying_supplied_extrapolatedUSD"] =
    extrapolatedData["underlying_supplied_extrapolated"] *
    (prices[assetName] / SCALE_FACTOR) *
    (1 / 10 ** assetDictionary[assetName]["decimals"])
    
  // active_collateral_extrapolatedUSD
  extrapolatedData["active_collateral_extrapolatedUSD"] =
    extrapolatedData["active_collateral_extrapolated"] *
    (prices[assetName] / SCALE_FACTOR) *
    (1 / 10 ** assetDictionary[assetName]["decimals"])

  return extrapolatedData
}

/**
 * Function to extrapolate data from user data
 *
 * @param   {dict<string,int>}  userResults
 * @param   {dict<string,int>}  userResults
 * @param   {string}            assetName
 *
 * @return  {dict<string,int>}  extroplatedData
 */
export async function extrapolateUserData(userResults, globalResults, assetName) {
  let extrapolatedData = {}

  // borrwed_extrapolated
  extrapolatedData["borrowed_extrapolated"] = userResults[assetName]["borrowed"] ? userResults[assetName]["borrowed"] : 0

  // collateral_underlying
  extrapolatedData["collateral_underlying_extrapolated"] =
    userResults[assetName]["active_collateral"] && globalResults[assetName]["bank_to_underlying_exchange_extrapolated"]
      ? (userResults[assetName]["active_collateral"] *
          globalResults[assetName]["bank_to_underlying_exchange_extrapolated"]) /
        SCALE_FACTOR
      : 0

  // borrowUSD
  extrapolatedData["borrowUSD"] =
    extrapolatedData["borrowed_extrapolated"] *
    (globalResults[assetName]["price"] / SCALE_FACTOR) *
    (1 / 10 ** assetDictionary[assetName]["decimals"])

  // collateralUSD
  extrapolatedData["collateralUSD"] =
    extrapolatedData["collateral_underlying_extrapolated"] *
    (globalResults[assetName]["price"] / SCALE_FACTOR) *
    (1 / 10 ** assetDictionary[assetName]["decimals"])

  // maxBorrowUSD
  extrapolatedData["maxBorrowUSD"] =
    extrapolatedData["collateralUSD"] * (globalResults[assetName]["collateral_factor"] / 1000)

  // extrapolated rewards
  let userMarketTVL = extrapolatedData["borrowed_extrapolated"] + extrapolatedData["collateral_underlying_extrapolated"]
  if (userResults["manager"]["user_rewards_program_number"] === globalResults["manager"]["n_rewards_programs"]) {
    extrapolatedData["market_unrealized_rewards"] = (userMarketTVL * (globalResults["manager"][assetName + "_counter_to_rewards_coefficient"] - userResults["manager"][assetName + "_counter_to_user_rewards_coefficient_initial"]) / SCALE_FACTOR)
  } else {
    extrapolatedData["market_unrealized_rewards"] = (userMarketTVL * (globalResults["manager"][assetName + "_counter_to_rewards_coefficient"]) / SCALE_FACTOR)
  }

  return extrapolatedData
}

/**
 * Function to extrapolate data from user data
 *
 * @param   {dict<string,int>}  userResults
 *
 * @return  {dict<string,int>}  extroplatedData
 */
export async function updateGlobalTotals(globalResults) {
  globalResults["underlying_supplied_extrapolatedUSD"] = 0
  globalResults["underlying_borrowed_extrapolatedUSD"] = 0
  globalResults["active_collateral_extrapolatedUSD"] = 0
  
  for (const assetName of orderedAssets) {
    if (assetName != "STBL") {
      globalResults["underlying_supplied_extrapolatedUSD"] +=
        globalResults[assetName]["underlying_supplied_extrapolatedUSD"]
    }
    globalResults["active_collateral_extrapolatedUSD"] +=
      globalResults[assetName]["active_collateral_extrapolatedUSD"]
    globalResults["underlying_borrowed_extrapolatedUSD"] +=
      globalResults[assetName]["underlying_borrowed_extrapolatedUSD"]
  }

  // calculate market APY
  let rewards_active = (globalResults["manager"]["rewards_start_time"] > 0 && globalResults["manager"]["rewards_amount"] > 0)
  let rewards_per_year = globalResults["manager"]["rewards_per_second"] * 60 * 60 * 24 * 365
  
  // TODO account for reward free markets
  for (const assetName of orderedAssets) {
    if (rewards_active) {
      globalResults[assetName]["reward_rate_per_1000USD"] = rewards_per_year * 1000 * (globalResults[assetName]["underlying_borrowed_extrapolatedUSD"] / globalResults["underlying_borrowed_extrapolatedUSD"]) / (globalResults[assetName]["active_collateral_extrapolatedUSD"] + globalResults[assetName]["underlying_borrowed_extrapolatedUSD"])
    } else {
      globalResults[assetName]["reward_rate_per_1000USD"] = 0
    }
  }
}

/**
 * Function to extrapolate data from user data
 *
 * @param   {dict<string,int>}  userResults
 * @param   {dict<string,int>}  globalResults
 * @param   {string[]}          activeMarkets
 *
 * @return  {dict<string,int>}  extroplatedData
 */
export async function updateGlobalUserTotals(userResults, globalResults, activeMarkets) {
  userResults["borrowUSD"] = 0
  userResults["collateralUSD"] = 0
  userResults["maxBorrowUSD"] = 0
  userResults["unrealized_rewards"] = 0
  userResults["portfolio_reward_rate_per_1000USD"] = 0
  userResults["portfolio_lend_interest_rate_earned"] = 0
  userResults["portfolio_borrow_interest_rate"] = 0

  if (globalResults["manager"]["rewards_start_time"] > 0 && userResults["manager"]["user_rewards_program_number"] === globalResults["manager"]["n_rewards_programs"]) {
    userResults["pending_rewards_extrapolated"] = userResults["manager"]["user_pending_rewards"]
  } else {
    userResults["pending_rewards_extrapolated"] = 0
  }
  
  for (const assetName of activeMarkets) {
    userResults["borrowUSD"] += userResults[assetName]["borrowUSD"]
    userResults["collateralUSD"] += userResults[assetName]["collateralUSD"]
    userResults["maxBorrowUSD"] += userResults[assetName]["maxBorrowUSD"]
    userResults["unrealized_rewards"] += userResults[assetName]["market_unrealized_rewards"]
  }
  
  for (const assetName of activeMarkets) {
    userResults["portfolio_reward_rate_per_1000USD"] += globalResults[assetName]["reward_rate_per_1000USD"] * (userResults[assetName]["borrowUSD"] + userResults[assetName]["collateralUSD"]) / (userResults["borrowUSD"] + userResults["collateralUSD"])
    userResults["portfolio_lend_interest_rate_earned"] += globalResults[assetName]["total_lend_interest_rate_earned"] * userResults[assetName]["collateralUSD"] / userResults["collateralUSD"]
    userResults["portfolio_borrow_interest_rate"] += globalResults[assetName]["total_borrow_interest_rate"] * userResults[assetName]["borrowUSD"] / userResults["borrowUSD"]
  }
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
  const totalSchema = accountInfo["apps-total-schema"]
  let totalByteSlices = BigInt(0)
  let totalUints = BigInt(0)
  if (totalSchema) {
    if (totalSchema["num-byte-slice"]) {
      totalByteSlices = BigInt(totalSchema["num-byte-slice"])
    }
    if (totalSchema["num-uint"]) {
      totalUints = BigInt(totalSchema["num-uint"])
    }
  }

  const totalExtraPages =
    Number(accountInfo["apps-total-extra-pages"]) > 0 ? BigInt(accountInfo["apps-total-extra-pages"]) : BigInt(0)
  const localApps = accountInfo["apps-local-state"] || []
  const createdApps = accountInfo["created-apps"] || []
  const assets = accountInfo["assets"] || []

  accountOptInData["min_balance"] =
    MIN_BALANCE_PER_ACCOUNT +
    MIN_BALANCE_PER_ASSET * BigInt(assets.length) +
    MIN_BALANCE_PER_APP * BigInt(createdApps.length + localApps.length) +
    MIN_BALANCE_PER_APP_UINT * totalUints +
    MIN_BALANCE_PER_APP_BYTESLICE * totalByteSlices +
    MIN_BALANCE_PER_APP_EXTRA_PAGE * totalExtraPages

  // prep for paul's change, only opt-in storage account to markets
  accountOptInData["min_balance_primary_account"] =
    BigInt(2) * NUMBER_OF_ASSETS * MIN_BALANCE_PER_ASSET +
    MIN_BALANCE_PER_APP +
    MIN_BALANCE_PER_APP_BYTESLICE * BYTES_FOR_PRIMARY_MANAGER +
    MIN_BALANCE_PER_APP_UINT * UINTS_FOR_PRIMARY_MANAGER

  // prep for paul's change, only opt-in storage account to markets
  accountOptInData["min_balance_storage_account"] =
    NUMBER_OF_MARKETS * (MIN_BALANCE_PER_APP + MIN_BALANCE_PER_APP_UINT * UINTS_FOR_STORAGE_MARKET)

  // opted in applications
  accountOptInData["apps"] = localApps

  // opted in assets
  accountOptInData["assets"] = assets

  return accountOptInData
}
